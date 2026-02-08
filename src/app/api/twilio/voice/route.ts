import { NextRequest, NextResponse } from "next/server";
import { getAgent, getCallSession, createCallSession, updateCallSession } from "@/lib/store";
import { generateTwiML } from "@/lib/twilio";
import { createLLMProvider } from "@/lib/llm";
import { FlowNode, CallSession } from "@/lib/types";

function findNode(nodes: FlowNode[], nodeId: string): FlowNode | undefined {
  return nodes.find((n) => n.id === nodeId);
}

function findNextNodeId(
  edges: { source: string; target: string; sourceHandle?: string }[],
  currentNodeId: string,
  sourceHandle?: string
): string | undefined {
  const edge = edges.find(
    (e) =>
      e.source === currentNodeId &&
      (!sourceHandle || e.sourceHandle === sourceHandle)
  );
  return edge?.target;
}

function findStartNode(nodes: FlowNode[]): FlowNode | undefined {
  return nodes.find((n) => n.type === "greeting") || nodes[0];
}

export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const formData = await request.formData();

  const callSid = (formData.get("CallSid") as string) || "browser-call";
  const speechResult = formData.get("SpeechResult") as string | null;
  const digits = formData.get("Digits") as string | null;

  const agentId = url.searchParams.get("agentId") || "demo-agent-1";
  const nodeId = url.searchParams.get("nodeId");
  const action = url.searchParams.get("action");

  const agent = getAgent(agentId);
  if (!agent) {
    const twiml = generateTwiML({
      say: "Sorry, this agent is not available. Goodbye.",
      voice: "Polly.Joanna",
      hangup: true,
    });
    return new NextResponse(twiml, {
      headers: { "Content-Type": "text/xml" },
    });
  }

  // Get or create call session
  let session = getCallSession(callSid);
  if (!session) {
    const startNode = findStartNode(agent.flow.nodes);
    session = createCallSession({
      callSid,
      agentId,
      currentNodeId: startNode?.id || "",
      conversationHistory: [],
      startedAt: new Date().toISOString(),
      status: "active",
    });
  }

  const currentNodeId = nodeId || session.currentNodeId;
  const currentNode = findNode(agent.flow.nodes, currentNodeId);

  if (!currentNode) {
    const twiml = generateTwiML({
      say: "Sorry, something went wrong. Goodbye.",
      voice: agent.voice,
      hangup: true,
    });
    return new NextResponse(twiml, {
      headers: { "Content-Type": "text/xml" },
    });
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  let twiml: string;

  switch (currentNode.type) {
    case "greeting": {
      const nextNodeId = findNextNodeId(agent.flow.edges, currentNode.id);
      if (nextNodeId) {
        twiml = generateTwiML({
          say: currentNode.data.message || "Hello!",
          voice: agent.voice,
          redirect: `${baseUrl}/api/twilio/voice?agentId=${agentId}&nodeId=${nextNodeId}`,
        });
      } else {
        // No next node — go to LLM conversation mode
        twiml = generateTwiML({
          gather: {
            input: "speech",
            action: `${baseUrl}/api/twilio/voice?agentId=${agentId}&nodeId=${currentNode.id}&action=llm`,
            speechTimeout: "auto",
            say: currentNode.data.message || "Hello! How can I help you?",
            voice: agent.voice,
          },
        });
      }
      updateCallSession(callSid, { currentNodeId: nextNodeId || currentNode.id });
      break;
    }

    case "menu": {
      if (action === "process" && (speechResult || digits)) {
        // Process menu selection
        const input = digits || speechResult || "";
        const options = currentNode.data.options || [];
        let matchedHandle: string | undefined;

        // Try to match by digit or by spoken option label
        for (const option of options) {
          if (
            input === option.key ||
            input.toLowerCase().includes(option.label.toLowerCase())
          ) {
            matchedHandle = `option-${option.key}`;
            break;
          }
        }

        const nextNodeId = matchedHandle
          ? findNextNodeId(agent.flow.edges, currentNode.id, matchedHandle)
          : undefined;

        if (nextNodeId) {
          updateCallSession(callSid, { currentNodeId: nextNodeId });
          twiml = generateTwiML({
            redirect: `${baseUrl}/api/twilio/voice?agentId=${agentId}&nodeId=${nextNodeId}`,
          });
        } else {
          // No match — repeat menu
          twiml = generateTwiML({
            say: "I didn't understand that selection. Let me try again.",
            voice: agent.voice,
            redirect: `${baseUrl}/api/twilio/voice?agentId=${agentId}&nodeId=${currentNode.id}`,
          });
        }
      } else {
        // Present menu
        const menuText =
          (currentNode.data.message || "Please choose:") +
          " " +
          (currentNode.data.options || [])
            .map((o) => `Press ${o.key} for ${o.label}.`)
            .join(" ");

        twiml = generateTwiML({
          gather: {
            input: "speech dtmf",
            action: `${baseUrl}/api/twilio/voice?agentId=${agentId}&nodeId=${currentNode.id}&action=process`,
            speechTimeout: "auto",
            say: menuText,
            voice: agent.voice,
          },
        });
      }
      break;
    }

    case "llm-response": {
      if (action === "llm" && speechResult) {
        // Process speech with LLM
        session.conversationHistory.push({
          role: "user",
          content: speechResult,
        });

        try {
          const llm = createLLMProvider({
            provider: agent.llmProvider,
            model: agent.llmModel,
          });
          const response = await llm.chat(
            session.conversationHistory,
            agent.systemPrompt
          );

          session.conversationHistory.push({
            role: "assistant",
            content: response,
          });

          updateCallSession(callSid, {
            conversationHistory: session.conversationHistory,
          });

          // Check if there's a next node after a few exchanges
          const nextNodeId = findNextNodeId(agent.flow.edges, currentNode.id);
          const exchanges = session.conversationHistory.filter(
            (m) => m.role === "user"
          ).length;

          if (nextNodeId && exchanges >= 3) {
            twiml = generateTwiML({
              say: response,
              voice: agent.voice,
              redirect: `${baseUrl}/api/twilio/voice?agentId=${agentId}&nodeId=${nextNodeId}`,
            });
          } else {
            // Continue conversation
            twiml = generateTwiML({
              gather: {
                input: "speech",
                action: `${baseUrl}/api/twilio/voice?agentId=${agentId}&nodeId=${currentNode.id}&action=llm`,
                speechTimeout: "auto",
                say: response,
                voice: agent.voice,
              },
            });
          }
        } catch {
          twiml = generateTwiML({
            say: "I'm having trouble processing your request. Let me transfer you to a human agent.",
            voice: agent.voice,
            hangup: true,
          });
        }
      } else {
        // Initial prompt for this node
        twiml = generateTwiML({
          gather: {
            input: "speech",
            action: `${baseUrl}/api/twilio/voice?agentId=${agentId}&nodeId=${currentNode.id}&action=llm`,
            speechTimeout: "auto",
            say: currentNode.data.message || "How can I help you?",
            voice: agent.voice,
          },
        });
      }
      break;
    }

    case "transfer": {
      twiml = generateTwiML({
        say: currentNode.data.message || "Transferring you now.",
        voice: agent.voice,
        dial: currentNode.data.transferTo || "",
      });
      updateCallSession(callSid, { status: "completed" });
      break;
    }

    case "end": {
      twiml = generateTwiML({
        say: currentNode.data.message || "Thank you for calling. Goodbye!",
        voice: agent.voice,
        hangup: true,
      });
      updateCallSession(callSid, { status: "completed" });
      break;
    }

    default: {
      twiml = generateTwiML({
        say: "Sorry, something went wrong. Goodbye.",
        voice: agent.voice,
        hangup: true,
      });
    }
  }

  return new NextResponse(twiml, {
    headers: { "Content-Type": "text/xml" },
  });
}

import twilio from "twilio";

let twilioClient: twilio.Twilio | null = null;

export function getTwilioClient(): twilio.Twilio {
  if (!twilioClient) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    if (!accountSid || !authToken) {
      throw new Error("Twilio credentials not configured. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN.");
    }

    twilioClient = twilio(accountSid, authToken);
  }
  return twilioClient;
}

export function generateAccessToken(identity: string): string {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const apiKey = process.env.TWILIO_API_KEY;
  const apiSecret = process.env.TWILIO_API_SECRET;
  const twimlAppSid = process.env.TWILIO_TWIML_APP_SID;

  if (!accountSid || !apiKey || !apiSecret || !twimlAppSid) {
    throw new Error(
      "Twilio access token configuration incomplete. Set TWILIO_ACCOUNT_SID, TWILIO_API_KEY, TWILIO_API_SECRET, and TWILIO_TWIML_APP_SID."
    );
  }

  const AccessToken = twilio.jwt.AccessToken;
  const VoiceGrant = AccessToken.VoiceGrant;

  const token = new AccessToken(accountSid, apiKey, apiSecret, {
    identity,
    ttl: 3600,
  });

  const voiceGrant = new VoiceGrant({
    outgoingApplicationSid: twimlAppSid,
    incomingAllow: true,
  });

  token.addGrant(voiceGrant);
  return token.toJwt();
}

export function generateTwiML(options: {
  say?: string;
  voice?: string;
  gather?: {
    input: string;
    action: string;
    speechTimeout?: string;
    speechModel?: string;
    say?: string;
    voice?: string;
  };
  redirect?: string;
  dial?: string;
  hangup?: boolean;
}): string {
  const VoiceResponse = twilio.twiml.VoiceResponse;
  const response = new VoiceResponse();

  if (options.gather) {
    const gather = response.gather({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      input: [options.gather.input] as any,
      action: options.gather.action,
      speechTimeout: options.gather.speechTimeout || "auto",
      speechModel: options.gather.speechModel || "experimental_conversations",
    });
    if (options.gather.say) {
      gather.say({ voice: (options.gather.voice || "Polly.Joanna") as any }, options.gather.say);
    }
  } else if (options.say) {
    response.say({ voice: (options.voice || "Polly.Joanna") as any }, options.say);
  }

  if (options.redirect) {
    response.redirect(options.redirect);
  }

  if (options.dial) {
    response.dial(options.dial);
  }

  if (options.hangup) {
    response.hangup();
  }

  return response.toString();
}

import { IncomingWebhook } from "@slack/webhook";

export const notifySlack = async (url: string, messages: string[]) => {
  const webhook = new IncomingWebhook(url);
  for(const message of messages) {
    await webhook.send({
      text: message,
    });
  }
};

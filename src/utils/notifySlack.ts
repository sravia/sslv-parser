import { timeout } from "./timeout";
import fetch from 'node-fetch';

const MAX_MESSAGE_LENGTH = 3500;
// TODO Refactor to pass slack limitations
export const notifySlack = async (url: string, messages: string[]) => {
  const rateLimitedMessages: string[][] = [];

  messages.forEach((m) => {
    if (rateLimitedMessages.length > 0) {
      const rateLimitedWithNewMessage = [...rateLimitedMessages[rateLimitedMessages.length - 1], m];

      if (rateLimitedWithNewMessage.join("").length > MAX_MESSAGE_LENGTH) {
        rateLimitedMessages.push([m]);
      } else {
        rateLimitedMessages[rateLimitedMessages.length - 1] = rateLimitedWithNewMessage;
      }

    } else {
      rateLimitedMessages.push([m]);
    }
  });

  for (let i = 0; i < rateLimitedMessages.length; i++) {
    const message = rateLimitedMessages[i];

    try {
      await fetch(url, {
        method: 'post',
        body: JSON.stringify({ text: message.join("\n") }),
        headers: {'Content-Type': 'application/json'}
      });
    } catch (e: any) {
      console.log(e);
      const retryAfter = JSON.parse(e.error).retry_after;
      if (e.statusCode === 429) {
        await timeout(retryAfter);
        i -= 1;
      }
    }
  }
};

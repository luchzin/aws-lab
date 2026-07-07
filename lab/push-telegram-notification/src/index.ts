import { saveUser } from "./user";
import { sendMessage } from "./telegram";

export const handler = async (event: any) => {
  if (!event || !event.body) {
    return { statusCode: 400, body: "Bad Request: Missing body" };
  }

  // 2. Parse the body ONLY if it's a string (fixes local vs production difference)
  const update =
    typeof event.body === "string" ? JSON.parse(event.body) : event.body;
  const message = update.message;

  if (!message) {
    return { statusCode: 200, body: "OK" };
  }

  const chatId = message.chat.id;
  const text = message.text;

  if (text === "/start") {
    await saveUser(message.from);

    await sendMessage(
      chatId,
      `👋 Welcome ${message.from.first_name}!

🎧 What would you like to do with audio?`,
      {
        keyboard: [
          [{ text: "🎙 Transcribe Audio" }],
          [{ text: "🔊 Change Voice" }],
          [{ text: "✨ Enhance Audio" }],
          [{ text: "🌐 Translate Audio" }],
          [{ text: "❓ Help" }],
        ],
        resize_keyboard: true,
      },
    );
  } else if (text === "🎙 Transcribe Audio") {
    await sendMessage(
      chatId,
      "📤 Send me an audio file and I will convert it to text.",
    );
  } else if (text === "🔊 Change Voice") {
    await sendMessage(
      chatId,
      "🎭 Send an audio file and choose the voice style you want.",
    );
  } else if (text === "✨ Enhance Audio") {
    await sendMessage(
      chatId,
      "🎚 Send audio and I will improve clarity and remove noise.",
    );
  } else if (text === "🌐 Translate Audio") {
    await sendMessage(chatId, "🌍 Send audio and select the target language.");
  } else if (text === "❓ Help") {
    await sendMessage(
      chatId,
      `
Commands:

🎙 Transcribe Audio
Convert speech to text

🔊 Change Voice
Transform voice style

✨ Enhance Audio
Improve audio quality

🌐 Translate Audio
Translate speech into another language
      `,
    );
  }

  return {
    statusCode: 200,
    body: "OK",
  };
};

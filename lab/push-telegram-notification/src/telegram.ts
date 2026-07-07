if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const TOKEN = process.env.TELEGRAM_TOKEN!;

export async function sendMessage(
  chatId: number,
  text: string,
  reply_markup?: object,
) {
  await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      reply_markup,
    }),
  });
}
export async function sendInfo(
  chatId: number,
  text: string,
  reply_markup?: object,
) {
  await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      reply_markup,
    }),
  });
}

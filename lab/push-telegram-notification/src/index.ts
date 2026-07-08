import { saveUser } from "./user";
import {
  sendMessage,
  sendAdminOptionList,
  handleListUsers,
  handleReadUser,
  handleDeleteUser,
  handleUpdateUser,
  sendUserOptionList,
  handleUserTranslate,
  sendLanguageList,
  promptForTranslationText,
  handleUserTranslateDirect,
  sendChatAction,
} from "./telegram";
import { SUPPORTED_LANGUAGES } from "./lib/supportLange";

export const handler = async (event: any) => {
  if (!event || !event.body) {
    return { statusCode: 400, body: "Bad Request: Missing body" };
  }

  const update =
    typeof event.body === "string" ? JSON.parse(event.body) : event.body;
  const message = update.message;

  if (!message) {
    return { statusCode: 200, body: "OK" };
  }

  const chatId = message.chat.id;
  const adminId = process.env.ADMIN_ID;
  const text = message.text || "";
  const isAdmin = chatId.toString() === adminId;

  if (text === "/start") {
    await saveUser(message.from);
  }

  if (
    message.reply_to_message?.text &&
    message.reply_to_message.text.startsWith("Translate to ")
  ) {
    const languageStr = message.reply_to_message.text
      .split(":\n")[0]
      .replace("Translate to ", "");
    await sendChatAction(chatId, "typing");
    await handleUserTranslateDirect(chatId, languageStr, text, isAdmin);
    return { statusCode: 200, body: "OK" };
  }
  const command = text.startsWith("/") ? text.split(" ")[0] : text;
  if (command === "🌐 Translate Text") {
    await sendLanguageList(chatId, isAdmin);
    return { statusCode: 200, body: "OK" };
  }

  if (SUPPORTED_LANGUAGES.includes(command)) {
    await promptForTranslationText(chatId, text);
    return { statusCode: 200, body: "OK" };
  }

  if (command === "/translate") {
    await sendChatAction(chatId, "typing");
    await handleUserTranslate(chatId, text);
    return { statusCode: 200, body: "OK" };
  }

  if (isAdmin) {
    switch (command) {
      case "/start":
      case "🔙 Back to Menu":
        await sendAdminOptionList(chatId);
        break;

      case "📖 List Users":
      case "👥 Users":
        await handleListUsers(chatId);
        break;

      case "🔍 Read User Info":
        await sendMessage(
          chatId,
          "To read a user's info, reply with: /user <id>",
        );
        break;

      case "/user":
        await handleReadUser(chatId, text);
        break;

      case "✏️ Update User":
        await sendMessage(
          chatId,
          "To update a user, reply with: /update_user <id> <field> <value>",
        );
        break;

      case "/update_user":
        await handleUpdateUser(chatId, text);
        break;

      case "❌ Delete User":
        await sendMessage(
          chatId,
          "To delete a user, reply with: /delete_user <id>",
        );
        break;

      case "/delete_user":
        await handleDeleteUser(chatId, text);
        break;

      case "❓ Help":
        await sendMessage(chatId, "Admin can also use these audio features.");
        break;

      default:
        await sendAdminOptionList(chatId);

        break;
    }
  } else {
    switch (command) {
      case "/start":
        await sendLanguageList(chatId, false);
        break;
      default:
        break;
    }
  }

  return { statusCode: 200, body: "OK" };
};

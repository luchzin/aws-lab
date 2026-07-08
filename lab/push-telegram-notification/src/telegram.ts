if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const TOKEN = process.env.TELEGRAM_TOKEN!;

import { getAllUsers, getUserInfo, deleteUser, updateUser } from "./user";
import { translateText } from "./gemini";
import { SUPPORTED_LANGUAGES } from "./lib/supportLange";

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

export async function sendAdminOptionList(chatId: number) {
  await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: "🛡 Admin Dashboard\nChoose a user management option from the menu below:",
      reply_markup: {
        keyboard: [
          [{ text: "📖 List Users" }, { text: "🔍 Read User Info" }],
          [{ text: "✏️ Update User" }, { text: "❌ Delete User" }],
          [{ text: "🌐 Translate Text" }],
        ],
        resize_keyboard: true,
      },
    }),
  });
}

export async function handleListUsers(chatId: number) {
  const users = await getAllUsers();
  const userList = users
    .map(
      (u) => `ID: ${u.telegram_id}, Name: ${u.first_name} ${u.last_name || ""}`,
    )
    .join("\n");
  await sendMessage(chatId, `Total users: ${users.length}\n${userList}`);
}

export async function handleReadUser(chatId: number, text: string) {
  const parts = text.split(" ");
  if (parts.length < 2) {
    await sendMessage(chatId, "Usage: /user <id>");
    return;
  }
  const id = parts[1];
  const user = await getUserInfo(id);
  if (user) {
    await sendMessage(
      chatId,
      `User Info:\nID: ${user.telegram_id}\nName: ${user.first_name} ${user.last_name || ""}\nUsername: ${user.username || "N/A"}`,
    );
  } else {
    await sendMessage(chatId, "User not found.");
  }
}

export async function handleDeleteUser(chatId: number, text: string) {
  const parts = text.split(" ");
  if (parts.length < 2) {
    await sendMessage(chatId, "Usage: /delete_user <id>");
    return;
  }
  const id = parts[1];
  await deleteUser(id);
  await sendMessage(chatId, `User ${id} deleted.`);
}

export async function handleUpdateUser(chatId: number, text: string) {
  const parts = text.split(" ");
  if (parts.length >= 4) {
    const id = parts[1];
    const field = parts[2];
    const value = parts.slice(3).join(" ");
    try {
      await updateUser(id, field, value);
      await sendMessage(chatId, `User ${id} updated.`);
    } catch (e: any) {
      await sendMessage(chatId, `Error updating user: ${e.message}`);
    }
  } else {
    await sendMessage(chatId, "Usage: /update_user <id> <field> <value>");
  }
}

export async function sendUserOptionList(chatId: number) {
  await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: "👋 Welcome!\n\nI am a translation bot powered by Gemini AI. Click the button below to get started.",
      reply_markup: {
        keyboard: [[{ text: "🌐 Translate Text" }]],
        resize_keyboard: true,
      },
    }),
  });
}

export async function handleUserTranslate(chatId: number, text: string) {
  const parts = text.split(" ");
  if (parts.length < 3) {
    await sendLanguageList(chatId, false);
    return;
  }

  const language = parts[1];
  const textToTranslate = parts.slice(2).join(" ");

  try {
    const translation = await translateText(textToTranslate, language);
    await sendMessage(chatId, `${translation}`);
    await sendLanguageList(chatId, false);
  } catch (error: any) {
    await sendMessage(chatId, `Error translating text: ${error.message}`);
  }
}

export async function handleUserTranslateDirect(
  chatId: number,
  language: string,
  textToTranslate: string,
  isAdmin: boolean,
) {
  try {
    const translation = await translateText(textToTranslate, language);
    await sendMessage(chatId, ` ${translation}`);
  } catch (error: any) {
    await sendMessage(chatId, `Error translating text: ${error.message}`);
  }
  // Resend the language list after translating
  await sendLanguageList(chatId, isAdmin);
}

export async function sendLanguageList(
  chatId: number,
  isAdmin: boolean = false,
) {
  const keyboard: { text: string }[][] = [];
  for (let i = 0; i < SUPPORTED_LANGUAGES.length; i += 2) {
    keyboard.push(
      SUPPORTED_LANGUAGES.slice(i, i + 2).map((l) => ({ text: l })),
    );
  }

  if (isAdmin) {
    keyboard.push([{ text: "🔙 Back to Menu" }]);
  }

  await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: "Please select a language to translate to:",
      reply_markup: {
        keyboard,
        resize_keyboard: true,
      },
    }),
  });
}

export async function promptForTranslationText(
  chatId: number,
  language: string,
) {
  await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: `Translate to ${language}:\nPlease send the text you want to translate.`,
      reply_markup: {
        force_reply: true,
        input_field_placeholder: `Text to translate into ${language}...`,
      },
    }),
  });
}
export async function sendChatAction(
  chatId: number,
  action: string = "typing",
) {
  try {
    await fetch(`https://api.telegram.org/bot${TOKEN}/sendChatAction`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        action: action,
      }),
    });
  } catch (error) {
    console.error("Failed to send chat action:", error);
  }
}

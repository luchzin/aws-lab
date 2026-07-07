import { pool } from "./db";

export async function saveUser(bot_users: any) {
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS bot_users (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      telegram_id BIGINT NOT NULL UNIQUE,
      username VARCHAR(255),
      first_name VARCHAR(255),
      last_name VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  await pool.execute(
    `
    INSERT INTO bot_users (
      telegram_id,
      username,
      first_name,
      last_name
    )
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      username = VALUES(username),
      first_name = VALUES(first_name),
      last_name = VALUES(last_name)
    `,
    [
      bot_users.id,
      bot_users.username ?? null,
      bot_users.first_name ?? null,
      bot_users.last_name ?? null,
    ],
  );
}
export async function getUserInfo(chat_id: string) {
  const [rows] = await pool.execute(
    `
    SELECT *
    FROM bot_users
    WHERE telegram_id = ?
    `,
    [chat_id],
  );

  return (rows as any[])[0] ?? null;
}

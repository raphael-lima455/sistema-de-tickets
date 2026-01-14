import fs from 'fs/promises';
import path from 'path';
import 'dotenv/config';

const dbPath = process.env.DB_PATH || path.resolve(process.cwd(), 'db');

// Garante que a pasta existe
await fs.mkdir(dbPath, { recursive: true });

export const readJson = async (fileName) => {
  const filePath = path.join(dbPath, fileName);
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
};

export const writeJson = async (fileName, data) => {
  const filePath = path.join(dbPath, fileName);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
};
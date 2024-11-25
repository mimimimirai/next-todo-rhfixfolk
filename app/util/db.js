import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const openDb = async () => {
  return open({
    filename: './database.sqlite',
    driver: sqlite3.Database,
  });
};

const addTodo = async (text) => {
  const db = await openDb();
  await db.run('INSERT INTO todos (text, done) VALUES (?, ?)', [text, false]);
  await db.close();
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Todoのテキストが必要です' });
    }
    await addTodo(text);
    return res.status(201).json({ message: 'Todoが追加されました' });
  }
  res.setHeader('Allow', ['POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
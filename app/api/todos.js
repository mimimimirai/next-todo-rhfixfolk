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

const getTodos = async () => {
  const db = await openDb();
  const todos = await db.all('SELECT * FROM todos');
  await db.close();
  return todos;
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Todoのテキストが必要です' });
    }
    await addTodo(text);
    return res.status(201).json({ message: 'Todoが追加されました' });
  } else if (req.method === 'GET') {
    const todos = await getTodos();
    return res.status(200).json(todos);
  }
  res.setHeader('Allow', ['POST', 'GET']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}

import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), 'path/to/your/file.txt'); // 読み込むファイルのパス
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'ファイルの読み込みに失敗しました' });
      return;
    }
    res.status(200).json({ content: data });
  });
}
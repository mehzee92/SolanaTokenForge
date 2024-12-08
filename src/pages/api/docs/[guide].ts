import { readFileSync } from 'fs';
import { join } from 'path';

export default function handler(req, res) {
  const { guide } = req.query;
  const filePath = join(process.cwd(), 'src/docs/guides', `${guide}.md`);
  
  try {
    const content = readFileSync(filePath, 'utf-8');
    res.status(200).send(content);
  } catch (error) {
    res.status(404).json({ error: 'Guide not found' });
  }
} 
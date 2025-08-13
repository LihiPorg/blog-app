import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const numNotes = parseInt(process.argv[2]);

if (isNaN(numNotes) || numNotes <= 0) {
  console.error("Please provide a valid positive number of notes.");
  process.exit(1);
}

const notes = Array.from({ length: numNotes }, (_, i) => ({
  id: i + 1,
  title: `Note ${i + 1}`,
  author: {
    name: `Author ${i + 1}`,
    email: `mail_${i + 1}@gmail.com`
  },
  content: `Content for note ${i + 1}`
}));

const data = { notes };
const outputDir = path.join(__dirname, "data");

fs.mkdirSync(outputDir, { recursive: true });

fs.writeFileSync(
  path.join(outputDir, "notes.json"),
  JSON.stringify(data, null, 2),
  "utf-8"
);


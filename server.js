const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());


const ALLOWED_ROOT = path.join(os.homedir(), 'Downloads');

const fileTypes = {
  images: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp', '.tiff'],
  documents: ['.pdf', '.doc', '.docx', '.txt', '.rtf', '.md', '.odt', '.xls', '.xlsx', '.ppt', '.pptx'],
  audio: ['.mp3', '.wav', '.ogg', '.aac', '.flac', '.m4a'],
  videos: ['.mp4', '.avi', '.mov', '.mkv', '.wmv', '.flv'],
  archives: ['.zip', '.rar', '.tar', '.gz', '.7z', '.bz2'],
  code: ['.js', '.py', '.java', '.cpp', '.html', '.css', '.ts', '.json', '.yaml', '.yml'],
  executables: ['.exe', '.dmg', '.app', '.bat', '.sh'],
};

function getFileType(ext) {
  for (const [type, extensions] of Object.entries(fileTypes)) {
    if (extensions.includes(ext.toLowerCase())) {
      return type;
    }
  }
  return 'others';
}

async function getAllFiles(dir) {
  let files = [];
  const items = await fs.readdir(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files = files.concat(await getAllFiles(fullPath));
    } else if (item.isFile()) {
      files.push(fullPath);
    }
  }
  return files;
}

app.post('/organize', async (req, res) => {
  let { folderPath } = req.body;

  if (!folderPath) {
    return res.status(400).json({ error: 'Caminho da pasta é obrigatório (body: { "folderPath": "/caminho/da/pasta" })' });
  }

  folderPath = path.resolve(folderPath);
  if (ALLOWED_ROOT && !folderPath.startsWith(ALLOWED_ROOT)) {
    return res.status(403).json({ error: `Acesso negado: pasta deve estar dentro de ${ALLOWED_ROOT}` });
  }

  try {
    await fs.access(folderPath);
  } catch {
    return res.status(404).json({ error: `Pasta não encontrada: ${folderPath}` });
  }

  try {
    const allFiles = await getAllFiles(folderPath);

    let organizedCount = 0;
    const summary = {};
    const errors = [];

    await Promise.all(allFiles.map(async (filePath) => {
      try {
        const ext = path.extname(filePath);
        if (!ext) return;

        const relativePath = path.relative(folderPath, filePath);
        const type = getFileType(ext);
        const typeFolder = path.join(folderPath, type);
        const newDir = path.join(typeFolder, path.dirname(relativePath));

        await fs.mkdir(newDir, { recursive: true });

        const newPath = path.join(newDir, path.basename(filePath));
        await fs.rename(filePath, newPath);

        organizedCount++;
        summary[type] = (summary[type] || 0) + 1;
      } catch (err) {
        errors.push(`Erro ao mover ${filePath}: ${err.message}`);
      }
    }));

    if (errors.length > 0) {
      return res.status(207).json({
        message: `Organização parcial: ${organizedCount} arquivos movidos, mas ${errors.length} erros.`,
        summary,
        errors,
      });
    }

    res.status(200).json({
      message: `Organização concluída! ${organizedCount} arquivos movidos.`,
      summary,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao organizar arquivos. Verifique permissões ou caminho.' });
  }
});

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
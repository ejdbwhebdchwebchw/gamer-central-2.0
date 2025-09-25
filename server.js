const express = require('express');
const multer = require('multer');
const unzipper = require('unzipper');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.static('uploads')); // Serve games from /uploads

// Multer config for uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const gameName = file.originalname.replace(/\.zip$/, '') + '-' + Date.now();
    cb(null, gameName + '.zip');
  }
});
const upload = multer({ storage });

// API: Upload a zip file
app.post('/api/upload', upload.single('game'), async (req, res) => {
  const filePath = req.file.path;
  const gameName = req.file.filename.replace(/\.zip$/, '');
  const gameDir = path.join('uploads', gameName);

  fs.mkdirSync(gameDir);
  fs.createReadStream(filePath)
    .pipe(unzipper.Extract({ path: gameDir }))
    .on('close', () => {
      fs.unlinkSync(filePath); // Delete zip after extraction
      res.json({ success: true, gameName });
    });
});

// API: List games
app.get('/api/games', (req, res) => {
  const games = fs.readdirSync('uploads')
    .filter(f => fs.statSync(path.join('uploads', f)).isDirectory());
  res.json(games);
});

// Serve a specific game (index.html entrypoint)
app.get('/games/:name', (req, res) => {
  const gameDir = path.join(__dirname, 'uploads', req.params.name);
  const indexPath = path.join(gameDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Game not found or missing index.html');
  }
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
  }
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});

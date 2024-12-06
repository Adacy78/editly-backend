import express from 'express';
import multer from 'multer';
import editly from 'editly';
import fs from 'fs';
import path from 'path';

const app = express();
const upload = multer({ dest: 'uploads/' });

app.get('/', (req, res) => {
  res.send('Bienvenue sur le backend Editly !');
});

app.post('/create-video', upload.fields([{ name: 'images' }, { name: 'music' }]), async (req, res) => {
  try {
    const images = req.files['images'].map(file => ({ type: 'image', path: file.path }));
    const music = req.files['music'][0].path;

    const outputPath = `output/${Date.now()}.mp4`;

    await editly({
      outPath: outputPath,
      width: 1920,
      height: 1080,
      fps: 30,
      clips: images,
      audioFilePath: music,
      loopAudio: true,
    });

    res.download(outputPath, () => {
      req.files['images'].forEach(file => fs.unlinkSync(file.path));
      fs.unlinkSync(music);
      fs.unlinkSync(outputPath);
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur lors de la création de la vidéo');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});

import express from 'express';
import multer from 'multer';
import editly from 'editly';
import fs from 'fs';
import { exec } from 'child_process';

// Vérifier si FFmpeg est installé
exec('ffmpeg -version', (error, stdout, stderr) => {
  if (error) {
    console.error('FFmpeg non disponible :', error.message);
    return;
  }
  console.log('FFmpeg disponible :', stdout);
});

// Créer les répertoires nécessaires
['uploads', 'output'].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
});

const app = express();
const upload = multer({ dest: 'uploads/' });

app.get('/', (req, res) => res.send('Bienvenue sur le backend Editly !'));

app.post(
  '/create-video',
  upload.fields([{ name: 'images' }, { name: 'music' }]),
  async (req, res) => {
    try {
      if (!req.files || !req.files['images'] || !req.files['music']) {
        return res.status(400).send('Les fichiers images ou musique sont manquants.');
      }

      const images = req.files['images'].map((file) => ({
        type: 'image',
        path: file.path,
      }));
      const music = req.files['music'][0].path;

      const outputPath = `output/${Date.now()}.mp4`;

      console.log('Fichiers reçus :', { images, music });

      // Générer la vidéo avec Editly
      await editly({
        outPath: outputPath,
        clips: images.map((image) => ({
          layers: [image],
        })),
        audioFilePath: music,
        loopAudio: true,
      });

      res.download(outputPath, (err) => {
        if (err) console.error('Erreur lors du téléchargement :', err);
        req.files['images'].forEach((file) => fs.unlinkSync(file.path));
        fs.unlinkSync(music);
        fs.unlinkSync(outputPath);
      });
    } catch (err) {
      console.error('Erreur lors de la création de la vidéo :', err);
      res.status(500).send('Erreur lors de la création de la vidéo');
    }
  }
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});

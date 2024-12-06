const express = require('express');
const multer = require('multer');
const editly = require('editly');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' }); // Répertoire temporaire pour les fichiers

// Route principale pour tester le serveur
app.get('/', (req, res) => {
  res.send('Bienvenue sur le backend Editly !');
});

// Route pour créer une vidéo
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
      loopAudio: true, // Répéter la musique si elle est plus courte que la vidéo
    });

    res.download(outputPath, () => {
      // Nettoyer les fichiers temporaires
      req.files['images'].forEach(file => fs.unlinkSync(file.path));
      fs.unlinkSync(music);
      fs.unlinkSync(outputPath);
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur lors de la création de la vidéo');
  }
});

// Lancer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});

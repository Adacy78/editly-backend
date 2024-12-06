# Utiliser une image Node.js officielle
FROM node:18-buster

# Installer FFmpeg
RUN apt-get update && apt-get install -y ffmpeg

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers de l'application
COPY . .

# Exposer le port 3000
EXPOSE 3000

# Démarrer l'application
CMD ["npm", "start"]

# Utiliser une image Node.js basée sur Debian
FROM node:18-buster

# Installer les dépendances système nécessaires pour FFmpeg, X11, et node-gyp
RUN apt-get update && apt-get install -y \
  ffmpeg \
  libxi-dev \
  libx11-dev \
  libxext-dev \
  build-essential \
  python3 \
  pkg-config

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances Node.js
RUN npm install

# Copier le reste des fichiers de l'application
COPY . .

# Exposer le port utilisé par l'application
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["npm", "start"]

# Utiliser une image Node.js avec Debian comme base
FROM node:18-buster

# Installer les dépendances système nécessaires pour node-gyp
RUN apt-get update && apt-get install -y \
  python3 \
  python3-pip \
  build-essential \
  libcairo2-dev \
  libpango1.0-dev \
  libjpeg-dev \
  libgif-dev \
  librsvg2-dev \
  pkg-config \
  libgl1-mesa-dev \
  libxi-dev

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de l'application dans le conteneur
COPY package.json ./

# Installer les dépendances npm
RUN npm install

# Copier le reste des fichiers du projet
COPY . .

# Exposer le port 3000
EXPOSE 3000

# Commande pour démarrer le serveur
CMD ["npm", "start"]

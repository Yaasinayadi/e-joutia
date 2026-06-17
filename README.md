# E-Joutia 🛒

Bienvenue sur le dépôt du projet **E-Joutia** ! 
Ce projet est une application mobile (et web) développée avec **React Native** et **Expo**.

## 🎯 État d'Avancement (Projet 2)

Actuellement, le développement est focalisé sur le **Projet 2 : Moteur de Recherche & Filtres Avancés**.
- ✅ **Barre de recherche** dynamique avec historique (3 dernières recherches).
- ✅ **Affichage des résultats** sous forme de grille (2 colonnes) avec image, prix, titre et distance.
- ✅ **Module de filtrage** interactif (Bottom Sheet) pour la catégorie, l'état du produit et le tri.
- ⏳ **En attente** : Intégration d'un Slider interactif pour le filtre de prix (actuellement des champs texte).

## 🚀 Prérequis

Avant de commencer, assurez-vous d'avoir installé les outils suivants sur votre machine :
- [Node.js](https://nodejs.org/) (version LTS recommandée)
- [Git](https://git-scm.com/)
- Un gestionnaire de paquets comme **npm** (inclus avec Node.js) ou **Yarn**.
- L'application **Expo Go** installée sur votre smartphone (disponible sur iOS et Android) si vous souhaitez tester l'application sur un appareil physique.

## 🛠️ Installation

Suivez ces étapes pour configurer le projet localement sur votre machine :

1. **Cloner le dépôt** (si vous ne l'avez pas déjà fait) :
   ```bash
   git clone https://github.com/Yaasinayadi/e-joutia.git
   cd e-joutia
   ```

2. **Installer les dépendances** :
   ```bash
   npm install
   ```

## 🏃‍♂️ Exécution du projet

Une fois les dépendances installées, vous pouvez lancer le serveur de développement (Metro Bundler) fourni par Expo.

1. **Démarrer le serveur** :
   ```bash
   npm start
   ```

2. **Voir le résultat** :
   Le démarrage affichera un **QR code** dans votre terminal. À partir de là, vous avez plusieurs options :
   - **Sur un appareil physique** : Scannez le QR code avec l'application **Expo Go** (sur Android) ou avec l'application **Appareil photo** (sur iOS).
   - **Sur un émulateur Android** : Appuyez sur la touche `a` dans le terminal (nécessite Android Studio et un émulateur configurés).
   - **Sur un simulateur iOS** : Appuyez sur la touche `i` dans le terminal (nécessite Xcode sur macOS).
   - **Sur le navigateur (Web)** : Appuyez sur la touche `w` pour ouvrir l'application comme un site web classique.

## 📦 Scripts disponibles

Voici les commandes principales (définies dans le `package.json`) que vous pouvez utiliser :
- `npm start` : Lance le projet avec Expo.
- `npm run android` : Lance directement l'application sur un émulateur Android en cours d'exécution.
- `npm run ios` : Lance directement l'application sur le simulateur iOS.
- `npm run web` : Lance l'application sur votre navigateur web.

## 🏗️ Technologies Principales Utilisées
- **React Native** & **Expo** (v56)
- **TypeScript**
- **React Native Reanimated** (pour des animations fluides)
- **Gorhom Bottom Sheet**
- **Async Storage**

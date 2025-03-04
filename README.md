# Application Web pour la Vente de Plantes

## Description du Projet

Ce projet consiste en une application web de commerce en ligne spécialisée dans la vente de plantes sous différents formats (boutures, greffons, etc.). L'application permet aux utilisateurs de parcourir, rechercher, et acheter des plantes, tandis que les administrateurs peuvent gérer les produits, les commandes, et les utilisateurs.

L'application est développée avec les technologies suivantes :
- **Frontend** : Vue.js
- **Backend** : Node.js avec Express.js
- **Base de données** : MongoDB
- **Apprentissage automatique** : Brain.js (LSTM) pour les suggestions de plantes

## Fonctionnalités

### Pour les Utilisateurs (Clients)
- Création et gestion de compte
- Recherche et visualisation des plantes
- Gestion du panier et passage de commande
- Gestion de la liste de souhaits (WishList)
- Ajout d'avis sur les plantes commandées

### Pour les Administrateurs
- Gestion des utilisateurs (rôles, permissions)
- Gestion des catégories et formats de plantes
- Gestion des plantes (ajout, modification, suppression)
- Gestion des commandes (suivi des statuts)
- Gestion des avis (suppression si nécessaire)

### Pour les Visiteurs
- Consultation des plantes sans connexion
- Ajout de plantes au panier (nécessite une connexion pour finaliser la commande)

## Technologies Utilisées

- **Frontend** : Vue.js, Vuex, Vue Router, Axios, Stripe (pour les paiements)
- **Backend** : Node.js, Express.js, MongoDB, Mongoose, Joi (validation des données)
- **Sécurité** : Bcrypt (hachage des mots de passe), JSON Web Token (authentification), CORS (sécurité des requêtes)
- **Apprentissage Automatique** : Brain.js (LSTM) pour les suggestions de plantes basées sur les interactions utilisateur

## Installation et Exécution

### Prérequis
- Node.js et npm installés sur votre machine
- MongoDB installé et en cours d'exécution

### Étapes pour lancer le projet






# travail-fin-etude-tahri-moussa

## Project setup
```
npm install
```

### Lancer le frontend
```
npm run serve
```

### Installer les dépendances pour le backend
```
cd backend
npm install
node index.js
```

### Lancer le service d'apprentissage automatique
```
cd machine_learning_backend
npm install
node index.js
```



# Service d'authentification Node.js

Ce projet est un service d'authentification en Node.js conçu pour fournir des fonctionnalités d'authentification sécurisées telles que la création de jetons d'accès, la validation d'identifiants utilisateur et la protection contre les attaques par force brute.

## Fonctionnalités

- Authentification des utilisateurs avec nom d'utilisateur et mot de passe
- Création de jetons d'accès JWT
- Renouvellement régulier des jetons d'accès
- Protection contre les attaques de force brute

## Configuration requise

- Node.js
- PostgreSQL

## Installation

1. Clonez ce dépôt sur votre machine locale :

git clone <URL_DU_REPO>

2. Accédez au répertoire du projet :

cd nom_du_projet

3. Installez les dépendances npm :

npm install

4. Configurez les variables d'environnement en créant un fichier `.env` à la racine du projet et en y ajoutant les informations de connexion à la base de données PostgreSQL :

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=nom_de_votre_base_de_données
DB_USERNAME=votre_nom_utilisateur
DB_PASSWORD=votre_mot_de_passe

5. Démarrez le serveur :

npm start

## Utilisation

1. Pour vous connecter, envoyez une requête HTTP POST à `/login` avec le nom d'utilisateur et le mot de passe dans le corps de la requête.
2. Le service générera un jeton d'accès et un jeton de rafraîchissement que vous pourrez utiliser pour accéder aux routes protégées.
3. Pour accéder à une route protégée, ajoutez le jeton d'accès dans l'en-tête de la requête comme suit : `Authorization: Bearer <votre_jetondacces>`
4. Pour renouveler le jeton d'accès, envoyez une requête HTTP POST à `/refresh-token` avec le jeton de rafraîchissement dans le corps de la requête.

## Licence

Ce projet a été ralisé par Alexis Herold et Quentin Mendel.
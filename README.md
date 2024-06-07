# Service d'authentification Node.js

Ce projet est un service d'authentification en Node.js conçu pour fournir des fonctionnalités d'authentification sécurisées telles que la création de jetons d'accès, la validation d'identifiants utilisateur et la protection contre les attaques par force brute.

## Fonctionnalités

- Authentification des utilisateurs avec nom d'utilisateur et mot de passe
- Création de jetons d'accès JWT
- Renouvellement régulier des jetons d'accès
- Protection contre les attaques de force brute

## Configuration requise

- Node.js v20.10.0
- PostgreSQL

## Installation

1. Installez les dépendances npm :
```bash
npm install
```

2. Démarrez le serveur :

```bash
npm run start
```

## Routes
- `POST /api/token`: Login as user & get access token.
- `GET /api/validate/{accessToken}`: Check if access token is still available.
- `POST /api/refresh-token/{refreshToken}/token`: Refresh access token.
- `POST /api/account`: Creater User.
- `GET /api/account/{id}`: Get user.
- `PUT /api/account/{id}`: Update user.

## Utilisation

1. Pour vous connecter, envoyez une requête HTTP POST à `/api/token` avec le nom d'utilisateur et le mot de passe dans le corps de la requête.
2. Le service générera un jeton d'accès et un jeton de rafraîchissement que vous pourrez utiliser pour accéder aux routes protégées.
3. Pour accéder à une route protégée, ajoutez le jeton d'accès dans l'en-tête de la requête comme suit : `Authorization : <YOUR_TOKEN>`
4. Pour renouveler le jeton d'accès, envoyez une requête HTTP POST à `/api/refresh-token` avec le jeton de rafraîchissement dans le corps de la requête.
5. La base de donnée utilisée et celle du projet suivant : https://github.com/web-services-api/rest-api-movies.git
6. Un fichier de test importable dans postman pour tester les routes est trouvable dans le dossier "postman"

## Licence

Ce projet a été ralisé par Alexis Herold et Quentin Mendel.

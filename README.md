## 🏠 Projet : https://afriqueavenirimmobilier.com/

Ce projet est un site d'annonces immobilières pour tout le continent africain. Il est construit sur un stack moderne comprenant **Next.js**, **React**, **TypeScript**, et utilise **NeonDB (PostgreSQL)** géré via **Prisma**.

### 🛠️ Technologies Clés

**Frontend** : Framework pour l'interface utilisateur et le routing.

- Next.js 14 (App Router)
- TypeScript

**Styling**: Gestion du style et du design.

- Tailwind CSS
- librairie nextUI pour les composants
- librairie acertinity UI pour les composants animés

**Base de Données** : Base de données relationnelle flexible et serverless

- NeonDB (PostgreSQL)
- Supabase pour stocker avatar et photos des biens immobiliers (jutilise 2 buckets)

**ORM** : Couche de gestion de la base de données et des migrations

- Prisma

**Authentification** : Gestion des utilisateurs et de l'authentification

- Kinde Auth

**Paiements** : Plateformes de traitement des paiements.

- Stripe & PayPal

**Backend** :

- Next.js 14

## 🚀 Démarrage Rapide (Quick Start)

Suivez ces étapes pour lancer le projet en environnement de développement local.

### 1. Prérequis

Assurez-vous d'avoir installé les outils suivants :

- **Node.js** (version recommandée : `[ex: v20.x]`)
- **[npm / yarn / pnpm]** (gestionnaire de paquets)
- **Git**

### 2. Cloner le Dépôt

```bash
# Clonez le projet
git clone https://github.com/JorgeDaSilva72/NextJS-RealEstate-Stripe.git

# Naviguez vers le dossier du projet
cd nextjs-realstate-stripe

3. Installation des Dépendances
Utilisez votre gestionnaire de paquets préféré :

Bash

# Exemple avec npm
npm install

# OU avec pnpm
pnpm install

4. Configuration de l'Environnement

Le projet utilise des variables d'environnement listées dans le fichier .env.example.

Créez une copie locale :

Bash

cp .env.example .env.local

Remplissez les variables : Ouvrez le fichier .env.local et remplacez les [PLACEHOLDERS] par les clés de développement fournies par le chef de projet/manager.

⚠️ IMPORTANT : Le fichier .env.local est ignoré par Git (.gitignore) et ne doit jamais contenir de clés de production.

5. Base de Données (NeonDB & Prisma)

Vous devez configurer votre base de données locale (ou de développement) et exécuter les migrations.

Configurez les variables DATABASE_URL et DATABASE_URL_UNPOOLED dans votre .env.local avec les informations d'accès que nous vous avons fournies.

Exécutez les migrations (pour créer le schéma) :

Bash

npx prisma migrate dev --name init
Peuplez la base de données avec des données de test (Seeding) :

Bash

npx prisma db seed

6. Lancer l'Application
Vous pouvez maintenant lancer le serveur de développement Next.js :

Bash

npm run dev

# L'application sera accessible sur http://localhost:3000

📁 Structure du Projet

Les répertoires clés du projet sont :

app/[locale] : Contient toutes les pages, les layouts et les Route Handlers de l'App Router de Next.js.

app/api/ : Les Route Handlers pour les API .

components/ : Composants React réutilisables .

prisma/ : Contient le schéma de la base de données (schema.prisma) et le script de seeding.

lib/ : Fonctions utilitaires côté client (ex: formatage de prix, validation).

server/ : Fonctions et logiques côté serveur (ex: interactions avec la base de données, logique d'authentification).

🧑‍💻 Conventions de Développement

Pour maintenir un code base cohérent, veuillez respecter les conventions suivantes :

Git et Branches
Branche Principale : main (toujours stable, correspond à la production).

Branches de Travail : Basez toujours vos travaux sur main. Nommez vos branches en utilisant le format :

feature/[description-de-la-feature] (pour les nouvelles fonctionnalités)

fix/[description-du-bug] (pour les corrections de bugs)

Soumission : Tout travail doit passer par une Pull Request (PR) et nécessite l'approbation d'au moins un autre développeur avant d'être fusionné dans main.

Qualité du Code
Linting & Formatage : Nous utilisons ESLint et Prettier. Votre IDE devrait appliquer automatiquement les règles. Si ce n'est pas le cas, vous pouvez lancer manuellement :

Bash

npm run lint
npm run format
Requêtes à la Base de Données
Toutes les interactions avec la base de données doivent passer par Prisma.

Jamais de requêtes SQL brutes à moins d'une justification exceptionnelle et d'une revue.

📝 Contact
Pour toute question ou blocage, veuillez contacter :

Chef de Projet/Tech Lead : Jorge DA SILVA

Canal de Communication :
    Slack Channel:  à définir
    Discord:  à définir
    Email : jorge.dasilva200172@gmail.com]
```

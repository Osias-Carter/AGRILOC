# AGRILOC - Configuration MySQL

## 1. Créer le fichier d'environnement

Copier `.env.example` vers `.env`, puis ajuster les accès MySQL si besoin.

```bash
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=agriloc
```

## 2. Initialiser la base

Depuis `D:\Agriloc` :

```bash
npm run db:init
```

Le script crée la base `agriloc`, les tables `machines`, `bookings`, `notifications`, puis insère les données de démonstration.

Si `mysql` n'est pas dans le PATH Windows, lance le fichier `database/schema.sql` depuis phpMyAdmin, MySQL Workbench ou le terminal MySQL de ton hébergeur.

## Comptes de test

| Rôle | Email | Mot de passe |
| --- | --- | --- |
| Agriculteur | `koffi@agriloc.test` | `00000000` |
| Agricultrice | `afi@agriloc.test` | `00000000` |
| Fournisseur | `supplier@agriloc.test` | `00000000` |
| Fournisseur | `savane@agriloc.test` | `00000000` |
| Admin | `admin@agriloc.test` | `admin123` |

La base contient 10 machines, plusieurs réservations, des paiements de test et des notifications.

## 3. Lancer l'API

```bash
npm run dev:api
```

API locale :

```text
http://127.0.0.1:4000/api
```

Test rapide :

```text
http://127.0.0.1:4000/api/health
```

## 4. Lancer le frontend

Dans un autre terminal :

```bash
npm run dev -- --host 127.0.0.1 --port 5174
```

Application :

```text
http://127.0.0.1:5174/index.html
```

Si l'API ou MySQL n'est pas disponible, l'application reste utilisable en mode démo local.

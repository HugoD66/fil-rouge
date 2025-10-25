# 🧭 Guide débutant — Monorepo CLI

Ce document t’explique **simplement** comment utiliser le script `bin/monorepo` de ton projet.  
Même si tu débutes, tu pourras suivre étape par étape sans te perdre 👇

---

## 🚀 À quoi sert ce script ?

Le script `bin/monorepo` est comme **un tableau de bord** pour ton projet.  
Il te permet de lancer **l’API**, **le Front**, **les tests**, **le lint**, ou d’arrêter les serveurs facilement — **sans retenir toutes les commandes npm**.

En gros, tu lances un seul script, puis tu navigues dans un petit menu interactif.

---

## 🧩 Préparation

Avant de lancer quoi que ce soit, assure-toi d’avoir :

1. **Node.js** et **npm** installés  
   → Teste avec :
   ```bash
   node -v
   npm -v
   ```

2. **Docker** installé et en marche  
   → Teste avec :
   ```bash
   docker ps
   ```

3. Le script est **exécutable** :  
   Si besoin, rends-le exécutable une fois pour toutes :
   ```bash
   chmod +x bin/monorepo
   ```

---

## ▶️ Lancer le script

Depuis la racine du projet :
```bash
./bin/monorepo
```

Tu verras apparaître quelque chose comme :

```
Monorepo CLI
============

1) front
2) api
3) lint
4) tests
5) stop servers
6) Quitter
```

👉 Tape le **numéro** de ce que tu veux faire, puis **Entrée**.

---

## 🧠 Que font les options ?

### 1️⃣ `front`
C’est la **partie visuelle** (interface utilisateur).

- **`up`** → Lance ton serveur Front (souvent Angular ou Vite)  
  Ouvre ensuite ton navigateur sur `http://localhost:4200`

- **`OpenAPI generation (models only)`** → Télécharge les modèles d’API à jour pour le front.  
  (Ton API doit tourner pour que ça marche)

---

### 2️⃣ `api`
C’est la **partie serveur / backend** (NestJS par exemple).

- **`up`** → Démarre la base de données avec Docker, puis l’API.  
  Accessible en général sur `http://localhost:3000`

- **`migrations: generate`** → Crée une nouvelle migration (changement dans la base de données)
- **`migrations: run`** → Applique les migrations
- **`migrations: revert`** → Annule la dernière migration

> 💡 Une migration, c’est une "mise à jour" du schéma de la base de données.

---

### 3️⃣ `lint`
Analyse ton code pour détecter les erreurs de style ou de syntaxe.

- **`lint & fix`** → Vérifie le code de tout le monorepo et corrige automatiquement ce qu’il peut.

> 🧹 Très utile avant de faire un commit !

---

### 4️⃣ `tests`
Permet de lancer tous les tests de ton projet.

- **`run (Jest -> E2E → front)`** → Lance tous les tests (API + Front)
- **`api only`** → Lance uniquement les tests du backend
- **`front only`** → Lance uniquement les tests du frontend

---

### 5️⃣ `stop servers`
Ferme les serveurs qui tournent encore sur les ports habituels :  
- `4200` (Front)  
- `3000` (API)

Cela évite les erreurs du genre “port déjà utilisé”.

---

### 6️⃣ `Quitter`
Ferme simplement le menu.

---

## 💡 Astuces utiles

- Si tu vois une erreur “Permission denied”, fais :  
  ```bash
  chmod +x bin/monorepo
  ```

- Si tu veux un raccourci rapide, crée un alias :
  ```bash
  echo 'alias mono="./bin/monorepo"' >> ~/.bashrc && source ~/.bashrc
  ```
  Tu pourras ensuite juste taper :
  ```bash
  mono
  ```

---

## 🧯 En cas de problème

| Problème rencontré | Solution rapide |
|--------------------|------------------|
| Le port est déjà pris | Lance `stop servers` |
| Docker ne démarre pas | Vérifie que Docker Desktop est lancé |
| Le front ne se lance pas | Vérifie que l’API tourne (elle fournit les modèles) |
| Commande inconnue | Mets-toi bien dans la racine du projet avant `./bin/monorepo` |

---

## 🧾 En résumé

| Action | Où aller | Ce que ça fait |
|--------|-----------|----------------|
| Lancer le front | `front > up` | Démarre l’application Angular/Vite |
| Lancer l’API | `api > up` | Démarre Docker et NestJS |
| Corriger le code | `lint > lint & fix` | Vérifie et nettoie le code |
| Lancer les tests | `tests > run (Jest -> E2E → front)` | Lance tous les tests |
| Arrêter tout | `stop servers` | Libère les ports 4200 et 3000 |

---

Bonne découverte et bon code ! 🚀

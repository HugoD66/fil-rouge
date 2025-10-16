# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Overview

Monorepo managed with npm workspaces containing:
- front: Angular 18 application with SSR (Express host in front/server.ts). Dev via Angular CLI; production SSR served by Node.
- api: NestJS 11 HTTP API (bootstrap in api/src/main.ts).

Key outputs/ports:
- front dev: http://localhost:4200 (ng serve)
- front SSR (after build): Node Express on http://localhost:4000
- api: PORT env or 3000 by default
- Build outputs: front → dist/front (browser and server bundles), api → dist/

## Setup

- Install all workspace deps at repo root:
  - npm install

## Run (development)

- Frontend (Angular dev server with HMR):
  - npm run start:front
  - Equivalent: npm run start --workspace=front

- Backend (NestJS with watch):
  - npm run start:dev --workspace=api

## Build

- Frontend (SSR-enabled build):
  - npm run build:front
  - Equivalent: npm run build --workspace=front

- Backend:
  - npm run build:api
  - Equivalent: npm run build --workspace=api

## Serve Frontend SSR (production-like)

- After building front:
  - npm run serve:ssr:front --workspace=front
  - Serves Express from dist/front/server/server.mjs on port 4000

## Tests

- Frontend unit tests (Karma/Jasmine):
  - All tests: npm run test:front
  - Single file: npm run test --workspace=front -- --include=src/app/app.component.spec.ts

- Backend tests (Jest):
  - Unit: npm run test:api
  - Watch: npm run test:watch --workspace=api
  - Coverage: npm run test:cov --workspace=api
  - E2E: npm run test:e2e --workspace=api
  - Run a single test file: npm run test --workspace=api -- src/app.controller.spec.ts
  - Filter by test name: npm run test --workspace=api -- -t "should return \"Hello World!\""

## Linting & Formatting

- API lint (ESLint):
  - npm run lint --workspace=api
- API format (Prettier):
  - npm run format --workspace=api

Note: Angular ESLint packages exist at the root, but no lint script/config is defined for front.

## Lint global (monorepo)

Pour lancer le lint sur les deux workspaces (`api` puis `front`) et appliquer les corrections automatiques (`--fix`), utilise :

- Depuis la racine du repo (ligne de commande) :

  ```bash
  npm run lint:all
  ```

  Ce script exécute en séquence :
  1) `npm run lint --workspace=api -- --fix`
  2) `npm run lint --workspace=front -- --fix`

  Il applique les correctifs auto‑fixables et affiche en console les erreurs/warnings restantes.

- Via le menu fourni dans `bin/monorepo` (bash) : lance `./bin/monorepo` depuis la racine, choisis `lint` → `lint & fix (api + front)`.
- Via PowerShell (Windows) : lance `PowerShell -NoProfile -ExecutionPolicy Bypass -File .\bin\monorepo.ps1` puis option `lint` → `lint & fix`.

Notes :
- Le script menu capture la sortie de chaque lint dans des logs temporaires et extrait/affiche les lignes contenant `error` ou `warning` pour faciliter la lecture.
- Si tu veux conserver les logs de manière persistante, on peut configurer le script pour écrire dans `./logs/` au lieu d'un répertoire temporaire.

## Liste synthétique des règles ESLint (config racine)

La configuration centrale du monorepo est définie dans `eslint.config.mjs`. En résumé, les règles activées sont :

- Héritage de base : `eslint:recommended` (via `@eslint/js` config recommended).

- Règles TypeScript (`@typescript-eslint`):
  - Vérifie les variables assignées mais non utilisées (`@typescript-eslint/no-unused-vars`):
    - Ce que ça vérifie : détecte les variables, paramètres ou imports qui sont déclarés/assignés mais jamais utilisés.
    - Comment corriger : supprimer la variable si inutile, utiliser `_prefix` pour indiquer l'intention (par ex. `_unused`), ou utiliser la variable si nécessaire.
    - Exemple :
      ```ts
      // violation
      const foo = 1;

      // correction - soit on supprime
      // soit on préfixe pour indiquer qu'on l'ignore
      const _foo = 1;
      ```

  - Force l'utilisation de `import type` pour imports uniquement types (`@typescript-eslint/consistent-type-imports`):
    - Ce que ça vérifie : si un import n'est utilisé que pour les types, il recommande d'utiliser `import type` pour éviter l'inclusion à l'exécution.
    - Comment corriger : remplacer `import { T } from 'x'` par `import type { T } from 'x'`.
    - Exemple :
      ```ts
      // violation
      import { MyType } from './types';

      // correction
      import type { MyType } from './types';
      ```

  - Préfère `type` pour les définitions de types (`@typescript-eslint/consistent-type-definitions`):
    - Ce que ça vérifie : impose un style cohérent (ici la préférence `type` plutôt que `interface`).
    - Comment corriger : remplacer une `interface` par un `type` si tu suis la règle (ou inversement si la config est modifiée).
    - Exemple :
      ```ts
      // violation (si la préférence est `type`)
      interface User { id: string }

      // correction
      type User = { id: string };
      ```

  - Alerte sur l'utilisation de `any` (`@typescript-eslint/no-explicit-any`):
    - Ce que ça vérifie : signale les déclarations `any` (perdent la sécurité de typage).
    - Comment corriger : préciser un type, utiliser un type générique, ou cast explicite si vraiment nécessaire; signale aussi pour revue de code.
    - Exemple :
      ```ts
      // violation
      function f(x: any) {}

      // correction
      function f(x: unknown) { /* affiner le type ensuite */ }
      ```

  - Exige ou recommande un type de retour explicite pour les fonctions (`@typescript-eslint/explicit-function-return-type`):
    - Ce que ça vérifie : avertit lorsque le type de retour d'une fonction n'est pas déclaré (utile pour l'API publique).
    - Comment corriger : ajouter la signature de retour (ex. `(): Promise<void>`).
    - Exemple :
      ```ts
      // violation
      function compute() { return 1; }

      // correction
      function compute(): number { return 1; }
      ```

  - Empêche les promesses non attendues (`@typescript-eslint/no-floating-promises`):
    - Ce que ça vérifie : détecte les appels à des fonctions retournant une Promise qui ne sont pas `await`és, `then`és ou explicitement ignorés (avec `void`).
    - Comment corriger : `await` la promesse, chaîner `.catch(...)`, ou préfixer par `void` si l'oubli est intentionnel.
    - Exemple :
      ```ts
      // violation
      someAsync();

      // correction
      await someAsync();
      // ou
      void someAsync();
      ```

  - Empêche l'usage incorrect des promesses comme callbacks (`@typescript-eslint/no-misused-promises`):
    - Ce que ça vérifie : prévient l'utilisation d'une fonction async là où un callback synchrone est attendu (ex. Array#map, event handlers sans await), ce qui peut entraîner des comportements inattendus.
    - Comment corriger : convertir le caller pour gérer les promesses, ou extraire une fonction synchrone wrapper qui gère l'appel async correctement.
    - Exemple :
      ```ts
      // violation
      arr.forEach(async (item) => { await doSomething(item); });

      // correction
      for (const item of arr) { await doSomething(item); }
      ```

  - Préfère `??` au lieu de `||` pour gérer `null`/`undefined` (`@typescript-eslint/prefer-nullish-coalescing`):
    - Ce que ça vérifie : recommande d'utiliser l'opérateur de coalescence nulle `??` quand on veut traiter uniquement `null` ou `undefined` (et non falsy comme `''` ou `0`).
    - Comment corriger : remplacer `a || b` par `a ?? b` si l'intention est de vérifier uniquement null/undefined.
    - Exemple :
      ```ts
      // violation (si on veut préserver 0 ou '')
      const x = value || 'default';

      // correction
      const x = value ?? 'default';
      ```

  - Préfère `?.` / chaînes optionnelles et opérateurs facultatifs (`@typescript-eslint/prefer-optional-chain`):
    - Ce que ça vérifie : suggère d'utiliser les opérateurs `?.` et `??` ou la chaîne optionnelle pour simplifier les checks en cascade plutôt que des tests répétitifs.
    - Comment corriger : réécrire les expressions longues en utilisant `?.` et `??`.
    - Exemple :
      ```ts
      // violation
      if (a && a.b && a.b.c) { return a.b.c; }

      // correction
      return a?.b?.c;
      ```

  - Détecte les assertions de type inutiles (`@typescript-eslint/no-unnecessary-type-assertion`):
    - Ce que ça vérifie : signale quand on utilise `as Type` alors que le type est déjà connu ou la coercition est superflue.
    - Comment corriger : supprimer l'assertion `as` ou ajuster le type source.
    - Exemple :
      ```ts
      // violation
      const x = y as string; // alors que y est déjà string

      // correction
      const x = y;
      ```

  - Vérifie l'exhaustivité des `switch` sur les unions discriminées (`@typescript-eslint/switch-exhaustiveness-check`):
    - Ce que ça vérifie : exige qu'un `switch` couvrant une union discriminée ait un cas pour chaque variante, ou qu'il y ait un `default` qui lève une erreur (pour détecter les cas non gérés lorsque la union change).
    - Comment corriger : ajouter les branches manquantes ou inclure un `default: throw new Error('Unhandled case')`.
    - Exemple :
      ```ts
      type Shape = { kind: 'circle'; r: number } | { kind: 'square'; s: number };

      // correction
      switch (shape.kind) {
        case 'circle': /*...*/; break;
        case 'square': /*...*/; break;
        default: throw new Error('Unhandled shape');
      }
      ```

- Règles Angular (`@angular-eslint`):
  - Vérifie que les classes de composants ont un suffixe `Component` :
    - Ce que ça vérifie : toute classe annotée `@Component(...)` doit se nommer avec le suffixe `Component` (ex. `UserComponent`).
    - Comment corriger : renommer la classe (ex. `export class UserComponent {}`) ou, si le fichier contient autre chose, convertir l’entité en composant correctement.
    - Exemple :
      ```ts
      // violation
      @Component({ selector: 'app-user', ... })
      export class User {}

      // correction
      export class UserComponent {}
      ```

  - Vérifie que les classes de directives ont un suffixe `Directive` :
    - Ce que ça vérifie : toute classe annotée `@Directive(...)` doit se nommer avec le suffixe `Directive` (ex. `HighlightDirective`).
    - Comment corriger : renommer la classe (ex. `export class HighlightDirective {}`).
    - Exemple :
      ```ts
      // violation
      @Directive({ selector: '[appHighlight]' })
      export class Highlight {}

      // correction
      export class HighlightDirective {}
      ```

  - Imposent des sélecteurs de composants cohérents (élément, préfixe `app`, kebab-case) :
    - Ce que ça vérifie : le `selector` d’un `@Component` doit être de type élément (pas d’attribut), commencer par le préfixe `app-` et être en kebab-case (ex. `app-user-card`).
    - Comment corriger : modifier la valeur `selector` dans le décorateur `@Component` pour respecter `app-<kebab-case>`.
    - Exemple :
      ```ts
      // violation
      @Component({ selector: 'userCard' })

      // correction
      @Component({ selector: 'app-user-card' })
      ```

  - Imposent des sélecteurs de directives cohérents (attribut, préfixe `app`, camelCase) :
    - Ce que ça vérifie : le `selector` d’une `@Directive` doit être un attribut (entre crochets), commencer par `app` et être en camelCase (ex. `[appHighlight]`).
    - Comment corriger : modifier la valeur `selector` dans `@Directive` pour respecter le format (par ex. `selector: '[appHighlight]'`).
    - Exemple :
      ```ts
      // violation
      @Directive({ selector: 'app-highlight' })

      // correction
      @Directive({ selector: '[appHighlight]' })
      ```

  - Signale les méthodes de cycle de vie vides (ex. `ngOnInit() {}`) :
    - Ce que ça vérifie : les définitions vides de hooks Angular (`ngOnInit`, `ngOnDestroy`, etc.) sont signalées parce qu’elles sont souvent inutiles et ajoutent du bruit.
    - Comment corriger : supprimer la méthode si elle est vide, ou y ajouter un commentaire expliquant pourquoi elle est volontairement vide. Si la méthode est nécessaire pour l’implémentation d’une interface, implémente uniquement ce qui est requis.
    - Exemple :
      ```ts
      // violation
      ngOnInit() {}

      // correction
      // soit supprimer la méthode si inutile
      // soit documenter pourquoi elle est vide
      ngOnInit() {
        // intentionally left blank because ...
      }
      ```

- Plugin Node (`eslint-plugin-n`) — règles appliquées sur `api` :
  - `n/no-missing-import` : error
  - `n/no-unsupported-features/es-syntax` : error

- Désactivation de la règle JS native `no-unused-vars` (pour éviter les conflits avec `@typescript-eslint/no-unused-vars`).

- Globales et overrides utiles :
  - Globals pour front/server : `console`, `window`, `document`, `navigator`, `process`, `__dirname`, timers (`setTimeout`/`clearTimeout`, ...), et déclarations pour Jest (`describe`, `it`, `expect`, ...).
  - Templates Angular : parser et plugin `@angular-eslint/template` pour les fichiers `front/**/*.html`.
  - Ignorés globaux : `**/dist/**`, `**/node_modules/**`, `**/coverage/**`, `**/.angular/**`.

Si tu veux que je génère une liste plus détaillée (par règle, avec description et niveau — error/warn — et exemples d'auto-fix), dis‑le moi et je l'ajoute à `WARP.md` ou dans un fichier `docs/ESLINT.md` séparé.

## Repository structure (high-level)

- Workspaces are declared in package.json at the root: ["front", "api"]. Use --workspace (or -w) to target a package.
- Front (Angular): standalone component setup, SSR configured in angular.json (server entry front/server.ts). Main client entry: front/src/main.ts; server bootstrap: front/src/main.server.ts. Express server wires SSR in front/server.ts.
- API (NestJS): AppModule (api/src/app.module.ts), AppController (api/src/app.controller.ts) returns a simple greeting, AppService (api/src/app.service.ts). Jest config embedded in api/package.json for unit tests; E2E Jest config in api/test/jest-e2e.json.

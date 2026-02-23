# PWA Go/No-Go & Stroop Task Training

A Progressive Web App (PWA) designed for cognitive training, combining the classic Go/No-Go task with Stroop interference for advanced levels.

## 🎮 Game Rules & Basic Specifications

### 🎯 Objective
Improve impulse control and cognitive flexibility by correctly responding to "Go" stimuli and inhibiting responses to "No-Go" stimuli.

### 🧠 Core Mechanics (Go/No-Go)
* **Go Stimulus**: An indicator (e.g., a green circle or a specific shape). You must tap/click the screen as quickly as possible.
* **No-Go Stimulus**: An indicator (e.g., a red cross or a different shape). You must **NOT** tap/click the screen.
* **Input**: Tapping anywhere on the screen or pressing the spacebar.

### 🔄 Progression & Difficulty
The game consists of multiple levels, with the difficulty naturally scaling up.
* Each Level consists of 2 Rounds.
* A Round consists of a set of 10 trials (stimulus presentations).
* **Bag System**: To ensure controlled randomness, each block of 10 trials contains a guaranteed ratio of 8 Go stimuli to 2 No-Go stimuli (80% Go / 20% No-Go). This creates a strong "pre-potent" urge to respond, making the No-Go trials more challenging.

#### Level Scaling
As the level increases, the time limits become stricter:
* **Stimulus Duration**: The amount of time the stimulus is visible decreases.
* **Inter-Stimulus Interval (ISI)**: The pause between stimuli becomes shorter and more variable.

### 🎨 Advanced Levels: Stroop Interference (Level 5+)
From Level 5 onwards, the Stroop task rules are introduced to increase cognitive load.
* Instead of simple shapes/colors, the stimulus might be a word (e.g., "RED", "GREEN", "BLUE").
* The word itself will be painted in a color (which may or may not match the text).
* **New Rule Example**: 
  * "Go" if the **text color** matches the **word meaning** (Congruent).
  * "No-Go" if the **text color** does NOT match the **word meaning** (Incongruent).

## 🛠️ Development Setup

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

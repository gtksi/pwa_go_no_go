# PWA Go/No-Go & ストループ課題トレーニング

認知力トレーニングのために設計されたプログレッシブウェブアプリ（PWA）。古典的なGo/No-Go課題と、高難易度レベルでのストループ干渉を組み合わせています。

## 🎮 ゲームのルールと基本仕様

### 🎯 目的
「Go」刺激に正しく反応し、「No-Go」刺激に対する反応を抑制することで、衝動のコントロールと認知的柔軟性を向上させます。

### 🧠 基本メカニクス (Go/No-Go)
* **Go刺激**: 指示マーク（例: 緑の丸や特定の図形）。できるだけ早く画面をタップ/クリックします。
* **No-Go刺激**: 指示マーク（例: 赤のバツや異なる図形）。画面をタップ/クリックしては**いけません**。
* **入力方法**: 画面の任意の場所をタップするか、スペースキーを押します。

### 🔄 進行と難易度
ゲームは複数のレベルで構成され、難易度が自然に上がっていきます。
* 各レベルは **2ラウンド** で構成されます。
* 1ラウンドは **10回の試行（刺激の提示）** のセットです。
* **バッグシステム**: ランダム性を制御するため、10回の試行ブロックには必ず「Go: 8回 / No-Go: 2回」の比率（Go 80% / No-Go 20%）が含まれます。これにより「反応したい」という強い衝動（優勢反応）が生まれ、No-Go試行がより難しくなります。

#### レベルごとの変化
レベルが上がるにつれて、時間制限が厳しくなります：
* **刺激の表示時間**: 刺激が表示される時間が短くなります。
* **刺激間隔 (ISI)**: 刺激と刺激の間の待機時間が短く、かつ不規則になります。

### 🎨 上級レベル: ストループ干渉 (レベル5以降)
レベル5以降では、認知負荷を高めるためにストループ課題のルールが導入されます。
* 単純な図形や色ではなく、刺激が「単語」（例: "RED", "GREEN", "BLUE"）になります。
* 単語自体が、テキストの意味とは異なる色で塗られている場合があります。
* **新しいルールの例**:
  * **文字の色**と**単語の意味**が一致している場合は「Go」（一致試行）。
  * **文字の色**と**単語の意味**が一致していない場合は「No-Go」（不一致試行）。

## 🆕 Update History (更新履歴)

### 2026-02-24 (Log & Stats Update)
* **Precise Reaction Time Filtering**: Anticipatory taps (Reaction Time < 150ms) are now excluded from performance calculations to ensure accurate cognitive measurements.
* **Baseline RT & Interference Cost**: 
  * Completing a level or the calibration phase accurately registers a **Baseline Median RT**.
  * From Level 5+ (Stroop tasks), the **Interference Cost** is calculated and displayed, measuring the cognitive delay caused by conflicting stimuli.
* **Error Classification & Response Bias**:
  * Errors are explicitly tracked as **Omission** (miss/遅延) and **Commission** (false alarm/誤タップ).
  * **Response Bias** is evaluated based on the error ratio, providing psychological feedback (e.g., Impulsive vs. Inattentive).
* **Integrated Result Screen**:
  * A completely redesigned, dynamic result screen displays Level Progress, Speed Metrics (Median RT, Interference Cost), Accuracy, and Response Bias evaluations.
  * Properly distinguishes between Level Clear, Game Over, and Aborted states.

### 2026-02-24 (Previous Update)
* **Level Selection**: Added the ability to choose a starting level from the title screen.
* **Calibration Phase (準備運動)**: Automatically inserts a 1-round Level 1 "warm-up" phase when starting from Level 2 or higher to establish a baseline reaction speed.
* **Feedback UX Enhancements**:
  * **Omission Error (Miss/遅延)**: The target fades out silently, representing a lapse in attention.
  * **Commission Error (False Alarm/誤タップ)**: Triggers a screen shake, local burst effect, and a dull "thud" sound, representing impulsive action.
* **Advanced Logging**:
  * Reaction Times (RT) are calculated using the **Median** instead of the Mean to exclude outliers.
  * The result screen initially categorizes errors into Omission and Commission.

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

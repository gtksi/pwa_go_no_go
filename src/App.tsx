import { useState } from 'react';
import { Gauge } from './components/Gauge';
import { Stimulus } from './components/Stimulus';
import { ResultScreen } from './components/ResultScreen';
import { useGameEngine } from './hooks/useGameEngine';

function App() {
  const { gameState, startGame, quitToTitle, handleTap } = useGameEngine();
  const [selectedLevel, setSelectedLevel] = useState<number>(1);

  // 背景色のフィードバックアニメーション用
  const getBgColor = () => {
    if (gameState.feedback === 'falseAlarm') return 'bg-red-900/40';
    if (gameState.feedback === 'miss') return 'bg-slate-900/80';
    if (gameState.feedback === 'success') return 'bg-blue-900/20';
    return 'bg-slate-900';
  };

  const isTitleScreen = gameState.level === 1 && gameState.targetLevel === 1 && gameState.progress === 0 && gameState.currentRound === 1 && !gameState.isCalibration;

  return (
    <div
      className={`min-h-screen ${getBgColor()} transition-colors duration-300 text-slate-100 flex flex-col items-center justify-center relative overflow-hidden ${gameState.feedback === 'falseAlarm' ? 'animate-shake' : ''}`}
      onClick={handleTap}
    >
      {/* HUD - Gauge and Level */}
      <div className="absolute top-0 w-full pt-8 pb-4 pointer-events-none z-10">
        <Gauge
          progress={gameState.progress}
          max={gameState.maxProgress}
          round={gameState.currentRound}
        />
        <div className="text-center text-slate-500 font-bold mt-2 flex flex-col items-center">
          <span>LV {gameState.isCalibration ? gameState.targetLevel : gameState.level}</span>
          {gameState.isCalibration && <span className="text-blue-400 text-sm mt-1 animate-pulse">【準備運動】</span>}
        </div>
        <div className="absolute top-0 right-4 pt-4 pointer-events-auto">
          {gameState.isPlaying && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm("ゲームを中断してタイトルに戻りますか？")) {
                  quitToTitle();
                }
              }}
              className="px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-sm rounded-full border border-slate-600 shadow-sm backdrop-blur transition-colors"
            >
              中断
            </button>
          )}
        </div>
      </div>

      {/* Main Stimulus */}
      <div className="flex-1 w-full flex items-center justify-center px-4 pointer-events-none z-0">
        <Stimulus
          stimulus={gameState.stimulus}
          isVisible={gameState.isStimulusVisible}
          feedback={gameState.feedback}
        />
      </div>

      {/* 画面全体のFeedbackエフェクト */}
      {gameState.feedback === 'success' && (
        <div className="absolute inset-0 border-4 border-blue-500/30 rounded-lg pointer-events-none z-20 transition-opacity duration-300" />
      )}
      {gameState.feedback === 'miss' && (
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px] rounded-lg pointer-events-none z-20 transition-all duration-300" />
      )}

      {/* Result Screen */}
      {gameState.isGameOver && (
        <ResultScreen
          stats={gameState.stats}
          onRestart={() => startGame(gameState.targetLevel)}
        />
      )}

      {/* Start Button Overlay */}
      {!gameState.isPlaying && !gameState.isGameOver && (
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-30">
          <h1 className="text-5xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-indigo-600 font-sans tracking-tight drop-shadow-lg text-center">
            BRAIN <br />TRAINING
          </h1>

          {gameState.level > 1 && gameState.progress === 0 && gameState.currentRound === 1 && !gameState.isCalibration && (
            <h2 className="text-2xl font-bold mb-8 text-green-400 animate-bounce">
              LEVEL UP!
            </h2>
          )}

          {isTitleScreen && (
            <div className="mb-8 flex flex-col items-center z-40">
              <label className="text-slate-300 font-bold mb-3 text-sm tracking-widest">開始レベル</label>
              <div className="relative isolate">
                <select
                  className="appearance-none bg-slate-800/80 text-slate-100 border border-slate-600 rounded-full px-6 py-3 pr-10 outline-none focus:border-blue-500 transition-colors cursor-pointer text-lg font-bold shadow-lg backdrop-blur-sm"
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(Number(e.target.value))}
                  onClick={(e) => e.stopPropagation()}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(lvl => (
                    <option key={lvl} value={lvl} className="bg-slate-800">Lv {lvl}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {!isTitleScreen && (
            <p className="text-slate-400 mb-8 max-w-xs text-center leading-relaxed">
              円<span className="text-blue-400 font-bold">（○）</span>が出たらタップ<br />
              バツ<span className="text-red-400 font-bold">（×）</span>が出たら待機<br />
              <span className="text-xs mt-3 block opacity-70">※色は関係ありません</span>
            </p>
          )}

          {isTitleScreen && (
            <p className="text-slate-400 mb-8 max-w-xs text-center leading-relaxed mt-2 text-sm">
              Lv 2以上は<span className="text-blue-400 font-bold">準備運動</span>（Lv 1相当）<br />から開始します。
            </p>
          )}

          <button
            className="px-12 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-95 transition-all text-white rounded-full font-bold shadow-[0_0_30px_rgba(79,70,229,0.4)] text-lg tracking-wider"
            onClick={(e) => {
              e.stopPropagation();
              if (isTitleScreen) {
                startGame(selectedLevel);
              } else {
                startGame();
              }
            }}
          >
            {isTitleScreen ? 'START TRAINING' : 'NEXT LEVEL'}
          </button>
        </div>
      )}
    </div>
  );
}

export default App;

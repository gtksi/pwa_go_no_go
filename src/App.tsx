import { Gauge } from './components/Gauge';
import { Stimulus } from './components/Stimulus';
import { ResultScreen } from './components/ResultScreen';
import { useGameEngine } from './hooks/useGameEngine';

function App() {
  const { gameState, startGame, quitToTitle, handleTap } = useGameEngine();

  // 背景色のフィードバックアニメーション用
  const getBgColor = () => {
    if (gameState.feedback === 'failure') return 'bg-red-900/40';
    if (gameState.feedback === 'success') return 'bg-blue-900/20';
    return 'bg-slate-900';
  };

  return (
    <div
      className={`min-h-screen ${getBgColor()} transition-colors duration-300 text-slate-100 flex flex-col items-center justify-center relative overflow-hidden`}
      onClick={handleTap}
    >
      {/* HUD - Gauge and Level */}
      <div className="absolute top-0 w-full pt-8 pb-4 pointer-events-none z-10">
        <Gauge
          progress={gameState.progress}
          max={gameState.maxProgress}
          round={gameState.currentRound}
        />
        <div className="text-center text-slate-500 font-bold mt-2">
          LV {gameState.level}
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
        />
      </div>

      {/* 画面全体のFeedbackエフェクト (割れるようなフラッシュ等) */}
      {gameState.feedback === 'failure' && (
        <div className="absolute inset-0 border-8 border-red-500 rounded-lg pointer-events-none z-20 animate-pulse" />
      )}
      {gameState.feedback === 'success' && (
        <div className="absolute inset-0 border-4 border-blue-500/30 rounded-lg pointer-events-none z-20 transition-opacity duration-300" />
      )}

      {/* Result Screen */}
      {gameState.isGameOver && (
        <ResultScreen
          stats={gameState.stats}
          onRestart={startGame}
        />
      )}

      {/* Start Button Overlay */}
      {!gameState.isPlaying && !gameState.isGameOver && (
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-30">
          <h1 className="text-5xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-indigo-600 font-sans tracking-tight drop-shadow-lg text-center">
            BRAIN <br />TRAINING
          </h1>
          {gameState.level > 1 && gameState.progress === 0 && gameState.currentRound === 1 && (
            <h2 className="text-2xl font-bold mb-8 text-green-400 animate-bounce">
              LEVEL UP!
            </h2>
          )}
          <p className="text-slate-400 mb-8 max-w-xs text-center leading-relaxed">
            円<span className="text-blue-400 font-bold">（○）</span>が出たらタップ<br />
            バツ<span className="text-red-400 font-bold">（×）</span>が出たら待機<br />
            <span className="text-xs mt-3 block opacity-70">※色は関係ありません</span>
          </p>
          <button
            className="px-12 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-95 transition-all text-white rounded-full font-bold shadow-[0_0_30px_rgba(79,70,229,0.4)] text-lg tracking-wider"
            onClick={(e) => {
              e.stopPropagation();
              startGame();
            }}
          >
            {gameState.level === 1 ? 'START TRAINING' : 'NEXT LEVEL'}
          </button>
        </div>
      )}
    </div>
  );
}

export default App;

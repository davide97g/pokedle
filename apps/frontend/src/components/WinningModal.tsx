import { Button } from "@heroui/button";
import { PokemonSummary } from "@pokedle/types";
import confetti from "canvas-confetti";
import { PartyPopper, X } from "lucide-react";
import React, { useEffect } from "react";

interface VictoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewGame: () => void;
  pokemon: PokemonSummary;
  guessCount: number;
}

export const WinningModal: React.FC<VictoryModalProps> = ({
  isOpen,
  onClose,
  onNewGame,
  pokemon,
  guessCount,
}) => {
  useEffect(() => {
    confetti({
      particleCount: Math.max(200 - 20 * guessCount, 50),
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#ffcc00", "#ff6699", "#66ccff"],
      disableForReducedMotion: true,
    });
  }, [guessCount]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-dark/95 bg-background border border-purple-900/50 rounded-2xl w-full max-w-md p-6 shadow-xl animate-scaleIn">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <PartyPopper className="text-yellow-400" size={24} />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary-400 bg-clip-text text-transparent">
              Congratulations!
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="text-center mb-8">
          <div className="relative w-32 h-32 mx-auto mb-6 group">
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse"></div>
            <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-primary/50">
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
                alt={pokemon.name}
                className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          </div>

          <p className="text-lg mb-2">
            You found{" "}
            <span className="font-bold text-primary">{pokemon.name}</span>
          </p>
          <p className="text-white/70">
            in <span className="font-bold text-yellow-400">{guessCount}</span>{" "}
            guesses!
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onPress={onNewGame}
            className="w-full py-3 px-6 bg-primary hover:bg-primary-dark rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            Start New Game
          </Button>

          {/* <Button
            onPress={() => {
              navigator.clipboard.writeText(
                `I found ${pokemon.name} in ${guessCount} guesses!`
              );
              onClose();
            }}
            className="w-full py-3 px-6 bg-purple-900/30 hover:bg-purple-900/50 border border-purple-900/50 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Share2 size={18} />
            Share Result
          </Button> */}
        </div>

        {/* Stats Preview */}
        {/* <div className="mt-6 pt-6 border-t border-purple-900/30">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">12</p>
              <p className="text-sm text-white/60">Played</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-400">83%</p>
              <p className="text-sm text-white/60">Win Rate</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-400">4.2</p>
              <p className="text-sm text-white/60">Avg. Guesses</p>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

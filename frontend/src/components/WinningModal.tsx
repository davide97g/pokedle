import {
  Button,
  Card,
  CardBody,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
} from "@nextui-org/react";
import confetti from "canvas-confetti";
import { useEffect } from "react";
import { useStatus } from "../hooks/useStatus";
import { PokemonSummary } from "../types/pokemon.model";

export function WinningModal({
  pokemon,
  numberOfGuesses,
  onClose,
  onRestart,
}: {
  pokemon: PokemonSummary;
  numberOfGuesses: number;
  onClose: () => void;
  onRestart: () => void;
}) {
  const bacgroundColorClass = `border-${pokemon.color ?? "black"}-500`;
  const { guessFeedbackHistory } = useStatus();
  useEffect(() => {
    const particleCount = Math.max(
      Math.floor(1000 - guessFeedbackHistory.length * 100),
      100
    );
    confetti({
      particleCount,
      spread: 100000,
    });
  }, [guessFeedbackHistory.length]);
  return (
    <Modal
      size="sm"
      backdrop="blur"
      placement="center"
      isOpen={true}
      onClose={onClose}
    >
      <ModalContent className="purple-dark">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <span className="text-lg">🎉 Congratulations!</span>
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-row gap-2 items-center">
                <Card
                  className={`flex-shrink-0 w-24 h-24 border-2 ${bacgroundColorClass}`}
                >
                  <CardBody className={`overflow-visible w-24`}>
                    <Tooltip
                      showArrow
                      content={`${pokemon.name} #${pokemon.id}`}
                      className="text-gray-600 capitalize"
                    >
                      <Image
                        alt="Card background"
                        className="object-cover rounded-xl cursor-pointer"
                        src={pokemon?.image}
                        width={150}
                        onClick={() =>
                          window.open(
                            `https://www.pokemon.com/us/pokedex/${pokemon.id}`
                          )
                        }
                      />
                    </Tooltip>
                  </CardBody>
                </Card>
                <p className="px-5 text-sm text-white/50">
                  You found{" "}
                  <span
                    className="font-bold"
                    style={{
                      textTransform: "capitalize",
                    }}
                  >
                    {pokemon.name}
                  </span>{" "}
                  in {numberOfGuesses} guesses!
                </p>
              </div>
            </ModalBody>
            <ModalFooter className="flex justify-between">
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" onPress={onRestart}>
                Start New Game
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

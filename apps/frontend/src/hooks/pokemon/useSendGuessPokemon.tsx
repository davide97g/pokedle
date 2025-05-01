import { PokemonValidationGuess } from "@pokedle/types";
import { useMutation } from "@tanstack/react-query";

export const useSendGuessPokemon = () => {
  return useMutation({
    mutationFn: async ({ pokemonId }: { pokemonId: number }) => {
      const { validationGuess } = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/guess/${pokemonId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).then(
        (res) =>
          res.json() as Promise<{ validationGuess: PokemonValidationGuess }>
      );

      return { validation: validationGuess };
    },
  });
};

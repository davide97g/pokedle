import { PokemonValidationGuess } from "@pokedle/types";
import { useMutation } from "@tanstack/react-query";
import { getAuth } from "firebase/auth";

export const useSendGuessPokemon = () => {
  return useMutation({
    mutationFn: async ({
      pokemonId,
      guessNumber,
      gen,
    }: {
      pokemonId: number;
      guessNumber: number;
      gen: number;
    }) => {
      const token = await getAuth().currentUser?.getIdToken();
      const { validationGuess } = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/guess/${pokemonId}?gen=${gen}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ guessNumber }),
        }
      ).then(
        (res) =>
          res.json() as Promise<{ validationGuess: PokemonValidationGuess }>
      );

      return { validation: validationGuess };
    },
  });
};

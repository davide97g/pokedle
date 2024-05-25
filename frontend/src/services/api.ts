import { getToken } from "firebase/app-check";
import {
  PokedleDayStats,
  PokemonModel,
  PokemonSummary,
  PokemonValidationGuess,
} from "../../../types/pokemon.model";
import { GENERATION } from "../types";
import { appCheck, auth } from "../config/firebase";

const BACKEND_URL =
  import.meta.env.VITE_APP_BACKEND_URL ?? "http://localhost:3000";

export const API = {
  getStatus: async (
    gen: GENERATION,
    guessFeedbackHistory: PokemonValidationGuess[]
  ) => {
    return fetch(`${BACKEND_URL}/status/${gen}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(guessFeedbackHistory),
    })
      .then((res) => res.json())
      .then(
        (res) =>
          res as {
            remainingPokemon: number;
          }
      )
      .catch((err) => {
        console.info(err);
        return null;
      });
  },
  getPokemons: async (gen: GENERATION) => {
    // TODO: paginated
    return fetch(`${BACKEND_URL}/pokemon/all/${gen}`)
      .then((res) => res.json())
      .then((res) => res as PokemonSummary[])
      .catch((err) => {
        console.info(err);
        return null;
      });
  },
  sendGuessPokemonId: async (
    pokemonId: number,
    gen: GENERATION,
    guessValidationHistory: PokemonValidationGuess[]
  ) => {
    return fetch(`${BACKEND_URL}/guess-pokemon/${pokemonId}/${gen}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(guessValidationHistory),
    })
      .then((res) => res.json())
      .then(
        (res) =>
          res as {
            validation: PokemonValidationGuess;
            remainingPokemon: number;
          }
      );
  },
};

export const API_PRO = {
  getBestSuggestion: async (
    guessValidationHistory: PokemonValidationGuess[],
    gen: GENERATION
  ) => {
    const appCheckTokenResponse = await getToken(appCheck, true).catch(
      (err) => {
        console.info(err);
        return null;
      }
    );
    const idToken = await auth.currentUser?.getIdToken().catch((err) => {
      console.info(err);
      return null;
    });

    if (!appCheckTokenResponse || !idToken) return null;
    return fetch(`${BACKEND_URL}/best-guess/${gen}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Firebase-AppCheck": appCheckTokenResponse.token,
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify(guessValidationHistory),
    })
      .then((res) => res.json())
      .then((res) => res.pokemon as PokemonModel)
      .catch((err) => {
        console.info(err);
        return null;
      });
  },
};

export const API_ADMIN = {
  createAdmin: async (idToken: string) => {
    fetch(`${BACKEND_URL}/create-admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.info(err);
      });
  },
  getStatusAdmin: async (
    gen: GENERATION,
    guessFeedbackHistory: PokemonValidationGuess[]
  ) => {
    const appCheckTokenResponse = await getToken(appCheck, true).catch(
      (err) => {
        console.info(err);
        return null;
      }
    );
    const idToken = await auth.currentUser?.getIdToken().catch((err) => {
      console.info(err);
      return null;
    });

    if (!appCheckTokenResponse?.token || !idToken) return null;
    return fetch(`${BACKEND_URL}/status/${gen}/admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Firebase-AppCheck": appCheckTokenResponse.token,
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify(guessFeedbackHistory),
    })
      .then((res) => res.json())
      .then(
        (res) =>
          res as {
            remainingPokemon: number;
            pokemonDayStats: PokedleDayStats;
          }
      )
      .catch((err) => {
        console.info(err);
        return null;
      });
  },
  newPokemon: async () => {
    const appCheckTokenResponse = await getToken(appCheck, true).catch(
      (err) => {
        console.info(err);
        return null;
      }
    );
    const idToken = await auth.currentUser?.getIdToken().catch((err) => {
      console.info(err);
      return null;
    });
    if (!appCheckTokenResponse?.token || !idToken) return null;
    return fetch(`${BACKEND_URL}/new-pokemon`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Firebase-AppCheck": appCheckTokenResponse.token,
        Authorization: `Bearer ${idToken}`,
      },
    })
      .then((res) => res.json())
      .then((res) => res.pokemonDayStats as PokedleDayStats)
      .catch((err) => {
        console.info(err);
        return null;
      });
  },
};

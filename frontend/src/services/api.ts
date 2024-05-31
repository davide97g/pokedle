import { getToken } from "firebase/app-check";
import {
  PokedleDayStats,
  PokemonModel,
  PokemonSummary,
  PokemonValidationGuess,
} from "../../../types/pokemon.model";
import { appCheck, auth } from "../config/firebase";
import { GENERATION } from "../../../types/user.types";

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
            totalPokemon: number;
            remainingPokemon: number;
          }
      )
      .catch((err) => {
        console.info(err);
        return null;
      });
  },
  getPokemons: async ({ gen, name }: { gen: GENERATION; name: string }) => {
    const cleanName = name.trim();
    const nameQuery = cleanName ? `?name=${cleanName}` : "";
    return fetch(`${BACKEND_URL}/pokemon/${gen}${nameQuery}`)
      .then((res) => res.json())
      .then((res) => res as PokemonSummary[])
      .catch((err) => {
        console.info(err);
        return [] as PokemonSummary[];
      });
  },
  sendGuessPokemonId: async (
    pokemonId: number,
    gen: GENERATION,
    guessValidationHistory: PokemonValidationGuess[]
  ) => {
    const idToken = await auth.currentUser?.getIdToken().catch((err) => {
      console.info(err);
      return null;
    });
    return fetch(`${BACKEND_URL}/guess-pokemon/${pokemonId}/${gen}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(idToken && { Authorization: `Bearer ${idToken}` }),
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
  getCheckoutSession: async (id: string) => {
    return fetch(`${BACKEND_URL}/checkout-session/${id}`)
      .then((res) => res.json())
      .then(
        (res) =>
          res as {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            checkoutSession: any;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            lineItems: any;
          }
      )
      .catch((err) => {
        console.info(err);
        return null;
      });
  },
};

export const API_ADMIN = {
  // createAdmin: async (idToken: string) => {
  //   fetch(`${BACKEND_URL}/create-admin`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ idToken }),
  //   })
  //     .then((res) => res.json())
  //     .then((res) => {
  //       console.log(res);
  //     })
  //     .catch((err) => {
  //       console.info(err);
  //     });
  // },
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
            totalPokemon: number;
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

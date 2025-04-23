import { Express } from "express";
import { database } from "../config/database";
export const createPokemonController = (app: Express) => {
  // get all the pokemon
  app.get("/pokemon", (_, res) => {
    res.send(database);
  });

  // get guess feedback results
  app.post("/pokemon/guess", (req, res) => {
    const { guess } = req.body;
    if (!guess) {
      return res.status(400).send("Guess is required");
    }
    res.send({
      correct: true,
    });
  });
};

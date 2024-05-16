import { useEffect, useMemo, useState } from "react";
import "./App.css";
import {
  PokemonGuess,
  PokemonModel,
  PokemonNegativeGuess,
} from "../../types/pokemon.model";
import { getStatus, getSuggestion, reset, sendGuess } from "./services/api";

function App() {
  const [status, setStatus] = useState<{
    history: PokemonModel[];
    guessedFeatures: Partial<PokemonGuess>;
    guessedNegativeFeatures: Partial<PokemonNegativeGuess>;
  }>({
    history: [],
    guessedFeatures: {},
    guessedNegativeFeatures: {},
  });

  const [guess, setGuess] = useState<Partial<PokemonGuess>>({});
  const [suggestion, setSuggestion] = useState<PokemonModel | null>(null);
  const [negativeGuess, setNegativeGuess] = useState<
    Partial<PokemonNegativeGuess>
  >({});

  useEffect(() => {
    setGuess(status.guessedFeatures);
    setNegativeGuess(status.guessedNegativeFeatures);
  }, [status]);

  const cleanGuess = useMemo(() => {
    return Object.fromEntries(Object.entries(guess).filter((value) => value));
  }, [guess]);

  const updateStatus = async () =>
    getStatus().then((res) => {
      if (res) {
        setStatus(res);
        console.log(res);
      }
    });

  const onSend = async () => {
    await sendGuess({ guess: cleanGuess, negativeGuess })
      .then((res) => {
        console.log(res);
        updateStatus();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onGuess = async () => {
    await getSuggestion()
      .then((res) => {
        setSuggestion(res);
        setTimeout(() => setSuggestion(null), 5000);
        updateStatus();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    updateStatus();
  }, []);

  return (
    <>
      <h1>Solvedle</h1>
      <p>Guess the Pokemon!</p>
      <button onClick={() => reset().then(() => updateStatus())}>Reset</button>
      {history.length > 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            width: "1200px",
            margin: "auto",
          }}
        >
          <h2>History</h2>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "10px",
              width: "1200px",
              justifyContent: "center",
            }}
          >
            {status.history.map((pokemon, index) => (
              <div key={crypto.randomUUID()}>
                <p>{index + 1}</p>
                <p>{pokemon.name}</p>
                <img
                  src={pokemon.sprite}
                  height={40}
                  width={40}
                  alt={pokemon.name}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "10px",
          width: "1200px",
          margin: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            width: "200px",
            margin: "auto",
          }}
        >
          <h3>Positive Guess</h3>
          {/* create a dropdown with different types of type1 to choose from */}
          <select
            onChange={(e) => setGuess({ ...guess, type1: e.target.value })}
          >
            <option value=""></option>
            <option value="normal">Normal</option>
            <option value="fire">Fire</option>
            <option value="water">Water</option>
            <option value="electric">Electric</option>
            <option value="grass">Grass</option>
            <option value="ice">Ice</option>
            <option value="fighting">Fighting</option>
            <option value="poison">Poison</option>
            <option value="ground">Ground</option>
            <option value="flying">Flying</option>
            <option value="psychic">Psychic</option>
            <option value="bug">Bug</option>
            <option value="rock">Rock</option>
            <option value="ghost">Ghost</option>
            <option value="dragon">Dragon</option>
            <option value="dark">Dark</option>
            <option value="steel">Steel</option>
            <option value="fairy">Fairy</option>
          </select>
          {/* create a dropdown with different types of type2 to choose from */}

          <select
            onChange={(e) => setGuess({ ...guess, type2: e.target.value })}
          >
            <option value=""></option>
            <option value="none">None</option>
            <option value="normal">Normal</option>
            <option value="fire">Fire</option>
            <option value="water">Water</option>
            <option value="electric">Electric</option>
            <option value="grass">Grass</option>
            <option value="ice">Ice</option>
            <option value="fighting">Fighting</option>
            <option value="poison">Poison</option>
            <option value="ground">Ground</option>
            <option value="flying">Flying</option>
            <option value="psychic">Psychic</option>
            <option value="bug">Bug</option>
            <option value="rock">Rock</option>
            <option value="ghost">Ghost</option>
            <option value="dragon">Dragon</option>
            <option value="dark">Dark</option>
            <option value="steel">Steel</option>
            <option value="fairy">Fairy</option>
          </select>
          {/* create a dropdown with different colors to choose from */}

          <select
            onChange={(e) => setGuess({ ...guess, color: e.target.value })}
          >
            <option value=""></option>
            <option value="black">Black</option>
            <option value="blue">Blue</option>
            <option value="brown">Brown</option>
            <option value="gray">Gray</option>
            <option value="green">Green</option>
            <option value="pink">Pink</option>
            <option value="purple">Purple</option>
            <option value="red">Red</option>
            <option value="white">White</option>
            <option value="yellow">Yellow</option>
          </select>
          {/* create a dropdown with different habitats to choose from */}
          <select
            onChange={(e) => setGuess({ ...guess, habitat: e.target.value })}
          >
            <option value=""></option>
            <option value="cave">Cave</option>
            <option value="forest">Forest</option>
            <option value="grassland">Grassland</option>
            <option value="mountain">Mountain</option>
            <option value="rare">Rare</option>
            <option value="rough-terrain">Rough Terrain</option>
            <option value="sea">Sea</option>
            <option value="urban">Urban</option>
            <option value="waters-edge">Water's Edge</option>
          </select>
          {/* create a dropdown with different evolution stages to choose from */}
          <select
            onChange={(e) =>
              setGuess({ ...guess, evolutionStage: parseInt(e.target.value) })
            }
          >
            <option value=""></option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
          {/* input that takes a number for height */}
          <input
            type="number"
            onChange={(e) =>
              setGuess({ ...guess, height: parseInt(e.target.value) })
            }
          />
          {/* input that takes a number for weight */}
          <input
            type="number"
            onChange={(e) =>
              setGuess({ ...guess, weight: parseInt(e.target.value) })
            }
          />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            width: "200px",
            margin: "auto",
          }}
        >
          <h3>Negative Guess</h3>
          {/* create a dropdown with different types of type1 to choose from */}
          <label htmlFor="type1">Type 1</label>
          <select
            id="type1"
            multiple
            onChange={(e) => {
              const values = Array.from(e.target.selectedOptions).map(
                (option) => option.value
              );
              setNegativeGuess({ ...negativeGuess, type1List: values });
            }}
          >
            <option value=""></option>
            <option value="normal">Normal</option>
            <option value="fire">Fire</option>
            <option value="water">Water</option>
            <option value="electric">Electric</option>
            <option value="grass">Grass</option>
            <option value="ice">Ice</option>
            <option value="fighting">Fighting</option>
            <option value="poison">Poison</option>
            <option value="ground">Ground</option>
            <option value="flying">Flying</option>
            <option value="psychic">Psychic</option>
            <option value="bug">Bug</option>
            <option value="rock">Rock</option>
            <option value="ghost">Ghost</option>
            <option value="dragon">Dragon</option>
            <option value="dark">Dark</option>
            <option value="steel">Steel</option>
            <option value="fairy">Fairy</option>
          </select>
          {/* create a dropdown with different types of type2 to choose from */}
          <label htmlFor="type2">Type 2</label>
          <select
            id="type2"
            multiple
            onChange={(e) => {
              const values = Array.from(e.target.selectedOptions).map(
                (option) => option.value
              );
              setNegativeGuess({ ...negativeGuess, type2List: values });
            }}
          >
            <option value=""></option>
            <option value="none">None</option>
            <option value="normal">Normal</option>
            <option value="fire">Fire</option>
            <option value="water">Water</option>
            <option value="electric">Electric</option>
            <option value="grass">Grass</option>
            <option value="ice">Ice</option>
            <option value="fighting">Fighting</option>
            <option value="poison">Poison</option>
            <option value="ground">Ground</option>
            <option value="flying">Flying</option>
            <option value="psychic">Psychic</option>
            <option value="bug">Bug</option>
            <option value="rock">Rock</option>
            <option value="ghost">Ghost</option>
            <option value="dragon">Dragon</option>
            <option value="dark">Dark</option>
            <option value="steel">Steel</option>
            <option value="fairy">Fairy</option>
          </select>
          {/* create a dropdown with different colors to choose from */}
          <label htmlFor="color">Color</label>
          <select
            id="color"
            multiple
            onChange={(e) => {
              const values = Array.from(e.target.selectedOptions).map(
                (option) => option.value
              );
              setNegativeGuess({ ...negativeGuess, colorList: values });
            }}
          >
            <option value=""></option>
            <option value="black">Black</option>
            <option value="blue">Blue</option>
            <option value="brown">Brown</option>
            <option value="gray">Gray</option>
            <option value="green">Green</option>
            <option value="pink">Pink</option>
            <option value="purple">Purple</option>
            <option value="red">Red</option>
            <option value="white">White</option>
            <option value="yellow">Yellow</option>
          </select>
          {/* create a dropdown with different habitats to choose from */}
          <label htmlFor="habitat">Habitat</label>
          <select
            id="habitat"
            multiple
            onChange={(e) => {
              const values = Array.from(e.target.selectedOptions).map(
                (option) => option.value
              );
              setNegativeGuess({ ...negativeGuess, habitatList: values });
            }}
          >
            <option value=""></option>
            <option
              value="cave"
              selected={negativeGuess.habitatList?.includes("cave")}
            >
              Cave
            </option>
            <option
              value="forest"
              selected={negativeGuess.habitatList?.includes("forest")}
            >
              Forest
            </option>
            <option
              value="grassland"
              selected={negativeGuess.habitatList?.includes("grassland")}
            >
              Grassland
            </option>
            <option value="mountain">Mountain</option>
            <option value="rare">Rare</option>
            <option value="rough-terrain">Rough Terrain</option>
            <option value="sea">Sea</option>
            <option value="urban">Urban</option>
            <option value="waters-edge">Water's Edge</option>
          </select>
          {/* create a dropdown with different evolution stages to choose from */}
          {/* add label */}
          <label htmlFor="evolutionStage">Evolution Stage</label>
          <input
            id="evolutionStage"
            type="number"
            onChange={(e) =>
              setNegativeGuess({
                ...negativeGuess,
                evolutionStage: {
                  min: parseInt(e.target.value),
                  max: parseInt(e.target.value) + 1,
                },
              })
            }
          />
          {/* input that takes a number for height */}
          <label htmlFor="height">Height</label>
          <input
            id="height"
            type="number"
            onChange={(e) =>
              setNegativeGuess({
                ...negativeGuess,
                height: {
                  min: parseInt(e.target.value),
                  max: parseInt(e.target.value) + 1,
                },
              })
            }
          />
          {/* input that takes a number for weight */}
          <label htmlFor="weight">Weight</label>
          <input
            id="weight"
            type="number"
            onChange={(e) =>
              setNegativeGuess({
                ...negativeGuess,
                weight: {
                  min: parseInt(e.target.value),
                  max: parseInt(e.target.value) + 1,
                },
              })
            }
          />
        </div>
      </div>
      {/* button that sends the guess */}
      <button onClick={onSend}>Send</button>
      <button onClick={onGuess}>Guess</button>

      {suggestion && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            border: "1px solid black",
            padding: "10px",
            margin: "10px",
            boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2>{suggestion.name}</h2>
          <img
            src={suggestion.sprite}
            height={100}
            width={100}
            alt={suggestion.name}
          />
        </div>
      )}
    </>
  );
}

export default App;

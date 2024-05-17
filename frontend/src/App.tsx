import { useEffect, useState } from "react";
import {
  PokemonModel,
  PokemonValidationGuess,
  ValidationComparison,
} from "../../types/pokemon.model";
import "./App.css";
import { getStatus, getSuggestion, reset, sendGuess } from "./services/api";

function App() {
  const [status, setStatus] = useState<{
    history: PokemonModel[];
  }>({
    history: [],
  });

  const [validationGuess, setValidationGuess] =
    useState<PokemonValidationGuess>();

  const [suggestion, setSuggestion] = useState<PokemonModel | null>(null);

  const updateStatus = async () =>
    getStatus().then((res) => {
      if (res) {
        setStatus(res);
        console.log(res);
      }
    });

  const onSend = async () => {
    if (!validationGuess) return;
    await sendGuess(validationGuess)
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

  const parseInputToGuessValidation = (
    input: string
  ): PokemonValidationGuess => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, type1, type2, color, habitat, evolutionStage, height, weight] =
      input.split("\n");
    return {
      type1: {
        value: type1,
        valid: undefined,
      },
      type2: {
        value: type2,
        valid: undefined,
      },
      color: {
        value: color,
        valid: undefined,
      },
      habitat: {
        value: habitat,
        valid: undefined,
      },
      evolutionStage: {
        value: parseInt(evolutionStage),
        comparison: "equal",
      },
      height: {
        value: parseInt(height),
        comparison: "equal",
      },
      weight: {
        value: parseInt(weight),
        comparison: "equal",
      },
    };
  };

  // listen for paste event
  useEffect(() => {
    document.addEventListener("paste", (event) => {
      const clipboardData = event.clipboardData;
      const pastedData = clipboardData?.getData("Text");
      console.log(pastedData);
      if (pastedData) {
        const parsedData = parseInputToGuessValidation(pastedData);
        setValidationGuess(parsedData);
      }
    });
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
        <h3>Guess Validation</h3>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "10px",
            width: "1200px",
            margin: "auto",
          }}
        >
          {/* for each validation guess key create a checkbox to set validity */}
          <label htmlFor="type1">Type 1</label>
          <input
            id="type1"
            type="checkbox"
            checked={validationGuess?.type1.valid}
            onChange={(e) =>
              setValidationGuess({
                ...validationGuess!,
                type1: {
                  ...validationGuess!.type1,
                  valid: e.target.checked,
                },
              })
            }
          />
          <label htmlFor="type2">Type 2</label>
          <input
            id="type2"
            type="checkbox"
            checked={validationGuess?.type2.valid}
            onChange={(e) =>
              setValidationGuess({
                ...validationGuess!,
                type2: {
                  ...validationGuess!.type2,
                  valid: e.target.checked,
                },
              })
            }
          />
          <label htmlFor="color">Color</label>
          <input
            id="color"
            type="checkbox"
            checked={validationGuess?.color.valid}
            onChange={(e) =>
              setValidationGuess({
                ...validationGuess!,
                color: {
                  ...validationGuess!.color,
                  valid: e.target.checked,
                },
              })
            }
          />
          <label htmlFor="habitat">Habitat</label>
          <input
            id="habitat"
            type="checkbox"
            checked={validationGuess?.habitat.valid}
            onChange={(e) =>
              setValidationGuess({
                ...validationGuess!,
                habitat: {
                  ...validationGuess!.habitat,
                  valid: e.target.checked,
                },
              })
            }
          />
          <label htmlFor="height">Height</label>
          {/* radio with 3 options: less greater and equal */}

          <select
            id="height"
            value={validationGuess?.height.comparison}
            onChange={(e) =>
              setValidationGuess({
                ...validationGuess!,
                height: {
                  ...validationGuess!.height,
                  comparison: e.target.value as ValidationComparison,
                },
              })
            }
          >
            <option
              selected={validationGuess?.height.comparison === "less"}
              value="less"
            >
              Lower
            </option>
            <option
              selected={validationGuess?.height.comparison === "equal"}
              value="equal"
            >
              Equal
            </option>
            <option
              selected={validationGuess?.height.comparison === "greater"}
              value="greater"
            >
              Greater
            </option>
          </select>

          <label htmlFor="weight">Weight</label>
          <select
            id="weight"
            value={validationGuess?.weight.comparison}
            onChange={(e) =>
              setValidationGuess({
                ...validationGuess!,
                weight: {
                  ...validationGuess!.weight,
                  comparison: e.target.value as ValidationComparison,
                },
              })
            }
          >
            <option
              selected={validationGuess?.weight.comparison === "less"}
              value="less"
            >
              Lower
            </option>
            <option
              selected={validationGuess?.weight.comparison === "equal"}
              value="equal"
            >
              Equal
            </option>
            <option
              selected={validationGuess?.weight.comparison === "greater"}
              value="greater"
            >
              Greater
            </option>
          </select>
          <label htmlFor="evolutionStage">Evolution Stage</label>
          <select
            id="evolutionStage"
            value={validationGuess?.evolutionStage.comparison}
            onChange={(e) =>
              setValidationGuess({
                ...validationGuess!,
                evolutionStage: {
                  ...validationGuess!.evolutionStage,
                  comparison: e.target.value as ValidationComparison,
                },
              })
            }
          >
            <option
              selected={validationGuess?.evolutionStage.comparison === "less"}
              value="less"
            >
              Lower
            </option>
            <option
              selected={validationGuess?.evolutionStage.comparison === "equal"}
              value="equal"
            >
              Equal
            </option>
            <option
              selected={
                validationGuess?.evolutionStage.comparison === "greater"
              }
              value="greater"
            >
              Greater
            </option>
          </select>
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

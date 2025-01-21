import Words from "./Words.json";
import { useState } from "react";
import { Keyboard } from "./Keyboard";
import { HangmanDrawing } from "./HangmanDrawing";
import { HangmanWord } from "./HangmanWord";

function App() {

  function getWord(): string {
    return Words[Math.floor(Math.random() * Words.length)]
  }

  const[wordtoGuess, setWordtoGuess] = useState(getWord);
  const[guessedLetters, setGuessedLetters] = useState<string[]>([])

  return (
    <>
      <div style={{
        maxWidth: "800px",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        margin: "0 auto",
        alignItems: "center",
      }}>
        <div style={{fontSize: "2rem",textAlign: "center"}}>Win/Lose</div>
        <HangmanDrawing />
        <HangmanWord />
        <div>
          <Keyboard />
        </div>
      </div>
    </>
  )
}

export default App

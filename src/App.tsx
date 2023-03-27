import React, { useEffect, useState } from 'react';
import './index.css';
import hangman from './../hangman.svg';

const App = () => {
  // define the word
  const word = 'Behaviour';

  // define starting underscores
  const generatePlaceholder = (word: string) => {
    return [...word].map((letter) => '_');
  };

  const [placeholder, setPlaceholder] = useState(generatePlaceholder(word));

  // get an input from the user, one letter at a time
  const [inputValue, setInputValue] = useState('');

  // winning condition check
  const [lives, setLives] = useState(9);
  const [previousAttempts, setPreviousAttempts] = useState<string[]>([]);
  const gameOver =
    lives <= 0 || placeholder.join('').toLowerCase() === word.toLowerCase();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // TODO: Enforce only one letter input at a time
    setInputValue(event.target.value);
  };

  const resetGame = () => {
    // here is where we could change the word for another one
    setPlaceholder(generatePlaceholder(word));
    setPreviousAttempts([]);
    setLives(9);
    
    // we could also update a counter for a total of Win / Lose score
  };

  const handleClick = () => {
    resetGame();
  };

  // check if the letter is present at the word
  const checkLetter = (letter, value = word) => {
    return [...value.toLowerCase()].includes(letter.toLowerCase());
  };

  const shouldUpdatePlaceholder = (letter) => {
    if (letter) {
      // Loop was running when letter was '', this fix Winning condition
      const letterAlreadyAttempted = checkLetter(
        letter,
        previousAttempts.join('')
      );
      if (letterAlreadyAttempted) {
        return false;
      }
      setPreviousAttempts([...previousAttempts, letter]);
      const wordIncludesLetter = checkLetter(letter);
      if (wordIncludesLetter) {
        return true;
      } else {
        setLives(lives - 1);
      }
    }
  };

  // update the underscores with the letter if guessed correctly, at the right positions
  const updatePlaceholder = (letter) => {
    let newPlaceholder = [...word].map((item, index) => {
      if (item.toLowerCase() === letter.toLowerCase()) {
        return item;
      }

      return [...placeholder][index];
    });

    setPlaceholder(newPlaceholder);
  };

  // get an array of previous mistakes
  const getPreviousMistakes = () => {
    return previousAttempts.filter((item) => !checkLetter(item)).join(', ');
  };

  useEffect(() => {
    if (shouldUpdatePlaceholder(inputValue)) {
      updatePlaceholder(inputValue);
    }
    setInputValue('');
  }, [inputValue]);

  // display previous letter attempts

  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Helvetica, Arial, Sans',
        color: 'black',
      }}
    >
      <img style={{ width: '80px' }} src={hangman} alt="First time?" />
      <span>Remaining lives: {lives}</span>
      <h2>{[...placeholder].join(' ')}</h2>
      {!gameOver && (
        <div style={{ display: 'flex', gap: '1rem' }}>
          <label htmlFor="player-guess">Guess the letter: </label>
          <input
            name="player-guess"
            style={{
              width: '2ch',
            }}
            value={inputValue}
            onChange={handleChange}
          />
        </div>
      )}
      <em>{getPreviousMistakes() && `Mistakes: ${getPreviousMistakes()}`}</em>

      {gameOver && (
        <>
          <h3>{lives <= 0 ? 'You lose!' : 'Congratulations!'}</h3>
          <button onClick={handleClick}>Try again?</button>
        </>
      )}
    </main>
  );
};

export default App;

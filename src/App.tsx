import React, { useEffect, useState } from 'react';
import './index.css';
import hangman from './../hangman.svg';

const App = () => {
  // define the word
  const word = 'Behaviour'; // accepts any size word, we could get a random word from a json dict or API

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
  const checkLetter = (letter: string, value = word) => {
    return [...value.toLowerCase()].includes(letter.toLowerCase());
  };

  const shouldUpdatePlaceholder = (letter: string) => {
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
  const updatePlaceholder = (letter: string) => {
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
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <h3>
            {lives <= 0 ? 'Oh, no! You lose!' : 'Congratulations! You win!'}
          </h3>
          <button onClick={handleClick}>Try again?</button>
        </div>
      )}
    </main>
  );

  // For improvements, we could separate a few elements in it's own components, such as the Input, or the Hangman itself. It would be neat to draw each limb as mistakes are made, it would have to receive the number of lives and display each limb as the value changes. Also could make a total score with the win / lose total across playthroughs, and save the value to local storage.
};

export default App;

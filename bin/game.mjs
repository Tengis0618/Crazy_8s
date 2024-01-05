// game.mjs
import {
    range,
    generateDeck,
    shuffle,
    draw,
    deal,
    handToString,
    matchesAnyProperty,
    drawUntilPlayable,
    gameState,
    playerTurn,
    computerTurn,
    cCardEight,
    pCardEight,
    gameStart,
} from "../lib/cards.mjs";
import {question} from 'readline-sync';
import clear from 'clear';
import {readFile,readFileSync} from 'fs';
import promptSync from 'prompt-sync';
const prompt = promptSync();


let deck = [];
let shuffledDeck = [];
let dealt = [];
let discardPile = [];
let playerHand = [];
let computerHand = [];
let nextPlay = [];
if (process.argv.length === 3) {//if there is 3 arguments
    
   const jsonFilePath = process.argv[2];
   //const gameData = JSON.parse(readFileSync(jsonFilePath, 'utf8'));
    // Extract game data from the JSON object
  // Get the file path from the command-line argument
  if(jsonFilePath) {//if there is a file path
    readFile(jsonFilePath, 'utf8', (err, data) => {
      if(err) {
        // handle error
        throw err;
      } else {
        const gameData = JSON.parse(data);
        deck = gameData.deck;
        playerHand = gameData.playerHand;
        computerHand = gameData.computerHand;
        nextPlay[0] = gameData.nextPlay;
        discardPile = gameData.discardPile;
        // parse json and assign to variables
      }
      gameStart(deck, nextPlay, discardPile, computerHand, playerHand);
      // start game 
    });
  }
} else {//if there are 2 arguments
  deck = generateDeck();
  shuffledDeck = shuffle(deck);
  dealt = deal(shuffledDeck);
  playerHand = dealt.hands[0];
  computerHand = dealt.hands[1];
  deck = dealt.deck;
  nextPlay[0] = deck.pop();
  while (nextPlay[0].rank === 8){
      nextPlay[0] = deck.pop();
  }
  discardPile.push(nextPlay[0]);//prepare according to instructions
  gameStart(deck, nextPlay, discardPile, computerHand, playerHand);//start game
  process.exit(1);//end process
} 

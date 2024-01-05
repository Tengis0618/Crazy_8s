// cards.mjs
import promptSync from 'prompt-sync';
import {question} from 'readline-sync';
import clear from 'clear';
const prompt = promptSync();
const suits = {SPADES: '♠️', HEARTS: '❤️', CLUBS: '♣️', DIAMONDS: '♦️'};

const range = (...args) => {
    let arr = [];
    let start, end, inc;
    const numParam = args.length;
    if (numParam === 1){
        end = args[0]
        for (let i = 0; i < end; i++){
            arr[i] = i;
        }
    } else if (numParam === 2){
        start = args[0];
        end = args[1];
        for (let i = 0; i < end; i++){
            arr[i] = start;
            start++;
            if (start >= end){
                break;
            }
        }
    } else if (numParam === 3){
        start = args[0];
        end = args[1];
        inc = args[2];
        for (let i = 0; i < end; i++){
            arr[i] = start;
            start+=inc;
            if (start >= end){
                break;
            }
        }
    } else {
        console.log("Invalid syntax!\n");
    }
    return arr;
}

const generateDeck = () => {
    const deck = [];
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    for (const suitKey in suits) {
        if (suits.hasOwnProperty(suitKey)) {
            const suit = suits[suitKey];
            for (const rank of ranks){
                const card= {
                    suit : suit,
                    rank : rank
                } 
                deck.push(card);
            }
        }
    }
    return deck;
}

const shuffle = (deck) => {
    let currentIndex = deck.length,  randomIndex;
    const deck1 = [...deck]
  // While there remain elements to shuffle.
    while (currentIndex > 0) {

    // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

    // And swap it with the current element.
        [deck1[currentIndex], deck1[randomIndex]] = [deck1[randomIndex], deck1[currentIndex]];
  }

  return deck1;
} //The shuffle algorithm is the Fisher-Yates (aka Knuth) Shuffle. https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array

const draw = (deck, n = 1) => {
    const cards = [];
    const newDeck = [...deck];
    const drawn = [];
    while (n > 0){
        let card = newDeck.pop();
        drawn.push(card);
        n--;
    }
    cards[0] = newDeck;
    cards[1] = drawn;
    return cards;
}

const deal = (cardsArray, numHands = 2, cardsPerHand = 5) => {
    const newArray = [...cardsArray];
    const hands = [];
    const result = {};
    for (let i = 0; i < numHands; i++){//deal t each hands and remove from deck
        const perHand = []
        while (cardsPerHand > 0){
            let lastCard = newArray.pop()
            const card = {};
            card.suit = lastCard.suit;
            card.rank = lastCard.rank;
            perHand.push(card);
            cardsPerHand--;
        }
        cardsPerHand = perHand.length;
        hands.push(perHand);
    }
    result.deck = newArray;
    result.hands = hands;
    return result;//returns an array that consists of 2 elements
}
const handToString = (hand, sep = '  ', numbers = false) => {
    // Check if there is a single card in the hand
    if (hand.length === 1) {
        const card = hand[0];
        return `${numbers ? '1: ' : ''}${card.rank}${card.suit}`;
    }

    const cardStrings = hand.map((card, index) => {
        const cardNumber = numbers ? `${index + 1}: ` : '';
        return `${cardNumber}${card.rank}${card.suit}`;
    });

    // Check if a custom separator is provided
    if (sep !== '  ') {
        return cardStrings.join(sep);
    }
        return cardStrings.join('  ');
};

const matchesAnyProperty = (obj, matchObj) => {
    const arrObj = Object.entries(obj);
    const arrMatchObj = Object.entries(matchObj);
    for (let i = 0; i < arrMatchObj.length; i++) {
        for (let j = 0; j < arrObj.length; j++) {
            if (
                arrMatchObj[i][0] === arrObj[j][0] && arrMatchObj[i][1] === arrObj[j][1]//check the respective elements for a match
            ) {
                return true;
            }
        }
    }
    return false;
};

const drawUntilPlayable = (deck, matchObject) => {
    const newDeck = [...deck];
    const removedCards = [];
    const result = [];
    while (newDeck.length > 0){//until deck is 0
        const cardRemove = newDeck.pop();
        const match = matchesAnyProperty(cardRemove, matchObject);
        removedCards.push(cardRemove);
        if (match || cardRemove.rank === '8'){//either a match or 8 is drawn
            break;
        }
    }
    result[0] = newDeck;
    result[1] = removedCards;
    return result;
}

const gameState = (deck, nextPlay, discardPile, computerHand, playerHand) =>{//function that prints the gameState, takes in 5 array arguments
    console.log("                 CR🤪ZY 8's\n");
    console.log("-----------------------------------------------\n");
    console.log(`Next suit/rank to play: ➡️ ${handToString(nextPlay)} ⬅️\n`)
    console.log("-----------------------------------------------\n");
    console.log(`Top of discard pile: ${handToString(discardPile)}\n`);
    console.log(`Number of cards left in deck: ${deck.length}\n`);
    console.log("-----------------------------------------------\n");
    console.log(`🤖✋ (computer hand): ${handToString(computerHand)}`)
    console.log(`😊✋ (player hand):   ${handToString(playerHand)}`)
    console.log("-----------------------------------------------\n");
}

const playerTurn = (deck, playerHand, nextPlay, discardPile) => {//player turn function
    console.log("😊 Player's turn..\n");
    let option;
    let choice = 0;
    let eChoice = 0;
    for (let i = 0; i < playerHand.length; i++){//checks if there is any matching card
        if (matchesAnyProperty(nextPlay[0], playerHand[i]) || playerHand[i].rank === '8'){
            console.log("Enter the number of the card you would like to play\n");
            console.log(handToString(playerHand, '\n', true));
            option = 1;
            break;
        }
    }
    let removedCard = [];
    if (option === 1){//if there is a matching card, ask for the card to choose
        choice = prompt("");
        let cardLoc = parseInt(choice)-1;
        if (playerHand[cardLoc].rank === '8'){
            pCardEight(suits, removedCard, nextPlay, discardPile, eChoice);//function that is executed when 8 is chosen by player
            const removed = playerHand.splice(cardLoc, 1);
            //eight option
        } else if (matchesAnyProperty(nextPlay[0], playerHand[cardLoc])){
            removedCard = playerHand.splice(cardLoc, 1);
            nextPlay[0] = removedCard;
            discardPile.push(removedCard);
            //remove the card from hand
        } else {
            console.log("Incorrect card!");
        }
    } else {//option for no playable card
        let result = []
        console.log("😔 You have no playable cards\n");
        console.log(`Press ENTER to draw cards until matching: ${nextPlay[0].rank}, ${nextPlay[0].suit}, 8`);
        question();
        result = drawUntilPlayable(deck, nextPlay[0]);
        console.log(`Cards drawn: ${handToString(result[1])}\n`);
        const playedCard = [];
        deck = result[0];
        playedCard[0] = result[1].pop();//the last card in the drawn cards is the chosen card
        console.log(`Card Played: ${handToString(playedCard)}`);
        if (playedCard[0].rank === '8'){
            pCardEight(suits, removedCard, nextPlay, discardPile, eChoice);//if 8 is chosen
        } else {
        let removedCard = [];
        removedCard[0] = playedCard[0];
        nextPlay[0] = removedCard;
        discardPile.push(removedCard);
        playerHand = playerHand.concat(result[1]);//push the drawn cards to the player hand
        }
    }
    const res = [deck, playerHand, nextPlay, discardPile];
    return res;
}

const computerTurn = (deck, computerHand, nextPlay, discardPile) => {//function for computer turn
    console.log("🤖 Computer's turn..\n");
    let option = 0;
    let choice;
    for (let i = 0; i < computerHand.length; i++){
        if (matchesAnyProperty(nextPlay[0], computerHand[i]) || computerHand[i].rank === 8){//search for match
            console.log("Computer's hand:\n");
            console.log(handToString(computerHand, '\n', true));
            choice = i;
            option = 1;
            break;
        }
    }
    let removedCard = [];
    if (option === 1){//if there is a match
        if (computerHand[choice].rank === 8){
            cCardEight(suits, removedCard, nextPlay, discardPile);
            const removed = playerHand.splice(choice, 1);
            //eight option
        } else if (matchesAnyProperty(nextPlay[0], computerHand[choice])){
            removedCard = computerHand.splice(choice, 1);
            nextPlay[0] = removedCard;
            discardPile.push(removedCard);
            //remove the card from hand
        }
    } else {//similar progression with the player turn
        let result = []
        console.log("😔 Computer has no playable cards\n");
        console.log(`Computer draws cards until matching: ${nextPlay[0].rank}, ${nextPlay[0].suit}, 8`);
        result = drawUntilPlayable(deck, nextPlay[0]);
        console.log(`Cards drawn: ${handToString(result[1])}\n`);
        const playedCard = [];
        deck = result[0];
        playedCard[0] = result[1].pop();
        console.log(`Card Played: ${handToString(playedCard)}`);
        if (playedCard[0].rank === '8'){
            cCardEight(suits, removedCard, nextPlay, discardPile);//eight choice for computer
        } else {
        let removedCard = [];
        removedCard[0] = playedCard[0];
        nextPlay[0] = removedCard;
        discardPile.push(removedCard);
        computerHand = computerHand.concat(result[1]);//add the drawn cards to computer hand
        }
    }
    const res = [deck, computerHand, nextPlay, discardPile];
    return res;
}

const cCardEight = (suits ,removedCard, nextPlay, discardPile) => {//function for computer use eight
    console.log("CRAZY EIGHTS! Computer played an 8 - computer chooses a suit\n");
    const suitArr = Object.entries(suits);
    for (let i = 0; i < suitArr.length; i++){
        console.log(`${i+1}: ${suitArr[i][1]}\n`);
    }
    const wild = {suit: suitArr[Math.floor(Math.random() * 4)][1], rank: 8};//sets random suit
    removedCard[0] = wild;
    nextPlay[0] = removedCard;
    discardPile.push(removedCard);
}
//function for player use eight
const pCardEight = (suits ,removedCard, nextPlay, discardPile, eChoice) => {
    console.log("CRAZY EIGHTS! Computer played an 8 - computer chooses a suit\n");
    const suitArr = Object.entries(suits);
    for (let i = 0; i < suitArr.length; i++){
        console.log(`${i+1}: ${suitArr[i][1]}\n`);
    }
    eChoice = prompt("");//asks for input for suit
    eChoice = parseInt(eChoice)-1;
    const wild = {suit: suitArr[eChoice][1], rank: 8};
    removedCard[0] = wild;
    nextPlay[0] = removedCard;
    discardPile.push(removedCard);
}

const gameStart = (deck, nextPlay, discardPile, computerHand, playerHand) => {//initializes and contains the progression of the game
    gameState(deck, nextPlay, discardPile, computerHand, playerHand);
    let pres = playerTurn(deck, playerHand, nextPlay, discardPile);
    deck = pres[0];
    playerHand = pres[1];
    nextPlay = pres[2][0];
    discardPile = pres[3][pres[3].length-1];
    gameState(deck, nextPlay, discardPile, computerHand, playerHand);
    let cres = computerTurn(deck, computerHand, nextPlay, discardPile);
    deck = cres[0];
    computerHand = cres[1];
    nextPlay = cres[2][0];
    discardPile = cres[3][cres[3].length-1];
    gameState(deck, nextPlay, discardPile, computerHand, playerHand);
  }

export {
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
}


// import { Engine, Scene, FreeCamera, Vector3, HemisphericLight, MeshBuilder, StandardMaterial, Color3, Texture, ActionManager, ExecuteCodeAction, Mesh } from "babylonjs";

import { Card, Rank, SuitValue } from "./types";

export const createDeck = (): Card[] =>
{
  const deck: Card[] = [];

  for (let suit = 0; suit < 4; suit++)
  {
    for (let rank = 0; rank < 13; rank++)
    {
      deck.push({ rank, suit });
    }
  }

  return deck;
};

export const shuffleDeck = (deck: Card[]) =>
{
  for (let i = deck.length - 1; i > 0; i--)
  {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
};
//Rank enum, the values start at zero (Two = 0, Three = 1, Four = 2, etc.). So in order to get the actual value of the card, we add 2 to the  value. For the face cards (Jack, Queen, King), we return 10. For the Ace, we return 11 for now later we will impliment 1 value for case.
export const getCardValue = (card: Card): number =>
{
  switch (card.rank)
  {
    case Rank.Two:
    case Rank.Three:
    case Rank.Four:
    case Rank.Five:
    case Rank.Six:
    case Rank.Seven:
    case Rank.Eight:
    case Rank.Nine: //7
      return card.rank + 2;
    case Rank.Ten:
    case Rank.J://9
    case Rank.Q://10
    case Rank.K://11
      return 10;
    case Rank.A://12
      return 11;
    case Rank.B:
      return 200;
  }
};

export const dealCards = (deck: Card[], numCards: number): Card[] =>
{
  const cards: Card[] = [];

  for (let i = 0; i < numCards; i++)
  {

    if (deck.length === 0)
    {
      break; // Stop dealingg cards if the deck is empty
    }

    cards.push(deck.pop()!);
  }

  return cards;
};

export const calculateHandScore = (hand: Card[]): number =>
{
  let score = 0;
  let numAces = 0;

  for (const card of hand)
  {
    const value = getCardValue(card);

    if (card.rank === Rank.A)
    {
      numAces++;
    }

    score += value;
  }

  while (score > 21 && numAces > 0)
  {
    score -= 10;
    numAces--;
  }

  return score;
};


export function getSuitFromValue(value: number): string | undefined
{
  const suit = Object.keys(SuitValue)
    .filter((key) => isNaN(Number(key)))
    .find((key) => SuitValue[key as keyof typeof SuitValue] === value);
  return suit ? suit : undefined;
}


import { GameStore } from '../store/store';


describe('GameStore', () =>
{
  let gameStore: any;

  beforeEach(() =>
  {
    gameStore = new GameStore();
  });

  test('should initialize with null gameState', () =>
  {
    expect(gameStore.gameState).toBeNull();
  });

  test('should update gameState when setGameState is called', () =>
  {
    const gameState = { id: 1, tokens: 10 };
    gameStore.setGameState(gameState);
    expect(gameStore.gameState).toEqual(gameState);
  });

  test('should update tokensChangeOnWinOrLoss when setTokensChangeOnWinOrLoss is called', () =>
  {
    gameStore.setTokensChangeOnWinOrLoss(5);
    expect(gameStore.tokensChangeOnWinOrLoss).toEqual(5);
  });


});
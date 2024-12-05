import { Utilities as U } from "../utilities";
import { WINNING_COMBINATIONS, BOARD_SIZE } from '../../src/app/constants';
import { SquareValue } from '../../src/app/enums';

const GAME_INFO_TEXT = '#game-info';
const SQUARE = 'app-square';
const GAME_RESET_BUTTON = '#reset-game-button';

function squareInitialAssertion(): void {
  cy.get(SQUARE)
    .should('have.length', BOARD_SIZE)
    .should('have.value', '')
    .should('not.be.disabled');
}

function gameEndResetAssert(): void {
  cy.get(SQUARE).should('be.disabled');
  cy.get(GAME_RESET_BUTTON).should('be.visible');
  cy.get(GAME_RESET_BUTTON).click();
  squareInitialAssertion();
  cy.get(SQUARE).should('not.be.disabled');
  cy.get(GAME_INFO_TEXT).contains('turn');
  cy.get(GAME_RESET_BUTTON).should('not.be.visible');
}

describe('App', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Element visibility', () => {
    it('title is visible', () => {
      cy.contains('Tic tac toe')
    });
  
    it('board is visible', () => {
      cy.get('app-board').should('be.visible');
    });
  
    it('reset button is not visible', () => {
      cy.get(GAME_RESET_BUTTON).should('not.be.visible');
    });
  
    it('game info text is empty', () => {
      cy.get(GAME_INFO_TEXT).contains('turn');
    });
  });

  describe('Board element', () => {
    it('has visible 9 clickable squares with empty text', squareInitialAssertion)
  });

  describe('Game logic', () => {
    // Before each variable
    let startTurn: SquareValue;

    beforeEach(() => {
      cy.get(GAME_INFO_TEXT).then($gameInfo => {
        startTurn = $gameInfo.text().includes(SquareValue.X) ? SquareValue.X : SquareValue.O;
      });
    });

    it(`square is filled alternatively with ${SquareValue.X} or ${SquareValue.O} when clicked`, () => {
      // ARRANGE
      let gameInfoTextAfterFirstClick = '';
      let gameInfoTextAfterSecondClick = '';
      let firstSquareValue = '';
      let secondSquareValue = '';
      // ACT
      cy.get(SQUARE).then($squares => {
        const randomIndex = U.randomFromList(U.range($squares.length));
        cy.wrap($squares).eq(randomIndex).click().then($square => {
          cy.get(GAME_INFO_TEXT).then(
            $gameInfo => {gameInfoTextAfterFirstClick = $gameInfo.text();}
          );
          firstSquareValue = $square.text();
        });
        const randomIndexNotPrevious = U.randomFromList(
          U.range($squares.length).filter(i => i !== randomIndex)
        );
        cy.wrap($squares).eq(randomIndexNotPrevious).click().then($secondSquare => {
          secondSquareValue = $secondSquare.text();
        });
        cy.get(GAME_INFO_TEXT).then(
          $gameInfo => {gameInfoTextAfterSecondClick = $gameInfo.text();}
        );
      });
      // ASSERT
      expect(gameInfoTextAfterFirstClick).to.not.contain(startTurn);
      expect(gameInfoTextAfterSecondClick).to.contain(startTurn);
      expect(firstSquareValue).to.not.equal(secondSquareValue);
    });

    describe('Game ends in a win', () => {
      WINNING_COMBINATIONS.forEach(combination => {
        it(`${combination} indices are filled with the starter value`, () => {
          // ACT
          let outsideIndices = U.range(BOARD_SIZE).filter(i => !combination.includes(i));
          cy.get(SQUARE).then($squares => {
            combination.forEach(index => {
              cy.wrap($squares).eq(index).click();
              const randomIndex = U.randomFromList(outsideIndices);
              cy.wrap($squares).eq(randomIndex).click();
              outsideIndices = outsideIndices.filter(i => i !== randomIndex);
            });
          });
          // ASSERT
          cy.get(GAME_INFO_TEXT).contains('won');
          gameEndResetAssert();
        });
      });
    });

    describe('Game ends in a tie', () => {
      it('no winning combinations are matched and all squares are filled', () => {
        // ACT
        cy.get(SQUARE).then($squares => {
          [0, 4, 8, 1, 2, 6, 3, 5, 7].forEach(index => cy.wrap($squares).eq(index).click());
        });
        // ASSERT
        cy.get(GAME_INFO_TEXT).contains('Tie');
        gameEndResetAssert();
      });
    })
  });
});
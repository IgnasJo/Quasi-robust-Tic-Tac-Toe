import { Component, Signal, WritableSignal, computed, signal } from '@angular/core';
import { SquareComponent } from '../square/square.component';
import { Utilities } from '../utilities';
import { GameState, SquareColor, SquareValue } from '../enums';
import { BOARD_SIZE, WINNING_COMBINATIONS } from '../constants';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [SquareComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {
  squareValues!: WritableSignal<SquareValue>[];
  squareColors!: WritableSignal<SquareColor>[];
  squareCombinedData!: {
    value: WritableSignal<SquareValue>,
    color: WritableSignal<SquareColor>
  }[];
  currentPlayerValue!: WritableSignal<SquareValue>;
  gameInfoText!: Signal<string>;
  gameState!: WritableSignal<GameState>;
  isGameOver!: Signal<boolean>;

  onSquareClick(squareValue: WritableSignal<SquareValue>): void {
    squareValue.set(this.currentPlayerValue());
    const currentGameState: GameState = this.evaluateGameState();
    this.gameState.set(currentGameState);
    if (currentGameState === GameState.IN_PROGRESS) {
      this.currentPlayerValue.set(this.getNextPlayerTurn());
    }
  }

  evaluateGameState(): GameState {
    for (const combination of WINNING_COMBINATIONS) {
      const [a, b, c] = combination;
      if (
        this.squareValues[a]() !== '' &&
        this.squareValues[a]() === this.squareValues[b]() &&
        this.squareValues[a]() === this.squareValues[c]()
      ) {
        combination.forEach(i => this.squareColors[i].set(SquareColor.GREEN));
        return GameState.WON;
      }
    }
    if (this.squareValues.every(state => state() !== '')) {
      return GameState.TIE;
    }
    return GameState.IN_PROGRESS;
  }

  constructor() {
    this.initState();
  }

  resetGame(): void {
    this.initState();
  }

  getInfoTextFromGameState(): string {
    switch (this.gameState()) {
      case GameState.IN_PROGRESS:
        return `Player ${this.currentPlayerValue()}'s turn`;
      case GameState.TIE:
        return 'Tie!';
      case GameState.WON:
        return `Player ${this.currentPlayerValue()} won!`;
    }
  }

  initState() {
    this.gameState = signal(GameState.IN_PROGRESS);
    this.gameInfoText = computed(() => this.getInfoTextFromGameState());
    this.isGameOver = computed(() => this.gameState() !== GameState.IN_PROGRESS);
    this.currentPlayerValue = signal(this.getRandomPlayerTurn());
    this.squareValues = this.generateSquareDataStates();
    this.squareColors = this.generateSquareColors();
    this.squareCombinedData = this.squareValues.map((value, index) => ({
      value: value,
      color: this.squareColors[index]
    }));
  }

  generateSquareDataStates(): WritableSignal<SquareValue>[] {
    return Utilities.expressList(BOARD_SIZE, () => signal<SquareValue>(SquareValue.EMPTY));
  }

  generateSquareColors(): WritableSignal<SquareColor>[] {
    return Utilities.expressList(BOARD_SIZE, () => signal<SquareColor>(SquareColor.WHITE));
  }

  getRandomPlayerTurn(): SquareValue {
    return Math.random() < 0.5 ? SquareValue.X : SquareValue.O;
  }

  getNextPlayerTurn(): SquareValue {
    return this.currentPlayerValue() === SquareValue.X ? SquareValue.O : SquareValue.X;
  }

}
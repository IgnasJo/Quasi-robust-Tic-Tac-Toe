import { Component, EventEmitter, Input, Output, Signal, WritableSignal } from '@angular/core';
import { SquareColor, SquareValue } from '../enums';


@Component({
  selector: 'app-square',
  standalone: true,
  imports: [],
  templateUrl: './square.component.html',
  styleUrl: './square.component.scss'
})
export class SquareComponent {
  @Input() value!: WritableSignal<SquareValue>;
  @Input() color!: WritableSignal<SquareColor>;
  @Input() isDisabled!: Signal<boolean>;
  @Output() squareClicked = new EventEmitter<WritableSignal<SquareValue>>();

  onClick(): void {
    if (this.value() === SquareValue.EMPTY) {
      this.squareClicked.emit(this.value);
    }
  }
}

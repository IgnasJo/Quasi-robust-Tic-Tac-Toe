import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SquareComponent } from './square.component';
import { signal } from '@angular/core';
import { SquareColor, SquareValue } from '../enums';

describe('SquareComponent', () => {
  let component: SquareComponent;
  let fixture: ComponentFixture<SquareComponent>;

  function dispatchClickEvent() {
    const nativeElement = fixture.nativeElement;
    const button = nativeElement.querySelector('button');
    button.dispatchEvent(new Event('click'));
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SquareComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SquareComponent);
    component = fixture.componentInstance;
    // Must initialize because it doesn't utilize the constructor
    component.color = signal(SquareColor.WHITE);
    component.value = signal(SquareValue.EMPTY);
    component.isDisabled = signal(false);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Square value is EMPTY', () => {
    it('onClick should be called when empty square is clicked', () => {
      const spyClicked = spyOn(component, 'onClick');
      dispatchClickEvent();
      expect(spyClicked).toHaveBeenCalled();
    });
    
    it('squareClicked should be emitted when empty square is clicked', () => {
      const spyEmitted = spyOn(component.squareClicked, 'emit');
      dispatchClickEvent();
      expect(spyEmitted).toHaveBeenCalled();
    });
  });

  describe(`Square value is either: "${SquareValue.X}", "${SquareValue.O}"`, () => {
    [SquareValue.X, SquareValue.O].forEach((squareValue) => {
      it(`squareClicked should NOT be emitted when square with ${squareValue} is clicked`, () => {
        component.value = signal(squareValue);
        const spyEmitted = spyOn(component.squareClicked, 'emit');
        dispatchClickEvent();
        expect(spyEmitted).not.toHaveBeenCalled();
      });
    });
  });

  describe(`Square color is either: "${SquareColor.GREEN}", "${SquareColor.WHITE}"`, () => {
    [SquareColor.GREEN, SquareColor.WHITE].forEach((squareColor) => {
      it(`component renders ${squareColor} color`, () => {
        component.color = signal(squareColor);
        fixture.detectChanges();
        const button = fixture.nativeElement.querySelector('button');
        expect(button.style.backgroundColor).toEqual(squareColor);
      });
    });
  });

  describe('Square is disabled with property isDisabled', () => {
    [true, false].forEach((isDisabled) => {
      it(`component is disabled: ${isDisabled}`, () => {
        component.isDisabled = signal(isDisabled);
        fixture.detectChanges();
        const nativeElement = fixture.nativeElement;
        const button = nativeElement.querySelector('button');
        expect(button.disabled).toEqual(isDisabled);
      });
    });
  });
});

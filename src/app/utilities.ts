export class Utilities {
  static range(to: number, from = 0): number[] {
    return Array.from({ length: to }, (_, i) => from + i);
  }

  static expressList<T>(length: number, initializer: (index: number) => T): T[] {
    return this.range(length).map(initializer);
  }
}

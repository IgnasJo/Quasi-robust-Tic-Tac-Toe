export class Utilities {
  static randomFromList<T>(list: T[]): T {
    return list[Math.floor(Math.random() * list.length)];
  }
  static range(to: number, from = 0): number[] {
    return Array.from({ length: to }, (_, i) => from + i);
  }
}
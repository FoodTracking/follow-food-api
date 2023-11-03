export class EnumX {
  static of<T extends object>(e: T) {
    const values = Object.values(e);
    const map = new Map(values.map((k, i) => [k, values[i + 1]]));
    return {
      next: <K extends keyof T>(v: T[K]) => map.get(v),
    };
  }
}

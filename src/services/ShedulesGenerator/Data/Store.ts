import Base, { DataAttributes } from './DataBase';
import Shift from './Shift';

interface DataStoreInterface {
  addShift(...args: [string, string][]): void;
  reset(): void;
  shift(index: number): Shift | null;
}

export default class Store extends Base implements DataStoreInterface {
  protected shifts: Shift[] = [];

  constructor(attributes: DataAttributes) {
    super(attributes);
  }

  public shift(index: number): Shift | null {
    return this.shifts[index] || null;
  }

  public addShift(...args: [string, string][]): void {
    for (let i = 0, length = args.length; i < length; i++) {
      const shift: Shift = new Shift(args[i][0], args[i][1]);
      this.shifts.push(shift);
    }
  }

  public reset(): void {
    this.shifts = [];
  }
}

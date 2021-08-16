import Base from './DataBase';
import Shift from './Shift';

interface DataStoreInterface {
  addShift(...args: [string, string][]): void;
  reset(): void;
  shift(index: number): Shift | null;
  allShifts(): Shift[];
}

export default class Store extends Base implements DataStoreInterface {
  protected shifts: Shift[] = [];

  public shift(index: number): Shift | null {
    return this.shifts[index] || null;
  }

  public addShift(...args: [string, string][]): void {
    for (let i = 0, { length } = args; i < length; i++) {
      const shift: Shift = new Shift(args[i][0], args[i][1]);
      this.shifts.push(shift);
    }
  }

  public allShifts(): Shift[] {
    return [...this.shifts];
  }

  public reset(): void {
    this.shifts = [];
  }
}

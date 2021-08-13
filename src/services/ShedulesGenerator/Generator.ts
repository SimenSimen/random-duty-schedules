import Log from './Log';
import Structure from './DataStructure';
import Collection from './Collection';

export interface SchedulesGeneratorInterface {
  run(): void;
  clear(): void;
  traversalLogs(): Log[] | null;
  schedules(): Collection | null;
  isValid(): boolean;
  setDays(): void;
  setEmployees(): void;
  setStores(): void;
}

export default class SchedulesGenerator implements SchedulesGeneratorInterface {
  protected logs: Log[] | null = null;

  protected result: Collection | null = null;

  protected structure: Structure;

  constructor() {
    this.structure = new Structure();
  }

  run() {
    this.logs = [];
  }

  clear() {
    this.logs = null;
  }

  traversalLogs() {
    return this.logs;
  }

  schedules(): Collection | null {
    return this.result;
  }

  isValid() {
    return this._checkTreeState();
  }

  setDays() {}

  setEmployees() {}

  setStores() {}

  private _checkTreeState(): boolean {
    return false;
  }
}

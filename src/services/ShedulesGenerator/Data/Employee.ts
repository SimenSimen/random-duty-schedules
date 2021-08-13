import moment, { Moment } from 'moment';
import Base from './DataBase';

interface DataEmployeeInterface {
  assignHolidays(...args: any[]): void;
  getWannaHolidays(): Moment[];
  assignWorkingDays(...args: any[]): void;
  getWorkDays(): void;
  clearHolidays(): void;
  clearWorkDays(): void;
  setWorkDaysLimit(limit: number): void;
  getWorkDaysLimit(): number;
  getActualWorkingDays(): number;
}

export default class Employee extends Base implements DataEmployeeInterface {
  protected holidaysExpected: Moment[] = [];

  protected workDays: Moment[] = [];

  protected workDaysLimit: number = 0;

  public assignHolidays(...args: any[]): void {
    for (let i = 0, { length } = args; i < length; i++) {
      const date = this._standardTime(args[i]);
      this._checkDuplicatedDate(this.holidaysExpected, date);
      this.holidaysExpected.push(date);
    }
  }

  public getWannaHolidays(): Moment[] {
    return this.holidaysExpected;
  }

  public assignWorkingDays(...args: any[]): void {
    for (let i = 0, { length } = args; i < length; i++) {
      const date = this._standardTime(args[i]);
      this._checkDuplicatedDate(this.workDays, date);

      if (this.getActualWorkingDays() >= this.workDaysLimit) {
        throw 'WORKING_DAYS_LIMITAION_EXCEED';
      }

      this.workDays.push(date);
    }
  }

  public getWorkDays(): Moment[] {
    return this.workDays;
  }

  public clearHolidays(): void {
    this.holidaysExpected = [];
  }

  public clearWorkDays(): void {
    this.workDays = [];
  }

  public getActualWorkingDays(): number {
    return this.workDays.length;
  }

  public setWorkDaysLimit(limit: number) {
    this.workDaysLimit = limit;
  }

  public getWorkDaysLimit(): number {
    return this.workDaysLimit;
  }

  private _checkDuplicatedDate(resource: Moment[], date: Moment): void {
    const result = resource.some((resourceDate) => resourceDate.format('YYYY-MM-DD') === date.format('YYYY-MM-DD'));

    if (result) {
      throw Error('DATE_DUPLICATED');
    }
  }

  private _standardTime(time: any): Moment {
    const date = moment(time);

    if (!date.isValid()) {
      throw Error('INVALID_TIME_FORMAT');
    }

    return date;
  }
}

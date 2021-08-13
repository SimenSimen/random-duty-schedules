import moment, { Moment } from 'moment';

interface ShiftInterface {
  getStartTime(): string;
  getEndTime(): string;
  setLabourLimit(limit: number): void;
  getLabourLimit(): number;
  setStartTime(time: string): void;
  setEndTime(time: string): void;

  /**
   * Get diff from end and start time in sencond units
   */
  getDiff(): number;
}

export default class Shift implements ShiftInterface {
  protected startTime: Moment;

  protected endTime: Moment;

  protected labourLimit: number = 0;

  private _format: string = 'HH:mm';

  /**
   * Time format is HH:mm
   *
   * @param startTime
   * @param endTime
   */
  constructor(startTime: string, endTime: string) {
    this.startTime = this.standardTime(startTime);
    this.endTime = this.standardTime(endTime);

    if (this.endTime.unix() < this.startTime.unix()) {
      this.endTime.add(1, 'days');
    }
  }

  public getStartTime(): string {
    return this.startTime.format(this._format);
  }

  public getEndTime(): string {
    return this.endTime.format(this._format);
  }

  public setLabourLimit(limit: number): void {
    this.labourLimit = limit;
  }

  public getLabourLimit(): number {
    return this.labourLimit;
  }

  public setStartTime(time: string) {
    this.startTime = this.standardTime(time);
  }

  public setEndTime(time: string) {
    this.endTime = this.standardTime(time);
  }

  public getDiff(): number {
    const start: number = this.startTime.unix();
    const end: number = this.endTime.unix();

    return end - start;
  }

  private standardTime(time: string): Moment {
    const date = moment(time, 'HH:mm');

    if (!date.isValid()) {
      throw Error('INVALID_TIME_FORMAT');
    }

    return date;
  }
}

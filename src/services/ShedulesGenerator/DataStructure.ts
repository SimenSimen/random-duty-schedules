import moment, { Moment } from 'moment';
import Employee from './Data/Employee';
import Store from './Data/Store';
import Shift from './Data/Shift';

interface DataStructureInterface {
  put(...args: Array<Employee | Store>): void;
  random(): void;
  setStartDate(date: Date): void;
  setEndDate(date: Date): void;
  clearEmployees(): void;
  clearStores(): void;
  isValid(): boolean;
}

type TreeElement = Moment | Store | Employee | Shift;

/**
 * [x, y]
 */
type CoordinateNode = [number, number];

interface ScheduleNode {
  store: Store;
  shift: Shift;
}

type ScheduleXAxis = (ScheduleNode | null | false)[];
type ScheduleMap = ScheduleXAxis[];

interface TreeNode {
  element: TreeElement;
  children: TreeNode[];
  weight: number;
}

export default class DataStructure implements DataStructureInterface {
  protected start;

  protected end;

  protected valid: boolean = false;

  protected employees: Employee[] = [];

  protected stores: Store[] = [];

  protected map: ScheduleMap = [];
  protected tracking: CoordinateNode[] = [];

  constructor(
    start: Date,
    end: Date,
    employees: Employee[] = [],
    stores: Store[] = []
  ) {
    if (start.getTime() > end.getTime()) {
      throw 'INVALID_TIME_RANGE';
    }

    this.start = moment(start);
    this.end = moment(end);
    this.employees = employees;
    this.stores = stores;
  }

  public setStartDate(date: Date): void {
    this.start = moment(date);
  }

  public setEndDate(date: Date): void {
    this.end = moment(date);
  }

  public clearEmployees(): void {
    this.employees = [];
  }

  public clearStores(): void {
    this.stores = [];
  }

  public put(...args: Array<Employee | Store>): void {
    for (let i = 0, { length } = args; i < length; i++) {
      const element = args[i];
      if (this._checkDuplicate(element)) {
        throw 'ELEMENT_DUPLICATED';
      }

      if (element instanceof Employee) {
        this.employees.push(element);
      } else if (element instanceof Store) {
        this.stores.push(element);
      }
    }
  }

  public isValid(): boolean {
    return this.valid;
  }

  public checkRequiredData(): void {
    switch (true) {
      case this.stores.length === 0:
      case this.employees.length === 0:
        break;

      default:
        this.valid = true;
        break;
    }
  }

  /**
   * Employees data as y axis
   * Days data as x axis
   */
  public random(): void {
    const daysLength: number = this.end.diff(this.start, 'days') + 1;
    const employees = [...this.employees];
    const employeeLength: number = employees.length;
    const days: Moment[] = [];
    const shiftsNodes: ScheduleNode[] = [];

    this._initMap(daysLength, employeeLength);

    for (let i = 0; i < daysLength; i++) {
      const date = this.start.toDate();
      date.setDate(date.getDate() + i);
      days.push(moment(date));
    }

    for (let i = 0, length = this.stores.length; i < length; i++) {
      const store = this.stores[i];
      const shifts = store.allShifts();

      for (let j = 0, lengthJ = shifts.length; j < lengthJ; j++) {
        shiftsNodes.push({ store, shift: shifts[j] });
      }
    }

    let scanning = true;
    let setNodeCount = 0;

    const currentPoint: CoordinateNode = [
      this._randomLength(daysLength),
      this._randomLength(employeeLength),
    ];

    const mapSize = daysLength * employeeLength;

    while (scanning) {
      const isAnyTargetUnavailable: boolean =
        shiftsNodes.length === 0 ||
        employees.length === 0 ||
        setNodeCount >= mapSize;

      if (isAnyTargetUnavailable) {
        scanning = false;
      } else {
        /** node traversing */
        const [x, y] = currentPoint;

        const day = days[x];
        const employee = this.employees[y];

        const isWannaDay: boolean = employee
          .getWannaHolidays()
          .some((holiday) => {
            return holiday.format('YYYYMMDD') === day.format('YYYYMMDD');
          });

        const empolyeeCanWork: boolean =
          this._getEmployeeWorkDaysOnMap(y) < employee.getWorkDaysLimit();

        if (!empolyeeCanWork) {
          const localEmployeeIndex: number = employees.findIndex(
            (_employee) => {
              return _employee.getId() === employee.getId();
            }
          );

          localEmployeeIndex > 0 && employees.splice(localEmployeeIndex, 1);
        }

        if (!isWannaDay && empolyeeCanWork) {
          /** Should go work */
          const duty = this._employeeWorkRankThisDay(x, y, shiftsNodes);
          duty && this._setWorkDayOnMap(x, y, duty) && setNodeCount++;
        } else {
          /** Should be on holiday */
          this._setHolidayOnMap(x, y);
        }

        setNodeCount++;
        this.tracking.push([x, y]);
        setNodeCount < mapSize && this._goNextNode(currentPoint);
      }
    }

    console.log(this.map);
  }

  private _goNextNode(currentPoint: CoordinateNode) {
    const flatternSetNode: CoordinateNode[] = [];

    for (let y = 0, length = this.map; y < length.length; y++) {
      const avaliablePosistion = this.map[y]
        .map((node, x: number) =>
          node === null ? ([x, y] as CoordinateNode) : null
        )
        .filter(
          (position: CoordinateNode | null) => position !== null
        ) as CoordinateNode[];

      flatternSetNode.concat(avaliablePosistion);
    }

    const nodeLength: number = flatternSetNode.length;

    if (nodeLength) {
      const [newX, newY] = flatternSetNode[this._randomLength(nodeLength)];

      currentPoint[0] = newX;
      currentPoint[1] = newY;
    }
  }

  private _employeeWorkRankThisDay(
    x: number,
    y: number,
    scheduleNode: ScheduleNode[]
  ): ScheduleNode | null {
    const index = 1;
    const duty = scheduleNode.splice(index, 1)[0];

    /** @todo */
    return duty;
  }

  private _getEmployeeWorkDaysOnMap(index: number): number {
    return this.map[index]
      .map((node) => {
        const result: number = !node ? 0 : 1;
        return result;
      })
      .reduce((a, b) => a + b);
  }

  private _setHolidayOnMap(x: number, y: number): void {
    this.map[x][y] = false;
  }

  private _setWorkDayOnMap(x: number, y: number, node: ScheduleNode) {
    this.map[x][y] = node;
  }

  private _initMap(x: number, y: number): void {
    this.tracking = [];
    this.map = Array(x)
      .fill(0)
      .map(() => Array(y).fill(null));
  }

  private _randomLength(max: number): number {
    return Math.floor(Math.random() * max);
  }

  private _checkDuplicate(element: Store | Employee) {
    let target: 'employees' | 'stores' | '' = '';
    element instanceof Employee && (target = 'employees');
    element instanceof Store && (target = 'stores');

    return target
      ? this[target].some((source) => source.getId() === element.getId())
      : false;
  }
}

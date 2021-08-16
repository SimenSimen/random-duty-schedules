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
  protected tree: TreeNode[] = [];

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
    for (let i = 0, length = args.length; i < length; i++) {
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
      case this._checkStoreShiftInvalid():
        break;

      default:
        this.valid = true;
        break;
    }
  }
  public random(): void {
    this._initTree();
  }

  private _initTree() {
    const diffDays: number = this.end.diff(this.start, 'days');
    for (let i = 0; i <= diffDays; i++) {
      const startDate = this.start.toDate();
      startDate.setDate(startDate.getDate() + i);

      const dateTreeNode = this._createTreeNode(moment(startDate));

      dateTreeNode.children = this.stores.map((store) => {
        const storeTreeNode = this._createTreeNode(store);
        storeTreeNode.children = store
          .allShifts()
          .map((shift) => this._createTreeNode(shift));
        return storeTreeNode;
      });

      this.tree.push(dateTreeNode);
    }
  }
  /**
   * @todo check the shift is valid with employee data
   */
  private _checkStoreShiftInvalid(): boolean {
    return this.stores.some((store: Store) => {
      let result = false;
      const shifts = store.allShifts();
      if (shifts.length !== 0) {
        shifts.forEach(() => {});
      } else {
        result = true;
      }
      return result;
    });
  }
  private _checkDuplicate(element: Store | Employee) {
    let target: 'employees' | 'stores' | '' = '';
    element instanceof Employee && (target = 'employees');
    element instanceof Store && (target = 'stores');

    return target
      ? this[target].some((source) => {
          return source.getId() === element.getId();
        })
      : false;
  }
  private _createTreeNode(element: TreeElement, weight: number = 1): TreeNode {
    return {
      element,
      weight,
      children: [],
    };
  }
}

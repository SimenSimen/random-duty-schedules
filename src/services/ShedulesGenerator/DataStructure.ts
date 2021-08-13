import Employee from './Data/Employee';
import Store from './Data/Store';

interface DataStructureInterface {
  put(data: Employee | Store): void;
  random(): void;
}

export default class DataStructure implements DataStructureInterface {}

import { v4 as uuidv4 } from 'uuid';

export type DataAttributes = {
  [key: string]: any;
};

export interface DataBaseInterface {
  getAttributes(): DataAttributes;
}

export default class DataBase implements DataBaseInterface {
  protected uuid: string = '';

  protected attributes: DataAttributes = {};

  constructor(attributes: DataAttributes) {
    this.genUUIDv4();
    this.setAttributes(attributes);
  }

  public getId(): string {
    return this.uuid;
  }

  public getAttributes(): DataAttributes {
    return { ...this.attributes };
  }

  protected genUUIDv4(): void {
    this.uuid = uuidv4();
  }

  protected setAttributes(attributes: DataAttributes): void {
    this.attributes = { ...attributes };
  }
}

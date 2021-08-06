interface LogInterface {
  getAction(): string;
}
export default class Log implements LogInterface {
  getAction(): string {
    return '';
  }
}

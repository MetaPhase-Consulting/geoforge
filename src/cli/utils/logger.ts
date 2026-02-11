export type LogLevel = 'silent' | 'info' | 'debug';

export class Logger {
  private level: LogLevel;

  constructor(verbose: boolean) {
    this.level = verbose ? 'debug' : 'info';
  }

  info(message: string): void {
    if (this.level === 'silent') return;
    console.log(message);
  }

  debug(message: string): void {
    if (this.level !== 'debug') return;
    console.log(message);
  }

  error(message: string): void {
    console.error(message);
  }
}

export type LogLevel = 'silent' | 'info' | 'debug';

export class Logger {
  private level: LogLevel;
  private useStderr: boolean;

  constructor(verbose: boolean, useStderr = false) {
    this.level = verbose ? 'debug' : 'info';
    this.useStderr = useStderr;
  }

  info(message: string): void {
    if (this.level === 'silent') return;
    if (this.useStderr) {
      console.error(message);
    } else {
      console.log(message);
    }
  }

  debug(message: string): void {
    if (this.level !== 'debug') return;
    if (this.useStderr) {
      console.error(message);
    } else {
      console.log(message);
    }
  }

  error(message: string): void {
    console.error(message);
  }
}

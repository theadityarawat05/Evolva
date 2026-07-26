export enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
}

class Logger {

  private enabled = true;

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  private print(
    level: LogLevel,
    message: string,
    data?: unknown,
  ) {
    if (!this.enabled) return;

    const time = new Date().toISOString();

    if (data !== undefined) {
      console.log(
        `[${time}] [${level}] ${message}`,
        data,
      );
      return;
    }

    console.log(
      `[${time}] [${level}] ${message}`,
    );
  }

  debug(
    message: string,
    data?: unknown,
  ) {
    this.print(
      LogLevel.DEBUG,
      message,
      data,
    );
  }

  info(
    message: string,
    data?: unknown,
  ) {
    this.print(
      LogLevel.INFO,
      message,
      data,
    );
  }

  warn(
    message: string,
    data?: unknown,
  ) {
    this.print(
      LogLevel.WARN,
      message,
      data,
    );
  }

  error(
    message: string,
    data?: unknown,
  ) {
    this.print(
      LogLevel.ERROR,
      message,
      data,
    );
  }
}

export default new Logger();


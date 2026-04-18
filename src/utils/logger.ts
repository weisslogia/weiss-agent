import chalk from "chalk";
import cliMd from "cli-markdown";

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

class Logger {
  private level: LogLevel = LogLevel.INFO;
  private prefix = "[WEISS]";

  public setLevel(level: LogLevel): void {
    this.level = level;
  }

  public debug(message: string | Array<unknown>, ...args: unknown[]): void {
    if (this.level <= LogLevel.DEBUG) {
      if (Array.isArray(message)) {
        console.log(
          `${chalk.cyan(this.prefix)} ${chalk.dim("DEBUG: ")}`,
          ...args,
        );
        console.table(message);
      } else {
        console.log(
          `${chalk.cyan(this.prefix)} ${chalk.dim(`DEBUG: ${message}`)}`,
          ...args,
        );
      }
    }
  }

  public info(message: string | Array<unknown>, ...args: unknown[]): void {
    if (this.level <= LogLevel.INFO) {
      if (Array.isArray(message)) {
        console.log(
          `${chalk.blue(this.prefix)} ${chalk.dim("INFO: ")}`,
          ...args,
        );
        console.table(message);
      } else {
        console.log(
          `${chalk.blue(this.prefix)} ${chalk.dim(`INFO: ${cliMd(message)}`)}`,
          ...args,
        );
      }
    }
  }

  public warn(message: string | Array<unknown>, ...args: unknown[]): void {
    if (this.level <= LogLevel.WARN) {
      if (Array.isArray(message)) {
        console.warn(
          `${chalk.yellow(this.prefix)} ${chalk.dim("WARN: ")}`,
          ...args,
        );
        console.warn(message);
      } else {
        console.warn(
          `${chalk.yellow(this.prefix)} ${chalk.dim(`WARN: ${message}`)}`,
          ...args,
        );
      }
    }
  }

  public error(message: string | Array<unknown>, ...args: unknown[]): void {
    if (this.level <= LogLevel.ERROR) {
      if (Array.isArray(message)) {
        console.error(
          `${chalk.red(this.prefix)} ${chalk.dim("ERROR: ")}`,
          ...args,
        );
        console.error(message);
      } else {
        console.error(
          `${chalk.red(this.prefix)} ${chalk.dim(`ERROR: ${message}`)}`,
          ...args,
        );
      }
    }
  }
}

export const logger = new Logger();

export function initLogger(): void {
  const debugMode = process.env.DEBUG === "true";
  if (debugMode) {
    logger.setLevel(LogLevel.DEBUG);
  }
}

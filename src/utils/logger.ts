import chalk from "chalk";
import cliMd from "cli-markdown";

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export class Logger {
  private level: LogLevel = LogLevel.INFO;
  private prefix = "[WEISS]";

  public setLevel(level: LogLevel): void {
    this.level = level;
  }

  public debug(message: string, ...args: unknown[]): void {
    if (this.level <= LogLevel.DEBUG) {
      console.log(
        `${chalk.cyan(this.prefix)} ${chalk.dim(`DEBUG: ${message}`)}`,
        ...args,
      );
    }
  }

  public info(message: string, ...args: unknown[]): void {
    if (this.level <= LogLevel.INFO) {
      console.log(
        `${chalk.blue(this.prefix)} ${chalk.dim(`INFO: ${message}`)}`,
        ...args,
      );
    }
  }

  public warn(message: string, ...args: unknown[]): void {
    if (this.level <= LogLevel.WARN) {
      console.warn(
        `${chalk.yellow(this.prefix)} ${chalk.dim(`WARN: ${message}`)}`,
        ...args,
      );
    }
  }

  public error(message: string, ...args: unknown[]): void {
    if (this.level <= LogLevel.ERROR) {
      console.error(
        `${chalk.red(this.prefix)} ${chalk.dim(`ERROR: ${message}`)}`,
        ...args,
      );
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

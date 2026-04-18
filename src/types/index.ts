export interface CLIOptions {
  debug: boolean;
  verbose: boolean;
  config?: string;
}

export interface CommandResult {
  success: boolean;
  message?: string;
  data?: unknown;
}

export type ExitCode = 0 | 1;

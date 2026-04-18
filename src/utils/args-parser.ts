export interface ParsedArgs {
  name?: string;
  verbose?: boolean;
  _?: string[];
  [key: string]: string | boolean | string[] | undefined;
}

export function parseArgs(args: string[]): ParsedArgs {
  const result: ParsedArgs = {};
  const positional: string[] = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const nextArg = args[i + 1];

      if (nextArg && !nextArg.startsWith('-')) {
        result[key] = nextArg;
        i++;
      } else {
        result[key] = true;
      }
    } else if (arg.startsWith('-')) {
      const key = arg.slice(1);
      const nextArg = args[i + 1];

      if (nextArg && !nextArg.startsWith('-')) {
        result[key] = nextArg;
        i++;
      } else {
        result[key] = true;
      }
    } else {
      positional.push(arg);
    }
  }

  if (positional.length > 0) {
    result._ = positional;
  }

  return result;
}

import * as chalk from "chalk";
import * as util from "util";

export enum LogLevel {
    Debug,
    Verbose,
    Info,
    Warning,
    Error,
    Fatal
}

export default class Log {

    public static logLevel: LogLevel =
        process.env.NODE_ENV === "production" ? LogLevel.Info : LogLevel.Verbose;

    static log(level: LogLevel, message: any) {
        if (level < this.logLevel) return;

        let out = "";
        if (level <= LogLevel.Debug)
            out += chalk.gray(`[${new Date().toISOString()}] `);
        switch (level) {
            case LogLevel.Debug:
                out += chalk.magenta("[ DEBUG ]")
                break;
            case LogLevel.Verbose:
                out += chalk.magentaBright("[ VERBOSE ]")
                break;
            case LogLevel.Info:
                out += chalk.green("[ INFO ]")
                break;
            case LogLevel.Warning:
                out += chalk.yellow("[ WARN ]")
                break;
            case LogLevel.Error:
                out += chalk.redBright("[ ERROR ]")
                break;
            case LogLevel.Fatal:
                out += chalk.red("[ FATAL ]")
                break;
        }
        out += " ";
        if (typeof message !== "function" && typeof message !== "object") {
            switch (typeof message) {
                case "undefined":
                    out += chalk.gray(message);
                    break;
                case "boolean":
                    out += chalk.magentaBright(message);
                    break;
                case "number":
                    out += chalk.yellow(message);
                    break;
                case "string":
                    out += chalk.white(message);
                    break;
                case "symbol":
                    out += chalk.magenta(message);
                    break;
                case "bigint":
                    out += chalk.yellowBright(message);
                    break;
            }
        } else if (message instanceof Error) {
            out += chalk.red(message.stack);
        } else if (typeof message.toString === "function") {
            out += chalk.white(message.toString());
        } else {
            out += util.inspect(message, true, 3, true);
        }
        console.log(out);
    }

    static debug(message : any) {
        this.log(LogLevel.Debug, message);
    }

    static verbose(message : any) {
        this.log(LogLevel.Verbose, message);
    }

    static info(message : any) {
        this.log(LogLevel.Info, message);
    }

    static warn(message : any) {
        this.log(LogLevel.Warning, message);
    }

    static error(message : any) {
        this.log(LogLevel.Error, message);
    }

    static fatal(message : any) {
        this.log(LogLevel.Fatal, message);
    }
}

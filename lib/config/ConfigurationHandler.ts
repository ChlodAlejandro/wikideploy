import * as fs from "fs/promises";
import * as path from "path";
import {Configuration} from "./Configuration";
import {isConfiguration} from "./ConfigurationGuard";
import Log from "../util/Log";

export default class ConfigurationHandler {

    static readonly i = new ConfigurationHandler();
    configuration : Configuration;

    /** The current working directory. */
    cwd : string;

    private constructor() {
        this.cwd = process.cwd();
    }

    /**
     * Reads a file with a given filename.
     * @param filename The filename to look for.
     */
    async readFile(filename : string) : Promise<string> {
        return fs.access(path.resolve(this.cwd, filename)).then(
            _ => fs.readFile(path.resolve(this.cwd, filename)).then(t => t.toString())
        );
    }

    async readEnvFile(configuration: Record<string, any>, file?: string) : Promise<void> {
        const envFile = await this.readFile(file ?? ".env");
        if (envFile == null) return;

        const env : Record<string, any> = {};
        for (const line of envFile.split("\n")) {
            const eqIndex = line.indexOf("=");
            if (eqIndex !== -1) {
                const key = line.substr(0, eqIndex);
                env[key] = line.substr(eqIndex + 1);
            }
        }

        configuration.method =
            env["WIKI_DEPLOY_METHOD"] ?? configuration.method;

        if (configuration.method === "oauth1" || configuration.method === "oauth2") {
            configuration.credentials.applicationToken =
                env["WIKI_APPLICATION_TOKEN"] ?? configuration.credentials.applicationToken;
            configuration.credentials.applicationSecret =
                env["WIKI_APPLICATION_SECRET"] ?? configuration.credentials.applicationSecret;
            configuration.credentials.accessToken =
                env["WIKI_ACCESS_TOKEN"] ?? configuration.credentials.accessToken;
            if (configuration.method === "oauth2")
                configuration.credentials.accessSecret =
                    env["WIKI_ACCESS_SECRET"] ?? configuration.credentials.accessSecret;
        } else if (configuration.method === "bot") {
            configuration.credentials.username =
                env["WIKI_BOT_USERNAME"] ?? configuration.credentials.username;
            configuration.credentials.password =
                env["WIKI_BOT_PASSWORD"] ?? configuration.credentials.password;
        }
    }

    /**
     * Reads the configuration file.
     *
     * The tokens to be used are based on their priority:
     *
     * <ol>
     * <li>Environment variables (<code>WIKI_APPLICATION_TOKEN</code>, etc.)</li>
     * <li><code>.wikideploy</code> file (treated just like an <code>.env</code> file)</li>
     * <li><code>.env</code> file</li>
     * <li><code>wikideploy.json</code> (<code>credentials</code> object)</li>
     * </ol>
     *
     * **WARNING:** Storing credentials in `wikideploy.json` is dangerous if the file is being
     * tracked by your version control system (i.e. Git)! Make sure to use an alternative instead.
     */
    async readConfigurationFile() : Promise<Configuration> {
        try {
            let configuration = JSON.parse(await this.readFile("wikideploy.json"));
            if (configuration.credentials == null)
                configuration.credentials = {};
            await this.readEnvFile(configuration).catch(() => {});
            await this.readEnvFile(configuration, ".wikideploy").catch(() => {});

            const method =
                process.env.WIKI_DEPLOY_METHOD ?? configuration.method;
            if (method !== "bot" && method !== "oauth1" && method !== "oauth2")
                // noinspection ExceptionCaughtLocallyJS
                throw "Authorization type must be either 'bot', 'oauth1', or 'oauth2'.";
            configuration.method = method;

            if (configuration.method === "oauth1" || configuration.method === "oauth2") {
                configuration.credentials.applicationToken =
                    process.env.WIKI_APPLICATION_TOKEN ?? configuration.credentials.applicationToken;
                configuration.credentials.applicationSecret =
                    process.env.WIKI_APPLICATION_SECRET ?? configuration.credentials.applicationSecret;
                configuration.credentials.accessToken =
                    process.env.WIKI_ACCESS_TOKEN ?? configuration.credentials.accessToken;
                if (configuration.method === "oauth2")
                    configuration.credentials.accessSecret =
                        process.env.WIKI_ACCESS_SECRET ?? configuration.credentials.accessSecret;
            } else if (configuration.method === "bot") {
                configuration.credentials.username =
                    process.env.WIKI_BOT_USERNAME ?? configuration.credentials.username;
                configuration.credentials.password =
                    process.env.WIKI_BOT_PASSWORD ?? configuration.credentials.password;
            }

            isConfiguration(configuration, true);

            return this.configuration = configuration;
        } catch (e) {
            Log.fatal("Fatal error reading configuration file!");
            Log.fatal(e);
        }
    }

}

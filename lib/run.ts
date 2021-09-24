import { Configuration } from "./config/Configuration";
import ConfigurationHandler from "./config/ConfigurationHandler";
import * as yargs from "yargs";
import {hideBin} from "yargs/helpers";
import Log from "./util/Log";

(async () => {
    const argv = await yargs(hideBin(process.argv))
        .usage("Usage: $0 [options]")
        .options({
            v: { type: "count" }
        }).argv;

    Log.logLevel = argv.v;

    await ConfigurationHandler.i.readConfigurationFile();
    const config : Configuration = ConfigurationHandler.i.configuration;
})();

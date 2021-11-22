require('dotenv').config()
import { resolve } from "path";
import fs from "fs";
import { LaunchConfig } from "../interfaces/launchConfig";

const getLaunchConfig = () => {
  const config_file = process.env.POLKADOT_LAUNCH_CONFIG_PATH

  if (!config_file) {
    console.error("Missing config file argument...");
    process.exit();
  }

  let config_path = resolve(process.cwd(), config_file);

  if (!fs.existsSync(config_path)) {
    console.error("Config file does not exist: ", config_path);
    process.exit();
  }

  let config: LaunchConfig = require(config_path);

  return config
}

export default getLaunchConfig;
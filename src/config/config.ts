import path from 'path';
import dotenv from 'dotenv';

// Parsing the env file.
dotenv.config({ path: path.resolve(__dirname, '../config/config.env') });

// Interface to load env variables
// Note these variables can possibly be undefined
// as someone could skip these variables or not setup a .env file at all

interface ENV {
  STANDUP_BLOCK_ID: string | undefined;
  GOOD_PEEPS_IMAGE_URL: string | undefined;
  BAD_PEEPS_IMAGE_URL: string | undefined;
  SLACK_DATA_FILE_PATH: string | undefined;
  CHANNEL_URL: string | undefined;
  API_KEY: string | undefined;
}

interface Config {
  STANDUP_BLOCK_ID: string;
  GOOD_PEEPS_IMAGE_URL: string;
  BAD_PEEPS_IMAGE_URL: string;
  SLACK_DATA_FILE_PATH: string;
  CHANNEL_URL: string;
  API_KEY: string;
}

// Loading process.env as ENV interface

const getConfig = (): ENV => {
  return {
    STANDUP_BLOCK_ID: process.env.STANDUP_BLOCK_ID,
    GOOD_PEEPS_IMAGE_URL: process.env.GOOD_PEEPS_IMAGE_URL,
    BAD_PEEPS_IMAGE_URL: process.env.BAD_PEEPS_IMAGE_URL,
    SLACK_DATA_FILE_PATH: process.env.SLACK_DATA_FILE_PATH,
    CHANNEL_URL: process.env.CHANNEL_URL,
    API_KEY: process.env.API_KEY,
  };
};

const getSanitzedConfig = (config: ENV): Config => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in config.env`);
    }
  }
  return config as Config;
};

const config = getConfig();

const sanitizedConfig = getSanitzedConfig(config);

export default sanitizedConfig;

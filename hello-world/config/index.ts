import { cleanEnv, str, email } from 'envalid';
import logger from '../utils/logger-winston';

export const { GLASSIX_BASIC_AUTH_KEY, GLASSIX_BASIC_AUTH_SECRET, GLASSIX_USERNAME } = process.env;

const env = cleanEnv(
    process.env,
    {
        GLASSIX_UNIQUE_TOKEN: str(),
        GLASSIX_BASIC_AUTH_KEY: str(),
        GLASSIX_BASIC_AUTH_SECRET: str(),
        GLASSIX_USERNAME: email(),
        GLASSIX_UNIQUE_URL: str(),
    },
    {
        reporter: ({ errors }) => {
            logger.info(`There are errors in the environment variables:`, { errors });
        },
    },
);

export default env;

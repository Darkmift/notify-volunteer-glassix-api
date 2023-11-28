import api from 'api';
import logger from './logger-winston';
import env from '../config/index';
const GlassixApi = api('@glassix/v1.2#abw55o2jvlp72nwk4');
GlassixApi.server('https://assistanceelderly.glassix.com/api/v1.2');

const sdk = new GlassixApi();
sdk.setBasicAuth(env.GLASSIX_BASIC_AUTH_KEY, env.GLASSIX_BASIC_AUTH_SECRET);

export const getToken = async () => {
    try {
        const options = {
            apiKey: env.GLASSIX_BASIC_AUTH_KEY,
            apiSecret: env.GLASSIX_BASIC_AUTH_SECRET,
            userName: env.GLASSIX_USERNAME,
        };

        const token = await sdk.pOST_tokenGet(options);
        return token;
    } catch (error) {
        logger.error(error as Error);
    }
};

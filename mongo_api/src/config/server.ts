import 'dotenv/config';

const MOGNO_OPTIONS = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    socketTimeoutMs: 300000,
    keepAlive: true,
    poolSize: 50,
    autoIndex: false,
    retryWrites: false,
};

const MONGO_USERNAME = process.env.MONGO_USERNAME || '';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || '';
const MONGO_HOST = process.env.MONGO_HOST || 'mongodb://localhost:27017/SREI';

const WEB_PROTOCOL = process.env.WEB_PROTOCOL || 'https';
const WEB_HOSTNAME = process.env.WEB_HOSTNAME || 'localhost';
const WEB_PORT = process.env.WEB_PORT || '8080';

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';
const SERVER_PORT = process.env.SERVER_PORT || 3001;

export const MONGO = {
    url: MONGO_HOST,
    username: MONGO_USERNAME,
    password: MONGO_PASSWORD,
    options: MOGNO_OPTIONS,
}

export const SERVER = {
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT
}

export const WEB = {
    protocol: WEB_PROTOCOL,
    hostname: WEB_HOSTNAME,
    port: WEB_PORT,
};
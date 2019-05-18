module.exports = Object.freeze ({
    HOST: process.env.HOST,
    PORT: process.env.PORT ? process.env.PORT : 3000,
    MONGODB_URI: process.env.MONGODB_URI,
    SECRET_KEY: process.env.SECRET_KEY ? process.env.SECRET_KEY : 's3cr3t'
});
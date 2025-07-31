export default () => ({
  version: process.env.npm_package_version,
  node_env: process.env.NODE_ENV,
  jwtSecret: process.env.JWT_SECRET,
  port: parseInt(process.env.PORT, 10),
  host: process.env.HOST,
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    dbName: process.env.DATABASE_NAME,
  },
  redis_host: process.env.REDIS_HOST,
  redis_port: process.env.REDIS_PORT,
});
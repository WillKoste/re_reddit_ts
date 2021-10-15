declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    REDIS_URL: string;
    PORT: string;
    SESSION_SECRET: string;
    COOKIE_NAME: string;
    REDIS_PORT: string;
    FORGET_PASSWORD_PREFIX: string;
    CORS_ORIGIN: string;
  }
}
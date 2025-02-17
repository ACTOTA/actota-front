export const clientEnv = {
    COOKIE_NAME: process.env.COOKIE_NAME as string,
    COOKIE_PASSWORD: process.env.COOKIE_PASSWORD as string,
    COOKIE_DOMAIN: process.env.COOKIE_DOMAIN as string,
    IS_PRODUCTION: process.env.NODE_ENV === 'production',
} as const;


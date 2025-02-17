import type { SessionOptions } from "iron-session";
import getConfig from "next/config";


const { COOKIE_DOMAIN, IS_PRODUCTION, COOKIE_NAME, COOKIE_PASSWORD } =
  getConfig().serverRuntimeConfig as any;

const cookieConfig: SessionOptions = {
  cookieName: COOKIE_NAME,
  password: COOKIE_PASSWORD,
  cookieOptions: {
    secure: IS_PRODUCTION,
    domain: COOKIE_DOMAIN ?? undefined,
  },
};

export { cookieConfig};

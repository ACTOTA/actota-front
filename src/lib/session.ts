import type { SessionOptions } from "iron-session";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { serverEnv } from "@/src/lib/config/env/server-env";

export type SessionDataType = {
    isLoggedIn?: boolean;
 
    user?: {
      user_id: string;
      email: string;
      type: string;
    };
    token: string | undefined;
};
export const defaultSession: SessionDataType = {
    isLoggedIn: false,
    user: {
      user_id: "",
      email: "",
      type: "",
    },
    token: undefined,
  };
export const sessionOptions: SessionOptions = {
    cookieName: serverEnv.COOKIE_NAME,
    password: serverEnv.COOKIE_PASSWORD,
    cookieOptions: {
      domain: serverEnv.COOKIE_DOMAIN ?? undefined,
      secure: serverEnv.IS_PRODUCTION,
    },
  };
export const getSession = () => {
    return getIronSession<SessionDataType>(cookies(), sessionOptions);
  };  

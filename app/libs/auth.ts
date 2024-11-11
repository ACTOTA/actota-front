import { jwtVerify } from 'jose/jwt/verify';

export interface Claims {
  sub: string,
  exp: number,
  iat: number
};

export const verifyJwt = async (token: string): Promise<Claims | null> => {
  const secret = process.env.NEXT_PUBLIC_AUTH_SECRET || "";

  try {
    // Convert the secret to a Uint8Array (required by `jose`)
    const encoder = new TextEncoder();
    const secretKey = encoder.encode(secret); 

    // Verify the JWT and extract the payload
    const { payload } = await jwtVerify(token, secretKey);

    // Type-cast the payload to your Claims interface
    return payload as Claims;
  } catch (err) {
    console.error('JWT verification failed:', err);
    return null;
  }
};

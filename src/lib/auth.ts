import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET!;
const secret = new TextEncoder().encode(JWT_SECRET);

export interface UserPayload {
  id: string;
  email: string;
}

export async function signToken(payload: UserPayload): Promise<string> {
  console.log("Sign token with SECRET:", JWT_SECRET ? "EXISTS" : "MISSING");

  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);

  console.log("sign token:", token);
  return token;
}

export async function verifyToken(token: string): Promise<UserPayload | null> {
  try {
    console.log("Verify token with SECRET:", JWT_SECRET ? "EXISTS" : "MISSING");
    console.log("Verifying token:", token);

    const { payload } = await jwtVerify(token, secret);
    console.log("Token decoded successfully:", payload);

    return payload as any;
  } catch (error) {
    console.log("Token verification failed:", error);
    return null;
  }
}

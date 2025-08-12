
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
const secret = new TextEncoder().encode(JWT_SECRET);

type UserPayload = {
    userId: string;
    role: string;
    name: string;
    email: string;
};

export async function getCurrentUser(): Promise<UserPayload | null> {
  const token = cookies().get('accessToken')?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as UserPayload;
  } catch (err) {
    return null;
  }
}


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
  const cookieStore = cookies();
  const token = cookieStore.get('accessToken')?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as UserPayload;
  } catch (err) {
    console.error('Failed to verify JWT:', err);
    return null;
  }
}

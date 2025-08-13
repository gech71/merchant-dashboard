
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { prisma } from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
const secret = new TextEncoder().encode(JWT_SECRET);

type UserPayload = {
    userId: string;
    role: string;
    name: string;
    email: string;
    permissions: string[];
};

export async function getCurrentUser(): Promise<UserPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get('accessToken')?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    
    // Fetch user from DB to get the latest role and permissions
    const user = await prisma.merchant_users.findUnique({
      where: { ID: payload.userId as string },
      include: {
        role: true,
      }
    });

    if (!user || !user.role) {
      return null;
    }
    
    const permissions = (user.role.permissions as { pages: string[] })?.pages || [];

    return {
        userId: user.ID,
        role: user.role.name,
        name: user.FULLNAME,
        email: user.PHONENUMBER, // Using phone number as email for display
        permissions: permissions,
    };
  } catch (err) {
    console.error('Failed to verify JWT:', err);
    return null;
  }
}


'use server';

import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
const secret = new TextEncoder().encode(JWT_SECRET);

type UserPayload = {
    userId: string;
    userType: 'merchant';
    role: string;
    name: string;
    email: string;
    accountNumber: string | null;
    permissions: string[];
};

export async function getCurrentUser(token: string | undefined): Promise<UserPayload | null> {
  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    const { userId } = payload as { userId: string };
    
    let user: any = null;
    let role: any = null;
    
    user = await prisma.Merchant_users.findUnique({
        where: { ID: userId },
        include: { ApplicationRole: { include: { permissions: true } } },
    });
    role = user?.ApplicationRole;
    
    if (!user || !role) {
      return null;
    }
    
    const permissions = role.permissions.map((p: { page: string }) => p.page);
    
    return {
        userId: user.ID,
        userType: 'merchant',
        role: role.ROLENAME,
        name: user.FULLNAME,
        email: user.PHONENUMBER,
        accountNumber: user.ACCOUNTNUMBER,
        permissions: permissions,
    };

  } catch (err) {
    console.error('Failed to verify JWT:', err);
    return null;
  }
}

export async function getMe() {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;
    const user = await getCurrentUser(token);
    if (!user) {
        return new NextResponse(JSON.stringify({ message: "Not authenticated" }), { status: 401 });
    }
    return new NextResponse(JSON.stringify(user));
}

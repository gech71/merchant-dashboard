
'use server';

import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
const secret = new TextEncoder().encode(JWT_SECRET);

type UserPayload = {
    userId: string;
    userType: 'merchant' | 'branch';
    role: string;
    name: string;
    email: string;
    accountNumber: string | null;
    branch: string | null;
    permissions: string[];
};

export async function getCurrentUser(token: string | undefined): Promise<UserPayload | null> {
  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    const { userId, userType } = payload as { userId: string, userType: 'merchant' | 'branch' };
    
    let user: any = null;
    let role: any = null;
    
    if (userType === 'merchant') {
        user = await prisma.merchant_users.findUnique({
            where: { ID: userId },
            include: { ApplicationRole: { include: { capabilities: true } } },
        });
        role = user?.ApplicationRole;
    } else if (userType === 'branch') {
        user = await prisma.branchUser.findUnique({
            where: { id: userId },
            include: { role: { include: { capabilities: true } } },
        });
        role = user?.role;
    }

    if (!user || !role) {
      return null;
    }
    
    const permissions = role.capabilities.map((cap: { ADDRESS: string }) => cap.ADDRESS);
    
    if (userType === 'merchant') {
        return {
            userId: user.ID,
            userType: 'merchant',
            role: role.ROLENAME,
            name: user.FULLNAME,
            email: user.PHONENUMBER,
            accountNumber: user.ACCOUNTNUMBER,
            branch: null, 
            permissions: permissions,
        };
    } else { // userType === 'branch'
         return {
            userId: user.id,
            userType: 'branch',
            role: role.name,
            name: user.name,
            email: user.email,
            accountNumber: null, 
            branch: user.branch,
            permissions: permissions,
        };
    }

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

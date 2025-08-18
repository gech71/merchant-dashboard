
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
    
    if (userType === 'merchant') {
        user = await prisma.Merchant_users.findUnique({
            where: { ID: userId },
            include: { DashBoardRoles: true },
        });
    } else if (userType === 'branch') {
        user = await prisma.BranchUser.findUnique({
            where: { id: userId },
            include: { role: true },
        });
    }

    const roles = user.DashBoardRoles || user.role;

    if (!user || !roles) {
      return null;
    }
    
    const permissions = (roles.permissions as { pages: string[] })?.pages || [];
    
    if (userType === 'merchant') {
        return {
            userId: user.ID,
            userType: 'merchant',
            role: roles.name,
            name: user.FULLNAME,
            email: user.PHONENUMBER,
            accountNumber: user.ACCOUNTNUMBER,
            branch: null, // Merchant users are not directly in a branch
            permissions: permissions,
        };
    } else { // userType === 'branch'
         return {
            userId: user.id,
            userType: 'branch',
            role: roles.name,
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

    
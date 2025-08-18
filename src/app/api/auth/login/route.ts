
'use server';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
const JWT_EXPIRES_IN = '1h';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { identifier, password, userType } = body;

    if (!identifier || !userType) {
      return NextResponse.json(
        { isSuccess: false, message: 'Identifier and user type are required' },
        { status: 400 }
      );
    }

    let user: any = null;
    let userPayload: any = null;

    if (userType === 'merchant') {
        // Password check is removed. We just find the user by phone number.
        const merchantUser = await prisma.Merchant_users.findUnique({
            where: { PHONENUMBER: identifier },
            include: { DashBoardRoles: true },
        });

        if (merchantUser) {
            user = merchantUser;
            const permissions = (user.DashBoardRoles?.permissions as {pages: string[]})?.pages || [];
            userPayload = {
                userId: user.ID,
                userType: 'merchant',
                role: user.DashBoardRoles?.name || 'No Role',
                name: user.FULLNAME,
                email: user.PHONENUMBER,
                accountNumber: user.ACCOUNTNUMBER,
                branch: null,
                permissions,
            };
        }
    } else if (userType === 'branch') {
        const branchUser = await prisma.BranchUser.findUnique({
            where: { email: identifier },
            include: { DashBoardRoles: true },
        });
        
        // Assuming branch users still use passwords for now.
        // If they also don't need passwords, this should be updated.
        if (branchUser && password && branchUser.password === password) {
            user = branchUser;
            const permissions = (user.DashBoardRoles?.permissions as {pages: string[]})?.pages || [];
            userPayload = {
                userId: user.id.toString(),
                userType: 'branch',
                role: user.DashBoardRoles?.name || 'No Role',
                name: user.name,
                email: user.email,
                accountNumber: null,
                branch: user.branch,
                permissions,
            };
        }
    } else {
        return NextResponse.json({ isSuccess: false, message: 'Invalid user type' }, { status: 400 });
    }

    if (!user || !userPayload) {
      return NextResponse.json(
        { isSuccess: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    const accessToken = jwt.sign(
        userPayload,
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
    
    const cookieStore = await cookies();
    cookieStore.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60, // 1 hour
      path: '/',
    });


    return NextResponse.json({
        isSuccess: true,
        user: userPayload,
        errors: null,
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ isSuccess: false, message: 'Something went wrong!' }, { status: 500 });
  }
}

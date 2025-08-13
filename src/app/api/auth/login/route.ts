
'use server';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
const JWT_EXPIRES_IN = '1h';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { identifier, password, userType } = body;

    if (!identifier || !password || !userType) {
      return NextResponse.json(
        { isSuccess: false, message: 'Identifier, password and user type are required' },
        { status: 400 }
      );
    }

    let user: any = null;
    let userPayload: any = null;

    if (userType === 'merchant') {
        const merchantUser = await prisma.merchant_users.findUnique({
            where: { PHONENUMBER: identifier },
            include: { role: true },
        });

        if (merchantUser && (await bcrypt.compare(password, merchantUser.password))) {
            user = merchantUser;
            const permissions = (user.role?.permissions as {pages: string[]})?.pages || [];
            userPayload = {
                userId: user.ID,
                userType: 'merchant',
                role: user.role?.name || 'No Role',
                name: user.FULLNAME,
                email: user.PHONENUMBER,
                accountNumber: user.ACCOUNTNUMBER,
                permissions,
            };
        }
    } else if (userType === 'branch') {
        const branchUser = await prisma.branchUser.findUnique({
            where: { email: identifier },
            include: { role: true },
        });
        
        if (branchUser && (await bcrypt.compare(password, branchUser.password))) {
            user = branchUser;
            const permissions = (user.role?.permissions as {pages: string[]})?.pages || [];
            userPayload = {
                userId: user.id.toString(),
                userType: 'branch',
                role: user.role?.name || 'No Role',
                name: user.name,
                email: user.email,
                accountNumber: null, // Branch users are not tied to a single company
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
    
    const cookieStore = cookies();
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

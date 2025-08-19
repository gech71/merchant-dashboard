
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
    const { identifier, password, loginType } = body;

    if (!identifier) {
      return NextResponse.json(
        { isSuccess: false, message: 'Identifier is required' },
        { status: 400 }
      );
    }

    let user: any = null;
    let userPayload: any = null;
    let role: any = null;

    const merchantUser = await prisma.merchant_users.findFirst({
        where: { PHONENUMBER: loginType === 'merchantSales' ? identifier : password },
        include: { ApplicationRole: { include: { permissions: true } } },
    });

    if (!merchantUser) {
        return NextResponse.json({ isSuccess: false, message: 'Merchant user not found.' }, { status: 404 });
    }

    if (loginType === 'merchantAdmin') {
        if (merchantUser.ApplicationRole?.ROLENAME !== 'Admin') {
            return NextResponse.json({ isSuccess: false, message: 'This user is not an Admin. Please use the Sales login.' }, { status: 403 });
        }
        if (merchantUser.ACCOUNTNUMBER !== identifier) {
            return NextResponse.json({ isSuccess: false, message: 'Invalid Account Number for the given Phone Number.' }, { status: 401 });
        }
    } else if (loginType === 'merchantSales') {
        if (merchantUser.ApplicationRole?.ROLENAME !== 'Sales') {
            return NextResponse.json({ isSuccess: false, message: 'This user is not a Sales user. Please use the Admin login.' }, { status: 403 });
        }
    } else {
        return NextResponse.json({ isSuccess: false, message: 'Invalid merchant login type.' }, { status: 400 });
    }

    user = merchantUser;
    role = user.ApplicationRole;
    
    const permissions: string[] = role?.permissions.map((p: { page: string; }) => p.page) || [];

    userPayload = {
        userId: user.ID,
        userType: 'merchant',
        role: user.ROLE,
        name: user.FULLNAME,
        email: user.PHONENUMBER,
        accountNumber: user.ACCOUNTNUMBER,
        permissions,
    };
   
    if (!user || !userPayload) {
      return NextResponse.json(
        { isSuccess: false, message: 'Invalid credentials or user not found' },
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


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
    const { phoneNumber, accountNumber } = body;

    if (!phoneNumber || !accountNumber) {
      return NextResponse.json(
        { isSuccess: false, message: 'Phone number and account number are required' },
        { status: 400 }
      );
    }

    const user = await prisma.merchant_users.findUnique({
      where: { PHONENUMBER: phoneNumber },
    });

    if (!user) {
      return NextResponse.json(
        { isSuccess: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(accountNumber, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { isSuccess: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    const userPayload = {
        userId: user.ID,
        role: user.ROLE,
        name: user.FULLNAME,
        email: user.PHONENUMBER, // Using phone number as email for display
    };

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

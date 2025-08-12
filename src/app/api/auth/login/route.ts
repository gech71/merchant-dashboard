
'use server';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
const JWT_EXPIRES_IN = '1h';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your-super-secret-refresh-token-key';
const REFRESH_TOKEN_EXPIRES_IN = '7d';

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

    const accessToken = jwt.sign(
        { userId: user.ID, role: user.ROLE },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
        { userId: user.ID },
        REFRESH_TOKEN_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
    );


    return NextResponse.json({
        isSuccess: true,
        accessToken,
        refreshToken,
        errors: null,
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ isSuccess: false, message: 'Something went wrong!' }, { status: 500 });
  }
}

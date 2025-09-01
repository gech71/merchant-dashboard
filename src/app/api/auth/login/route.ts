
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
    
    if (loginType !== 'merchantSaler' && !password) {
        return NextResponse.json(
            { isSuccess: false, message: 'Password is required' },
            { status: 400 }
        );
    }


    let user: any = null;
    let userPayload: any = null;
    let role: any = null;

    if (loginType === 'system') {
        const systemUser = await prisma.systemUsers.findFirst({
            where: { email: identifier },
            include: { role: { include: { permissions: true } } },
        });

        if (!systemUser || systemUser.password !== password) {
             return NextResponse.json({ isSuccess: false, message: 'Invalid credentials for system user.' }, { status: 401 });
        }
        user = systemUser;
        role = user.role;
        const permissions: string[] = role?.permissions.map((p: { page: string; }) => p.page) || [];
        userPayload = {
            userId: user.id,
            userType: 'system',
            role: role.ROLENAME,
            name: user.name,
            email: user.email,
            permissions,
        };

    } else if (loginType === 'merchantAdmin' || loginType === 'merchantSaler') {
        let whereClause;
        if (loginType === 'merchantAdmin') {
            whereClause = { ACCOUNTNUMBER: identifier, PHONENUMBER: password };
        } else { // merchantSaler
            whereClause = { PHONENUMBER: identifier };
        }

        const merchantUser = await prisma.merchant_users.findFirst({
            where: whereClause,
            include: { ApplicationRole: { include: { permissions: true } } },
        });

        if (!merchantUser) {
            return NextResponse.json({ isSuccess: false, message: 'Merchant user not found or credentials invalid.' }, { status: 404 });
        }

        if (loginType === 'merchantAdmin' && merchantUser.ApplicationRole?.ROLENAME !== 'ADMIN') {
            return NextResponse.json({ isSuccess: false, message: 'This user is not an ADMIN. Please use the Saler login.' }, { status: 403 });
        }
        
        if (loginType === 'merchantSaler' && merchantUser.ApplicationRole?.ROLENAME !== 'SALER') {
            return NextResponse.json({ isSuccess: false, message: 'This user is not a SALER user. Please use the Admin login.' }, { status: 403 });
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
    } else {
         return NextResponse.json({ isSuccess: false, message: 'Invalid login type.' }, { status: 400 });
    }
   
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

      
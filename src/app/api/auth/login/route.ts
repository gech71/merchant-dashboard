
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
    const { identifier, password, userType, loginType } = body;

    if (!identifier || !userType) {
      return NextResponse.json(
        { isSuccess: false, message: 'Identifier and user type are required' },
        { status: 400 }
      );
    }

    let user: any = null;
    let userPayload: any = null;
    let role: any = null;

    if (userType === 'merchant') {
      const merchantUser = await prisma.merchant_users.findFirst({
        where: { PHONENUMBER: loginType === 'merchantSales' ? identifier : password },
        include: { ApplicationRole: { include: { capabilities: true } } },
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
      const permissions = role.capabilities.map((cap: any) => cap.ADDRESS);

      userPayload = {
          userId: user.ID,
          userType: 'merchant',
          role: role.ROLENAME,
          applicationRole: role.ROLENAME,
          name: user.FULLNAME,
          email: user.PHONENUMBER,
          accountNumber: user.ACCOUNTNUMBER,
          branch: null,
          permissions,
      };

    } else if (userType === 'branch') {
        const branchUser = await prisma.branchUser.findUnique({
            where: { email: identifier },
            include: { role: { include: { capabilities: true } } },
        });
        
        if (branchUser && password && branchUser.password === password) {
            user = branchUser;
            role = user.role;
            const permissions = role.capabilities.map((cap: any) => cap.ADDRESS);
            userPayload = {
                userId: user.id.toString(),
                userType: 'branch',
                role: role.name,
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

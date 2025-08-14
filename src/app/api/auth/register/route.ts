
'use server';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      ACCOUNTNUMBER,
      FULLNAME,
      ACCOUNTTYPE,
      PHONENUMBER,
      ROLE,
      DEVICENAME,
      ENCRYPTIONKEY,
      iV,
      authenticationkey,
      VALUE3,
      INSERTUSERID,
      UPDATEUSERID,
    } = body;

    // Check if user already exists
    const existingUser = await prisma.Merchant_users.findUnique({
      where: { PHONENUMBER },
    });

    if (existingUser) {
      return NextResponse.json(
        { user: null, message: 'User with this phone number already exists' },
        { status: 409 }
      );
    }

    // Hash the account number to use as a password
    const hashedPassword = await bcrypt.hash(ACCOUNTNUMBER, 10);

    const newUser = await prisma.Merchant_users.create({
      data: {
        ID: randomUUID(),
        ACCOUNTNUMBER,
        password: hashedPassword,
        FULLNAME,
        ACCOUNTTYPE,
        PHONENUMBER,
        ROLE,
        DEVICENAME,
        ENCRYPTIONKEY,
        iV,
        ISLOGGEDIN: false,
        authenticationkey,
        STATUS: 'Pending', // Or 'Active' if you want to auto-approve
        FAILEDATTMEPTS: 0,
        LASTLOGINATTEMPT: new Date(),
        ISLOCKED: false,
        UNLOCKEDTIME: null,
        VALUE3,
        INSERTUSERID,
        UPDATEUSERID,
      },
    });
    
    const { password, ...userWithoutPassword } = newUser;

    return NextResponse.json(
      { user: userWithoutPassword, message: 'User created successfully' },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ message: 'Something went wrong!' }, { status: 500 });
  }
}

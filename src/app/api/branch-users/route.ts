
'use server';

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const existingUser = await prisma.systemUsers.findUnique({ where: { email }});
    if (existingUser) {
        return NextResponse.json({ message: 'A user with this email already exists.' }, { status: 409 });
    }

    const newUser = await prisma.systemUsers.create({
      data: {
        name,
        email,
        password, // In a real app, this should be hashed
        status: 'Pending', // Default status
      },
      include: {
        role: true
      }
    });
    
    const newUserSerializable = {
        ...newUser,
        createdAt: newUser.createdAt.toISOString(),
        updatedAt: newUser.updatedAt.toISOString(),
    }

    return NextResponse.json(newUserSerializable, { status: 201 });
  } catch (error) {
    console.error('Error creating system user:', error);
    // Check for unique constraint violation
    if ((error as any).code === 'P2002' && (error as any).meta?.target?.includes('email')) {
        return NextResponse.json({ message: 'A user with this email already exists.' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Something went wrong!' }, { status: 500 });
  }
}

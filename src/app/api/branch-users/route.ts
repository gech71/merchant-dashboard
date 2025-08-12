
'use server';

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, branch } = body;

    if (!name || !email || !branch) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newUser = await prisma.branchUser.create({
      data: {
        name,
        email,
        branch,
        status: 'Pending', // Default status
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error creating branch user:', error);
    // Check for unique constraint violation
    if ((error as any).code === 'P2002' && (error as any).meta?.target?.includes('email')) {
        return NextResponse.json({ message: 'A user with this email already exists.' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Something went wrong!' }, { status: 500 });
  }
}

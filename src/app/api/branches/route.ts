
'use server';

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, code, address, contact } = body;

    if (!name || !code || !address || !contact) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newBranch = await prisma.branch.create({
      data: {
        name,
        code,
        address,
        contact,
        status: 'Approved', // Default status
      },
    });

    const newBranchSerializable = {
        ...newBranch,
        INSERTDATE: newBranch.INSERTDATE?.toISOString() ?? null,
        UPDATEDATE: newBranch.UPDATEDATE?.toISOString() ?? null,
    };

    return NextResponse.json(newBranchSerializable, { status: 201 });
  } catch (error) {
    console.error('Error creating branch:', error);
    return NextResponse.json({ message: 'Something went wrong!' }, { status: 500 });
  }
}

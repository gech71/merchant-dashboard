
'use server';

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const body = await request.json();
    const { name, code, address, contact } = body;

    if (!name || !code || !address || !contact) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const updatedBranch = await prisma.branch.update({
      where: { id },
      data: {
        name,
        code,
        address,
        contact,
      },
    });
    
    const updatedBranchSerializable = {
        ...updatedBranch,
        INSERTDATE: updatedBranch.INSERTDATE?.toISOString() ?? null,
        UPDATEDATE: updatedBranch.UPDATEDATE?.toISOString() ?? null,
    };

    return NextResponse.json(updatedBranchSerializable, { status: 200 });
  } catch (error) {
    console.error(`Error updating branch ${params.id}:`, error);
    return NextResponse.json({ message: 'Something went wrong!' }, { status: 500 });
  }
}

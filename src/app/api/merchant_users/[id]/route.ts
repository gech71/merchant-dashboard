
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
    const { ROLE, STATUS } = body;

    const dataToUpdate: { ROLE?: string; STATUS?: string } = {};
    if (ROLE) {
        dataToUpdate.ROLE = ROLE;
    }
    if (STATUS) {
        dataToUpdate.STATUS = STATUS;
    }

    if (Object.keys(dataToUpdate).length === 0) {
        return NextResponse.json({ message: 'No fields to update' }, { status: 400 });
    }

    const updatedUser = await prisma.merchant_users.update({
      where: { ID: id },
      data: dataToUpdate,
    });
    
    const { password, ...userWithoutPassword } = updatedUser;

    const userSerializable = {
        ...userWithoutPassword,
        LASTLOGINATTEMPT: userWithoutPassword.LASTLOGINATTEMPT?.toISOString() ?? null,
        UNLOCKEDTIME: userWithoutPassword.UNLOCKEDTIME?.toISOString() ?? null,
        INSERTDATE: userWithoutPassword.INSERTDATE?.toISOString() ?? null,
        UPDATEDATE: userWithoutPassword.UPDATEDATE?.toISOString() ?? null,
    };


    return NextResponse.json(userSerializable, { status: 200 });
  } catch (error) {
    console.error(`Error updating merchant user ${params.id}:`, error);
    return NextResponse.json({ message: 'Something went wrong!' }, { status: 500 });
  }
}


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
    const { roleId, STATUS, ROLE } = body;

    const dataToUpdate: { roleId?: string; STATUS?: string, ROLE?: string } = {};
    if (roleId) {
        dataToUpdate.roleId = roleId;
    }
    if (STATUS) {
        dataToUpdate.STATUS = STATUS;
    }
    if (ROLE) {
        dataToUpdate.ROLE = ROLE;
    }


    if (Object.keys(dataToUpdate).length === 0) {
        return NextResponse.json({ message: 'No fields to update' }, { status: 400 });
    }

    const updatedUser = await prisma.merchant_users.update({
      where: { ID: id },
      data: dataToUpdate,
    });

    const userSerializable = {
        ...updatedUser,
        LASTLOGINATTEMPT: updatedUser.LASTLOGINATTEMPT?.toISOString() ?? null,
        UNLOCKEDTIME: updatedUser.UNLOCKEDTIME?.toISOString() ?? null,
        INSERTDATE: updatedUser.INSERTDATE?.toISOString() ?? null,
        UPDATEDATE: updatedUser.UPDATEDATE?.toISOString() ?? null,
    };


    return NextResponse.json(userSerializable, { status: 200 });
  } catch (error) {
    console.error(`Error updating merchant user ${params.id}:`, error);
    return NextResponse.json({ message: 'Something went wrong!' }, { status: 500 });
  }
}

    
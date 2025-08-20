
'use server';

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;
    const user = await getCurrentUser(token);

    if (!user) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const {
      MENUNAME,
      MENUNAME_am,
      ADDRESS,
      MENUORDER,
      SUBMENUORDER,
      PARENT,
      PARENTID,
      ROLEID,
    } = body;

    const [_, updatedCapability] = await prisma.$transaction(async (tx) => {
        const oldValue = await tx.role_capablities.findUnique({
            where: { ID: id }
        });

        if (!oldValue) {
            throw new Error("Capability not found");
        }
        
        const updatedCapability = await tx.role_capablities.update({
            where: { ID: id },
            data: {
                MENUNAME,
                MENUNAME_am,
                ADDRESS,
                MENUORDER,
                SUBMENUORDER,
                PARENT,
                PARENTID,
                ROLEID,
                UPDATEDATE: new Date(),
            },
        });

        await tx.auditLog.create({
            data: {
                tableName: 'role_capablities',
                recordId: id,
                action: 'UPDATE',
                oldValue: oldValue,
                newValue: updatedCapability,
                changedBy: user.userId,
            }
        });

        return [oldValue, updatedCapability];
    });


    const serializableCapability = {
      ...updatedCapability,
      INSERTDATE: updatedCapability.INSERTDATE?.toISOString() ?? null,
      UPDATEDATE: updatedCapability.UPDATEDATE?.toISOString() ?? null,
      PARENT: updatedCapability.PARENT ?? false,
      PARENTID: updatedCapability.PARENTID ?? null,
    };

    return NextResponse.json(serializableCapability, { status: 200 });
  } catch (error) {
    console.error(`Error updating role capability ${params.id}:`, error);
     if (error instanceof Error && error.message === 'Capability not found') {
        return NextResponse.json({ message: error.message }, { status: 404 });
    }
    return NextResponse.json({ message: 'Something went wrong!' }, { status: 500 });
  }
}


export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
     const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;
    const user = await getCurrentUser(token);

    if (!user) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const { id } = params;

    await prisma.$transaction(async (tx) => {
        const oldValue = await tx.role_capablities.findUnique({
            where: { ID: id }
        });

        if (!oldValue) {
            throw new Error("Capability not found");
        }

        await tx.role_capablities.delete({
            where: { ID: id },
        });

        await tx.auditLog.create({
            data: {
                tableName: 'role_capablities',
                recordId: id,
                action: 'DELETE',
                oldValue: oldValue,
                changedBy: user.userId,
            }
        });
    });

    return NextResponse.json({ message: 'Capability deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Error deleting role capability ${params.id}:`, error);
    if (error instanceof Error && error.message === 'Capability not found') {
        return NextResponse.json({ message: error.message }, { status: 404 });
    }
    return NextResponse.json({ message: 'Something went wrong!' }, { status: 500 });
  }
}


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

    const updatedCapability = await prisma.role_capablities.update({
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
    return NextResponse.json({ message: 'Something went wrong!' }, { status: 500 });
  }
}


export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await prisma.role_capablities.delete({
      where: { ID: id },
    });
    return NextResponse.json({ message: 'Capability deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Error deleting role capability ${params.id}:`, error);
    return NextResponse.json({ message: 'Something went wrong!' }, { status: 500 });
  }
}

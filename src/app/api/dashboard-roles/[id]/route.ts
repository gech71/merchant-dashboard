
'use server';

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { name, description, permissions } = body;

    if (!name || !permissions) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const updatedRole = await prisma.dashBoardRoles.update({
      where: { id },
      data: {
        name,
        description,
        permissions,
      },
    });

     const updatedRoleSerializable = {
        ...updatedRole,
        createdAt: updatedRole.createdAt.toISOString(),
        updatedAt: updatedRole.updatedAt.toISOString(),
    }

    return NextResponse.json(updatedRoleSerializable, { status: 200 });
  } catch (error) {
    console.error(`Error updating role ${params.id}:`, error);
    return NextResponse.json({ message: 'Something went wrong!' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    await prisma.dashBoardRoles.delete({ where: { id } });
    return NextResponse.json({ message: 'Role deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Error deleting role ${params.id}:`, error);
    return NextResponse.json({ message: 'Something went wrong!' }, { status: 500 });
  }
}

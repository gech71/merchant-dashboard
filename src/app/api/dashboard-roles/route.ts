
'use server';

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, permissions } = body;

    if (!name || !permissions) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const newRole = await prisma.dashBoardRoles.create({
      data: {
        id: randomUUID(),
        name,
        description,
        permissions,
      },
    });

    const newRoleSerializable = {
        ...newRole,
        createdAt: newRole.createdAt.toISOString(),
        updatedAt: newRole.updatedAt.toISOString(),
    }

    return NextResponse.json(newRoleSerializable, { status: 201 });
  } catch (error) {
    console.error('Error creating role:', error);
    return NextResponse.json({ message: 'Something went wrong!' }, { status: 500 });
  }
}

export async function GET() {
    try {
        const roles = await prisma.dashBoardRoles.findMany();
        const rolesSerializable = roles.map(role => ({
            ...role,
            createdAt: role.createdAt.toISOString(),
            updatedAt: role.updatedAt.toISOString(),
        }));
        return NextResponse.json(rolesSerializable, { status: 200 });
    } catch (error) {
        console.error('Error fetching roles:', error);
        return NextResponse.json({ message: 'Something went wrong!' }, { status: 500 });
    }
}

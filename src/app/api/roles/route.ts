
'use server';

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ROLENAME, description, pages } = body;

    if (!ROLENAME || !pages) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const newRole = await prisma.roles.create({
      data: {
        ROLENAME,
        description,
        permissions: {
            create: pages.map((page: string) => ({ page }))
        }
      },
      include: {
        permissions: true
      }
    });

    const newRoleSerializable = {
        ...newRole,
        INSERTDATE: newRole.INSERTDATE?.toISOString() ?? null,
        UPDATEDATE: newRole.UPDATEDATE?.toISOString() ?? null,
        permissions: newRole.permissions.map(p => ({...p, createdAt: p.createdAt.toISOString(), updatedAt: p.updatedAt.toISOString()}))
    }

    return NextResponse.json(newRoleSerializable, { status: 201 });
  } catch (error) {
    console.error('Error creating role:', error);
    return NextResponse.json({ message: 'Something went wrong!' }, { status: 500 });
  }
}

export async function GET() {
    try {
        const roles = await prisma.roles.findMany({
            include: { permissions: true, capabilities: true }
        });
        const rolesSerializable = roles.map(role => ({
            ...role,
            INSERTDATE: role.INSERTDATE?.toISOString() ?? null,
            UPDATEDATE: role.UPDATEDATE?.toISOString() ?? null,
            permissions: role.permissions.map(p => ({...p, createdAt: p.createdAt.toISOString(), updatedAt: p.updatedAt.toISOString()})),
            capabilities: role.capabilities.map(c => ({...c, INSERTDATE: c.INSERTDATE?.toISOString() ?? null, UPDATEDATE: c.UPDATEDATE?.toISOString() ?? null, PARENT: c.PARENT ?? false, PARENTID: c.PARENTID ?? null}))
        }));
        return NextResponse.json(rolesSerializable, { status: 200 });
    } catch (error) {
        console.error('Error fetching roles:', error);
        return NextResponse.json({ message: 'Something went wrong!' }, { status: 500 });
    }
}

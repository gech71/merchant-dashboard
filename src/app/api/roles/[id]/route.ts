
'use server';

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { ROLENAME, description, pages } = body;

    if (!ROLENAME || !pages) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Use a transaction to update role and its permissions
    await prisma.$transaction([
        // Delete old permissions
        prisma.dashboard_permissions.deleteMany({
            where: { roleId: id }
        }),
        // Create new permissions
        prisma.dashboard_permissions.createMany({
            data: pages.map((page: string) => ({
                page: page,
                roleId: id,
            }))
        }),
        // Update the role details
        prisma.Roles.update({
            where: { ID: id },
            data: {
                ROLENAME,
                description,
            }
        })
    ]);

    // Fetch the updated role with its new permissions *after* the transaction
    const updatedRole = await prisma.Roles.findUnique({
        where: { ID: id },
        include: { permissions: true, capabilities: true }
    });
    
    if (!updatedRole) {
        return NextResponse.json({ message: 'Role not found after update' }, { status: 404 });
    }


     const updatedRoleSerializable = {
        ...updatedRole,
        INSERTDATE: updatedRole.INSERTDATE?.toISOString() ?? null,
        UPDATEDATE: updatedRole.UPDATEDATE?.toISOString() ?? null,
        permissions: updatedRole.permissions.map(p => ({...p, createdAt: p.createdAt.toISOString(), updatedAt: p.updatedAt.toISOString()})),
        capabilities: updatedRole.capabilities.map(c => ({...c, INSERTDATE: c.INSERTDATE?.toISOString() ?? null, UPDATEDATE: c.UPDATEDATE?.toISOString() ?? null, PARENT: c.PARENT ?? false, PARENTID: c.PARENTID ?? null}))
    }

    return NextResponse.json(updatedRoleSerializable, { status: 200 });
  } catch (error) {
    console.error(`Error updating role:`, error);
    return NextResponse.json({ message: 'Something went wrong!' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    
    // Deleting a role will also delete its permissions due to cascading delete
    await prisma.Roles.delete({ where: { ID: id } });
    return NextResponse.json({ message: 'Role deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Error deleting role ${params.id}:`, error);
    return NextResponse.json({ message: 'Something went wrong!' }, { status: 500 });
  }
}

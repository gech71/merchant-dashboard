
'use server';

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;
    const user = await getCurrentUser(token);

    if (!user) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { ROLENAME, description, pages } = body;

    if (!ROLENAME || !pages) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const [oldValue, updatedRole] = await prisma.$transaction(async (tx) => {
        const oldValue = await tx.roles.findUnique({
            where: { ID: id },
            include: { permissions: true }
        });

        if (!oldValue) {
            throw new Error("Role not found");
        }

        // Delete old permissions
        await tx.dashboard_permissions.deleteMany({
            where: { roleId: id }
        });

        // Create new permissions
        await tx.dashboard_permissions.createMany({
            data: pages.map((page: string) => ({
                page: page,
                roleId: id,
            }))
        });

        // Update the role details
        const updatedRoleData = await tx.roles.update({
            where: { ID: id },
            data: {
                ROLENAME,
                description,
            },
            include: { permissions: true, capabilities: true }
        });
        
        await tx.auditLog.create({
            data: {
                tableName: 'Roles',
                recordId: id,
                action: 'UPDATE',
                oldValue: oldValue,
                newValue: updatedRoleData,
                changedBy: user.userId,
            }
        });

        return [oldValue, updatedRoleData];
    });


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
    if (error instanceof Error && error.message === 'Role not found') {
        return NextResponse.json({ message: error.message }, { status: 404 });
    }
    return NextResponse.json({ message: 'Something went wrong!' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
     const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;
    const user = await getCurrentUser(token);

    if (!user) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }
    
    const { id } = params;
    
    await prisma.$transaction(async (tx) => {
        const oldValue = await tx.roles.findUnique({
            where: { ID: id }
        });

        if (!oldValue) {
            throw new Error("Role not found");
        }

        await tx.roles.delete({ where: { ID: id } });

        await tx.auditLog.create({
            data: {
                tableName: 'Roles',
                recordId: id,
                action: 'DELETE',
                oldValue: oldValue,
                changedBy: user.userId,
            }
        });
    });

    return NextResponse.json({ message: 'Role deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Error deleting role ${params.id}:`, error);
    if (error instanceof Error && error.message === 'Role not found') {
        return NextResponse.json({ message: error.message }, { status: 404 });
    }
    return NextResponse.json({ message: 'Something went wrong!' }, { status: 500 });
  }
}

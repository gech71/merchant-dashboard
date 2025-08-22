
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
    const { name, email, password, status, roleId } = body;

    const dataToUpdate: any = {};
    if (name) dataToUpdate.name = name;
    if (email) dataToUpdate.email = email;
    if (password) dataToUpdate.password = password; // In a real app, hash this!
    if (status) dataToUpdate.status = status;
    if (roleId) dataToUpdate.roleId = roleId;
    
    if (Object.keys(dataToUpdate).length === 0) {
        return NextResponse.json({ message: 'No fields to update' }, { status: 400 });
    }

    dataToUpdate.updatedAt = new Date();

    const [oldValue, updatedUser, auditLog] = await prisma.$transaction(async (tx) => {
        const oldValue = await tx.systemUsers.findUnique({
            where: { id },
        });

        if (!oldValue) {
            throw new Error("User not found");
        }

        const updatedUser = await tx.systemUsers.update({
            where: { id },
            data: dataToUpdate,
            include: { role: true },
        });

        const newAuditLog = await tx.auditLog.create({
            data: {
                tableName: 'system_users',
                recordId: id,
                action: 'UPDATE',
                oldValue,
                newValue: updatedUser,
                changedBy: user.userId,
            }
        });

        return [oldValue, updatedUser, newAuditLog];
    });


    const serializableUser = {
      ...updatedUser,
      createdAt: updatedUser.createdAt.toISOString(),
      updatedAt: updatedUser.updatedAt.toISOString(),
    };
    
    const serializableAuditLog = {
      ...auditLog,
      changedAt: auditLog.changedAt.toISOString(),
      oldValue: auditLog.oldValue as object,
      newValue: auditLog.newValue as object,
    };


    return NextResponse.json({ user: serializableUser, auditLog: serializableAuditLog }, { status: 200 });
  } catch (error: any) {
    console.error(`Error updating system user ${params.id}:`, error);
     if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        return NextResponse.json({ message: 'A user with this email already exists.' }, { status: 409 });
    }
    if (error instanceof Error && error.message === 'User not found') {
        return NextResponse.json({ message: error.message }, { status: 404 });
    }
    return NextResponse.json({ message: 'Something went wrong!' }, { status: 500 });
  }
}

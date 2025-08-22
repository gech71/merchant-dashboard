
'use server';

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;
    const user = await getCurrentUser(token);

    if (!user) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, password, status, roleId } = body;

    const existingUser = await prisma.systemUsers.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ message: 'A user with this email already exists.' }, { status: 409 });
    }

    const [newUser, auditLog] = await prisma.$transaction(async (tx) => {
        const newUser = await tx.systemUsers.create({
            data: {
                name,
                email,
                password, // In a real app, hash this!
                status,
                roleId,
            },
            include: {
                role: true
            }
        });

        const newAuditLog = await tx.auditLog.create({
            data: {
                tableName: 'system_users',
                recordId: newUser.id,
                action: 'CREATE',
                newValue: newUser,
                changedBy: user.userId,
            }
        });

        return [newUser, newAuditLog];
    });


    const serializableUser = {
      ...newUser,
      createdAt: newUser.createdAt.toISOString(),
      updatedAt: newUser.updatedAt.toISOString(),
    };
    
    const serializableAuditLog = {
      ...auditLog,
      changedAt: auditLog.changedAt.toISOString(),
      oldValue: auditLog.oldValue as object,
      newValue: auditLog.newValue as object,
    };

    return NextResponse.json({ user: serializableUser, auditLog: serializableAuditLog }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating system user:', error);
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        return NextResponse.json({ message: 'A user with this email already exists.' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Something went wrong!' }, { status: 500 });
  }
}


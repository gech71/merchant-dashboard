
'use server';

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { cookies } from 'next/headers';
import { randomUUID } from 'crypto';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;
    const user = await getCurrentUser(token);

    if (!user) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const {
      ROLEID,
      MENUNAME,
      MENUNAME_am,
      ADDRESS,
      MENUORDER,
      SUBMENUORDER,
      PARENT,
      PARENTID,
    } = body;
    
    if (!ROLEID || !MENUNAME) {
        return NextResponse.json({ message: 'Role ID and Menu Name are required' }, { status: 400 });
    }
    
    const [newCapability, auditLog] = await prisma.$transaction(async (tx) => {
        const newCapability = await tx.role_capablities.create({
            data: {
                ID: randomUUID(),
                ROLEID,
                MENUNAME,
                MENUNAME_am,
                ADDRESS,
                MENUORDER,
                SUBMENUORDER,
                PARENT,
                PARENTID,
                INSERTUSERID: user.name,
                UPDATEUSERID: user.name,
                INSERTDATE: new Date(),
                UPDATEDATE: new Date(),
            },
        });

        const newAuditLog = await tx.auditLog.create({
            data: {
                tableName: 'role_capablities',
                recordId: newCapability.ID,
                action: 'CREATE',
                newValue: newCapability,
                changedBy: user.userId,
            }
        });

        return [newCapability, newAuditLog];
    });


    const serializableCapability = {
      ...newCapability,
      INSERTDATE: newCapability.INSERTDATE?.toISOString() ?? null,
      UPDATEDATE: newCapability.UPDATEDATE?.toISOString() ?? null,
      PARENT: newCapability.PARENT ?? false,
      PARENTID: newCapability.PARENTID ?? null,
    };
    
    const serializableAuditLog = {
        ...auditLog,
        changedAt: auditLog.changedAt.toISOString(),
        oldValue: auditLog.oldValue as object,
        newValue: auditLog.newValue as object,
    };


    return NextResponse.json({ capability: serializableCapability, auditLog: serializableAuditLog }, { status: 201 });
  } catch (error) {
    console.error('Error creating role capability:', error);
    return NextResponse.json({ message: 'Something went wrong!' }, { status: 500 });
  }
}

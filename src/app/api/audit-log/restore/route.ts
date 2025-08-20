
'use server';

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { cookies } from 'next/headers';
import type { Prisma } from '@prisma/client';

type TableName = Exclude<keyof typeof prisma, `$${string}` | symbol>;

const isValidTableName = (tableName: string): tableName is TableName => {
  return Object.keys(prisma).includes(tableName) && !tableName.startsWith('$');
};


const getSanitizedData = (tableName: string, data: any) => {
    const sanitizedData = { ...data };

    delete sanitizedData.id;
    delete sanitizedData.ID;
    delete sanitizedData.Oid;
    delete sanitizedData.createdAt;
    delete sanitizedData.updatedAt;
    delete sanitizedData.INSERTDATE;
    delete sanitizedData.UPDATEDATE;

    if (tableName === 'roles') {
        delete sanitizedData.permissions;
        delete sanitizedData.capabilities;
    }

    return sanitizedData;
}


export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;
    const user = await getCurrentUser(token);
    if (!user) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const { auditLogId } = await request.json();
    if (!auditLogId) {
      return NextResponse.json({ message: 'Audit Log ID is required' }, { status: 400 });
    }

    const auditLogEntry = await prisma.auditLog.findUnique({
      where: { id: auditLogId },
    });

    if (!auditLogEntry || auditLogEntry.action !== 'DELETE' || !auditLogEntry.oldValue) {
      return NextResponse.json({ message: 'Invalid or non-deletable audit log entry' }, { status: 400 });
    }

    const tableName = auditLogEntry.tableName as TableName;
    if (!isValidTableName(tableName)) {
      return NextResponse.json({ message: 'Invalid table name in audit log' }, { status: 500 });
    }

    const prismaModel = prisma[tableName] as any;
    
    const restoredData = getSanitizedData(tableName, auditLogEntry.oldValue as object);

    const [restoredRecord, newAuditLog] = await prisma.$transaction(async (tx) => {
        const restored = await (tx[tableName] as any).create({
            data: restoredData,
        });

        const newLog = await tx.auditLog.create({
            data: {
                tableName: tableName,
                recordId: restored.id || restored.ID || restored.Oid,
                action: 'RESTORE',
                oldValue: auditLogEntry.oldValue,
                newValue: restored,
                changedBy: user.userId,
            },
        });
        
        return [restored, newLog];
    });


    return NextResponse.json({ 
        message: 'Record restored successfully',
        restoredRecord,
        auditLog: {
          ...newAuditLog,
          changedAt: newAuditLog.changedAt.toISOString(),
          oldValue: newAuditLog.oldValue as object,
          newValue: newAuditLog.newValue as object
        }
    }, { status: 200 });

  } catch (error: any) {
    console.error('Failed to restore record:', error);
    return NextResponse.json({ message: error.message || 'Something went wrong!' }, { status: 500 });
  }
}

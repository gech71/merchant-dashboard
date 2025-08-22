
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
        BANK,
        DISPLAYNAME,
        OTPLENGTH,
        ORDER,
        ENDPOINT1,
        ENDPOINT2,
        ENDPOINT3,
        CANCELURL,
        ERRORURL,
        SUCCESSURL,
        NOTIFYURL,
        ISTWOSTEP,
        ISOTP,
        TRANSACTIONTYPE,
        BENEFICIARYACCOUNT,
        BENEFICIARYBANK,
        IMAGEURL,
    } = body;

    const [newEndpoint, auditLog] = await prisma.$transaction(async (tx) => {
        const newEndpoint = await tx.arifpay_endpoints.create({
            data: {
                ID: randomUUID(),
                BANK,
                DISPLAYNAME,
                OTPLENGTH,
                ORDER,
                ENDPOINT1,
                ENDPOINT2,
                ENDPOINT3,
                CANCELURL,
                ERRORURL,
                SUCCESSURL,
                NOTIFYURL,
                ISTWOSTEP,
                ISOTP,
                TRANSACTIONTYPE,
                BENEFICIARYACCOUNT,
                BENEFICIARYBANK,
                IMAGEURL,
                UPDATEUSER: user.name,
                INSERTUSER: user.name,
            },
        });

        const newAuditLog = await tx.auditLog.create({
            data: {
                tableName: 'arifpay_endpoints',
                recordId: newEndpoint.ID,
                action: 'CREATE',
                newValue: newEndpoint,
                changedBy: user.userId,
            }
        });
        
        return [newEndpoint, newAuditLog];
    });

    const serializableEndpoint = {
      ...newEndpoint,
      INSERTDATE: newEndpoint.INSERTDATE?.toISOString() ?? null,
      UPDATEDATE: newEndpoint.UPDATEDATE?.toISOString() ?? null,
    };
    
    const serializableAuditLog = {
      ...auditLog,
      changedAt: auditLog.changedAt.toISOString(),
      oldValue: auditLog.oldValue as object,
      newValue: auditLog.newValue as object
    };

    return NextResponse.json({ endpoint: serializableEndpoint, auditLog: serializableAuditLog }, { status: 201 });
  } catch (error) {
    console.error('Error creating ArifPay endpoint:', error);
    return NextResponse.json({ message: 'Something went wrong!' }, { status: 500 });
  }
}

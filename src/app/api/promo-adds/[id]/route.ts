
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
    const {
      ADDTITLE,
      ADDSUBTITLE,
      ADDADDRESS,
      IMAGEADDRESS,
      ORDER,
    } = body;
    
    const [oldValue, updatedAd, auditLog] = await prisma.$transaction(async (tx) => {
        const oldValue = await tx.promo_adds.findUnique({
            where: { ID: id }
        });

        if (!oldValue) {
            throw new Error("Ad not found");
        }
        
        const updatedAd = await tx.promo_adds.update({
            where: { ID: id },
            data: {
                ADDTITLE,
                ADDSUBTITLE,
                ADDADDRESS,
                IMAGEADDRESS,
                ORDER,
                UPDATEUSERID: user.name,
                UPDATEDATE: new Date(),
            },
        });

        const newAuditLog = await tx.auditLog.create({
            data: {
                tableName: 'promo_adds',
                recordId: id,
                action: 'UPDATE',
                oldValue,
                newValue: updatedAd,
                changedBy: user.userId,
            }
        });
        
        return [oldValue, updatedAd, newAuditLog];
    });


    const serializableAd = {
      ...updatedAd,
      INSERTDATE: updatedAd.INSERTDATE?.toISOString() ?? null,
      UPDATEDATE: updatedAd.UPDATEDATE?.toISOString() ?? null,
    };
    
    const serializableAuditLog = {
      ...auditLog,
      changedAt: auditLog.changedAt.toISOString(),
      oldValue: auditLog.oldValue as object,
      newValue: auditLog.newValue as object
    };


    return NextResponse.json({ ad: serializableAd, auditLog: serializableAuditLog }, { status: 200 });
  } catch (error) {
    console.error(`Error updating promo ad ${params.id}:`, error);
    if (error instanceof Error && error.message === 'Ad not found') {
        return NextResponse.json({ message: error.message }, { status: 404 });
    }
    return NextResponse.json({ message: 'Something went wrong!' }, { status: 500 });
  }
}

export async function DELETE(
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

    const auditLog = await prisma.$transaction(async (tx) => {
        const oldValue = await tx.promo_adds.findUnique({
            where: { ID: id }
        });

        if (!oldValue) {
            throw new Error("Ad not found");
        }

        await tx.promo_adds.delete({
            where: { ID: id },
        });

        return await tx.auditLog.create({
            data: {
                tableName: 'promo_adds',
                recordId: id,
                action: 'DELETE',
                oldValue,
                changedBy: user.userId,
            }
        });
    });
    
     const serializableAuditLog = {
      ...auditLog,
      changedAt: auditLog.changedAt.toISOString(),
      oldValue: auditLog.oldValue as object,
      newValue: auditLog.newValue as object
    };

    return NextResponse.json({ message: 'Ad deleted successfully', auditLog: serializableAuditLog }, { status: 200 });
  } catch (error) {
    console.error(`Error deleting promo ad ${params.id}:`, error);
     if (error instanceof Error && error.message === 'Ad not found') {
        return NextResponse.json({ message: error.message }, { status: 404 });
    }
    return NextResponse.json({ message: 'Something went wrong!' }, { status: 500 });
  }
}

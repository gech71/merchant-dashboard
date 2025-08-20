
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
    const { ADDRESS, USERNAME, PASSWORD } = body;

    if (!ADDRESS || !USERNAME) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }
    
    const [_, updatedSetting, auditLog] = await prisma.$transaction(async (tx) => {
        const oldValue = await tx.core_integration_settings.findUnique({
            where: { ID: id },
        });

        if (!oldValue) {
            throw new Error('Setting not found');
        }

        const dataToUpdate: any = {
            ADDRESS,
            USERNAME,
            UPDATEDATE: new Date(),
            UPDATEUSER: user.name,
        };

        if (PASSWORD) {
            dataToUpdate.PASSWORD = PASSWORD;
        }

        const updatedSetting = await tx.core_integration_settings.update({
          where: { ID: id },
          data: dataToUpdate,
        });

        const newAuditLog = await tx.auditLog.create({
            data: {
                tableName: 'core_integration_settings',
                recordId: id,
                action: 'UPDATE',
                oldValue,
                newValue: updatedSetting,
                changedBy: user.userId,
            }
        });

        return [oldValue, updatedSetting, newAuditLog];
    });
    
    const serializableSetting = {
        ...updatedSetting,
        INSERTDATE: updatedSetting.INSERTDATE?.toISOString() ?? null,
        UPDATEDATE: updatedSetting.UPDATEDATE?.toISOString() ?? null,
    };
    
    const serializableAuditLog = {
      ...auditLog,
      changedAt: auditLog.changedAt.toISOString(),
      oldValue: auditLog.oldValue as object,
      newValue: auditLog.newValue as object
    };


    return NextResponse.json({ setting: serializableSetting, auditLog: serializableAuditLog }, { status: 200 });
  } catch (error) {
    console.error(`Error updating Core Integration setting ${params.id}:`, error);
     if (error instanceof Error && error.message === 'Setting not found') {
        return NextResponse.json({ message: error.message }, { status: 404 });
    }
    return NextResponse.json({ message: 'Something went wrong!' }, { status: 500 });
  }
}

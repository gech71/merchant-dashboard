
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
    const { ADDRESS, RESULTURL, USERNAME, PASSWORD } = body;

    if (!ADDRESS || !RESULTURL || !USERNAME) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }
    
    const [_, updatedSetting] = await prisma.$transaction(async (tx) => {
        const oldValue = await tx.ussd_push_settings.findUnique({
            where: { ID: id },
        });

        if (!oldValue) {
            throw new Error('Setting not found');
        }

        const dataToUpdate: any = {
            ADDRESS,
            RESULTURL,
            USERNAME,
            UPDATEDATE: new Date(),
            UPDATEUSER: user.name,
        };

        if (PASSWORD) {
            dataToUpdate.PASSWORD = PASSWORD;
        }

        const updatedSetting = await tx.ussd_push_settings.update({
          where: { ID: id },
          data: dataToUpdate,
        });

        await tx.auditLog.create({
            data: {
                tableName: 'ussd_push_settings',
                recordId: id,
                action: 'UPDATE',
                oldValue,
                newValue: updatedSetting,
                changedBy: user.userId,
            }
        });

        return [oldValue, updatedSetting];
    });
    
    const serializableSetting = {
        ...updatedSetting,
        INSERTDATE: updatedSetting.INSERTDATE?.toISOString() ?? null,
        UPDATEDATE: updatedSetting.UPDATEDATE?.toISOString() ?? null,
    };

    return NextResponse.json(serializableSetting, { status: 200 });
  } catch (error) {
    console.error(`Error updating USSD push setting ${params.id}:`, error);
    if (error instanceof Error && error.message === 'Setting not found') {
        return NextResponse.json({ message: error.message }, { status: 404 });
    }
    return NextResponse.json({ message: 'Something went wrong!' }, { status: 500 });
  }
}

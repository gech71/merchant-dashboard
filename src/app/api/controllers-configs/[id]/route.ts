
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
    const { APIKEY } = body;

    if (!APIKEY) {
      return NextResponse.json({ message: 'APIKEY is a required field' }, { status: 400 });
    }
    
    const [_, updatedConfig] = await prisma.$transaction(async (tx) => {
        const oldValue = await tx.controllersconfigs.findUnique({
            where: { ID: id },
        });

        if (!oldValue) {
            throw new Error('Config not found');
        }

        const updatedConfig = await tx.controllersconfigs.update({
          where: { ID: id },
          data: {
            APIKEY,
            UPDATEDATE: new Date(),
            UPDATEUSER: user.name,
          },
        });

        await tx.auditLog.create({
            data: {
                tableName: 'controllersconfigs',
                recordId: id,
                action: 'UPDATE',
                oldValue,
                newValue: updatedConfig,
                changedBy: user.userId,
            }
        });

        return [oldValue, updatedConfig];
    });
    
    const serializableConfig = {
        ...updatedConfig,
        INSERTDATE: updatedConfig.INSERTDATE?.toISOString() ?? null,
        UPDATEDATE: updatedConfig.UPDATEDATE?.toISOString() ?? null,
    };

    return NextResponse.json(serializableConfig, { status: 200 });
  } catch (error) {
    console.error(`Error updating Controllers Config setting ${params.id}:`, error);
     if (error instanceof Error && error.message === 'Config not found') {
        return NextResponse.json({ message: error.message }, { status: 404 });
    }
    return NextResponse.json({ message: 'Something went wrong!' }, { status: 500 });
  }
}

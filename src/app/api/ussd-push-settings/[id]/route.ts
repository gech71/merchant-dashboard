'use server';

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { ADDRESS, RESULTURL, USERNAME, PASSWORD } = body;

    if (!ADDRESS || !RESULTURL || !USERNAME) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }
    
    const dataToUpdate: any = {
        ADDRESS,
        RESULTURL,
        USERNAME,
        UPDATEDATE: new Date(),
    };

    if (PASSWORD) {
        dataToUpdate.PASSWORD = PASSWORD;
    }

    const updatedSetting = await prisma.ussd_push_settings.update({
      where: { ID: id },
      data: dataToUpdate,
    });
    
    const serializableSetting = {
        ...updatedSetting,
        INSERTDATE: updatedSetting.INSERTDATE?.toISOString() ?? null,
        UPDATEDATE: updatedSetting.UPDATEDATE?.toISOString() ?? null,
    };

    return NextResponse.json(serializableSetting, { status: 200 });
  } catch (error) {
    console.error(`Error updating USSD push setting ${params.id}:`, error);
    return NextResponse.json({ message: 'Something went wrong!' }, { status: 500 });
  }
}

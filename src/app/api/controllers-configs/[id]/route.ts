
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
    const { APIKEY } = body;

    if (!APIKEY) {
      return NextResponse.json({ message: 'APIKEY is a required field' }, { status: 400 });
    }
    
    const updatedConfig = await prisma.controllersconfigs.update({
      where: { ID: id },
      data: {
        APIKEY,
        UPDATEDATE: new Date(),
      },
    });
    
    const serializableConfig = {
        ...updatedConfig,
        INSERTDATE: updatedConfig.INSERTDATE?.toISOString() ?? null,
        UPDATEDATE: updatedConfig.UPDATEDATE?.toISOString() ?? null,
    };

    return NextResponse.json(serializableConfig, { status: 200 });
  } catch (error) {
    console.error(`Error updating Controllers Config setting ${params.id}:`, error);
    return NextResponse.json({ message: 'Something went wrong!' }, { status: 500 });
  }
}

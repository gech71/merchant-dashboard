
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

    const updatedEndpoint = await prisma.arifpay_endpoints.update({
      where: { ID: id },
      data: {
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
        UPDATEDATE: new Date(),
      },
    });

    const serializableEndpoint = {
      ...updatedEndpoint,
      INSERTDATE: updatedEndpoint.INSERTDATE?.toISOString() ?? null,
      UPDATEDATE: updatedEndpoint.UPDATEDATE?.toISOString() ?? null,
    };

    return NextResponse.json(serializableEndpoint, { status: 200 });
  } catch (error) {
    console.error(`Error updating ArifPay endpoint ${params.id}:`, error);
    return NextResponse.json({ message: 'Something went wrong!' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await prisma.arifpay_endpoints.delete({
      where: { ID: id },
    });
    return NextResponse.json({ message: 'Endpoint deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Error deleting ArifPay endpoint ${params.id}:`, error);
    return NextResponse.json({ message: 'Something went wrong!' }, { status: 500 });
  }
}

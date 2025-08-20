
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
    
    const [oldValue, updatedEndpoint] = await prisma.$transaction(async (tx) => {
      const oldValue = await tx.arifpay_endpoints.findUnique({
        where: { ID: id },
      });

      if (!oldValue) {
        throw new Error('Endpoint not found');
      }

      const updatedEndpoint = await tx.arifpay_endpoints.update({
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
          UPDATEUSER: user.name,
        },
      });

      await tx.auditLog.create({
        data: {
          tableName: 'arifpay_endpoints',
          recordId: id,
          action: 'UPDATE',
          oldValue: oldValue,
          newValue: updatedEndpoint,
          changedBy: user.userId,
        },
      });

      return [oldValue, updatedEndpoint];
    });


    const serializableEndpoint = {
      ...updatedEndpoint,
      INSERTDATE: updatedEndpoint.INSERTDATE?.toISOString() ?? null,
      UPDATEDATE: updatedEndpoint.UPDATEDATE?.toISOString() ?? null,
    };

    return NextResponse.json(serializableEndpoint, { status: 200 });
  } catch (error) {
    console.error(`Error updating ArifPay endpoint ${params.id}:`, error);
    if (error instanceof Error && error.message === 'Endpoint not found') {
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

    await prisma.$transaction(async (tx) => {
      const oldValue = await tx.arifpay_endpoints.findUnique({
        where: { ID: id },
      });

      if (!oldValue) {
        throw new Error('Endpoint not found');
      }

      await tx.arifpay_endpoints.delete({
        where: { ID: id },
      });

      await tx.auditLog.create({
        data: {
          tableName: 'arifpay_endpoints',
          recordId: id,
          action: 'DELETE',
          oldValue: oldValue,
          changedBy: user.userId,
        },
      });
    });

    return NextResponse.json({ message: 'Endpoint deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Error deleting ArifPay endpoint ${params.id}:`, error);
    if (error instanceof Error && error.message === 'Endpoint not found') {
        return NextResponse.json({ message: error.message }, { status: 404 });
    }
    return NextResponse.json({ message: 'Something went wrong!' }, { status: 500 });
  }
}

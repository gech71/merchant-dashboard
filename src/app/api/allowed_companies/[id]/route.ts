
'use server';

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { APPROVED, STATUS } = body;

    if (typeof APPROVED !== 'boolean' || !STATUS) {
        return NextResponse.json({ message: 'Missing required approval fields' }, { status: 400 });
    }

    const updatedCompany = await prisma.allowed_companies.update({
      where: { Oid: id },
      data: {
        APPROVED,
        STATUS,
        APPROVEUSER: user.name,
        UPDATEDATE: new Date(),
        UPDATEUSER: user.name,
      },
    });

    const updatedCompanySerializable = {
        ...updatedCompany,
        INSERTDATE: updatedCompany.INSERTDATE?.toISOString() ?? null,
        UPDATEDATE: updatedCompany.UPDATEDATE?.toISOString() ?? null,
    };

    return NextResponse.json(updatedCompanySerializable, { status: 200 });
  } catch (error) {
    console.error(`Error updating company ${params.id}:`, error);
    return NextResponse.json({ message: 'Something went wrong!' }, { status: 500 });
  }
}

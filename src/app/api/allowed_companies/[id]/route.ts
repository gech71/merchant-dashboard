
'use server';

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;
    const user = await getCurrentUser(token);

    if (!user) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }
    
    const { id } = context.params;

    const body = await request.json();
    const { APPROVED, STATUS, FIELDNAME, ACCOUNTNUMBER } = body;

    // This handles the case where we are just updating the approval status
    if (typeof APPROVED === 'boolean' && typeof STATUS === 'boolean' && !FIELDNAME && !ACCOUNTNUMBER) {
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
    }

    // This handles the case where we are editing the company details
    if (FIELDNAME && ACCOUNTNUMBER) {
         const updatedCompany = await prisma.allowed_companies.update({
            where: { Oid: id },
            data: {
                FIELDNAME,
                ACCOUNTNUMBER,
                APPROVED: false, // Reset approval status on edit
                STATUS: false,
                APPROVEUSER: null, // Clear approver
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
    }


    return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });

  } catch (error) {
    console.error(`Error updating company:`, error);
    return NextResponse.json({ message: 'Something went wrong!' }, { status: 500 });
  }
}

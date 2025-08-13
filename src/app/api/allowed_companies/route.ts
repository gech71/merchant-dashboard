
'use server';

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;
    const user = await getCurrentUser(token);
    if (!user) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { FIELDNAME, ACCOUNTNUMBER } = body;

    if (!FIELDNAME || !ACCOUNTNUMBER) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const companies = await prisma.allowed_companies.findMany({
        select: { ID: true }
    });

    const newIdNumber = Math.max(...companies.map(c => parseInt(c.ID.replace('C', ''), 10)), 0) + 1;
    const newId = `C${newIdNumber.toString().padStart(3, '0')}`;
    const newOid = `oid_${newId}`;
    
    // If the user is a branch user, associate the company with their branch
    const branchName = user.userType === 'branch' ? user.branch : null;

    const newCompany = await prisma.allowed_companies.create({
      data: {
        Oid: newOid,
        ID: newId,
        ACCOUNTNUMBER,
        FIELDNAME,
        APPROVEUSER: null,
        APPROVED: false,
        STATUS: false, // Default to inactive
        INSERTUSER: user.name,
        UPDATEUSER: user.name,
        OptimisticLockField: 0,
        GCRecord: 0,
        branchName: branchName,
      },
    });

    const newCompanySerializable = {
        ...newCompany,
        INSERTDATE: newCompany.INSERTDATE?.toISOString() ?? null,
        UPDATEDATE: newCompany.UPDATEDATE?.toISOString() ?? null,
    };

    return NextResponse.json(newCompanySerializable, { status: 201 });
  } catch (error) {
    console.error('Error creating company:', error);
    return NextResponse.json({ message: 'Something went wrong!' }, { status: 500 });
  }
}

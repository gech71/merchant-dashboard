
'use server';

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { cookies } from 'next/headers';
import { randomUUID } from 'crypto';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;
    const user = await getCurrentUser(token);
    if (!user) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const {
      ADDTITLE,
      ADDSUBTITLE,
      ADDADDRESS,
      IMAGEADDRESS,
      ORDER,
    } = body;
    
    if (!ADDTITLE || !ADDSUBTITLE || !ADDADDRESS || !IMAGEADDRESS || ORDER === undefined) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newAd = await prisma.promo_adds.create({
      data: {
        ID: randomUUID(),
        ADDTITLE,
        ADDSUBTITLE,
        ADDADDRESS,
        IMAGEADDRESS,
        ORDER,
        INSERTUSERID: user.name,
        UPDATEUSERID: user.name,
      },
    });

    const newAdSerializable = {
        ...newAd,
        INSERTDATE: newAd.INSERTDATE?.toISOString() ?? null,
        UPDATEDATE: newAd.UPDATEDATE?.toISOString() ?? null,
    };

    return NextResponse.json(newAdSerializable, { status: 201 });
  } catch (error) {
    console.error('Error creating promo ad:', error);
    return NextResponse.json({ message: 'Something went wrong!' }, { status: 500 });
  }
}

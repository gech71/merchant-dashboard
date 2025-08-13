
'use server';

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, roleId, userType } = body;

    if (!userId || !roleId || !userType) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    let updatedUser;
    if (userType === 'merchant') {
      updatedUser = await prisma.merchant_users.update({
        where: { ID: userId },
        data: { roleId },
        include: { role: true },
      });
    } else if (userType === 'branch') {
      updatedUser = await prisma.branchUser.update({
        where: { id: parseInt(userId, 10) },
        data: { roleId },
        include: { role: true },
      });
    } else {
      return NextResponse.json({ message: 'Invalid user type' }, { status: 400 });
    }
    
    const { password, ...userWithoutPassword } = (updatedUser as any);


    return NextResponse.json(userWithoutPassword, { status: 200 });
  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json({ message: 'Something went wrong!' }, { status: 500 });
  }
}


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
      updatedUser = await prisma.Merchant_users.update({
        where: { ID: userId },
        data: { roleId },
        include: { DashBoardRoles: true },
      });
    } else if (userType === 'branch') {
      updatedUser = await prisma.BranchUser.update({
        where: { id: userId },
        data: { roleId },
        include: { DashBoardRoles: true },
      });
    } else {
      return NextResponse.json({ message: 'Invalid user type' }, { status: 400 });
    }

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json({ message: 'Something went wrong!' }, { status: 500 });
  }
}

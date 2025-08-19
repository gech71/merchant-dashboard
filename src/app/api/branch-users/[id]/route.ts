
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
    const { name, email, password, status } = body;

    const dataToUpdate: any = {};
    if (name) dataToUpdate.name = name;
    if (email) dataToUpdate.email = email;
    if (password) dataToUpdate.password = password; // In a real app, hash this
    if (status) dataToUpdate.status = status;


    if (Object.keys(dataToUpdate).length === 0) {
        return NextResponse.json({ message: 'No fields to update' }, { status: 400 });
    }

    const updatedUser = await prisma.systemUser.update({
      where: { id: id },
      data: dataToUpdate,
      include: {
        role: true,
      }
    });

    const userSerializable = {
        ...updatedUser,
        createdAt: updatedUser.createdAt.toISOString(),
        updatedAt: updatedUser.updatedAt.toISOString(),
    };

    return NextResponse.json(userSerializable, { status: 200 });
  } catch (error) {
    console.error(`Error updating system user ${params.id}:`, error);
    return NextResponse.json({ message: 'Something went wrong!' }, { status: 500 });
  }
}

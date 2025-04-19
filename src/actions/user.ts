'use server';

import { client } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export const onAuthenticateUser = async () => {
  try {
    const user = await currentUser();
    
    // Clerk kullanıcı kontrolü
    if (!user) {
      console.log('🔴 Clerk user not found');
      return { status: 403, error: 'Unauthorized' };
    }

    // E-posta adresi kontrolü
    const email = user.emailAddresses[0]?.emailAddress;
    if (!email) {
      console.log('🔴 Email not found');
      return { status: 400, error: 'Email required' };
    }

    // Mevcut kullanıcıyı bul
    const userExist = await client.user.findUnique({
      where: { clerkId: user.id },
      include: { PurchasedProjects: { select: { id: true } } }
    });

    if (userExist) {
      console.log('🟢 Existing user:', userExist.id);
      return { status: 200, user: userExist };
    }

    // Yeni kullanıcı oluştur
    const newUser = await client.user.create({
      data: {
        clerkId: user.id,
        email: email,
        name: `${user.firstName} ${user.lastName}`.trim(),
        profileImage: user.imageUrl,
      },
    });

    console.log('🟡 New user created:', newUser.id);
    return { status: 201, user: newUser };

  } catch (error) {
    console.log('🔴 ERROR:', error);
    return { status: 500, error: 'Internal Server Error' };
  }
};
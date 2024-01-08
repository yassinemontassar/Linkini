'use server';

import { redirect } from "next/navigation";
import prisma from "/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";




export default async function grabUsername(formData) {
  const username=  formData.get('username');
  const verify = await prisma.page.findUnique({
    where: {
        uri: username
    }
  })
  if (verify) {
    return false
  } else {
    const session = await getServerSession(authOptions);
  await prisma.page.create({
    data: {
        uri: username,
        owner: session?.user?.email,
    }
  })
}
}
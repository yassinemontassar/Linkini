"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import prisma from "../../lib/db";

export async function savePageSettings(formData) {
  const session = await getServerSession(authOptions);
  if (session) {
    const dataKeys = ['displayName', 'location', 'bio', 'bgType', 'bgColor', 'bgImage'];
   
    const dataToUpdate = {};
    for (const key of dataKeys) {
      if(formData.has(key)) {
        dataToUpdate[key] = formData.get(key);
      }
    }
    
    await prisma.page.update({
      where: {
        owner: session.user.email,
      },
      data: {
        // Include the fields directly within the data object
        displayName: dataToUpdate.displayName,
        location: dataToUpdate.location,
        bio: dataToUpdate.bio,
        bgType: dataToUpdate.bgType,
        bgColor: dataToUpdate.bgColor,
        bgImage: dataToUpdate.bgImage,
      },
    });

    if (formData.has('avatar')) {
      const avatarLink = formData.get('avatar');
      await prisma.user.update({
        where: {
          email: session.user?.email
        }, 
        data: {
          image: avatarLink
        }
      })
    }

    return true;
  }
  return false;
}

export async function savePageButtons(formData) {
  const session = await getServerSession(authOptions);
  if (session) {
    const buttonsValues = {};
    formData.forEach((value, key) => {
      buttonsValues[key.toString()] = value;
    });
    const dataToUpdate = { buttons: buttonsValues };
    console.log(dataToUpdate.buttons)
    try {
     await prisma.page.update({
        where: {
          owner: session.user.email,
        },
        data: {
          buttons: 
            dataToUpdate.buttons,
          
        },
      });
      console.log('Settings saved successfully!');
      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      return false;
    }
  }
  return false;
}

export async function savePageLinks(links) {
  const session = await getServerSession(authOptions);
  if (session) {
    try {
     await prisma.page.update({
        where: {
          owner: session.user.email,
        },
        data: {
          links: 
            links,
          
        },
      });
      console.log('Links saved successfully!');
      return true;
    } catch (error) {
      console.error('Error saving Links:', error);
      return false;
    }
  }
  return false;
}

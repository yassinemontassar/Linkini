import prisma from "../../../../lib/db";

export async function POST(req) {
    const url = new URL(req.url);
    const clickedLink = atob(url.searchParams.get('url'));
    const page = url.searchParams.get('page');
    await prisma.event.create({
        data: {
        type: 'click',
        page: page,
        uri: clickedLink,    
        },
      })
    return Response.json(true);
  }
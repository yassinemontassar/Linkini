import { writeFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import uniqid from 'uniqid';

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get('file');

  if (!file) {
    return NextResponse.json({ success: false });
  }

  // Generate a unique ID for the file
  const uniqueID = uniqid();

  const chunks = [];
  for await (const chunk of file.stream()) {
    chunks.push(chunk);
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Update the path to include the unique ID in the file name
  const path = `public/uploads/${uniqueID}-${file.name}`;
  await writeFile(path, Buffer.concat(chunks));

  console.log(`Open http://localhost:3000/uploads/${uniqueID}-${file.name} to see the uploaded file`);

  // Update the link variable to include the unique ID
  const link = `/uploads/${uniqueID}-${file.name}`;
  return NextResponse.json(link);
}

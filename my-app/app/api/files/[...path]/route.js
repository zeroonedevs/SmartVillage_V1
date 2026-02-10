import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    console.log('Proxy Params:', resolvedParams); 
    const { path } = resolvedParams;
    
    if (!path) {
        console.error('Path is undefined in params');
        return new NextResponse('Invalid Path', { status: 400 });
    }
    
    const key = path.join('/');

    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
    });

    const response = await s3Client.send(command);

    // Convert the stream to a Web Response
    return new NextResponse(response.Body.transformToWebStream(), {
      headers: {
        'Content-Type': response.ContentType || 'application/octet-stream',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('File proxy error:', error);
    return new NextResponse('File not found', { status: 404 });
  }
}

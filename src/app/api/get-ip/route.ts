import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Get IP from standard headers used by Vercel and other reverse proxies
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  let ip = 'Unknown IP';
  
  if (forwardedFor) {
    ip = forwardedFor.split(',')[0].trim();
  } else if (realIp) {
    ip = realIp.trim();
  }
  
  return NextResponse.json({ ip });
}

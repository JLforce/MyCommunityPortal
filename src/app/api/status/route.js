import { NextResponse } from 'next/server';

// Simple demo status endpoint. Replace with your real status check.
export async function GET() {
  try {
    const now = new Date().toISOString();
    // For demo purposes we return a stable 'ok' status. Production may call an upstream health endpoint.
    const payload = { status: 'ok', checked: now };
    return NextResponse.json(payload, { status: 200 });
  } catch (err) {
    return NextResponse.json({ status: 'offline', checked: new Date().toISOString() }, { status: 500 });
  }
}

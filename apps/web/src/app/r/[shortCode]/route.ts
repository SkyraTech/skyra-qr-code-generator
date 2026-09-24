import { NextResponse, NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { shortCode: string } }
) {
  const { shortCode } = params;

  // The backend API base URL for server-side fetching
  const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3001';

  try {
    const res = await fetch(`${apiBaseUrl}/api/v1/public/qr-codes/${shortCode}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      // Do not cache this request, as dynamic QR destinations might change
      cache: 'no-store',
    });

    if (!res.ok) {
      // Return a standard 404 response to avoid exposing detailed errors to scanners
      return new NextResponse('QR Code not found or inactive', { status: 404 });
    }

    const json = await res.json();
    const targetUrl = json?.data?.targetUrl;

    if (!targetUrl) {
      return new NextResponse('QR Code destination is missing', { status: 404 });
    }

    // Redirect with HTTP 302
    return NextResponse.redirect(targetUrl, 302);
  } catch (error) {
    console.error('Failed to resolve QR code:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserShopId } from '@/lib/auth-server';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export const dynamic = 'force-dynamic';

function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFKD') // Separate accent marks
    .replace(/[\u0300-\u036f]/g, '') // Remove accent marks
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    console.log('[Create Product API] Token exists:', !!token);

    if (!token) {
      console.log('[Create Product API] No token found in cookies');
      return NextResponse.json({ error: 'Unauthorized - Please log in again' }, { status: 401 });
    }

    // Get user's shop ID
    const shopId = await getUserShopId(token);

    if (!shopId) {
      return NextResponse.json({ error: 'No shop found for user' }, { status: 400 });
    }

    // Get FormData from request
    const formData = await request.formData();

    // Parse the data JSON
    const dataStr = formData.get('data') as string;
    if (!dataStr) {
      return NextResponse.json({ error: 'Missing product data' }, { status: 400 });
    }

    const data = JSON.parse(dataStr);

    if (!data.name || typeof data.name !== 'string') {
      return NextResponse.json({ error: 'Product name is required' }, { status: 400 });
    }

    data.slug = data.slug || slugify(data.name) || `product-${Date.now()}`;

    // Add shop ID to data
    data.shop = shopId;

    console.log('[Create Product API] Sending to Strapi:', {
      shopId,
      dataKeys: Object.keys(data),
      hasImages: formData.getAll('files.images').length > 0
    });

    // Create new FormData for Strapi
    const strapiFormData = new FormData();
    strapiFormData.append('data', JSON.stringify(data));

    // Transfer image files
    const imageFiles = formData.getAll('files.images');
    imageFiles.forEach((file) => {
      strapiFormData.append('files.images', file);
    });

    // Send to Strapi
    const response = await fetch(`${STRAPI_URL}/api/products`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: strapiFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Create Product API] Strapi error response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });

      let error;
      try {
        error = JSON.parse(errorText);
      } catch (e) {
        error = { error: { message: errorText || 'Failed to create product' } };
      }

      return NextResponse.json(
        { error: error.error?.message || 'Failed to create product' },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

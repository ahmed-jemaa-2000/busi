import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserShopId } from '@/lib/auth';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export async function POST(request: NextRequest) {
  try {
    const token = cookies().get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

    // Add shop ID to data
    data.shop = shopId;

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
      const error = await response.json();
      console.error('Strapi error:', error);
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

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserShopId } from '@/lib/auth-server';
import { getOrdersByShop } from '@/lib/strapi';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const shopId = await getUserShopId(token);

    if (!shopId) {
      return NextResponse.json({ error: 'No shop found' }, { status: 400 });
    }

    const orders = await getOrdersByShop(shopId, token);

    return NextResponse.json(orders);
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

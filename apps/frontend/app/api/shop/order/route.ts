import { NextResponse } from 'next/server';
import { getStrapiURL } from '@/lib/strapi';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { customerName, customerPhone, customerAddress, items, shopId } = body;

        // Basic validation
        if (!customerName || !customerPhone || !items || items.length === 0 || !shopId) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // transform items to match Strapi component structure if needed
        // Based on schema: items is a component "order.order-item"
        // It expects: product (relation), quantity, unitPrice, totalPrice, size, color

        const orderData = {
            data: {
                customerName,
                customerPhone,
                customerAddress,
                items: items.map((item: any) => ({
                    product: item.productId,
                    quantity: item.quantity,
                    unitPrice: item.price,
                    totalPrice: item.price * item.quantity,
                    size: item.size,
                    color: item.color,
                })),
                shop: shopId,
                status: 'pending',
                paymentMethod: 'cod', // Default to Cash on Delivery for WhatsApp orders
                notes: 'Order via WhatsApp',
                publishedAt: new Date().toISOString(), // Publish immediately
            },
        };

        // We need to use a token that has permission to create orders.
        // Since this is a public storefront, we might need a specific API token or use a public role.
        // For now, I'll assume we can use the backend internal API or a configured public permission.
        // If we need an API token, we should use process.env.STRAPI_API_TOKEN

        const token = process.env.STRAPI_API_TOKEN;

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const res = await fetch(`${getStrapiURL()}/api/orders`, {
            method: 'POST',
            headers,
            body: JSON.stringify(orderData),
        });

        const data = await res.json();

        if (!res.ok) {
            console.error('Strapi Order Create Error:', data);
            return NextResponse.json(
                { error: data.error?.message || 'Failed to create order' },
                { status: res.status }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Order API Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

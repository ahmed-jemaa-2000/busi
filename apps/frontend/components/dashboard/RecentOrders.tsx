import { Order } from '@busi/types';
import Link from 'next/link';

interface RecentOrdersProps {
    orders: Order[];
}

export default function RecentOrders({ orders }: RecentOrdersProps) {
    if (orders.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">🛍️</span>
                </div>
                <h3 className="text-gray-900 font-medium mb-1">No orders yet</h3>
                <p className="text-gray-500 text-sm">
                    When you receive orders, they will appear here.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Recent Orders</h2>
                <Link
                    href="/dashboard/orders"
                    className="text-sm text-primary hover:text-primary/80 font-medium hover:underline"
                >
                    View all
                </Link>
            </div>
            <div className="divide-y divide-gray-100">
                {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-medium text-sm">
                                #{order.id}
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">
                                    {order.customerName || 'Guest Customer'}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-medium text-gray-900">
                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'TND' }).format(order.total)}
                            </p>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize
                ${order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                            'bg-gray-100 text-gray-800'}`}
                            >
                                {order.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

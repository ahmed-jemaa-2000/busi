'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { deleteProduct } from '@/lib/strapi';

interface ProductListActionsProps {
  productId: number;
}

export default function ProductListActions({ productId }: ProductListActionsProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      // Get token from cookie (will be sent automatically)
      const response = await fetch('/api/dashboard/products/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product');
    }
  };

  return (
    <div className="flex items-center justify-end space-x-2">
      <Link
        href={`/dashboard/products/${productId}/edit`}
        className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition"
      >
        Edit
      </Link>
      <button
        onClick={handleDelete}
        className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition"
      >
        Delete
      </button>
    </div>
  );
}

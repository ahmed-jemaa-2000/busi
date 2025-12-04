'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import type { Product, Shop } from '@busi/types';
import { generateWhatsAppUrl } from '@/lib/whatsapp';
import { Loader2 } from 'lucide-react';

interface WhatsAppButtonProps {
  product: Product;
  shop: Shop;
}

export default function WhatsAppButton({ product, shop }: WhatsAppButtonProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });

  const handleOrderClick = () => {
    if (!shop.whatsappNumber) {
      toast.error('WhatsApp number not configured for this shop');
      return;
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Create Order in Backend
      const response = await fetch('/api/shop/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: formData.name,
          customerPhone: formData.phone,
          customerAddress: formData.address,
          shopId: shop.id,
          items: [
            {
              productId: product.id,
              quantity: 1,
              price: product.price,
              size: selectedSize,
              color: selectedColor,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      // 2. Generate WhatsApp URL and Redirect
      const url = generateWhatsAppUrl({
        phone: shop.whatsappNumber!,
        productName: product.name,
        price: product.price,
        shopName: shop.name,
        size: selectedSize,
        color: selectedColor,
      });

      window.open(url, '_blank');
      setIsModalOpen(false);
      toast.success('Order started! Opening WhatsApp...');

      // Reset form
      setFormData({ name: '', phone: '', address: '' });

    } catch (error) {
      console.error('Order Error:', error);
      toast.error('Something went wrong, but you can still order via WhatsApp.');

      // Fallback: Open WhatsApp anyway so we don't lose the sale
      const url = generateWhatsAppUrl({
        phone: shop.whatsappNumber!,
        productName: product.name,
        price: product.price,
        shopName: shop.name,
        size: selectedSize,
        color: selectedColor,
      });
      window.open(url, '_blank');
      setIsModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const hasVariants = (product.sizes && product.sizes.length > 0) ||
    (product.colors && product.colors.length > 0);

  return (
    <div className="space-y-4">
      {/* Size Selection */}
      {product.sizes && product.sizes.length > 0 && (
        <div>
          <label className="block font-semibold mb-2">Select Size:</label>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 border-2 rounded transition ${selectedSize === size
                    ? 'border-primary bg-primary text-white'
                    : 'border-gray-300 hover:border-primary'
                  }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Color Selection */}
      {product.colors && product.colors.length > 0 && (
        <div>
          <label className="block font-semibold mb-2">Select Color:</label>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`px-4 py-2 border-2 rounded transition ${selectedColor === color
                    ? 'border-primary bg-primary text-white'
                    : 'border-gray-300 hover:border-primary'
                  }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* WhatsApp Button */}
      <button
        onClick={handleOrderClick}
        disabled={
          hasVariants &&
          (!selectedSize && product.sizes && product.sizes.length > 0) &&
          (!selectedColor && product.colors && product.colors.length > 0)
        }
        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg flex items-center justify-center space-x-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        <span>Order via WhatsApp</span>
      </button>

      {hasVariants && (
        <p className="text-sm text-gray-500 text-center">
          Please select your preferred options above before ordering
        </p>
      )}

      {/* Order Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold mb-4">Complete your Order</h3>
            <p className="text-gray-600 mb-6 text-sm">
              Please enter your details so we can prepare your order before redirecting you to WhatsApp.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  placeholder="e.g. Ahmed Jemaa"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  placeholder="e.g. 20 123 456"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address (Optional)</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  placeholder="Delivery address..."
                  rows={2}
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Confirm & Chat'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

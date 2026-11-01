import React, { useState } from 'react';
import { X, Search, Package, Truck, CheckCircle, Clock, MapPin, Sparkles, AlertCircle } from 'lucide-react';
import { OrderConfirmation } from '../types';

interface TrackOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TrackOrderModal: React.FC<TrackOrderModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('AUR-829104');
  const [order, setOrder] = useState<OrderConfirmation | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/orders/track/${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      if (data.found && data.order) {
        setOrder(data.order);
      } else {
        setOrder(null);
        setErrorMsg(data.message || 'No order found matching your inquiry.');
      }
    } catch {
      setErrorMsg('Network error checking order status.');
    } finally {
      setLoading(false);
    }
  };

  // Initial lookup if default query is present and modal is open
  React.useEffect(() => {
    if (isOpen && query && !order) {
      handleSearch();
    }
  }, [isOpen]);

  const getStepProgress = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 1;
      case 'handcrafting':
        return 2;
      case 'dispatched':
        return 3;
      case 'delivered':
        return 4;
      default:
        return 2;
    }
  };

  const currentStep = order ? getStepProgress(order.status) : 1;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div
        className="relative bg-[#faf8f5] w-full max-w-2xl rounded-3xl shadow-2xl border border-[#e8ded1] overflow-hidden my-6 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#f5efe6] border-b border-[#e8ded1] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#241e1b] text-white rounded-xl">
              <Truck className="w-5 h-5 text-[#e0a96d]" />
            </div>
            <div>
              <h3 className="font-serif text-2xl text-[#241e1b]">Track Atelier Delivery</h3>
              <p className="text-xs text-[#6e5d4e]">Live progress from jeweler's anvil to your doorstep</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#eae0d2] text-[#4a3f35] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Search Input */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="Enter Order ID (e.g. AUR-829104) or FedEx Tracking #"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-white border border-[#d8c8b4] rounded-xl px-3.5 py-2.5 text-xs text-[#241e1b] focus:outline-none focus:border-[#241e1b]"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-[#241e1b] hover:bg-[#a0683a] text-white font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>{loading ? 'Searching...' : 'Track'}</span>
            </button>
          </form>

          {errorMsg && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Order Found Details */}
          {order && (
            <div className="space-y-6">
              {/* Reference & Arrival Banner */}
              <div className="p-4 bg-white rounded-2xl border border-[#e8ded1] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#8a5d3b]">Order Identified:</span>
                  <p className="font-mono text-lg font-bold text-[#241e1b]">{order.orderId}</p>
                </div>
                <div className="sm:text-right">
                  <span className="text-[10px] uppercase font-bold text-[#8a5d3b]">Estimated Delivery:</span>
                  <p className="font-bold text-emerald-800 text-sm">{order.estimatedDeliveryDate}</p>
                </div>
              </div>

              {/* Visual 4-Stage Progress Line */}
              <div className="p-5 bg-white rounded-2xl border border-[#e8ded1] shadow-sm space-y-4">
                <span className="font-bold text-[#241e1b] block">Live Handcrafting & Delivery Stage:</span>
                
                <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                  {/* Step 1 */}
                  <div
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 ${
                      currentStep >= 1
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                        : 'bg-[#faf8f5] border-[#e8ded1] text-[#8c7866]'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-700" />
                    <span>1. Paid & Queued</span>
                  </div>

                  {/* Step 2 */}
                  <div
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 ${
                      currentStep >= 2
                        ? 'bg-amber-50 border-amber-300 text-amber-900 font-semibold'
                        : 'bg-[#faf8f5] border-[#e8ded1] text-[#8c7866]'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-amber-700" />
                    <span>2. Bench Forging</span>
                  </div>

                  {/* Step 3 */}
                  <div
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 ${
                      currentStep >= 3
                        ? 'bg-blue-50 border-blue-300 text-blue-900 font-semibold'
                        : 'bg-[#faf8f5] border-[#e8ded1] text-[#8c7866]'
                    }`}
                  >
                    <Truck className="w-4 h-4 text-blue-700" />
                    <span>3. In Courier Transit</span>
                  </div>

                  {/* Step 4 */}
                  <div
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 ${
                      currentStep >= 4
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                        : 'bg-[#faf8f5] border-[#e8ded1] text-[#8c7866]'
                    }`}
                  >
                    <Package className="w-4 h-4 text-emerald-700" />
                    <span>4. Delivered</span>
                  </div>
                </div>

                <div className="p-3 bg-[#f5efe6] rounded-xl flex items-center justify-between text-[11px]">
                  <span>FedEx Priority Courier Code:</span>
                  <span className="font-mono font-bold text-[#241e1b]">{order.trackingNumber}</span>
                </div>
              </div>

              {/* Items in Delivery */}
              <div className="bg-white p-4 rounded-2xl border border-[#e8ded1] space-y-2">
                <span className="font-bold text-[#241e1b] block">Handcrafted Jewels in Package:</span>
                <div className="divide-y divide-[#f5efe6]">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-2 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product.images[0]}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-semibold text-[#241e1b]">{item.product.name}</p>
                          <span className="text-[10px] text-[#8c7866]">
                            Qty: {item.quantity} {item.selectedSize ? `• Size: ${item.selectedSize}` : ''}
                          </span>
                        </div>
                      </div>
                      <span className="font-serif font-bold text-[#241e1b]">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Destination */}
              <div className="p-4 bg-white rounded-2xl border border-[#e8ded1] flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#a0683a] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#241e1b] block">Delivery Destination:</span>
                  <p className="text-[#5c4d3f]">
                    {order.shippingAddress.fullName} &bull; {order.shippingAddress.street} {order.shippingAddress.apt}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

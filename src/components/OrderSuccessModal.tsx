import React from 'react';
import { X, CheckCircle, Package, Truck, Printer, Sparkles, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import { OrderConfirmation } from '../types';

interface OrderSuccessModalProps {
  order: OrderConfirmation | null;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div
        className="relative bg-[#faf8f5] w-full max-w-2xl rounded-3xl shadow-2xl border border-[#e8ded1] overflow-hidden my-4 max-h-[94vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#241e1b] to-[#40332a] text-[#f7f2ea] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#e0a96d]/20 border border-[#e0a96d]/40 flex items-center justify-center text-[#e0a96d]">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-[#e0a96d] font-semibold">
                Order Confirmed
              </span>
              <h3 className="font-serif text-2xl font-normal">Welcome to the AURA Atelier</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-xs text-[#5c4d3f]">
          
          {/* Order Identity & Timeline */}
          <div className="bg-white p-5 rounded-2xl border border-[#e8ded1] shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#f0e8dc]">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#8a5d3b]">Order Reference:</span>
                <p className="font-mono text-base font-bold text-[#241e1b]">{order.orderId}</p>
              </div>
              <div className="sm:text-right">
                <span className="text-[10px] uppercase font-bold text-[#8a5d3b]">Expected Arrival:</span>
                <p className="font-semibold text-emerald-800 text-sm">{order.estimatedDeliveryDate}</p>
              </div>
            </div>

            {/* Atelier Craft Timeline */}
            <div>
              <span className="text-[11px] font-bold text-[#241e1b] block mb-2">Live Atelier Progress:</span>
              <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 font-semibold">
                  <CheckCircle className="w-3.5 h-3.5 mx-auto mb-1 text-emerald-700" />
                  <span>Authorized</span>
                </div>
                <div className="p-2 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 font-semibold">
                  <Package className="w-3.5 h-3.5 mx-auto mb-1 text-amber-700 animate-bounce" />
                  <span>Bench Forging</span>
                </div>
                <div className="p-2 rounded-xl bg-[#faf8f5] border border-[#e8ded1] text-[#8c7866]">
                  <Sparkles className="w-3.5 h-3.5 mx-auto mb-1" />
                  <span>Wax-Sealing</span>
                </div>
                <div className="p-2 rounded-xl bg-[#faf8f5] border border-[#e8ded1] text-[#8c7866]">
                  <Truck className="w-3.5 h-3.5 mx-auto mb-1" />
                  <span>Courier Dispatch</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-[#f5efe6] rounded-xl flex items-center justify-between text-[11px]">
              <span>FedEx Priority Tracking ID:</span>
              <span className="font-mono font-bold text-[#241e1b]">{order.trackingNumber}</span>
            </div>
          </div>

          {/* Delivery & Items Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Delivery address */}
            <div className="bg-white p-4 rounded-2xl border border-[#e8ded1] space-y-1">
              <span className="font-bold text-[#241e1b] flex items-center gap-1.5 mb-1">
                <MapPin className="w-3.5 h-3.5 text-[#a0683a]" />
                <span>Insured Destination:</span>
              </span>
              <p className="font-semibold text-[#241e1b]">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.street} {order.shippingAddress.apt}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
              <p className="text-[10px] text-[#8c7866] mt-1">Method: {order.shippingMethod.name}</p>
            </div>

            {/* Payment Details */}
            <div className="bg-white p-4 rounded-2xl border border-[#e8ded1] space-y-1">
              <span className="font-bold text-[#241e1b] flex items-center gap-1.5 mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Payment Summary:</span>
              </span>
              <p className="text-[#241e1b] font-medium">{order.paymentMethod}</p>
              <p>Subtotal: ${order.totals.subtotal.toFixed(2)}</p>
              {order.totals.discount > 0 && (
                <p className="text-emerald-700 font-medium">Discount: -${order.totals.discount.toFixed(2)}</p>
              )}
              <p>Delivery: {order.totals.shipping === 0 ? 'FREE' : `$${order.totals.shipping.toFixed(2)}`}</p>
              <p className="font-serif font-bold text-sm text-[#241e1b] pt-1 border-t border-[#f0e8dc]">
                Total Paid: ${order.totals.total.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Purchased Items List */}
          <div className="bg-white p-4 rounded-2xl border border-[#e8ded1] space-y-2">
            <span className="font-bold text-[#241e1b] block">Handcrafted Jewels Included:</span>
            <div className="divide-y divide-[#f5efe6]">
              {order.items.map((item, i) => (
                <div key={i} className="py-2 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
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

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={handlePrint}
              className="w-full sm:w-auto px-4 py-3 rounded-xl bg-white border border-[#d8c8b4] hover:bg-[#f0e8dc] text-[#241e1b] font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Invoice</span>
            </button>

            <button
              onClick={onClose}
              className="w-full sm:flex-1 py-3 rounded-xl bg-[#241e1b] hover:bg-[#a0683a] text-white font-semibold flex items-center justify-center gap-2 transition-colors shadow-md cursor-pointer"
            >
              <span>Continue Browsing Atelier</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

import { forwardRef } from 'react';
import { CartItem } from './POSCart';

interface POSInvoiceProps {
  invoiceNumber: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  customerName?: string;
  customerPhone?: string;
  paymentMethod: string;
  date: Date;
}

export const POSInvoice = forwardRef<HTMLDivElement, POSInvoiceProps>(
  ({ invoiceNumber, items, subtotal, discount, tax, total, customerName, customerPhone, paymentMethod, date }, ref) => {
    const paymentMethodLabel = {
      cash: 'নগদ',
      card: 'কার্ড',
      mobile: 'মোবাইল ব্যাংকিং',
    }[paymentMethod] || paymentMethod;

    return (
      <div ref={ref} className="p-4 bg-white text-black w-[80mm] text-sm font-mono">
        {/* Header */}
        <div className="text-center border-b border-dashed pb-2 mb-2">
          <h1 className="text-lg font-bold">আপনার দোকানের নাম</h1>
          <p className="text-xs">ঠিকানা: আপনার ঠিকানা</p>
          <p className="text-xs">ফোন: 01XXXXXXXXX</p>
        </div>

        {/* Invoice Info */}
        <div className="border-b border-dashed pb-2 mb-2 text-xs">
          <div className="flex justify-between">
            <span>ইনভয়েস:</span>
            <span>{invoiceNumber}</span>
          </div>
          <div className="flex justify-between">
            <span>তারিখ:</span>
            <span>{date.toLocaleDateString('bn-BD')}</span>
          </div>
          <div className="flex justify-between">
            <span>সময়:</span>
            <span>{date.toLocaleTimeString('bn-BD')}</span>
          </div>
          {customerName && (
            <div className="flex justify-between">
              <span>কাস্টমার:</span>
              <span>{customerName}</span>
            </div>
          )}
          {customerPhone && (
            <div className="flex justify-between">
              <span>ফোন:</span>
              <span>{customerPhone}</span>
            </div>
          )}
        </div>

        {/* Items */}
        <div className="border-b border-dashed pb-2 mb-2">
          <div className="flex justify-between font-bold text-xs mb-1">
            <span>আইটেম</span>
            <span>মোট</span>
          </div>
          {items.map((item, index) => (
            <div key={index} className="text-xs">
              <div className="flex justify-between">
                <span className="flex-1">{item.name}</span>
                <span>৳{item.total_price.toFixed(2)}</span>
              </div>
              <div className="text-[10px] text-gray-600 pl-2">
                {item.quantity} × ৳{item.unit_price.toFixed(2)}
                {item.discount > 0 && ` (-৳${item.discount.toFixed(2)})`}
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span>সাবটোটাল:</span>
            <span>৳{subtotal.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between">
              <span>ডিসকাউন্ট:</span>
              <span>-৳{discount.toFixed(2)}</span>
            </div>
          )}
          {tax > 0 && (
            <div className="flex justify-between">
              <span>ট্যাক্স:</span>
              <span>৳{tax.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-base border-t border-dashed pt-1">
            <span>মোট:</span>
            <span>৳{total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span>পেমেন্ট:</span>
            <span>{paymentMethodLabel}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-4 pt-2 border-t border-dashed text-xs">
          <p>ধন্যবাদ আপনার কেনাকাটার জন্য!</p>
          <p className="text-[10px] text-gray-500 mt-1">
            Powered by Lovable
          </p>
        </div>
      </div>
    );
  }
);

POSInvoice.displayName = 'POSInvoice';

import { forwardRef } from 'react';
import { CartItem } from './POSCart';
import { Store, Phone, MapPin, Mail } from 'lucide-react';

interface CompanyInfo {
  name: string;
  address: string;
  phone: string;
  email?: string;
  logo?: string;
}

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
  companyInfo?: CompanyInfo;
}

// ডিফল্ট কোম্পানি তথ্য - পরে সেটিংস থেকে পরিবর্তন করা যাবে
const defaultCompanyInfo: CompanyInfo = {
  name: 'স্মার্ট স্টোর',
  address: '১২৩, প্রধান সড়ক, গুলশান-২, ঢাকা-১২১২',
  phone: '০১৭১২-৩৪৫৬৭৮',
  email: 'info@smartstore.com.bd',
};

export const POSInvoice = forwardRef<HTMLDivElement, POSInvoiceProps>(
  ({ 
    invoiceNumber, 
    items, 
    subtotal, 
    discount, 
    tax, 
    total, 
    customerName, 
    customerPhone, 
    paymentMethod, 
    date,
    companyInfo = defaultCompanyInfo 
  }, ref) => {
    const paymentMethodLabel = {
      cash: 'নগদ',
      card: 'কার্ড',
      mobile: 'মোবাইল ব্যাংকিং',
    }[paymentMethod] || paymentMethod;

    return (
      <div ref={ref} className="p-4 bg-white text-black w-[80mm] text-sm font-mono">
        {/* Company Header with Logo */}
        <div className="text-center border-b-2 border-gray-800 pb-3 mb-3">
          {/* Logo Placeholder */}
          <div className="flex justify-center mb-2">
            {companyInfo.logo ? (
              <img 
                src={companyInfo.logo} 
                alt={companyInfo.name} 
                className="h-12 w-auto object-contain"
              />
            ) : (
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center border-2 border-gray-300">
                <Store className="w-8 h-8 text-gray-600" />
              </div>
            )}
          </div>
          
          {/* Company Name */}
          <h1 className="text-xl font-bold tracking-wide">{companyInfo.name}</h1>
          
          {/* Company Details */}
          <div className="mt-2 space-y-0.5 text-[10px] text-gray-700">
            <div className="flex items-center justify-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{companyInfo.address}</span>
            </div>
            <div className="flex items-center justify-center gap-1">
              <Phone className="w-3 h-3" />
              <span>{companyInfo.phone}</span>
            </div>
            {companyInfo.email && (
              <div className="flex items-center justify-center gap-1">
                <Mail className="w-3 h-3" />
                <span>{companyInfo.email}</span>
              </div>
            )}
          </div>
        </div>

        {/* Invoice Title */}
        <div className="text-center mb-2">
          <span className="text-xs font-bold bg-gray-800 text-white px-3 py-0.5 rounded">
            বিক্রয় রসিদ
          </span>
        </div>

        {/* Invoice Info */}
        <div className="border border-gray-300 rounded p-2 mb-2 text-xs bg-gray-50">
          <div className="grid grid-cols-2 gap-1">
            <div>
              <span className="text-gray-600">ইনভয়েস নং:</span>
              <span className="font-bold ml-1">{invoiceNumber}</span>
            </div>
            <div className="text-right">
              <span className="text-gray-600">তারিখ:</span>
              <span className="ml-1">{date.toLocaleDateString('bn-BD')}</span>
            </div>
            <div>
              <span className="text-gray-600">সময়:</span>
              <span className="ml-1">{date.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="text-right">
              <span className="text-gray-600">পেমেন্ট:</span>
              <span className="ml-1">{paymentMethodLabel}</span>
            </div>
          </div>
          
          {(customerName || customerPhone) && (
            <div className="mt-2 pt-2 border-t border-gray-300">
              <span className="text-gray-600 font-semibold">কাস্টমার তথ্য:</span>
              <div className="flex justify-between mt-1">
                {customerName && <span>{customerName}</span>}
                {customerPhone && <span>{customerPhone}</span>}
              </div>
            </div>
          )}
        </div>

        {/* Items Table */}
        <div className="mb-2">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b-2 border-gray-800">
                <th className="text-left py-1 font-bold">পণ্য</th>
                <th className="text-center py-1 font-bold w-10">সংখ্যা</th>
                <th className="text-right py-1 font-bold w-16">দাম</th>
                <th className="text-right py-1 font-bold w-16">মোট</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-1">
                    <div className="truncate max-w-[100px]" title={item.name}>
                      {item.name}
                    </div>
                    {item.discount > 0 && (
                      <div className="text-[9px] text-green-700">-৳{item.discount.toFixed(0)} ছাড়</div>
                    )}
                  </td>
                  <td className="text-center py-1">{item.quantity}</td>
                  <td className="text-right py-1">৳{item.unit_price.toFixed(0)}</td>
                  <td className="text-right py-1 font-medium">৳{item.total_price.toFixed(0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="border-t-2 border-gray-800 pt-2 space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-600">সাবটোটাল ({items.length} আইটেম):</span>
            <span>৳{subtotal.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-700">
              <span>ডিসকাউন্ট:</span>
              <span>-৳{discount.toFixed(2)}</span>
            </div>
          )}
          {tax > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">ট্যাক্স/ভ্যাট:</span>
              <span>৳{tax.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg border-t-2 border-b-2 border-gray-800 py-1 mt-1">
            <span>সর্বমোট:</span>
            <span>৳{total.toFixed(2)}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-4 space-y-2">
          <div className="border border-dashed border-gray-400 rounded p-2">
            <p className="font-bold text-xs">🙏 ধন্যবাদ!</p>
            <p className="text-[10px] text-gray-600">আবার আসবেন</p>
          </div>
          
          <div className="text-[9px] text-gray-400 space-y-0.5">
            <p>পণ্য বিনিময় ৭ দিনের মধ্যে সম্ভব</p>
            <p>রসিদ সংরক্ষণ করুন</p>
          </div>
          
          <p className="text-[8px] text-gray-300 mt-2">
            Powered by Smart ERP
          </p>
        </div>
      </div>
    );
  }
);

POSInvoice.displayName = 'POSInvoice';

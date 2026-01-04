import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CreditCard, Banknote, Smartphone } from 'lucide-react';
import { CartItem } from './POSCart';
import { toast } from 'sonner';
import { posPaymentSchema, getFirstErrorMessage } from '@/lib/validations';

interface POSPaymentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  onComplete: (data: {
    customer_name?: string;
    customer_phone?: string;
    payment_method: string;
  }) => void;
  isLoading?: boolean;
}

export const POSPayment = ({
  open,
  onOpenChange,
  items,
  subtotal,
  discount,
  tax,
  total,
  onComplete,
  isLoading,
}: POSPaymentProps) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [receivedAmount, setReceivedAmount] = useState(0);

  const changeAmount = receivedAmount - total;

  const handleComplete = () => {
    // Validate payment data with Zod schema
    const result = posPaymentSchema.safeParse({
      customerName: customerName || undefined,
      customerPhone: customerPhone || undefined,
      paymentMethod,
      receivedAmount,
    });
    
    if (!result.success) {
      toast.error(getFirstErrorMessage(result.error));
      return;
    }
    
    onComplete({
      customer_name: customerName || undefined,
      customer_phone: customerPhone || undefined,
      payment_method: paymentMethod,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>পেমেন্ট সম্পন্ন করুন</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Customer Info */}
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="customer_name">কাস্টমারের নাম (ঐচ্ছিক)</Label>
              <Input
                id="customer_name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="কাস্টমারের নাম..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer_phone">ফোন নম্বর (ঐচ্ছিক)</Label>
              <Input
                id="customer_phone"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="01xxxxxxxxx"
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span>সাবটোটাল ({items.length} আইটেম)</span>
              <span>৳{subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>ডিসকাউন্ট</span>
                <span>-৳{discount.toFixed(2)}</span>
              </div>
            )}
            {tax > 0 && (
              <div className="flex justify-between text-sm">
                <span>ট্যাক্স</span>
                <span>৳{tax.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>মোট</span>
              <span className="text-primary">৳{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label>পেমেন্ট পদ্ধতি</Label>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash" className="flex items-center gap-1 cursor-pointer">
                    <Banknote className="h-4 w-4" />
                    নগদ
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center gap-1 cursor-pointer">
                    <CreditCard className="h-4 w-4" />
                    কার্ড
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mobile" id="mobile" />
                  <Label htmlFor="mobile" className="flex items-center gap-1 cursor-pointer">
                    <Smartphone className="h-4 w-4" />
                    মোবাইল
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Cash Calculation */}
          {paymentMethod === 'cash' && (
            <div className="space-y-3 p-4 border rounded-lg">
              <div className="space-y-2">
                <Label htmlFor="received">প্রাপ্ত টাকা</Label>
                <Input
                  id="received"
                  type="number"
                  value={receivedAmount || ''}
                  onChange={(e) => setReceivedAmount(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
              </div>
              {receivedAmount > 0 && (
                <div className={`flex justify-between font-medium ${changeAmount >= 0 ? 'text-green-600' : 'text-destructive'}`}>
                  <span>ফেরত</span>
                  <span>৳{changeAmount.toFixed(2)}</span>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              বাতিল
            </Button>
            <Button 
              className="flex-1" 
              onClick={handleComplete}
              disabled={isLoading || (paymentMethod === 'cash' && receivedAmount < total)}
            >
              {isLoading ? 'প্রসেসিং...' : 'সম্পন্ন করুন'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

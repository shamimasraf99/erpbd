import { useState, useRef } from 'react';
import { ShoppingCart, Printer, Trash2, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useProducts, Product } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { usePOSSales, CreateSaleData } from '@/hooks/usePOSSales';
import { useCompanySettings } from '@/hooks/useCompanySettings';
import { POSProductGrid } from '@/components/pos/POSProductGrid';
import { POSCart, CartItem } from '@/components/pos/POSCart';
import { POSPayment } from '@/components/pos/POSPayment';
import { POSInvoice } from '@/components/pos/POSInvoice';
import { useReactToPrint } from 'react-to-print';
import { useToast } from '@/hooks/use-toast';

const InventoryPOS = () => {
  const { products } = useProducts();
  const { categories } = useCategories();
  const { createSale, getTodaysTotal } = usePOSSales();
  const { settings: companySettings } = useCompanySettings();
  const { toast } = useToast();
  
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orderDiscount, setOrderDiscount] = useState(0);
  const [orderTax, setOrderTax] = useState(0);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [lastSale, setLastSale] = useState<{
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
  } | null>(null);
  
  const invoiceRef = useRef<HTMLDivElement>(null);
  
  const handlePrint = useReactToPrint({
    contentRef: invoiceRef,
  });

  const subtotal = cartItems.reduce((sum, item) => sum + item.total_price, 0);
  const totalDiscount = orderDiscount + cartItems.reduce((sum, item) => sum + item.discount, 0);
  const total = subtotal - orderDiscount + orderTax;

  const addToCart = (product: Product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      if (existingItem.quantity >= product.stock_quantity) {
        toast({
          title: 'স্টক শেষ',
          description: `${product.name} এর স্টক ${product.stock_quantity} ${product.unit}`,
          variant: 'destructive',
        });
        return;
      }
      updateQuantity(product.id, existingItem.quantity + 1);
    } else {
      const newItem: CartItem = {
        id: product.id,
        name: product.name,
        quantity: 1,
        unit_price: product.selling_price,
        discount: 0,
        total_price: product.selling_price,
      };
      setCartItems([...cartItems, newItem]);
    }
  };

  const updateQuantity = (id: string, quantity: number) => {
    const product = products.find(p => p.id === id);
    if (product && quantity > product.stock_quantity) {
      toast({
        title: 'স্টক শেষ',
        description: `${product.name} এর স্টক ${product.stock_quantity} ${product.unit}`,
        variant: 'destructive',
      });
      return;
    }
    
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? {
              ...item,
              quantity,
              total_price: item.unit_price * quantity - item.discount,
            }
          : item
      )
    );
  };

  const updateDiscount = (id: string, discount: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? {
              ...item,
              discount,
              total_price: item.unit_price * item.quantity - discount,
            }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
    setOrderDiscount(0);
    setOrderTax(0);
  };

  const handlePaymentComplete = async (data: {
    customer_name?: string;
    customer_phone?: string;
    payment_method: string;
  }) => {
    const saleData: CreateSaleData = {
      customer_name: data.customer_name,
      customer_phone: data.customer_phone,
      subtotal,
      discount: totalDiscount,
      tax: orderTax,
      total_amount: total,
      payment_method: data.payment_method,
      items: cartItems.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        discount: item.discount,
        total_price: item.total_price,
      })),
    };

    createSale.mutate(saleData, {
      onSuccess: (sale) => {
        setLastSale({
          invoiceNumber: sale.invoice_number,
          items: [...cartItems],
          subtotal,
          discount: totalDiscount,
          tax: orderTax,
          total,
          customerName: data.customer_name,
          customerPhone: data.customer_phone,
          paymentMethod: data.payment_method,
          date: new Date(),
        });
        setPaymentOpen(false);
        clearCart();
        
        // Auto print after short delay
        setTimeout(() => {
          handlePrint();
        }, 500);
      },
    });
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-4">
      {/* Left Side - Products */}
      <div className="flex-1 flex flex-col bg-background border rounded-lg overflow-hidden">
        <POSProductGrid
          products={products}
          categories={categories}
          onAddToCart={addToCart}
        />
      </div>

      {/* Right Side - Cart */}
      <Card className="w-96 flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              কার্ট
            </span>
            <span className="text-sm font-normal text-muted-foreground">
              আজকের বিক্রয়: ৳{getTodaysTotal().toFixed(2)}
            </span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
          {/* Cart Items */}
          <POSCart
            items={cartItems}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeItem}
            onUpdateDiscount={updateDiscount}
          />

          {/* Cart Footer */}
          <div className="p-4 border-t space-y-3">
            {/* Order Level Discount & Tax */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">অর্ডার ডিসকাউন্ট (৳)</Label>
                <Input
                  type="number"
                  value={orderDiscount || ''}
                  onChange={(e) => setOrderDiscount(parseFloat(e.target.value) || 0)}
                  className="h-8"
                  min="0"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">ট্যাক্স (৳)</Label>
                <Input
                  type="number"
                  value={orderTax || ''}
                  onChange={(e) => setOrderTax(parseFloat(e.target.value) || 0)}
                  className="h-8"
                  min="0"
                />
              </div>
            </div>

            <Separator />

            {/* Totals */}
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>সাবটোটাল</span>
                <span>৳{subtotal.toFixed(2)}</span>
              </div>
              {totalDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>ডিসকাউন্ট</span>
                  <span>-৳{totalDiscount.toFixed(2)}</span>
                </div>
              )}
              {orderTax > 0 && (
                <div className="flex justify-between">
                  <span>ট্যাক্স</span>
                  <span>৳{orderTax.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold">
                <span>মোট</span>
                <span className="text-primary">৳{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={clearCart}
                disabled={cartItems.length === 0}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                ক্লিয়ার
              </Button>
              {lastSale && (
                <Button
                  variant="outline"
                  onClick={() => handlePrint()}
                >
                  <Printer className="h-4 w-4" />
                </Button>
              )}
              <Button
                className="flex-1"
                onClick={() => setPaymentOpen(true)}
                disabled={cartItems.length === 0}
              >
                <Receipt className="h-4 w-4 mr-1" />
                পেমেন্ট
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Dialog */}
      <POSPayment
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
        items={cartItems}
        subtotal={subtotal}
        discount={totalDiscount}
        tax={orderTax}
        total={total}
        onComplete={handlePaymentComplete}
        isLoading={createSale.isPending}
      />

      {/* Hidden Invoice for Printing */}
      <div className="hidden">
        {lastSale && (
          <POSInvoice
            ref={invoiceRef}
            invoiceNumber={lastSale.invoiceNumber}
            items={lastSale.items}
            subtotal={lastSale.subtotal}
            discount={lastSale.discount}
            tax={lastSale.tax}
            total={lastSale.total}
            customerName={lastSale.customerName}
            customerPhone={lastSale.customerPhone}
            paymentMethod={lastSale.paymentMethod}
            date={lastSale.date}
            companyInfo={companySettings ? {
              name: companySettings.name,
              address: companySettings.address || '',
              phone: companySettings.phone || '',
              email: companySettings.email || undefined,
              logo: companySettings.logo_url || undefined,
            } : undefined}
          />
        )}
      </div>
    </div>
  );
};

export default InventoryPOS;

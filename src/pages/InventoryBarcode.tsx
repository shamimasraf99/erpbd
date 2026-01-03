import { useState, useRef } from 'react';
import { Printer, Search, Package, Plus, Minus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useProducts, Product } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useReactToPrint } from 'react-to-print';
import JsBarcode from 'jsbarcode';
import { useEffect } from 'react';

interface PrintItem {
  product: Product;
  quantity: number;
}

const InventoryBarcode = () => {
  const { products } = useProducts();
  const { categories } = useCategories();
  
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [printItems, setPrintItems] = useState<PrintItem[]>([]);
  const [labelSize, setLabelSize] = useState<'small' | 'medium' | 'large'>('medium');
  
  const printRef = useRef<HTMLDivElement>(null);
  
  const handlePrint = useReactToPrint({
    contentRef: printRef,
  });

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.barcode?.toLowerCase().includes(search.toLowerCase()) ||
      product.sku?.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || product.category_id === categoryFilter;
    
    return matchesSearch && matchesCategory && product.status === 'active';
  });

  const addToPrint = (product: Product) => {
    const existing = printItems.find(item => item.product.id === product.id);
    if (existing) {
      setPrintItems(items =>
        items.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setPrintItems([...printItems, { product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromPrint(productId);
      return;
    }
    setPrintItems(items =>
      items.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeFromPrint = (productId: string) => {
    setPrintItems(items => items.filter(item => item.product.id !== productId));
  };

  const clearPrintList = () => {
    setPrintItems([]);
  };

  const totalLabels = printItems.reduce((sum, item) => sum + item.quantity, 0);

  const labelSizes = {
    small: { width: '35mm', height: '22mm', fontSize: '8px', barcodeHeight: 25 },
    medium: { width: '50mm', height: '30mm', fontSize: '10px', barcodeHeight: 35 },
    large: { width: '70mm', height: '40mm', fontSize: '12px', barcodeHeight: 50 },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">বারকোড প্রিন্ট</h1>
          <p className="text-muted-foreground">প্রোডাক্ট বারকোড লেবেল প্রিন্ট করুন</p>
        </div>
        <div className="flex gap-2">
          <Select value={labelSize} onValueChange={(value: 'small' | 'medium' | 'large') => setLabelSize(value)}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="লেবেল সাইজ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">ছোট (35×22mm)</SelectItem>
              <SelectItem value="medium">মাঝারি (50×30mm)</SelectItem>
              <SelectItem value="large">বড় (70×40mm)</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            onClick={() => handlePrint()} 
            disabled={printItems.length === 0}
          >
            <Printer className="h-4 w-4 mr-2" />
            প্রিন্ট ({totalLabels})
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Selection */}
        <Card>
          <CardHeader>
            <CardTitle>প্রোডাক্ট নির্বাচন করুন</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Filters */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="প্রোডাক্ট সার্চ করুন..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="ক্যাটাগরি" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">সব ক্যাটাগরি</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Product List */}
            <ScrollArea className="h-[400px]">
              <div className="space-y-2">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => addToPrint(product)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-muted rounded flex items-center justify-center">
                        <Package className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {product.barcode || product.sku || 'বারকোড নেই'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">৳{product.selling_price}</Badge>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {filteredProducts.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    কোনো প্রোডাক্ট পাওয়া যায়নি
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Print Queue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>প্রিন্ট লিস্ট</CardTitle>
            {printItems.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearPrintList}>
                সব মুছুন
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {printItems.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                প্রিন্ট করতে প্রোডাক্ট যোগ করুন
              </div>
            ) : (
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>প্রোডাক্ট</TableHead>
                      <TableHead className="text-center">সংখ্যা</TableHead>
                      <TableHead className="text-right">অ্যাকশন</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {printItems.map((item) => (
                      <TableRow key={item.product.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.product.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.product.barcode || 'Auto-generate'}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value) || 0)}
                              className="w-14 h-7 text-center"
                              min="1"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => removeFromPrint(item.product.id)}
                          >
                            <X className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="font-medium">মোট লেবেল:</span>
                  <Badge variant="default" className="text-lg">{totalLabels}</Badge>
                </div>

                {/* Preview */}
                <div className="border rounded-lg p-4">
                  <Label className="text-sm font-medium mb-2 block">প্রিভিউ</Label>
                  <div className="flex flex-wrap gap-2">
                    {printItems.slice(0, 3).map((item) => (
                      <BarcodeLabel
                        key={item.product.id}
                        product={item.product}
                        size={labelSizes[labelSize]}
                      />
                    ))}
                    {printItems.length > 3 && (
                      <div className="flex items-center text-muted-foreground text-sm">
                        +{printItems.length - 3} আরো
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Hidden Print Area */}
      <div className="hidden">
        <div ref={printRef} className="p-4">
          <div className="flex flex-wrap gap-2">
            {printItems.flatMap((item) =>
              Array(item.quantity).fill(null).map((_, index) => (
                <BarcodeLabel
                  key={`${item.product.id}-${index}`}
                  product={item.product}
                  size={labelSizes[labelSize]}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Barcode Label Component
const BarcodeLabel = ({ product, size }: { product: Product; size: { width: string; height: string; fontSize: string; barcodeHeight: number } }) => {
  const barcodeRef = useRef<SVGSVGElement>(null);
  const barcodeValue = product.barcode || product.sku || product.id.slice(0, 12);

  useEffect(() => {
    if (barcodeRef.current) {
      try {
        JsBarcode(barcodeRef.current, barcodeValue, {
          format: 'CODE128',
          width: 1.5,
          height: size.barcodeHeight,
          displayValue: false,
          margin: 0,
        });
      } catch (error) {
        console.error('Barcode generation error:', error);
      }
    }
  }, [barcodeValue, size.barcodeHeight]);

  return (
    <div
      className="border border-gray-300 bg-white text-black p-1 flex flex-col items-center justify-center"
      style={{ width: size.width, height: size.height }}
    >
      <p className="font-bold text-center truncate w-full" style={{ fontSize: size.fontSize }}>
        {product.name}
      </p>
      <svg ref={barcodeRef} className="w-full" />
      <div className="flex justify-between w-full px-1" style={{ fontSize: size.fontSize }}>
        <span>{barcodeValue}</span>
        <span className="font-bold">৳{product.selling_price}</span>
      </div>
    </div>
  );
};

export default InventoryBarcode;

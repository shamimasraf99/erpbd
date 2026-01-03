import { useState } from 'react';
import { Search, Package } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Product } from '@/hooks/useProducts';
import { Category } from '@/hooks/useCategories';

interface POSProductGridProps {
  products: Product[];
  categories: Category[];
  onAddToCart: (product: Product) => void;
}

export const POSProductGrid = ({
  products,
  categories,
  onAddToCart,
}: POSProductGridProps) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.barcode?.toLowerCase().includes(search.toLowerCase()) ||
      product.sku?.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = !selectedCategory || product.category_id === selectedCategory;
    
    return matchesSearch && matchesCategory && product.status === 'active';
  });

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="প্রোডাক্ট সার্চ করুন (নাম, বারকোড, SKU)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="p-4 border-b">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-2">
            <Badge
              variant={selectedCategory === null ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(null)}
            >
              সব
            </Badge>
            {categories.map((category) => (
              <Badge
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </Badge>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Products Grid */}
      <ScrollArea className="flex-1 p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredProducts.map((product) => (
            <Button
              key={product.id}
              variant="outline"
              className="h-auto p-3 flex flex-col items-start text-left relative"
              onClick={() => onAddToCart(product)}
              disabled={product.stock_quantity <= 0}
            >
              <div className="w-full flex items-center justify-center h-12 mb-2 bg-muted rounded">
                <Package className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="font-medium text-sm line-clamp-2 w-full">{product.name}</p>
              <p className="text-primary font-bold">৳{product.selling_price}</p>
              <p className="text-xs text-muted-foreground">
                স্টক: {product.stock_quantity} {product.unit}
              </p>
              {product.stock_quantity <= product.min_stock_level && product.stock_quantity > 0 && (
                <Badge variant="destructive" className="absolute top-1 right-1 text-[10px]">
                  কম
                </Badge>
              )}
              {product.stock_quantity <= 0 && (
                <Badge variant="secondary" className="absolute top-1 right-1 text-[10px]">
                  শেষ
                </Badge>
              )}
            </Button>
          ))}
        </div>
        {filteredProducts.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            কোনো প্রোডাক্ট পাওয়া যায়নি
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface CartItem {
  id: string;
  name: string;
  quantity: number;
  unit_price: number;
  discount: number;
  total_price: number;
}

interface POSCartProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onUpdateDiscount: (id: string, discount: number) => void;
}

export const POSCart = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onUpdateDiscount,
}: POSCartProps) => {
  return (
    <ScrollArea className="flex-1">
      <div className="space-y-2 p-2">
        {items.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            কার্টে কোনো আইটেম নেই
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="p-3 bg-muted/50 rounded-lg space-y-2"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    ৳{item.unit_price.toFixed(2)} × {item.quantity}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-destructive"
                  onClick={() => onRemoveItem(item.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
                    className="w-14 h-7 text-center text-sm"
                    min="1"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="flex items-center gap-1 flex-1">
                  <span className="text-xs text-muted-foreground">ডিসকাউন্ট:</span>
                  <Input
                    type="number"
                    value={item.discount}
                    onChange={(e) => onUpdateDiscount(item.id, parseFloat(e.target.value) || 0)}
                    className="w-16 h-7 text-sm"
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div className="text-right font-medium text-sm">
                  ৳{item.total_price.toFixed(2)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </ScrollArea>
  );
};

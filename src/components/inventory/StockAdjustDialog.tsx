import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Product } from '@/hooks/useProducts';

interface StockAdjustDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onSubmit: (data: { productId: string; quantity: number; type: 'in' | 'out' | 'adjustment'; notes?: string }) => void;
  isLoading?: boolean;
}

export const StockAdjustDialog = ({
  open,
  onOpenChange,
  product,
  onSubmit,
  isLoading,
}: StockAdjustDialogProps) => {
  const [type, setType] = useState<'in' | 'out' | 'adjustment'>('in');
  const [quantity, setQuantity] = useState(0);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (product) {
      onSubmit({
        productId: product.id,
        quantity,
        type,
        notes,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>স্টক অ্যাডজাস্ট করুন</DialogTitle>
        </DialogHeader>
        {product && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-3 bg-muted rounded-lg">
              <p className="font-medium">{product.name}</p>
              <p className="text-sm text-muted-foreground">
                বর্তমান স্টক: {product.stock_quantity} {product.unit}
              </p>
            </div>

            <div className="space-y-2">
              <Label>অ্যাডজাস্টমেন্ট টাইপ</Label>
              <Select value={type} onValueChange={(value: 'in' | 'out' | 'adjustment') => setType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in">স্টক ইন (যোগ)</SelectItem>
                  <SelectItem value="out">স্টক আউট (বিয়োগ)</SelectItem>
                  <SelectItem value="adjustment">অ্যাডজাস্টমেন্ট (নতুন মান)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">
                {type === 'adjustment' ? 'নতুন স্টক পরিমাণ' : 'পরিমাণ'}
              </Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">নোট</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="অ্যাডজাস্টমেন্টের কারণ..."
                rows={2}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                বাতিল
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'সেভ হচ্ছে...' : 'সেভ করুন'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

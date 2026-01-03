import { useState } from 'react';
import { Plus, Search, Package, AlertTriangle, Edit, Trash2, RefreshCw, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProducts, Product, ProductFormData } from '@/hooks/useProducts';
import { useCategories, Category, CategoryFormData } from '@/hooks/useCategories';
import { ProductDialog } from '@/components/dialogs/ProductDialog';
import { CategoryDialog } from '@/components/dialogs/CategoryDialog';
import { StockAdjustDialog } from '@/components/inventory/StockAdjustDialog';
import { DeleteConfirmDialog } from '@/components/dialogs/DeleteConfirmDialog';

const InventoryStock = () => {
  const { products, isLoading, createProduct, updateProduct, deleteProduct, updateStock, lowStockProducts } = useProducts();
  const { categories, createCategory, updateCategory, deleteCategory } = useCategories();
  
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  
  const [stockDialogOpen, setStockDialogOpen] = useState(false);
  const [stockProduct, setStockProduct] = useState<Product | null>(null);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'product' | 'category'; item: Product | Category } | null>(null);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.sku?.toLowerCase().includes(search.toLowerCase()) ||
      product.barcode?.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || product.category_id === categoryFilter;
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleProductSubmit = (data: ProductFormData) => {
    if (selectedProduct) {
      updateProduct.mutate({ ...data, id: selectedProduct.id }, {
        onSuccess: () => setProductDialogOpen(false),
      });
    } else {
      createProduct.mutate(data, {
        onSuccess: () => setProductDialogOpen(false),
      });
    }
  };

  const handleCategorySubmit = (data: CategoryFormData) => {
    if (selectedCategory) {
      updateCategory.mutate({ ...data, id: selectedCategory.id }, {
        onSuccess: () => setCategoryDialogOpen(false),
      });
    } else {
      createCategory.mutate(data, {
        onSuccess: () => setCategoryDialogOpen(false),
      });
    }
  };

  const handleStockSubmit = (data: { productId: string; quantity: number; type: 'in' | 'out' | 'adjustment'; notes?: string }) => {
    updateStock.mutate(data, {
      onSuccess: () => setStockDialogOpen(false),
    });
  };

  const handleDelete = () => {
    if (!itemToDelete) return;
    
    if (itemToDelete.type === 'product') {
      deleteProduct.mutate(itemToDelete.item.id, {
        onSuccess: () => setDeleteDialogOpen(false),
      });
    } else {
      deleteCategory.mutate(itemToDelete.item.id, {
        onSuccess: () => setDeleteDialogOpen(false),
      });
    }
  };

  const openEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setProductDialogOpen(true);
  };

  const openNewProduct = () => {
    setSelectedProduct(null);
    setProductDialogOpen(true);
  };

  const openEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setCategoryDialogOpen(true);
  };

  const openNewCategory = () => {
    setSelectedCategory(null);
    setCategoryDialogOpen(true);
  };

  const openStockAdjust = (product: Product) => {
    setStockProduct(product);
    setStockDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">স্টক ম্যানেজমেন্ট</h1>
          <p className="text-muted-foreground">প্রোডাক্ট ও স্টক পরিচালনা করুন</p>
        </div>
        <Button onClick={openNewProduct}>
          <Plus className="h-4 w-4 mr-2" />
          নতুন প্রোডাক্ট
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">মোট প্রোডাক্ট</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">সক্রিয় প্রোডাক্ট</CardTitle>
            <Package className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {products.filter(p => p.status === 'active').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">লো স্টক</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{lowStockProducts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">ক্যাটাগরি</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
              <AlertTriangle className="h-4 w-4" />
              লো স্টক সতর্কতা
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {lowStockProducts.slice(0, 5).map((product) => (
                <Badge key={product.id} variant="outline" className="border-yellow-300">
                  {product.name} ({product.stock_quantity} {product.unit})
                </Badge>
              ))}
              {lowStockProducts.length > 5 && (
                <Badge variant="outline">+{lowStockProducts.length - 5} আরো</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs defaultValue="products">
        <TabsList>
          <TabsTrigger value="products">প্রোডাক্ট</TabsTrigger>
          <TabsTrigger value="categories">ক্যাটাগরি</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
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
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="ক্যাটাগরি" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">সব ক্যাটাগরি</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue placeholder="স্ট্যাটাস" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">সব</SelectItem>
                <SelectItem value="active">সক্রিয়</SelectItem>
                <SelectItem value="inactive">নিষ্ক্রিয়</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Products Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>প্রোডাক্ট</TableHead>
                    <TableHead>ক্যাটাগরি</TableHead>
                    <TableHead className="text-right">ক্রয় মূল্য</TableHead>
                    <TableHead className="text-right">বিক্রয় মূল্য</TableHead>
                    <TableHead className="text-center">স্টক</TableHead>
                    <TableHead>স্ট্যাটাস</TableHead>
                    <TableHead className="text-right">অ্যাকশন</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        লোড হচ্ছে...
                      </TableCell>
                    </TableRow>
                  ) : filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        কোনো প্রোডাক্ট পাওয়া যায়নি
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {product.sku && `SKU: ${product.sku}`}
                              {product.sku && product.barcode && ' | '}
                              {product.barcode && `Barcode: ${product.barcode}`}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{product.categories?.name || '-'}</TableCell>
                        <TableCell className="text-right">৳{product.purchase_price}</TableCell>
                        <TableCell className="text-right">৳{product.selling_price}</TableCell>
                        <TableCell className="text-center">
                          <Badge 
                            variant={product.stock_quantity <= product.min_stock_level ? 'destructive' : 'secondary'}
                          >
                            {product.stock_quantity} {product.unit}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                            {product.status === 'active' ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openStockAdjust(product)}
                              title="স্টক অ্যাডজাস্ট"
                            >
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditProduct(product)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setItemToDelete({ type: 'product', item: product });
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={openNewCategory}>
              <Plus className="h-4 w-4 mr-2" />
              নতুন ক্যাটাগরি
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ক্যাটাগরি</TableHead>
                    <TableHead>বিবরণ</TableHead>
                    <TableHead className="text-center">প্রোডাক্ট সংখ্যা</TableHead>
                    <TableHead className="text-right">অ্যাকশন</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        কোনো ক্যাটাগরি নেই
                      </TableCell>
                    </TableRow>
                  ) : (
                    categories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {category.description || '-'}
                        </TableCell>
                        <TableCell className="text-center">
                          {products.filter(p => p.category_id === category.id).length}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditCategory(category)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setItemToDelete({ type: 'category', item: category });
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <ProductDialog
        open={productDialogOpen}
        onOpenChange={setProductDialogOpen}
        product={selectedProduct}
        onSubmit={handleProductSubmit}
        isLoading={createProduct.isPending || updateProduct.isPending}
      />

      <CategoryDialog
        open={categoryDialogOpen}
        onOpenChange={setCategoryDialogOpen}
        category={selectedCategory}
        onSubmit={handleCategorySubmit}
        isLoading={createCategory.isPending || updateCategory.isPending}
      />

      <StockAdjustDialog
        open={stockDialogOpen}
        onOpenChange={setStockDialogOpen}
        product={stockProduct}
        onSubmit={handleStockSubmit}
        isLoading={updateStock.isPending}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title={itemToDelete?.type === 'product' ? 'প্রোডাক্ট মুছে ফেলুন' : 'ক্যাটাগরি মুছে ফেলুন'}
        description={`আপনি কি নিশ্চিত যে আপনি "${itemToDelete?.item && 'name' in itemToDelete.item ? itemToDelete.item.name : ''}" মুছে ফেলতে চান?`}
        loading={deleteProduct.isPending || deleteCategory.isPending}
      />
    </div>
  );
};

export default InventoryStock;

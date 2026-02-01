import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Filter,
  X,
  Calendar,
  Hash,
  DollarSign,
  Archive,
  ShoppingCart,
  CheckCircle,
  XCircle,
  RefreshCw,
  BarChart3,
  Box,
  User,
  Plus
} from 'lucide-react';
import { AppHeader } from '@/app/components/shared/AppHeader';

interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  minQuantity: number;
  price: number;
  supplier: string;
  lastUpdate: string;
  status: 'normal' | 'low' | 'critical' | 'out';
}

interface Movement {
  id: number;
  type: 'in' | 'out';
  quantity: number;
  date: string;
  reason: string;
  user: string;
}

interface InventoryAppProps {
  onBack: () => void;
  language: string;
}

export function InventoryApp({ onBack, language }: InventoryAppProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    sku: '',
    category: 'electronics',
    quantity: 0,
    minQuantity: 0,
    price: 0,
    supplier: ''
  });

  const translations = {
    pt: {
      title: 'Estoque',
      subtitle: 'Gerenciamento de inventário',
      search: 'Buscar produtos...',
      filters: 'Filtros',
      category: 'Categoria',
      status: 'Status',
      all: 'Todos',
      normal: 'Normal',
      low: 'Baixo',
      critical: 'Crítico',
      out: 'Esgotado',
      products: 'Produtos',
      totalValue: 'Valor Total',
      alerts: 'Alertas',
      inStock: 'Em Estoque',
      price: 'Preço',
      supplier: 'Fornecedor',
      lastUpdate: 'Última Atualização',
      movements: 'Movimentações',
      entry: 'Entrada',
      exit: 'Saída',
      close: 'Fechar',
      units: 'unidades',
      electronics: 'Eletrônicos',
      furniture: 'Móveis',
      accessories: 'Acessórios',
      components: 'Componentes',
      addProduct: 'Adicionar Produto',
      productName: 'Nome do Produto',
      productSku: 'SKU',
      quantity: 'Quantidade',
      minQuantity: 'Estoque Mínimo',
      cancel: 'Cancelar',
      save: 'Salvar'
    },
    en: {
      title: 'Inventory',
      subtitle: 'Inventory management',
      search: 'Search products...',
      filters: 'Filters',
      category: 'Category',
      status: 'Status',
      all: 'All',
      normal: 'Normal',
      low: 'Low',
      critical: 'Critical',
      out: 'Out of Stock',
      products: 'Products',
      totalValue: 'Total Value',
      alerts: 'Alerts',
      inStock: 'In Stock',
      price: 'Price',
      supplier: 'Supplier',
      lastUpdate: 'Last Update',
      movements: 'Movements',
      entry: 'Entry',
      exit: 'Exit',
      close: 'Close',
      units: 'units',
      electronics: 'Electronics',
      furniture: 'Furniture',
      accessories: 'Accessories',
      components: 'Components',
      addProduct: 'Add Product',
      productName: 'Product Name',
      productSku: 'SKU',
      quantity: 'Quantity',
      minQuantity: 'Minimum Stock',
      cancel: 'Cancel',
      save: 'Save'
    },
    es: {
      title: 'Inventario',
      subtitle: 'Gestión de inventario',
      search: 'Buscar productos...',
      filters: 'Filtros',
      category: 'Categoría',
      status: 'Estado',
      all: 'Todos',
      normal: 'Normal',
      low: 'Bajo',
      critical: 'Crítico',
      out: 'Agotado',
      products: 'Productos',
      totalValue: 'Valor Total',
      alerts: 'Alertas',
      inStock: 'En Stock',
      price: 'Precio',
      supplier: 'Proveedor',
      lastUpdate: 'Última Actualización',
      movements: 'Movimientos',
      entry: 'Entrada',
      exit: 'Salida',
      close: 'Cerrar',
      units: 'unidades',
      electronics: 'Electrónica',
      furniture: 'Muebles',
      accessories: 'Accesorios',
      components: 'Componentes',
      addProduct: 'Agregar Producto',
      productName: 'Nombre del Producto',
      productSku: 'SKU',
      quantity: 'Cantidad',
      minQuantity: 'Stock Mínimo',
      cancel: 'Cancelar',
      save: 'Guardar'
    },
    fr: {
      title: 'Inventaire',
      subtitle: 'Gestion des stocks',
      search: 'Rechercher des produits...',
      filters: 'Filtres',
      category: 'Catégorie',
      status: 'Statut',
      all: 'Tous',
      normal: 'Normal',
      low: 'Bas',
      critical: 'Critique',
      out: 'Épuisé',
      products: 'Produits',
      totalValue: 'Valeur Totale',
      alerts: 'Alertes',
      inStock: 'En Stock',
      price: 'Prix',
      supplier: 'Fournisseur',
      lastUpdate: 'Dernière Mise à Jour',
      movements: 'Mouvements',
      entry: 'Entrée',
      exit: 'Sortie',
      close: 'Fermer',
      units: 'unités',
      electronics: 'Électronique',
      furniture: 'Meubles',
      accessories: 'Accessoires',
      components: 'Composants',
      addProduct: 'Ajouter Produit',
      productName: 'Nom du Produit',
      productSku: 'SKU',
      quantity: 'Quantité',
      minQuantity: 'Stock Minimum',
      cancel: 'Annuler',
      save: 'Enregistrer'
    }
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: 'MacBook Pro 16" M3',
      sku: 'MBP-M3-16-001',
      category: 'electronics',
      quantity: 15,
      minQuantity: 5,
      price: 12499.00,
      supplier: 'Apple Inc.',
      lastUpdate: '2025-01-28',
      status: 'normal'
    },
    {
      id: 2,
      name: 'Cadeira Ergonômica Aeron',
      sku: 'CHR-ERG-001',
      category: 'furniture',
      quantity: 3,
      minQuantity: 8,
      price: 2890.00,
      supplier: 'Herman Miller',
      lastUpdate: '2025-01-29',
      status: 'critical'
    },
    {
      id: 3,
      name: 'Mouse MX Master 3S',
      sku: 'MSE-MX3S-001',
      category: 'accessories',
      quantity: 8,
      minQuantity: 10,
      price: 549.00,
      supplier: 'Logitech',
      lastUpdate: '2025-01-30',
      status: 'low'
    },
    {
      id: 4,
      name: 'Monitor Dell UltraSharp 27"',
      sku: 'MON-DL27-001',
      category: 'electronics',
      quantity: 0,
      minQuantity: 5,
      price: 3299.00,
      supplier: 'Dell Technologies',
      lastUpdate: '2025-01-25',
      status: 'out'
    },
    {
      id: 5,
      name: 'Teclado Mecânico K2',
      sku: 'KBD-K2-001',
      category: 'accessories',
      quantity: 22,
      minQuantity: 10,
      price: 679.00,
      supplier: 'Keychron',
      lastUpdate: '2025-01-31',
      status: 'normal'
    },
    {
      id: 6,
      name: 'Mesa Ajustável Elétrica',
      sku: 'DSK-ADJ-001',
      category: 'furniture',
      quantity: 12,
      minQuantity: 6,
      price: 4299.00,
      supplier: 'Uplift Desk',
      lastUpdate: '2025-01-27',
      status: 'normal'
    },
    {
      id: 7,
      name: 'SSD Samsung 2TB',
      sku: 'SSD-SM-2TB-001',
      category: 'components',
      quantity: 5,
      minQuantity: 15,
      price: 899.00,
      supplier: 'Samsung',
      lastUpdate: '2025-01-26',
      status: 'critical'
    },
    {
      id: 8,
      name: 'Webcam Logitech Brio 4K',
      sku: 'WBC-BR4K-001',
      category: 'electronics',
      quantity: 18,
      minQuantity: 8,
      price: 1199.00,
      supplier: 'Logitech',
      lastUpdate: '2025-01-30',
      status: 'normal'
    }
  ]);

  const movements: { [key: number]: Movement[] } = {
    1: [
      { id: 1, type: 'in', quantity: 10, date: '2025-01-28', reason: 'Compra mensal', user: 'João Silva' },
      { id: 2, type: 'out', quantity: 5, date: '2025-01-29', reason: 'Venda corporativa', user: 'Maria Santos' },
      { id: 3, type: 'in', quantity: 10, date: '2025-01-25', reason: 'Reposição de estoque', user: 'João Silva' }
    ],
    2: [
      { id: 1, type: 'out', quantity: 5, date: '2025-01-29', reason: 'Montagem escritório', user: 'Pedro Costa' },
      { id: 2, type: 'in', quantity: 3, date: '2025-01-20', reason: 'Compra inicial', user: 'João Silva' },
      { id: 3, type: 'out', quantity: 2, date: '2025-01-27', reason: 'Venda varejo', user: 'Ana Oliveira' }
    ],
    3: [
      { id: 1, type: 'in', quantity: 20, date: '2025-01-30', reason: 'Reposição', user: 'João Silva' },
      { id: 2, type: 'out', quantity: 12, date: '2025-01-31', reason: 'Kit funcionários', user: 'Maria Santos' }
    ],
    4: [
      { id: 1, type: 'out', quantity: 5, date: '2025-01-25', reason: 'Projeto especial', user: 'Pedro Costa' },
      { id: 2, type: 'in', quantity: 5, date: '2025-01-15', reason: 'Compra inicial', user: 'João Silva' }
    ],
    5: [
      { id: 1, type: 'in', quantity: 30, date: '2025-01-31', reason: 'Estoque de segurança', user: 'João Silva' },
      { id: 2, type: 'out', quantity: 8, date: '2025-02-01', reason: 'Vendas diversas', user: 'Ana Oliveira' }
    ],
    6: [
      { id: 1, type: 'in', quantity: 15, date: '2025-01-27', reason: 'Compra trimestral', user: 'João Silva' },
      { id: 2, type: 'out', quantity: 3, date: '2025-01-28', reason: 'Escritório novo', user: 'Pedro Costa' }
    ],
    7: [
      { id: 1, type: 'out', quantity: 10, date: '2025-01-26', reason: 'Upgrade sistemas', user: 'Maria Santos' },
      { id: 2, type: 'in', quantity: 15, date: '2025-01-22', reason: 'Compra mensal', user: 'João Silva' }
    ],
    8: [
      { id: 1, type: 'in', quantity: 25, date: '2025-01-30', reason: 'Estoque home office', user: 'João Silva' },
      { id: 2, type: 'out', quantity: 7, date: '2025-01-31', reason: 'Distribuição equipes', user: 'Ana Oliveira' }
    ]
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || product.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const stats = {
    totalProducts: products.length,
    totalValue: products.reduce((sum, p) => sum + (p.price * p.quantity), 0),
    alerts: products.filter(p => p.status === 'low' || p.status === 'critical' || p.status === 'out').length,
    inStock: products.filter(p => p.quantity > 0).length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-[#1fff94] bg-[#1fff94]/10 border-[#1fff94]/30';
      case 'low': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'critical': return 'text-orange-500 bg-orange-500/10 border-orange-500/30';
      case 'out': return 'text-red-500 bg-red-500/10 border-red-500/30';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal': return CheckCircle;
      case 'low': return AlertTriangle;
      case 'critical': return AlertTriangle;
      case 'out': return XCircle;
      default: return CheckCircle;
    }
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.sku) {
      return;
    }

    const productStatus = 
      newProduct.quantity === 0 ? 'out' :
      newProduct.quantity <= newProduct.minQuantity * 0.5 ? 'critical' :
      newProduct.quantity <= newProduct.minQuantity ? 'low' :
      'normal';

    const productToAdd: Product = {
      id: products.length + 1,
      name: newProduct.name,
      sku: newProduct.sku,
      category: newProduct.category,
      quantity: newProduct.quantity,
      minQuantity: newProduct.minQuantity,
      price: newProduct.price,
      supplier: newProduct.supplier,
      lastUpdate: new Date().toISOString().split('T')[0],
      status: productStatus
    };

    setProducts([...products, productToAdd]);
    setShowAddModal(false);
    setNewProduct({
      name: '',
      sku: '',
      category: 'electronics',
      quantity: 0,
      minQuantity: 0,
      price: 0,
      supplier: ''
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <AppHeader
        title={t.title}
        subtitle={t.subtitle}
        icon={Package}
        onBack={onBack}
        actions={
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-[#1fff94] to-[#00d978] hover:from-[#00d978] hover:to-[#1fff94] rounded-xl flex items-center gap-2 transition-all text-black font-semibold"
            >
              <Plus size={18} />
              <span className="text-sm">{t.addProduct}</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 flex items-center gap-2 transition-all"
            >
              <Filter size={18} className="text-[#1fff94]" />
              <span className="text-sm font-medium">{t.filters}</span>
            </motion.button>
          </div>
        }
      />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl p-5 border border-white/10"
          >
            <div className="flex items-center justify-between mb-2">
              <Package size={24} className="text-[#1fff94]" />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="w-10 h-10 bg-[#1fff94]/10 rounded-xl flex items-center justify-center"
              >
                <Box size={20} className="text-[#1fff94]" />
              </motion.div>
            </div>
            <p className="text-3xl font-bold text-white mb-1">{stats.totalProducts}</p>
            <p className="text-sm text-gray-400">{t.products}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl p-5 border border-white/10"
          >
            <div className="flex items-center justify-between mb-2">
              <DollarSign size={24} className="text-[#1fff94]" />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
                className="w-10 h-10 bg-[#1fff94]/10 rounded-xl flex items-center justify-center"
              >
                <TrendingUp size={20} className="text-[#1fff94]" />
              </motion.div>
            </div>
            <p className="text-3xl font-bold text-white mb-1">
              R$ {stats.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-gray-400">{t.totalValue}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl p-5 border border-white/10"
          >
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle size={24} className="text-orange-500" />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: 'spring' }}
                className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center"
              >
                <AlertTriangle size={20} className="text-orange-500" />
              </motion.div>
            </div>
            <p className="text-3xl font-bold text-white mb-1">{stats.alerts}</p>
            <p className="text-sm text-gray-400">{t.alerts}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl p-5 border border-white/10"
          >
            <div className="flex items-center justify-between mb-2">
              <CheckCircle size={24} className="text-[#1fff94]" />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
                className="w-10 h-10 bg-[#1fff94]/10 rounded-xl flex items-center justify-center"
              >
                <Archive size={20} className="text-[#1fff94]" />
              </motion.div>
            </div>
            <p className="text-3xl font-bold text-white mb-1">{stats.inStock}</p>
            <p className="text-sm text-gray-400">{t.inStock}</p>
          </motion.div>
        </div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.search}
              className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#1fff94]/50 transition-all"
            />
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">{t.category}</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#1fff94]/50 transition-all"
                  >
                    <option value="all">{t.all}</option>
                    <option value="electronics">{t.electronics}</option>
                    <option value="furniture">{t.furniture}</option>
                    <option value="accessories">{t.accessories}</option>
                    <option value="components">{t.components}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">{t.status}</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#1fff94]/50 transition-all"
                  >
                    <option value="all">{t.all}</option>
                    <option value="normal">{t.normal}</option>
                    <option value="low">{t.low}</option>
                    <option value="critical">{t.critical}</option>
                    <option value="out">{t.out}</option>
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product, index) => {
            const StatusIcon = getStatusIcon(product.status);
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02, y: -5 }}
                onClick={() => setSelectedProduct(product)}
                className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden cursor-pointer group"
              >
                {/* Product Icon Area */}
                <div className="relative h-32 overflow-hidden bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-[#1fff94]/20 blur-2xl rounded-full" />
                    <Package size={56} className="text-[#1fff94] relative z-10" strokeWidth={1.5} />
                  </motion.div>
                  <div className="absolute top-3 right-3">
                    <div className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 backdrop-blur-xl ${getStatusColor(product.status)}`}>
                      <StatusIcon size={14} />
                      {t[product.status as keyof typeof t]}
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-bold text-white text-lg mb-1 line-clamp-1">{product.name}</h3>
                    <p className="text-sm text-gray-400 flex items-center gap-1.5">
                      <Hash size={14} />
                      {product.sku}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Quantidade</p>
                      <p className="text-xl font-bold text-white">
                        {product.quantity}
                        <span className="text-sm text-gray-400 ml-1">{t.units}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400 mb-1">{t.price}</p>
                      <p className="text-lg font-bold text-[#1fff94]">
                        R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>Estoque mínimo: {product.minQuantity}</span>
                      <span>{Math.round((product.quantity / product.minQuantity) * 100)}%</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((product.quantity / product.minQuantity) * 100, 100)}%` }}
                        transition={{ delay: index * 0.05 + 0.3, duration: 0.8 }}
                        className={`h-full rounded-full ${
                          product.status === 'normal' ? 'bg-[#1fff94]' :
                          product.status === 'low' ? 'bg-yellow-400' :
                          product.status === 'critical' ? 'bg-orange-500' :
                          'bg-red-500'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Package size={64} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400 text-lg">Nenhum produto encontrado</p>
          </motion.div>
        )}
      </div>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProduct(null)}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-[#0a0a0a] to-[#111111] rounded-3xl border border-white/10 max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
            >
              {/* Header */}
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-white/10 via-white/5 to-transparent">
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', duration: 0.6 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-[#1fff94]/30 blur-3xl rounded-full" />
                    <Package size={80} className="text-[#1fff94] relative z-10" strokeWidth={1.5} />
                  </motion.div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-black/80 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/10 hover:border-[#1fff94]/50 transition-all z-20"
                >
                  <X size={20} className="text-white" />
                </motion.button>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0a0a0a] to-transparent p-6">
                  <h2 className="text-3xl font-bold text-white mb-2">{selectedProduct.name}</h2>
                  <p className="text-gray-400 flex items-center gap-2">
                    <Hash size={16} />
                    {selectedProduct.sku}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-16rem)]">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
                    <Package size={20} className="text-[#1fff94] mb-2" />
                    <p className="text-2xl font-bold text-white">{selectedProduct.quantity}</p>
                    <p className="text-sm text-gray-400">{t.units}</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
                    <DollarSign size={20} className="text-[#1fff94] mb-2" />
                    <p className="text-2xl font-bold text-white">
                      R$ {selectedProduct.price.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-400">{t.price}</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
                    <AlertTriangle size={20} className="text-orange-500 mb-2" />
                    <p className="text-2xl font-bold text-white">{selectedProduct.minQuantity}</p>
                    <p className="text-sm text-gray-400">Mínimo</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
                    <DollarSign size={20} className="text-[#1fff94] mb-2" />
                    <p className="text-2xl font-bold text-white">
                      R$ {(selectedProduct.price * selectedProduct.quantity).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-400">Valor Total</p>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-3 border-b border-white/10">
                    <span className="text-gray-400">Categoria</span>
                    <span className="font-medium text-white">{t[selectedProduct.category as keyof typeof t]}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-white/10">
                    <span className="text-gray-400">{t.supplier}</span>
                    <span className="font-medium text-white">{selectedProduct.supplier}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-white/10">
                    <span className="text-gray-400">{t.lastUpdate}</span>
                    <span className="font-medium text-white">{selectedProduct.lastUpdate}</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-gray-400">{t.status}</span>
                    <div className={`px-3 py-1.5 rounded-lg border text-sm font-bold flex items-center gap-1.5 ${getStatusColor(selectedProduct.status)}`}>
                      {(() => {
                        const StatusIcon = getStatusIcon(selectedProduct.status);
                        return <StatusIcon size={14} />;
                      })()}
                      {t[selectedProduct.status as keyof typeof t]}
                    </div>
                  </div>
                </div>

                {/* Movements History */}
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <RefreshCw size={20} className="text-[#1fff94]" />
                    {t.movements}
                  </h3>
                  <div className="space-y-2">
                    {movements[selectedProduct.id]?.map((movement, index) => (
                      <motion.div
                        key={movement.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              movement.type === 'in' ? 'bg-[#1fff94]/10 border border-[#1fff94]/30' : 'bg-red-500/10 border border-red-500/30'
                            }`}>
                              {movement.type === 'in' ? (
                                <TrendingUp size={20} className="text-[#1fff94]" />
                              ) : (
                                <TrendingDown size={20} className="text-red-500" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-white">
                                {movement.type === 'in' ? t.entry : t.exit}: {movement.quantity} {t.units}
                              </p>
                              <p className="text-sm text-gray-400">{movement.reason}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-400 flex items-center gap-1.5">
                              <Calendar size={14} />
                              {movement.date}
                            </p>
                            <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-1">
                              <User size={12} />
                              {movement.user}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Product Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddModal(false)}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-[#0a0a0a] to-[#111111] rounded-3xl border border-white/10 max-w-2xl w-full shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#1fff94]/10 rounded-xl flex items-center justify-center">
                      <Plus size={24} className="text-[#1fff94]" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{t.addProduct}</h2>
                      <p className="text-sm text-gray-400">Preencha os dados do novo produto</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowAddModal(false)}
                    className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center border border-white/10 transition-all"
                  >
                    <X size={20} className="text-white" />
                  </motion.button>
                </div>
              </div>

              {/* Form */}
              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Product Name */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-400 mb-2">{t.productName}</label>
                    <input
                      type="text"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      placeholder="Ex: MacBook Pro 16"
                      className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#1fff94]/50 transition-all"
                    />
                  </div>

                  {/* SKU */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">{t.productSku}</label>
                    <input
                      type="text"
                      value={newProduct.sku}
                      onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                      placeholder="Ex: MBP-001"
                      className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#1fff94]/50 transition-all"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">{t.category}</label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#1fff94]/50 transition-all"
                    >
                      <option value="electronics">{t.electronics}</option>
                      <option value="furniture">{t.furniture}</option>
                      <option value="accessories">{t.accessories}</option>
                      <option value="components">{t.components}</option>
                    </select>
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">{t.quantity}</label>
                    <input
                      type="number"
                      min="0"
                      value={newProduct.quantity}
                      onChange={(e) => setNewProduct({ ...newProduct, quantity: parseInt(e.target.value) || 0 })}
                      placeholder="0"
                      className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#1fff94]/50 transition-all"
                    />
                  </div>

                  {/* Min Quantity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">{t.minQuantity}</label>
                    <input
                      type="number"
                      min="0"
                      value={newProduct.minQuantity}
                      onChange={(e) => setNewProduct({ ...newProduct, minQuantity: parseInt(e.target.value) || 0 })}
                      placeholder="0"
                      className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#1fff94]/50 transition-all"
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">{t.price}</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                      className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#1fff94]/50 transition-all"
                    />
                  </div>

                  {/* Supplier */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">{t.supplier}</label>
                    <input
                      type="text"
                      value={newProduct.supplier}
                      onChange={(e) => setNewProduct({ ...newProduct, supplier: e.target.value })}
                      placeholder="Ex: Apple Inc."
                      className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#1fff94]/50 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 bg-white/5 border-t border-white/10 flex items-center justify-end gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-white font-medium transition-all"
                >
                  {t.cancel}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddProduct}
                  disabled={!newProduct.name || !newProduct.sku}
                  className="px-6 py-3 bg-gradient-to-r from-[#1fff94] to-[#00d978] hover:from-[#00d978] hover:to-[#1fff94] rounded-xl text-black font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t.save}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  DollarSign,
  FileText,
  Download,
  Calendar,
  Hash,
  Package,
  User,
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Settings,
  Filter,
  ArrowUpRight,
  Building,
  Mail,
  Phone
} from 'lucide-react';
import { AppHeader } from '@/app/components/shared/AppHeader';

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Order {
  id: number;
  orderHash: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerCompany: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'paid' | 'pending' | 'overdue';
  paymentMethod: 'credit_card' | 'debit_card' | 'pix' | 'bank_slip';
  invoiceGenerated: boolean;
  createdAt: string;
}

interface FinanceAppProps {
  onBack: () => void;
}

// Função para gerar hash aleatório
const generateHash = () => {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
};

// Função para gerar data aleatória nos últimos 60 dias
const generateRandomDate = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

export function FinanceApp({ onBack }: FinanceAppProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [confirmInvoice, setConfirmInvoice] = useState<Order | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDownload, setShowDownload] = useState(false);

  const [orders, setOrders] = useState<Order[]>([
    {
      id: 1,
      orderHash: generateHash(),
      customerName: 'Tech Solutions Ltda',
      customerEmail: 'contato@techsolutions.com',
      customerPhone: '+55 11 98765-4321',
      customerCompany: 'Tech Solutions Ltda',
      items: [
        { id: '1', productName: 'Software ERP - Licença Anual', quantity: 5, unitPrice: 2500.00, total: 12500.00 },
        { id: '2', productName: 'Suporte Premium', quantity: 1, unitPrice: 3000.00, total: 3000.00 }
      ],
      subtotal: 15500.00,
      tax: 2790.00,
      total: 18290.00,
      status: 'paid',
      paymentMethod: 'pix',
      invoiceGenerated: true,
      createdAt: generateRandomDate(2)
    },
    {
      id: 2,
      orderHash: generateHash(),
      customerName: 'Indústria ABC S.A.',
      customerEmail: 'financeiro@industriaabc.com.br',
      customerPhone: '+55 21 3456-7890',
      customerCompany: 'Indústria ABC S.A.',
      items: [
        { id: '1', productName: 'Sistema de Gestão de Estoque', quantity: 1, unitPrice: 8900.00, total: 8900.00 },
        { id: '2', productName: 'Integração API', quantity: 2, unitPrice: 1500.00, total: 3000.00 }
      ],
      subtotal: 11900.00,
      tax: 2142.00,
      total: 14042.00,
      status: 'pending',
      paymentMethod: 'bank_slip',
      invoiceGenerated: false,
      createdAt: generateRandomDate(5)
    },
    {
      id: 3,
      orderHash: generateHash(),
      customerName: 'Comercial XYZ',
      customerEmail: 'compras@comercialxyz.com',
      customerPhone: '+55 11 2345-6789',
      customerCompany: 'Comercial XYZ',
      items: [
        { id: '1', productName: 'CRM Empresarial', quantity: 10, unitPrice: 450.00, total: 4500.00 }
      ],
      subtotal: 4500.00,
      tax: 810.00,
      total: 5310.00,
      status: 'paid',
      paymentMethod: 'credit_card',
      invoiceGenerated: true,
      createdAt: generateRandomDate(8)
    },
    {
      id: 4,
      orderHash: generateHash(),
      customerName: 'Startup Inovação',
      customerEmail: 'admin@startupinovacao.io',
      customerPhone: '+55 11 91234-5678',
      customerCompany: 'Startup Inovação LTDA',
      items: [
        { id: '1', productName: 'Plano Startup - 3 Meses', quantity: 1, unitPrice: 1200.00, total: 1200.00 },
        { id: '2', productName: 'Consultoria Inicial', quantity: 5, unitPrice: 300.00, total: 1500.00 }
      ],
      subtotal: 2700.00,
      tax: 486.00,
      total: 3186.00,
      status: 'overdue',
      paymentMethod: 'bank_slip',
      invoiceGenerated: false,
      createdAt: generateRandomDate(15)
    },
    {
      id: 5,
      orderHash: generateHash(),
      customerName: 'Empresa Beta',
      customerEmail: 'pagamentos@empresabeta.com',
      customerPhone: '+55 21 99876-5432',
      customerCompany: 'Empresa Beta Serviços',
      items: [
        { id: '1', productName: 'Dashboard Analytics', quantity: 3, unitPrice: 1800.00, total: 5400.00 }
      ],
      subtotal: 5400.00,
      tax: 972.00,
      total: 6372.00,
      status: 'paid',
      paymentMethod: 'pix',
      invoiceGenerated: true,
      createdAt: generateRandomDate(20)
    },
    {
      id: 6,
      orderHash: generateHash(),
      customerName: 'Corporação Global',
      customerEmail: 'financeiro@corpglobal.com',
      customerPhone: '+55 11 3000-0000',
      customerCompany: 'Corporação Global S.A.',
      items: [
        { id: '1', productName: 'Enterprise Suite', quantity: 50, unitPrice: 500.00, total: 25000.00 },
        { id: '2', productName: 'Treinamento Equipe', quantity: 1, unitPrice: 5000.00, total: 5000.00 }
      ],
      subtotal: 30000.00,
      tax: 5400.00,
      total: 35400.00,
      status: 'pending',
      paymentMethod: 'bank_slip',
      invoiceGenerated: false,
      createdAt: generateRandomDate(3)
    }
  ]);

  const statusConfig = {
    paid: { label: 'Pago', color: 'text-[#1fff94] bg-[#1fff94]/10 border-[#1fff94]/20', icon: CheckCircle },
    pending: { label: 'Pendente', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20', icon: Clock },
    overdue: { label: 'Atrasado', color: 'text-red-400 bg-red-400/10 border-red-400/20', icon: AlertCircle }
  };

  const paymentMethodConfig = {
    credit_card: { label: 'Cartão de Crédito', icon: CreditCard },
    debit_card: { label: 'Cartão de Débito', icon: CreditCard },
    pix: { label: 'PIX', icon: DollarSign },
    bank_slip: { label: 'Boleto', icon: FileText }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.orderHash.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toString().includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const generateInvoice = (orderId: number) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, invoiceGenerated: true } : order
    ));
    setConfirmInvoice(null);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const totalRevenue = orders.filter(o => o.status === 'paid').reduce((sum, order) => sum + order.total, 0);
  const pendingRevenue = orders.filter(o => o.status === 'pending').reduce((sum, order) => sum + order.total, 0);
  const overdueRevenue = orders.filter(o => o.status === 'overdue').reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <AppHeader
        title="Financeiro"
        subtitle="Gestão de pedidos e faturamento"
        icon={DollarSign}
        onBack={onBack}
        actions={
          <>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all backdrop-blur-sm border border-white/10"
            >
              <RefreshCw size={18} className="text-gray-400" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all backdrop-blur-sm border border-white/10"
            >
              <Settings size={18} className="text-gray-400" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2.5 bg-gradient-to-r from-[#1fff94] to-[#00d976] rounded-xl font-medium text-black hover:shadow-lg hover:shadow-[#1fff94]/50 transition-all flex items-center gap-2"
            >
              <Download size={18} />
              Exportar
            </motion.button>
          </>
        }
      />

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#1fff94] to-[#00d976] rounded-lg flex items-center justify-center">
                  <DollarSign size={20} className="text-black" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Receita Total</p>
                  <p className="text-xl font-bold text-white">
                    R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#1fff94] to-[#00d976] rounded-lg flex items-center justify-center">
                  <Clock size={20} className="text-black" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Pendente</p>
                  <p className="text-xl font-bold text-white">
                    R$ {pendingRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#1fff94] to-[#00d976] rounded-lg flex items-center justify-center">
                  <AlertCircle size={20} className="text-black" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Atrasado</p>
                  <p className="text-xl font-bold text-white">
                    R$ {overdueRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#1fff94] to-[#00d976] rounded-lg flex items-center justify-center">
                  <FileText size={20} className="text-black" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Total Pedidos</p>
                  <p className="text-xl font-bold text-white">{orders.length}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por cliente, pedido ou hash..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#1fff94]/50 focus:bg-white/10 transition-all"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#1fff94]/50 transition-all"
            >
              <option value="all">Todos Status</option>
              <option value="paid">Pago</option>
              <option value="pending">Pendente</option>
              <option value="overdue">Atrasado</option>
            </select>
          </div>

          {/* Orders List */}
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filteredOrders.map((order, index) => {
                const StatusIcon = statusConfig[order.status].icon;
                const PaymentIcon = paymentMethodConfig[order.paymentMethod].icon;

                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.03 }}
                    onClick={() => setSelectedOrder(order)}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 hover:border-[#1fff94]/30 hover:bg-white/[0.07] transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between gap-4">
                      {/* Left - Order Info */}
                      <div className="flex items-center gap-4 flex-1">
                        {/* Order Number */}
                        <div className="flex flex-col items-center justify-center w-16 h-16 bg-gradient-to-br from-[#1fff94] to-[#00d976] rounded-lg">
                          <span className="text-xs text-black/60 font-medium pl-[5px] pt-[0px] pr-[0px] pb-[0px]">Nº</span>
                          <span className="text-lg font-bold text-black px-[10px] py-[0px] inline-flex items-center leading-none">{order.id}</span>
                        </div>

                        {/* Order Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-white truncate">{order.customerName}</h3>
                            <span className={`px-2 py-0.5 rounded-lg text-xs font-medium border flex items-center gap-1 ${statusConfig[order.status].color}`}>
                              <StatusIcon size={12} />
                              {statusConfig[order.status].label}
                            </span>
                          </div>

                          <div className="flex items-center gap-4 text-xs text-gray-400">
                            <div className="flex items-center gap-1">
                              <Hash size={12} />
                              <span className="font-mono">{order.orderHash}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar size={12} />
                              <span>{new Date(order.createdAt).toLocaleDateString('pt-BR')}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <PaymentIcon size={12} />
                              <span>{paymentMethodConfig[order.paymentMethod].label}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right - Actions */}
                      <div className="flex items-center gap-3">
                        {/* Total Value */}
                        <div className="text-right">
                          <p className="text-xs text-gray-400">Total</p>
                          <p className="text-lg font-bold text-[#1fff94]">
                            R$ {order.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                        </div>

                        {/* Invoice Button */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!order.invoiceGenerated) {
                              setConfirmInvoice(order);
                            } else {
                              setShowDownload(true);
                              setTimeout(() => setShowDownload(false), 2500);
                            }
                          }}
                          className={`p-3 rounded-xl transition-all ${
                            order.invoiceGenerated
                              ? 'bg-[#1fff94]/20 border border-[#1fff94]/30 text-[#1fff94]'
                              : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
                          }`}
                          title={order.invoiceGenerated ? 'Baixar NF' : 'Gerar NF'}
                        >
                          <FileText size={18} />
                        </motion.button>

                        {/* View Details Arrow */}
                        <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-[#1fff94]/20 transition-all">
                          <ArrowUpRight size={16} className="text-gray-400 group-hover:text-[#1fff94] transition-colors" />
                        </div>
                      </div>
                    </div>

                    {/* Items Preview */}
                    <div className="mt-3 pt-3 border-t border-white/5">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Package size={12} />
                        <span>
                          {order.items.length} {order.items.length === 1 ? 'item' : 'itens'} - {order.items.map(i => i.productName).join(', ')}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {filteredOrders.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <FileText size={64} className="text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nenhum pedido encontrado</h3>
              <p className="text-gray-500">Tente ajustar os filtros de busca</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-gray-900 to-black border border-[#1fff94]/20 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl shadow-[#1fff94]/20"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#1fff94] to-[#00d976] rounded-xl flex items-center justify-center">
                    <FileText size={24} className="text-black" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Pedido #{selectedOrder.id}</h2>
                    <p className="text-sm text-gray-400 font-mono">#{selectedOrder.orderHash}</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <X size={20} className="text-gray-400" />
                </motion.button>
              </div>

              {/* Modal Body */}
              <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Customer Info */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <User size={18} className="text-[#1fff94]" />
                      Informações do Cliente
                    </h3>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                      <div className="flex items-start gap-3">
                        <Building size={16} className="text-gray-400 mt-1" />
                        <div>
                          <p className="text-xs text-gray-400">Empresa</p>
                          <p className="text-white font-medium">{selectedOrder.customerCompany}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <User size={16} className="text-gray-400 mt-1" />
                        <div>
                          <p className="text-xs text-gray-400">Nome</p>
                          <p className="text-white font-medium">{selectedOrder.customerName}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Mail size={16} className="text-gray-400 mt-1" />
                        <div>
                          <p className="text-xs text-gray-400">Email</p>
                          <p className="text-white font-medium">{selectedOrder.customerEmail}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Phone size={16} className="text-gray-400 mt-1" />
                        <div>
                          <p className="text-xs text-gray-400">Telefone</p>
                          <p className="text-white font-medium">{selectedOrder.customerPhone}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Info */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <DollarSign size={18} className="text-[#1fff94]" />
                      Informações do Pedido
                    </h3>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm">Status</span>
                        <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${statusConfig[selectedOrder.status].color}`}>
                          {statusConfig[selectedOrder.status].label}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm">Data do Pedido</span>
                        <span className="text-white font-medium">{new Date(selectedOrder.createdAt).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm">Forma de Pagamento</span>
                        <span className="text-white font-medium">{paymentMethodConfig[selectedOrder.paymentMethod].label}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm">Nota Fiscal</span>
                        <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                          selectedOrder.invoiceGenerated ? 'bg-[#1fff94]/10 text-[#1fff94]' : 'bg-gray-500/10 text-gray-400'
                        }`}>
                          {selectedOrder.invoiceGenerated ? 'Gerada' : 'Pendente'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="mt-6">
                  <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                    <Package size={18} className="text-[#1fff94]" />
                    Itens do Pedido
                  </h3>
                  <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-white/5 border-b border-white/10">
                          <th className="text-left p-4 text-sm font-medium text-gray-400">Produto</th>
                          <th className="text-center p-4 text-sm font-medium text-gray-400">Qtd</th>
                          <th className="text-right p-4 text-sm font-medium text-gray-400">Preço Unit.</th>
                          <th className="text-right p-4 text-sm font-medium text-gray-400">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.items.map((item) => (
                          <tr key={item.id} className="border-b border-white/5 last:border-0">
                            <td className="p-4 text-white">{item.productName}</td>
                            <td className="p-4 text-center text-gray-400">{item.quantity}</td>
                            <td className="p-4 text-right text-gray-400">
                              R$ {item.unitPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="p-4 text-right text-white font-medium">
                              R$ {item.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Totals */}
                  <div className="mt-4 bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Subtotal</span>
                      <span className="text-white">
                        R$ {selectedOrder.subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Impostos (18%)</span>
                      <span className="text-white">
                        R$ {selectedOrder.tax.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                      <span className="text-lg font-bold text-white">Total</span>
                      <span className="text-2xl font-bold text-[#1fff94]">
                        R$ {selectedOrder.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-white/10 flex items-center justify-between gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedOrder(null)}
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-medium transition-colors"
                >
                  Fechar
                </motion.button>
                <div className="flex gap-3">
                  {!selectedOrder.invoiceGenerated && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setConfirmInvoice(selectedOrder)}
                      className="px-6 py-3 bg-gradient-to-r from-[#1fff94] to-[#00d976] rounded-xl font-medium text-black hover:shadow-lg hover:shadow-[#1fff94]/50 transition-all flex items-center gap-2"
                    >
                      <FileText size={18} />
                      Gerar Nota Fiscal
                    </motion.button>
                  )}
                  {selectedOrder.invoiceGenerated && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setShowDownload(true);
                        setTimeout(() => setShowDownload(false), 2500);
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-[#1fff94] to-[#00d976] rounded-xl font-medium text-black hover:shadow-lg hover:shadow-[#1fff94]/50 transition-all flex items-center gap-2"
                    >
                      <Download size={18} />
                      Baixar Nota Fiscal
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmInvoice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[60] flex items-center justify-center p-6"
            onClick={() => setConfirmInvoice(null)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: 50, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-gray-900 to-black border-2 border-[#1fff94]/30 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl shadow-[#1fff94]/30 relative"
            >
              {/* Animated Background Glow */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-[#1fff94]/10 to-transparent"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              <div className="relative z-10 p-8">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', damping: 15 }}
                  className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#1fff94] to-[#00d976] rounded-2xl flex items-center justify-center relative"
                >
                  <motion.div
                    className="absolute inset-0 bg-[#1fff94] rounded-2xl blur-xl"
                    animate={{
                      opacity: [0.5, 0.8, 0.5],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <FileText size={40} className="text-black relative z-10" />
                </motion.div>

                {/* Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold text-center mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                >
                  Gerar Nota Fiscal?
                </motion.h2>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-400 text-center mb-6"
                >
                  Confirme a emissão da nota fiscal para o pedido <span className="text-[#1fff94] font-bold">#{confirmInvoice.id}</span>
                </motion.p>

                {/* Order Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6 space-y-2"
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Cliente</span>
                    <span className="text-white font-medium">{confirmInvoice.customerName}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Valor Total</span>
                    <span className="text-[#1fff94] font-bold text-lg">
                      R$ {confirmInvoice.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </motion.div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setConfirmInvoice(null)}
                    className="flex-1 px-6 py-4 bg-white/5 hover:bg-white/10 rounded-xl font-medium transition-all border border-white/10"
                  >
                    Cancelar
                  </motion.button>
                  <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      generateInvoice(confirmInvoice.id);
                      if (selectedOrder?.id === confirmInvoice.id) {
                        setSelectedOrder({ ...selectedOrder, invoiceGenerated: true });
                      }
                    }}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-[#1fff94] to-[#00d976] rounded-xl font-bold text-black hover:shadow-2xl hover:shadow-[#1fff94]/50 transition-all relative overflow-hidden group"
                  >
                    <motion.div
                      className="absolute inset-0 bg-white/20"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.5 }}
                    />
                    <span className="relative z-10">Confirmar</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Animation */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[70] flex items-center justify-center pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: 'spring', damping: 15, stiffness: 200 }}
              className="relative"
            >
              {/* Expanding Rings */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 border-4 border-[#1fff94] rounded-full"
                  initial={{ scale: 1, opacity: 0.8 }}
                  animate={{ 
                    scale: [1, 2.5, 3],
                    opacity: [0.8, 0.3, 0]
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.2,
                    ease: "easeOut"
                  }}
                />
              ))}

              {/* Success Circle */}
              <motion.div
                className="w-32 h-32 bg-gradient-to-br from-[#1fff94] to-[#00d976] rounded-full flex items-center justify-center relative shadow-2xl shadow-[#1fff94]/50"
                animate={{
                  boxShadow: [
                    '0 0 40px rgba(31, 255, 148, 0.5)',
                    '0 0 80px rgba(31, 255, 148, 0.8)',
                    '0 0 40px rgba(31, 255, 148, 0.5)',
                  ]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {/* Checkmark */}
                <motion.svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-black"
                >
                  <motion.path
                    d="M5 13l4 4L19 7"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  />
                </motion.svg>
              </motion.div>

              {/* Success Text */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute -bottom-20 left-1/2 -translate-x-1/2 whitespace-nowrap"
              >
                <p className="text-2xl font-bold text-[#1fff94] text-center mb-1">Nota Fiscal Gerada!</p>
                <p className="text-sm text-gray-400 text-center">O documento está pronto para download</p>
              </motion.div>

              {/* Confetti Particles */}
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-[#1fff94] rounded-full"
                  style={{
                    left: '50%',
                    top: '50%',
                  }}
                  initial={{ 
                    scale: 0,
                    x: 0,
                    y: 0,
                    opacity: 1
                  }}
                  animate={{ 
                    scale: [0, 1, 0.5],
                    x: Math.cos(i * 18 * Math.PI / 180) * 150,
                    y: Math.sin(i * 18 * Math.PI / 180) * 150,
                    opacity: [1, 1, 0]
                  }}
                  transition={{
                    duration: 1.2,
                    delay: 0.3,
                    ease: "easeOut"
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Download Toast Notification */}
      <AnimatePresence>
        {showDownload && (
          <motion.div
            initial={{ opacity: 0, y: -100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -100, scale: 0.8 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed top-6 right-6 z-[80] bg-gradient-to-br from-gray-900 to-black border-2 border-[#1fff94]/50 rounded-2xl p-6 shadow-2xl shadow-[#1fff94]/40 min-w-[320px]"
          >
            {/* Animated Background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-[#1fff94]/10 to-transparent rounded-2xl"
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            <div className="relative z-10 flex items-center gap-4">
              {/* Animated Download Icon */}
              <div className="relative">
                <motion.div
                  className="w-12 h-12 bg-gradient-to-br from-[#1fff94] to-[#00d976] rounded-xl flex items-center justify-center"
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(31, 255, 148, 0.3)',
                      '0 0 40px rgba(31, 255, 148, 0.6)',
                      '0 0 20px rgba(31, 255, 148, 0.3)',
                    ]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <motion.div
                    animate={{
                      y: [0, 3, 0],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Download size={24} className="text-black" />
                  </motion.div>
                </motion.div>

                {/* Progress Circle */}
                <svg className="absolute inset-0 w-12 h-12 -rotate-90">
                  <motion.circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="#1fff94"
                    strokeWidth="2"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "linear" }}
                  />
                </svg>
              </div>

              {/* Text Content */}
              <div className="flex-1">
                <motion.h3
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-white font-bold text-sm mb-1"
                >
                  Download Iniciado
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-gray-400 text-xs"
                >
                  Nota fiscal sendo baixada...
                </motion.p>

                {/* Progress Bar */}
                <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#1fff94] to-[#00d976]"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2, ease: "linear" }}
                  />
                </div>
              </div>

              {/* Success Checkmark (appears at the end) */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.8, type: 'spring', damping: 15 }}
                className="absolute -top-2 -right-2 w-8 h-8 bg-[#1fff94] rounded-full flex items-center justify-center shadow-lg shadow-[#1fff94]/50"
              >
                <CheckCircle size={18} className="text-black" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(31, 255, 148, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(31, 255, 148, 0.5);
        }
      `}</style>
    </div>
  );
}

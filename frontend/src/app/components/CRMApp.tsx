import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  X, 
  GripVertical,
  Trash2,
  Edit2,
  MoreVertical,
  Filter,
  Search,
  User,
  Package,
  Mail,
  Phone,
  Building,
  Tag,
  DollarSign,
  ShoppingCart,
  RefreshCw,
  Settings
} from 'lucide-react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { AppHeader } from '@/app/components/shared/AppHeader';

interface CRMAppProps {
  onBack: () => void;
}

interface Stage {
  id: string;
  name: string;
  color: string;
}

interface Deal {
  id: string;
  name: string;
  value: number;
  company: string;
  contact: string;
  stageId: string;
  leadId: string;
  description: string;
  createdAt: string;
}

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'new' | 'contacted' | 'qualified' | 'unqualified';
  createdAt: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  createdAt: string;
}

interface Funnel {
  id: string;
  name: string;
  stages: Stage[];
  deals: Deal[];
  productId?: string;
  createdAt: string;
}

interface DraggableStageProps {
  stage: Stage;
  index: number;
  moveStage: (dragIndex: number, hoverIndex: number) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newName: string) => void;
}

const ITEM_TYPE = 'STAGE';

const stageColors = [
  '#1fff94', '#00d976', '#06ffa5', '#1fff94', '#00d976', 
  '#06ffa5', '#1fff94', '#00d976', '#06ffa5', '#1fff94'
];

function DraggableStage({ stage, index, moveStage, onDelete, onEdit }: DraggableStageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(stage.name);

  const [{ isDragging }, drag, preview] = useDrag({
    type: ITEM_TYPE,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: ITEM_TYPE,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveStage(item.index, index);
        item.index = index;
      }
    },
  });

  const handleSaveEdit = () => {
    if (editName.trim()) {
      onEdit(stage.id, editName.trim());
      setIsEditing(false);
    }
  };

  return (
    <motion.div
      ref={(node) => {
        preview(drop(node));
      }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ 
        opacity: isDragging ? 0.5 : 1, 
        x: 0,
      }}
      transition={{ duration: 0.2 }}
      className={`group relative bg-white/5 backdrop-blur-sm border rounded-xl p-4 transition-all select-none ${
        isDragging 
          ? 'border-[#1fff94] shadow-2xl shadow-[#1fff94]/50 bg-[#1fff94]/10 z-50' 
          : isOver 
            ? 'border-[#1fff94]/70 bg-[#1fff94]/5'
            : 'border-white/10 hover:border-[#1fff94]/50'
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Drag Handle */}
        <div 
          ref={drag}
          className="text-gray-500 group-hover:text-[#1fff94] transition-colors flex-shrink-0 p-1 cursor-grab active:cursor-grabbing"
        >
          <GripVertical size={20} />
        </div>

        {/* Stage Name */}
        {isEditing ? (
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleSaveEdit}
            onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
            autoFocus
            className="flex-1 bg-white/10 border border-[#1fff94]/50 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-[#1fff94]"
          />
        ) : (
          <span className="flex-1 text-white text-sm font-medium">{stage.name}</span>
        )}

        {/* Actions */}
        {!isDragging && (
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsEditing(!isEditing)}
              className="p-1.5 bg-[#1fff94]/20 border border-[#1fff94]/30 rounded-lg hover:bg-[#1fff94]/30 transition-all"
            >
              <Edit2 size={14} className="text-[#1fff94]" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onDelete(stage.id)}
              className="p-1.5 bg-[#1fff94]/20 border border-[#1fff94]/30 rounded-lg hover:bg-[#1fff94]/30 transition-all"
            >
              <Trash2 size={14} className="text-[#1fff94]" />
            </motion.button>
          </div>
        )}
      </div>

      {/* Drop indicator */}
      {isOver && !isDragging && (
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          className="absolute -bottom-1 left-0 right-0 h-1 bg-[#1fff94] rounded-full shadow-lg shadow-[#1fff94]/50"
        />
      )}

      {/* Drag overlay */}
      {isDragging && (
        <div className="absolute inset-0 bg-[#1fff94]/20 rounded-xl border-2 border-[#1fff94] border-dashed" />
      )}
    </motion.div>
  );
}

function CreateFunnelModal({ 
  onClose, 
  onSave,
  products 
}: { 
  onClose: () => void; 
  onSave: (funnel: Omit<Funnel, 'id' | 'createdAt'>) => void;
  products: Product[];
}) {
  const [funnelName, setFunnelName] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [stages, setStages] = useState<Stage[]>([
    { id: '1', name: 'Prospecção', color: stageColors[0] },
    { id: '2', name: 'Qualificação', color: stageColors[1] },
    { id: '3', name: 'Proposta', color: stageColors[2] },
    { id: '4', name: 'Negociação', color: stageColors[3] },
    { id: '5', name: 'Fechamento', color: stageColors[4] },
  ]);
  const [newStageName, setNewStageName] = useState('');

  const moveStage = (dragIndex: number, hoverIndex: number) => {
    const draggedStage = stages[dragIndex];
    const newStages = [...stages];
    newStages.splice(dragIndex, 1);
    newStages.splice(hoverIndex, 0, draggedStage);
    setStages(newStages);
  };

  const addStage = () => {
    if (newStageName.trim()) {
      const newStage: Stage = {
        id: Date.now().toString(),
        name: newStageName.trim(),
        color: stageColors[stages.length % stageColors.length],
      };
      setStages([...stages, newStage]);
      setNewStageName('');
    }
  };

  const deleteStage = (id: string) => {
    setStages(stages.filter(s => s.id !== id));
  };

  const editStage = (id: string, newName: string) => {
    setStages(stages.map(s => s.id === id ? { ...s, name: newName } : s));
  };

  const handleSave = () => {
    if (funnelName.trim() && stages.length > 0) {
      onSave({ 
        name: funnelName.trim(), 
        stages,
        deals: [],
        productId: selectedProductId || undefined
      });
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gradient-to-br from-gray-900 to-black border border-[#1fff94]/30 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl shadow-[#1fff94]/20"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-white/10 bg-gradient-to-r from-[#1fff94]/10 to-transparent flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#1fff94]">Criar Novo Funil</h2>
              <p className="text-sm text-gray-400 mt-1">Configure as etapas do seu funil de vendas</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 bg-white/5 border border-white/10 rounded-lg hover:border-red-500/50 hover:bg-red-500/10 transition-all"
            >
              <X size={20} className="text-gray-400" />
            </motion.button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto overflow-x-hidden flex-1 min-h-0" style={{ overscrollBehavior: 'contain' }}>
          {/* Funnel Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nome do Funil
            </label>
            <input
              type="text"
              value={funnelName}
              onChange={(e) => setFunnelName(e.target.value)}
              placeholder="Ex: Vendas B2B, Vendas Online..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#1fff94]/50 focus:bg-white/10 transition-all"
            />
          </div>

          {/* Product Association */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Produto Associado (Opcional)
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#1fff94]/50 focus:bg-white/10 transition-all"
            >
              <option value="" className="bg-gray-900">Nenhum produto</option>
              {products.map(product => (
                <option key={product.id} value={product.id} className="bg-gray-900">
                  {product.name} - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                </option>
              ))}
            </select>
          </div>

          {/* Stages Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-300">
                Etapas do Funil
              </label>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <GripVertical size={14} className="text-[#1fff94]" />
                <span>Arraste para reordenar</span>
              </div>
            </div>

            {/* Help Banner */}
            {stages.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-3 p-3 bg-[#1fff94]/10 border border-[#1fff94]/30 rounded-xl flex items-center gap-3"
              >
                <div className="p-2 bg-[#1fff94]/20 rounded-lg">
                  <GripVertical size={16} className="text-[#1fff94]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-[#1fff94] font-medium">
                    💡 Clique e arraste o ícone de reordenar para mudar a ordem das etapas
                  </p>
                </div>
              </motion.div>
            )}

            <DndProvider backend={HTML5Backend}>
              <div className="space-y-3 mb-4 min-h-0">
                {stages.map((stage, index) => (
                  <DraggableStage
                    key={stage.id}
                    stage={stage}
                    index={index}
                    moveStage={moveStage}
                    onDelete={deleteStage}
                    onEdit={editStage}
                  />
                ))}
              </div>
            </DndProvider>

            {/* Add New Stage */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newStageName}
                onChange={(e) => setNewStageName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addStage()}
                placeholder="Nova etapa..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#1fff94]/50 focus:bg-white/10 transition-all text-sm"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={addStage}
                className="px-4 py-2.5 bg-[#1fff94]/20 border border-[#1fff94]/30 rounded-xl hover:bg-[#1fff94]/30 transition-all flex items-center gap-2"
              >
                <Plus size={18} className="text-[#1fff94]" />
                <span className="text-[#1fff94] text-sm font-medium">Adicionar</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-white/10 bg-black/50 flex gap-3 flex-shrink-0">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-white font-medium"
          >
            Cancelar
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={!funnelName.trim() || stages.length === 0}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-[#1fff94] to-[#00d976] rounded-xl hover:shadow-lg hover:shadow-[#1fff94]/50 transition-all text-black font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Criar Funil
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function CreateDealModal({ 
  onClose, 
  onSave,
  leads,
  firstStageId
}: { 
  onClose: () => void; 
  onSave: (deal: Omit<Deal, 'id' | 'createdAt' | 'stageId'>) => void;
  leads: Lead[];
  firstStageId: string;
}) {
  const [selectedLeadId, setSelectedLeadId] = useState('');
  const [dealName, setDealName] = useState('');
  const [dealValue, setDealValue] = useState('');
  const [dealDescription, setDealDescription] = useState('');

  const selectedLead = leads.find(l => l.id === selectedLeadId);

  const handleSave = () => {
    if (selectedLeadId && dealName.trim() && dealValue && dealDescription.trim()) {
      const lead = leads.find(l => l.id === selectedLeadId)!;
      // Convert formatted value (1.000,00) to number
      const numericValue = parseFloat(dealValue.replace(/\./g, '').replace(',', '.')) || 0;
      onSave({
        name: dealName.trim(),
        value: numericValue,
        company: lead.company,
        contact: lead.name,
        leadId: selectedLeadId,
        description: dealDescription.trim(),
      });
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gradient-to-br from-gray-900 to-black border border-[#1fff94]/30 rounded-3xl max-w-2xl w-full shadow-2xl shadow-[#1fff94]/20"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-white/10 bg-gradient-to-r from-[#1fff94]/10 to-transparent">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#1fff94]">Criar Novo Negócio</h2>
              <p className="text-sm text-gray-400 mt-1">Selecione um lead e adicione detalhes do negócio</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 bg-white/5 border border-white/10 rounded-lg hover:border-red-500/50 hover:bg-red-500/10 transition-all"
            >
              <X size={20} className="text-gray-400" />
            </motion.button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Select Lead */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Selecionar Lead
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {leads.map(lead => (
                <motion.div
                  key={lead.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedLeadId(lead.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    selectedLeadId === lead.id
                      ? 'bg-[#1fff94]/20 border-[#1fff94] shadow-lg shadow-[#1fff94]/30'
                      : 'bg-white/5 border-white/10 hover:border-[#1fff94]/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      selectedLeadId === lead.id ? 'bg-[#1fff94]/30' : 'bg-white/10'
                    }`}>
                      <User size={18} className={selectedLeadId === lead.id ? 'text-[#1fff94]' : 'text-gray-400'} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{lead.name}</h4>
                      <div className="flex items-center gap-4 mt-1">
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <Building size={12} />
                          {lead.company}
                        </p>
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <Mail size={12} />
                          {lead.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {selectedLead && (
            <>
              {/* Deal Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nome do Negócio
                </label>
                <input
                  type="text"
                  value={dealName}
                  onChange={(e) => setDealName(e.target.value)}
                  placeholder="Ex: Venda de produto X para empresa Y"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#1fff94]/50 focus:bg-white/10 transition-all"
                />
              </div>

              {/* Deal Value */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Valor do Negócio
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">R$</span>
                  <input
                    type="text"
                    value={dealValue}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, '');
                      if (value === '') {
                        setDealValue('');
                        return;
                      }
                      // Convert to cents
                      const numValue = parseFloat(value) / 100;
                      // Format as Brazilian currency
                      const formatted = numValue.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      });
                      setDealValue(formatted);
                    }}
                    placeholder="0,00"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#1fff94]/50 focus:bg-white/10 transition-all"
                  />
                </div>
              </div>

              {/* Deal Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Descrição do Negócio
                </label>
                <textarea
                  value={dealDescription}
                  onChange={(e) => setDealDescription(e.target.value)}
                  placeholder="Descreva os detalhes do negócio, necessidades do cliente, próximos passos..."
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#1fff94]/50 focus:bg-white/10 transition-all resize-none"
                />
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-white/10 bg-black/50 flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-white font-medium"
          >
            Cancelar
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={!selectedLeadId || !dealName.trim() || !dealValue || !dealDescription.trim()}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-[#1fff94] to-[#00d976] rounded-xl hover:shadow-lg hover:shadow-[#1fff94]/50 transition-all text-black font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Criar Negócio
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function FunnelCard({ 
  funnel, 
  onDelete, 
  onClick,
  products 
}: { 
  funnel: Funnel; 
  onDelete: (id: string) => void; 
  onClick: () => void;
  products: Product[];
}) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const associatedProduct = products.find(p => p.id === funnel.productId);

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-[#1fff94]/50 hover:from-[#1fff94]/10 hover:to-[#1fff94]/5 transition-all duration-300 cursor-pointer"
    >
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1fff94]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-[#1fff94] transition-colors">
              {funnel.name}
            </h3>
            <p className="text-xs text-gray-500">
              Criado em {new Date(funnel.createdAt).toLocaleDateString('pt-BR')}
            </p>
            {associatedProduct && (
              <div className="mt-2 flex items-center gap-2 px-2 py-1 bg-[#1fff94]/10 border border-[#1fff94]/30 rounded-lg w-fit">
                <Package size={12} className="text-[#1fff94]" />
                <span className="text-xs text-[#1fff94] font-medium">{associatedProduct.name}</span>
              </div>
            )}
          </div>
          
          <div className="relative" ref={menuRef}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-2 bg-white/5 border border-white/10 rounded-lg hover:border-[#1fff94]/50 hover:bg-[#1fff94]/10 transition-all"
            >
              <MoreVertical size={18} className="text-gray-400" />
            </motion.button>

            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-48 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl z-20"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(funnel.id);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#1fff94]/20 transition-colors text-left"
                  >
                    <Trash2 size={16} className="text-[#1fff94]" />
                    <span className="text-sm text-white">Excluir Funil</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Stages */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-400 mb-3">
            {funnel.stages.length} etapas • {funnel.deals?.length || 0} negócios
          </p>
          <div className="flex flex-wrap gap-2">
            {funnel.stages.map((stage, index) => (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg"
              >
                <span className="text-xs text-gray-300">{stage.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#1fff94] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-2xl" />
    </motion.div>
  );
}

// Componente de Deal Card
const DEAL_TYPE = 'DEAL';

interface DraggableDealProps {
  deal: Deal;
  index: number;
  moveDeal: (dealId: string, newStageId: string) => void;
}

function DraggableDeal({ deal, index }: DraggableDealProps) {
  const [{ isDragging }, drag] = useDrag({
    type: DEAL_TYPE,
    item: { dealId: deal.id, stageId: deal.stageId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <motion.div
      ref={drag}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: isDragging ? 0.5 : 1, 
        y: 0,
        scale: isDragging ? 1.05 : 1,
      }}
      transition={{ delay: index * 0.05 }}
      className={`bg-white/5 backdrop-blur-sm border rounded-xl p-4 cursor-grab active:cursor-grabbing transition-all ${
        isDragging 
          ? 'border-[#1fff94] shadow-lg shadow-[#1fff94]/30' 
          : 'border-white/10 hover:border-[#1fff94]/50 hover:bg-white/10'
      }`}
    >
      <h4 className="text-white font-medium text-sm mb-2">{deal.name}</h4>
      <div className="space-y-1.5">
        <p className="text-[#1fff94] font-bold text-lg">
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(deal.value)}
        </p>
        <p className="text-xs text-gray-400">{deal.company}</p>
        <p className="text-xs text-gray-500">{deal.contact}</p>
        {deal.description && (
          <p className="text-xs text-gray-500 mt-2 line-clamp-2">{deal.description}</p>
        )}
      </div>
    </motion.div>
  );
}

// Componente de Coluna de Etapa
interface StageColumnProps {
  stage: Stage;
  deals: Deal[];
  moveDeal: (dealId: string, newStageId: string) => void;
  searchQuery: string;
  allStages: Stage[];
  allDeals: Deal[];
  stageIndex: number;
}

function StageColumn({ stage, deals, moveDeal, searchQuery, allStages, allDeals, stageIndex }: StageColumnProps) {
  const [localSearch, setLocalSearch] = useState('');
  
  const [{ isOver }, drop] = useDrop({
    accept: DEAL_TYPE,
    drop: (item: { dealId: string; stageId: string }) => {
      if (item.stageId !== stage.id) {
        moveDeal(item.dealId, stage.id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  // Filtrar deals por pesquisa global ou local
  const filteredDeals = deals.filter(deal => {
    const matchesGlobal = searchQuery === '' || 
      deal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.company.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLocal = localSearch === '' || 
      deal.name.toLowerCase().includes(localSearch.toLowerCase()) ||
      deal.company.toLowerCase().includes(localSearch.toLowerCase());
    
    return matchesGlobal && matchesLocal;
  });

  const totalValue = filteredDeals.reduce((sum, deal) => sum + deal.value, 0);
  const dealsCount = filteredDeals.length;

  // Calcular taxa de conversão em relação à etapa anterior
  let conversionRate = 0;
  if (stageIndex > 0) {
    const previousStage = allStages[stageIndex - 1];
    const previousStageDealsCount = allDeals.filter(d => d.stageId === previousStage.id).length;
    if (previousStageDealsCount > 0) {
      conversionRate = (dealsCount / previousStageDealsCount) * 100;
    }
  }

  return (
    <div className="flex-shrink-0 w-80 flex flex-col relative group/column h-full">
      {/* Vertical accent line with animated flow */}
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#1fff94]/30 to-transparent overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1fff94] to-transparent"
          animate={{
            y: ['-100%', '200%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
      
      <div className="relative flex flex-col h-full">
        {/* Stage Header with gradient animation */}
        <div className="mb-4 space-y-3">
          <motion.div 
            className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-[#1fff94]/40 rounded-xl p-4 overflow-hidden group/header"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ 
              borderColor: 'rgba(31, 255, 148, 0.7)',
              boxShadow: '0 0 25px rgba(31, 255, 148, 0.2)'
            }}
            transition={{ duration: 0.5 }}
          >
            {/* Shimmer background - behind text */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1fff94]/5 to-transparent"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 1.5 }}
              style={{ zIndex: 0 }}
            />
            
            {/* Decorative corner accents */}
            <div className="absolute top-0 left-0 w-10 h-10 border-l-2 border-t-2 border-[#1fff94]/40 rounded-tl-xl" />
            <div className="absolute bottom-0 right-0 w-10 h-10 border-r-2 border-b-2 border-[#1fff94]/40 rounded-br-xl" />
            
            {/* Stage name */}
            <div className="relative z-10 flex items-center justify-between">
              <h3 className="text-white font-bold text-lg tracking-wide">
                {stage.name}
              </h3>
              
              {/* Animated pulse indicator */}
              <motion.div
                className="w-2.5 h-2.5 rounded-full bg-[#1fff94]"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [1, 0.6, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
            
            {/* Gradient underline */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#1fff94] via-[#00d976] to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{ transformOrigin: 'left', zIndex: 10 }}
            />
          </motion.div>
          
          {/* Stats card with gradient border and shimmer effect */}
          <motion.div 
            className="relative bg-gradient-to-br from-white/10 to-white/5 border border-[#1fff94]/30 rounded-xl p-3 space-y-2 overflow-hidden"
            whileHover={{ 
              borderColor: 'rgba(31, 255, 148, 0.6)',
              boxShadow: '0 0 20px rgba(31, 255, 148, 0.3)'
            }}
            transition={{ duration: 0.3 }}
          >
            {/* Shimmer effect - behind text */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1fff94]/10 to-transparent"
              animate={{
                x: ['-100%', '200%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
                repeatDelay: 1
              }}
              style={{ zIndex: 0 }}
            />
            
            <div className="relative z-10">
              <p className="text-xs text-gray-400">Valor Total</p>
              <motion.p 
                className="text-[#1fff94] font-bold text-lg"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue)}
              </motion.p>
            </div>
            <div className="relative z-10">
              <p className="text-xs text-gray-400">Negócios</p>
              <motion.p 
                className="text-white font-semibold"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                {dealsCount}
              </motion.p>
            </div>

            {/* Taxa de conversão */}
            {stageIndex > 0 && (
              <div className="relative z-10 pt-2 border-t border-[#1fff94]/20">
                <p className="text-xs text-gray-400">Taxa de Conversão</p>
                <motion.div 
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <p className={`font-bold text-sm ${
                    conversionRate >= 50 ? 'text-[#1fff94]' : 
                    conversionRate >= 30 ? 'text-yellow-400' : 
                    'text-red-400'
                  }`}>
                    {conversionRate.toFixed(1)}%
                  </p>
                  <motion.div
                    animate={{
                      y: conversionRate >= 50 ? [0, -2, 0] : [0, 2, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="text-sm"
                  >
                    {conversionRate >= 50 ? '↗' : '↘'}
                  </motion.div>
                </motion.div>
              </div>
            )}
            
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-[#1fff94]/50 rounded-tl-xl" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-[#1fff94]/50 rounded-br-xl" />
          </motion.div>

          {/* Local Search with glow effect */}
          <motion.div 
            className="relative"
            whileFocus={{ scale: 1.02 }}
          >
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 z-10" />
            
            {/* Glow effect on focus */}
            <motion.div
              className="absolute inset-0 bg-[#1fff94]/20 rounded-lg blur-md opacity-0 transition-opacity"
              animate={{ opacity: localSearch ? 0.5 : 0 }}
            />
            
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Buscar aqui..."
              className="relative w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#1fff94]/70 focus:bg-white/10 focus:shadow-[0_0_15px_rgba(31,255,148,0.3)] transition-all"
            />
            
            {/* Active indicator line */}
            {localSearch && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#1fff94] to-transparent"
              />
            )}
          </motion.div>
        </div>
      </div>

      {/* Deals List with drop zone */}
      <div 
        ref={drop}
        className={`flex-1 space-y-3 min-h-[500px] p-3 rounded-xl border-2 border-dashed transition-all ${
          isOver 
            ? 'border-[#1fff94] bg-[#1fff94]/10' 
            : 'border-transparent'
        }`}
      >
        {filteredDeals.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-gray-500 text-sm">
            {localSearch || searchQuery ? 'Nenhum negócio encontrado' : 'Nenhum negócio nesta etapa'}
          </div>
        ) : (
          filteredDeals.map((deal, index) => (
            <DraggableDeal
              key={deal.id}
              deal={deal}
              index={index}
              moveDeal={moveDeal}
            />
          ))
        )}
      </div>
    </div>
  );
}

// Componente de visualização do Funil
function FunnelView({ 
  funnel, 
  onBack, 
  onUpdateFunnel,
  leads
}: { 
  funnel: Funnel; 
  onBack: () => void; 
  onUpdateFunnel: (funnel: Funnel) => void;
  leads: Lead[];
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDealModal, setShowCreateDealModal] = useState(false);

  const moveDeal = (dealId: string, newStageId: string) => {
    const updatedDeals = funnel.deals.map(deal =>
      deal.id === dealId ? { ...deal, stageId: newStageId } : deal
    );
    onUpdateFunnel({ ...funnel, deals: updatedDeals });
  };

  const handleCreateDeal = (dealData: Omit<Deal, 'id' | 'createdAt' | 'stageId'>) => {
    const newDeal: Deal = {
      ...dealData,
      id: Date.now().toString(),
      stageId: funnel.stages[0].id,
      createdAt: new Date().toISOString(),
    };
    onUpdateFunnel({ ...funnel, deals: [...funnel.deals, newDeal] });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
          <motion.div
            className="absolute w-96 h-96 rounded-full blur-3xl opacity-10"
            style={{ backgroundColor: '#1fff94', top: '10%', right: '5%' }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.15, 0.1],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
        </div>

        {/* Header */}
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-30 bg-gradient-to-r from-[#1fff94]/15 via-white/5 to-[#1fff94]/15 backdrop-blur-md border-b border-[#1fff94]/30"
        >
          <div className="max-w-screen-2xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Left */}
              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onBack}
                  className="p-2 bg-white/5 border border-white/10 rounded-lg hover:border-[#1fff94]/50 hover:bg-[#1fff94]/5 transition-all"
                >
                  <ArrowLeft size={20} className="text-gray-400" />
                </motion.button>

                <div>
                  <h1 className="text-2xl font-bold text-[#1fff94]">{funnel.name}</h1>
                  <p className="text-sm text-gray-400">Visualização do funil de vendas</p>
                </div>
              </div>

              {/* Right */}
              <div className="flex items-center gap-3">
                {/* Global Search */}
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar negócios..."
                    className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#1fff94]/50 focus:bg-white/10 transition-all w-64"
                  />
                </div>

                {/* Create Deal Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCreateDealModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-[#1fff94] to-[#00d976] rounded-xl hover:shadow-lg hover:shadow-[#1fff94]/50 transition-all flex items-center gap-2"
                >
                  <Plus size={18} className="text-black" />
                  <span className="text-black font-bold">Criar Negócio</span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Estatísticas Totais */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative z-20 px-6 pt-4 pb-3"
        >
          <div className="flex items-center gap-4">
            {/* Valor Total Card */}
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-md border border-[#1fff94]/30 rounded-xl px-5 py-3 overflow-hidden group"
            >
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1fff94]/10 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
              />
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#1fff94] animate-pulse" />
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Valor Total</p>
                </div>
                <p className="text-[#1fff94] font-bold text-2xl">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                    funnel.deals.reduce((sum, deal) => sum + deal.value, 0)
                  )}
                </p>
              </div>

              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-12 h-12 border-r-2 border-t-2 border-[#1fff94]/30 rounded-tr-xl" />
            </motion.div>

            {/* Total de Negócios Card */}
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-md border border-[#1fff94]/30 rounded-xl px-5 py-3 overflow-hidden group"
            >
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1fff94]/10 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 1.5 }}
              />
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#1fff94] animate-pulse" />
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Total de Negócios</p>
                </div>
                <p className="text-white font-bold text-2xl">{funnel.deals.length}</p>
              </div>

              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-12 h-12 border-r-2 border-t-2 border-[#1fff94]/30 rounded-tr-xl" />
            </motion.div>
          </div>
        </motion.div>

        {/* Kanban Board */}
        <div className="relative z-10 p-6 min-h-[calc(100vh-280px)]">
          <div className="flex gap-6 overflow-x-auto pb-6 h-full">
            {funnel.stages.map((stage, index) => {
              const stageDeals = funnel.deals.filter(d => d.stageId === stage.id);
              return (
                <StageColumn
                  key={stage.id}
                  stage={stage}
                  deals={stageDeals}
                  moveDeal={moveDeal}
                  searchQuery={searchQuery}
                  allStages={funnel.stages}
                  allDeals={funnel.deals}
                  stageIndex={index}
                />
              );
            })}
          </div>
        </div>

        {/* Create Deal Modal */}
        <AnimatePresence>
          {showCreateDealModal && (
            <CreateDealModal
              onClose={() => setShowCreateDealModal(false)}
              onSave={handleCreateDeal}
              leads={leads}
              firstStageId={funnel.stages[0].id}
            />
          )}
        </AnimatePresence>
      </div>
    </DndProvider>
  );
}

// Componente de Leads
function LeadsView({ onBack }: { onBack: () => void }) {
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: '1',
      name: 'João Silva',
      email: 'joao@empresa.com',
      phone: '+55 11 98765-4321',
      company: 'Empresa XYZ',
      status: 'new',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Maria Santos',
      email: 'maria@tech.com',
      phone: '+55 21 91234-5678',
      company: 'Tech Solutions',
      status: 'qualified',
      createdAt: new Date().toISOString()
    }
  ]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newLead, setNewLead] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'new' as Lead['status']
  });

  const handleCreateLead = () => {
    if (newLead.name && newLead.email) {
      const lead: Lead = {
        ...newLead,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      setLeads([...leads, lead]);
      setNewLead({ name: '', email: '', phone: '', company: '', status: 'new' });
      setShowCreateModal(false);
    }
  };

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statusColors = {
    new: { bg: 'bg-[#1fff94]/20', border: 'border-[#1fff94]/50', text: 'text-[#1fff94]', label: 'Novo' },
    contacted: { bg: 'bg-[#1fff94]/20', border: 'border-[#1fff94]/50', text: 'text-[#1fff94]', label: 'Contatado' },
    qualified: { bg: 'bg-[#1fff94]/20', border: 'border-[#1fff94]/50', text: 'text-[#1fff94]', label: 'Qualificado' },
    unqualified: { bg: 'bg-[#1fff94]/20', border: 'border-[#1fff94]/50', text: 'text-[#1fff94]', label: 'Não Qualificado' }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        <motion.div
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{ backgroundColor: '#1fff94', top: '10%', right: '5%' }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-30 bg-gradient-to-r from-[#1fff94]/15 via-white/5 to-[#1fff94]/15 backdrop-blur-md border-b border-[#1fff94]/30"
      >
        <div className="max-w-screen-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onBack}
                className="p-2 bg-white/5 border border-white/10 rounded-lg hover:border-[#1fff94]/50 hover:bg-[#1fff94]/5 transition-all"
              >
                <ArrowLeft size={20} className="text-gray-400" />
              </motion.button>

              <div>
                <h1 className="text-2xl font-bold text-[#1fff94]">Leads</h1>
                <p className="text-sm text-gray-400">Gerencie seus leads</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar leads..."
                  className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#1fff94]/50 focus:bg-white/10 transition-all w-64"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-[#1fff94] to-[#00d976] rounded-xl hover:shadow-lg hover:shadow-[#1fff94]/50 transition-all flex items-center gap-2"
              >
                <Plus size={18} className="text-black" />
                <span className="text-black font-bold">Novo Lead</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Content */}
      <div className="relative z-10 p-6">
        <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLeads.map((lead, index) => (
            <motion.div
              key={lead.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-[#1fff94]/50 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-[#1fff94]/20 rounded-xl">
                    <User size={24} className="text-[#1fff94]" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold">{lead.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-lg ${statusColors[lead.status].bg} ${statusColors[lead.status].border} ${statusColors[lead.status].text} border`}>
                      {statusColors[lead.status].label}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Mail size={14} />
                  <span>{lead.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Phone size={14} />
                  <span>{lead.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Building size={14} />
                  <span>{lead.company}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Create Lead Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-gray-900 to-black border border-[#1fff94]/30 rounded-3xl max-w-2xl w-full shadow-2xl shadow-[#1fff94]/20"
            >
              <div className="p-6 border-b border-white/10 bg-gradient-to-r from-[#1fff94]/10 to-transparent">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-[#1fff94]">Novo Lead</h2>
                    <p className="text-sm text-gray-400 mt-1">Adicione as informações do lead</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowCreateModal(false)}
                    className="p-2 bg-white/5 border border-white/10 rounded-lg hover:border-red-500/50 hover:bg-red-500/10 transition-all"
                  >
                    <X size={20} className="text-gray-400" />
                  </motion.button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Nome</label>
                  <input
                    type="text"
                    value={newLead.name}
                    onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#1fff94]/50 focus:bg-white/10 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={newLead.email}
                    onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#1fff94]/50 focus:bg-white/10 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Telefone</label>
                  <input
                    type="tel"
                    value={newLead.phone}
                    onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#1fff94]/50 focus:bg-white/10 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Empresa</label>
                  <input
                    type="text"
                    value={newLead.company}
                    onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#1fff94]/50 focus:bg-white/10 transition-all"
                  />
                </div>
              </div>

              <div className="p-6 border-t border-white/10 bg-black/50 flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-white font-medium"
                >
                  Cancelar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCreateLead}
                  disabled={!newLead.name || !newLead.email}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#1fff94] to-[#00d976] rounded-xl hover:shadow-lg hover:shadow-[#1fff94]/50 transition-all text-black font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Criar Lead
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Componente de Produtos
function ProductsView({ onBack }: { onBack: () => void }) {
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Software ERP',
      description: 'Sistema completo de gestão empresarial',
      price: 5999.99,
      category: 'Software',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Consultoria Premium',
      description: 'Consultoria especializada em processos',
      price: 15000.00,
      category: 'Serviços',
      createdAt: new Date().toISOString()
    }
  ]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: ''
  });

  const handleCreateProduct = () => {
    if (newProduct.name && newProduct.price) {
      const product: Product = {
        ...newProduct,
        price: parseFloat(newProduct.price),
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      setProducts([...products, product]);
      setNewProduct({ name: '', description: '', price: '', category: '' });
      setShowCreateModal(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        <motion.div
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{ backgroundColor: '#1fff94', top: '10%', right: '5%' }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-30 bg-gradient-to-r from-[#1fff94]/15 via-white/5 to-[#1fff94]/15 backdrop-blur-md border-b border-[#1fff94]/30"
      >
        <div className="max-w-screen-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onBack}
                className="p-2 bg-white/5 border border-white/10 rounded-lg hover:border-[#1fff94]/50 hover:bg-[#1fff94]/5 transition-all"
              >
                <ArrowLeft size={20} className="text-gray-400" />
              </motion.button>

              <div>
                <h1 className="text-2xl font-bold text-[#1fff94]">Produtos</h1>
                <p className="text-sm text-gray-400">Gerencie seu catálogo de produtos</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar produtos..."
                  className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#1fff94]/50 focus:bg-white/10 transition-all w-64"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-[#1fff94] to-[#00d976] rounded-xl hover:shadow-lg hover:shadow-[#1fff94]/50 transition-all flex items-center gap-2"
              >
                <Plus size={18} className="text-black" />
                <span className="text-black font-bold">Novo Produto</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Content */}
      <div className="relative z-10 p-6">
        <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-[#1fff94]/50 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-[#1fff94]/20 rounded-xl">
                    <Package size={24} className="text-[#1fff94]" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold">{product.name}</h3>
                    <span className="text-xs px-2 py-1 rounded-lg bg-[#1fff94]/20 border border-[#1fff94]/50 text-[#1fff94]">
                      {product.category}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-400 mb-4">{product.description}</p>

              <div className="flex items-center gap-2">
                <Tag size={16} className="text-[#1fff94]" />
                <span className="text-2xl font-bold text-[#1fff94]">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Create Product Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-gray-900 to-black border border-[#1fff94]/30 rounded-3xl max-w-2xl w-full shadow-2xl shadow-[#1fff94]/20"
            >
              <div className="p-6 border-b border-white/10 bg-gradient-to-r from-[#1fff94]/10 to-transparent">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-[#1fff94]">Novo Produto</h2>
                    <p className="text-sm text-gray-400 mt-1">Adicione um novo produto ao catálogo</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowCreateModal(false)}
                    className="p-2 bg-white/5 border border-white/10 rounded-lg hover:border-red-500/50 hover:bg-red-500/10 transition-all"
                  >
                    <X size={20} className="text-gray-400" />
                  </motion.button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Nome do Produto</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#1fff94]/50 focus:bg-white/10 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Descrição</label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#1fff94]/50 focus:bg-white/10 transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Preço</label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#1fff94]/50 focus:bg-white/10 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Categoria</label>
                  <input
                    type="text"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#1fff94]/50 focus:bg-white/10 transition-all"
                  />
                </div>
              </div>

              <div className="p-6 border-t border-white/10 bg-black/50 flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-white font-medium"
                >
                  Cancelar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCreateProduct}
                  disabled={!newProduct.name || !newProduct.price}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#1fff94] to-[#00d976] rounded-xl hover:shadow-lg hover:shadow-[#1fff94]/50 transition-all text-black font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Criar Produto
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function CRMApp({ onBack }: CRMAppProps) {
  const [currentView, setCurrentView] = useState<'funnels' | 'leads' | 'products'>('funnels');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [funnels, setFunnels] = useState<Funnel[]>([]);
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: '1',
      name: 'João Silva',
      email: 'joao@empresa.com',
      phone: '+55 11 98765-4321',
      company: 'Empresa XYZ',
      status: 'new',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Maria Santos',
      email: 'maria@tech.com',
      phone: '+55 21 91234-5678',
      company: 'Tech Solutions',
      status: 'qualified',
      createdAt: new Date().toISOString()
    }
  ]);
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Software ERP',
      description: 'Sistema completo de gestão empresarial',
      price: 5999.99,
      category: 'Software',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Consultoria Premium',
      description: 'Consultoria especializada em processos',
      price: 15000.00,
      category: 'Serviços',
      createdAt: new Date().toISOString()
    }
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFunnel, setSelectedFunnel] = useState<Funnel | null>(null);

  const handleCreateFunnel = (funnelData: Omit<Funnel, 'id' | 'createdAt'>) => {
    const newFunnel: Funnel = {
      ...funnelData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setFunnels([...funnels, newFunnel]);
  };

  const handleDeleteFunnel = (id: string) => {
    setFunnels(funnels.filter(f => f.id !== id));
  };

  const handleUpdateFunnel = (updatedFunnel: Funnel) => {
    setFunnels(funnels.map(f => f.id === updatedFunnel.id ? updatedFunnel : f));
    setSelectedFunnel(updatedFunnel);
  };

  const handleFunnelClick = (funnel: Funnel) => {
    setSelectedFunnel(funnel);
  };

  const filteredFunnels = funnels.filter(funnel =>
    funnel.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Views de Leads e Produtos
  if (currentView === 'leads') {
    return <LeadsView onBack={() => setCurrentView('funnels')} />;
  }

  if (currentView === 'products') {
    return <ProductsView onBack={() => setCurrentView('funnels')} />;
  }

  // Se um funil está selecionado, mostrar a visualização do funil
  if (selectedFunnel) {
    return (
      <FunnelView
        funnel={selectedFunnel}
        onBack={() => setSelectedFunnel(null)}
        onUpdateFunnel={handleUpdateFunnel}
        leads={leads}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <AppHeader
        title="CRM"
        subtitle="Gestão de vendas"
        icon={ShoppingCart}
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
              onClick={() => setShowCreateModal(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-[#1fff94] to-[#00d976] rounded-xl font-medium text-black hover:shadow-lg hover:shadow-[#1fff94]/50 transition-all flex items-center gap-2"
            >
              <Plus size={18} />
              Novo Funil
            </motion.button>
          </>
        }
      />

      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <motion.div
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{ backgroundColor: '#1fff94', top: '10%', right: '5%' }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{ backgroundColor: '#1fff94', bottom: '15%', left: '10%' }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.15, 0.1, 0.15],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6"
      >
        <div className="max-w-7xl mx-auto">

          {/* Search and Navigation */}
          <div className="flex gap-3 mb-6">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar funis..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#1fff94]/50 focus:bg-white/10 transition-all"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentView('leads')}
              className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:border-[#1fff94]/50 hover:bg-[#1fff94]/10 transition-all flex items-center gap-2"
            >
              <User size={18} className="text-[#1fff94]" />
              <span className="text-white font-medium">Leads</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentView('products')}
              className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:border-[#1fff94]/50 hover:bg-[#1fff94]/10 transition-all flex items-center gap-2"
            >
              <Package size={18} className="text-[#1fff94]" />
              <span className="text-white font-medium">Produtos</span>
            </motion.button>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#1fff94]/20 rounded-xl">
                  <Filter size={24} className="text-[#1fff94]" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total de Funis</p>
                  <p className="text-white text-2xl font-bold">{funnels.length}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#1fff94]/20 rounded-xl">
                  <User size={24} className="text-[#1fff94]" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total de Leads</p>
                  <p className="text-white text-2xl font-bold">{leads.length}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#1fff94]/20 rounded-xl">
                  <Package size={24} className="text-[#1fff94]" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total de Produtos</p>
                  <p className="text-white text-2xl font-bold">{products.length}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Funnels Grid */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Meus Funis ({filteredFunnels.length})</h2>
              <p className="text-sm text-gray-400">Clique em um funil para visualizar e gerenciar seus leads</p>
            </div>

            {filteredFunnels.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20"
              >
                <div className="p-6 bg-white/5 rounded-full mb-4">
                  <Filter size={48} className="text-gray-600" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {searchQuery ? 'Nenhum funil encontrado' : 'Nenhum funil criado ainda'}
                </h3>
                <p className="text-gray-400 mb-6">
                  {searchQuery ? 'Tente buscar por outro termo' : 'Crie seu primeiro funil de vendas para começar'}
                </p>
                {!searchQuery && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowCreateModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-[#1fff94] to-[#00d976] rounded-xl hover:shadow-lg hover:shadow-[#1fff94]/50 transition-all flex items-center gap-2"
                  >
                    <Plus size={20} className="text-black" />
                    <span className="text-black font-bold">Criar Primeiro Funil</span>
                  </motion.button>
                )}
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFunnels.map(funnel => (
                  <FunnelCard
                    key={funnel.id}
                    funnel={funnel}
                    onDelete={handleDeleteFunnel}
                    onClick={() => handleFunnelClick(funnel)}
                    products={products}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Create Funnel Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateFunnelModal
            onClose={() => setShowCreateModal(false)}
            onSave={handleCreateFunnel}
            products={products}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

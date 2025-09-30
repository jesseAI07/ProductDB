import React, { useState } from 'react';

import { ShoppingBag, Package, DollarSign, TrendingUp, Plus, Edit2, Trash2, Mail, Search, Filter, BarChart3, AlertTriangle, Sparkles, Tag, Heart } from 'lucide-react';

export default function BoutiqueInventoryApp() {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [activeTab, setActiveTab] = useState('inventory');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLowStock, setFilterLowStock] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '', price: '', quantity: '', sku: '', category: '', description: '', image: ''
  });

  const [saleData, setSaleData] = useState({
    productId: '', quantity: 1, customerName: '', customerEmail: '', notes: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = () => {
    if (!formData.name || !formData.price || !formData.quantity) {
      alert('Please fill in all required fields');
      return;
    }
    const newProduct = {
      id: Date.now(), ...formData,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity),
      createdAt: new Date().toISOString()
    };
    setProducts(prev => [...prev, newProduct]);
    resetForm();
  };

  const handleUpdateProduct = () => {
    setProducts(prev => prev.map(p => 
      p.id === editingProduct.id 
        ? { ...p, ...formData, price: parseFloat(formData.price), quantity: parseInt(formData.quantity) }
        : p
    ));
    resetForm();
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleSale = () => {
    const product = products.find(p => p.id === parseInt(saleData.productId));
    if (!product) {
      alert('Please select a product');
      return;
    }
    if (saleData.quantity > product.quantity) {
      alert('Not enough stock available');
      return;
    }
    if (!saleData.customerEmail) {
      alert('Please enter customer email');
      return;
    }
    const sale = {
      id: Date.now(), productId: product.id, productName: product.name,
      quantity: saleData.quantity, price: product.price,
      total: product.price * saleData.quantity,
      customerName: saleData.customerName,
      customerEmail: saleData.customerEmail,
      notes: saleData.notes,
      date: new Date().toISOString()
    };
    setProducts(prev => prev.map(p => 
      p.id === product.id ? { ...p, quantity: p.quantity - saleData.quantity } : p
    ));
    setSales(prev => [sale, ...prev]);
    sendReceipt(sale);
    resetSaleForm();
    setShowSaleModal(false);
    alert('Sale completed! Receipt sent to customer.');
  };

  const sendReceipt = (sale) => {
    const subject = `Receipt from Adoma's Boutique - Order #${sale.id}`;
    const body = `Dear ${sale.customerName || 'Valued Customer'},\n\nThank you for your purchase!\n\nORDER DETAILS:\nOrder Number: ${sale.id}\nDate: ${new Date(sale.date).toLocaleDateString()}\n\nITEMS:\n- ${sale.productName} x ${sale.quantity}\n  Price: $${sale.price.toFixed(2)} each\n\nTOTAL: $${sale.total.toFixed(2)}\n\n${sale.notes ? `Notes: ${sale.notes}\n\n` : ''}Thank you for shopping with us!\n\nBest regards,\nBoutique Luxe Team`;
    const mailtoLink = `mailto:${sale.customerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink, '_blank');
  };

  const resetForm = () => {
    setFormData({ name: '', price: '', quantity: '', sku: '', category: '', description: '', image: '' });
    setShowAddModal(false);
  };

  const resetSaleForm = () => {
    setSaleData({ productId: '', quantity: 1, customerName: '', customerEmail: '', notes: '' });
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name, price: product.price, quantity: product.quantity,
      sku: product.sku || '', category: product.category || '',
      description: product.description || '', image: product.image || ''
    });
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = !filterLowStock || p.quantity < 10;
    return matchesSearch && matchesFilter;
  });

  const totalInventoryValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
  const totalSales = sales.reduce((sum, s) => sum + s.total, 0);
  const lowStockItems = products.filter(p => p.quantity < 10).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-200/30 to-fuchsia-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-rose-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto p-4 md:p-8 max-w-7xl relative z-10">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-8 border border-pink-100">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="bg-gradient-to-br from-rose-400 to-fuchsia-500 p-4 rounded-2xl shadow-lg">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-serif font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-fuchsia-600 bg-clip-text text-transparent">
                  Adoma's Boutique
                </h1>
                <p className="text-gray-600 font-light tracking-wide mt-1">Inventory & Sales Management</p>
              </div>
            </div>
            <button onClick={() => setShowSaleModal(true)} className="group bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 text-white px-8 py-4 rounded-full font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-3">
              <ShoppingBag className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              New Sale
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="group bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-blue-100 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-light tracking-wide uppercase mb-1">Products</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{products.length}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-400 to-cyan-400 p-4 rounded-xl shadow-lg group-hover:rotate-6 transition-transform">
                <Package className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          
          <div className="group bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-emerald-100 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-light tracking-wide uppercase mb-1">Value</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">${totalInventoryValue.toFixed(0)}</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-400 to-teal-400 p-4 rounded-xl shadow-lg group-hover:rotate-6 transition-transform">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          
          <div className="group bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-purple-100 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-light tracking-wide uppercase mb-1">Sales</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">${totalSales.toFixed(0)}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-400 to-pink-400 p-4 rounded-xl shadow-lg group-hover:rotate-6 transition-transform">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          
          <div className="group bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-rose-100 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-light tracking-wide uppercase mb-1">Low Stock</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-red-600 bg-clip-text text-transparent">{lowStockItems}</p>
              </div>
              <div className="bg-gradient-to-br from-rose-400 to-red-400 p-4 rounded-xl shadow-lg group-hover:rotate-6 transition-transform">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-pink-100 overflow-hidden">
          <div className="flex border-b border-pink-100 bg-gradient-to-r from-rose-50 to-fuchsia-50">
            <button onClick={() => setActiveTab('inventory')} className={`flex-1 px-8 py-5 font-semibold tracking-wide transition-all duration-300 relative ${activeTab === 'inventory' ? 'text-fuchsia-600' : 'text-gray-500 hover:text-fuchsia-600'}`}>
              <span className="flex items-center justify-center gap-2">
                <Package className="w-5 h-5" />
                Inventory
              </span>
              {activeTab === 'inventory' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 rounded-t-full"></div>}
            </button>
            <button onClick={() => setActiveTab('sales')} className={`flex-1 px-8 py-5 font-semibold tracking-wide transition-all duration-300 relative ${activeTab === 'sales' ? 'text-fuchsia-600' : 'text-gray-500 hover:text-fuchsia-600'}`}>
              <span className="flex items-center justify-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Sales History
              </span>
              {activeTab === 'sales' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 rounded-t-full"></div>}
            </button>
          </div>

          <div className="p-6 md:p-8">
            {activeTab === 'inventory' && (
              <>
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input type="text" placeholder="Search your collection..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-4 border-2 border-pink-100 rounded-2xl focus:outline-none focus:border-fuchsia-300 bg-white/50 backdrop-blur transition-all" />
                    </div>
                  </div>
                  <button onClick={() => setFilterLowStock(!filterLowStock)} className={`px-6 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-2 ${filterLowStock ? 'bg-gradient-to-r from-rose-500 to-red-500 text-white shadow-lg' : 'bg-white border-2 border-pink-100 text-gray-700 hover:border-fuchsia-300'}`}>
                    <Filter className="w-5 h-5" />
                    Low Stock
                  </button>
                  <button onClick={() => setShowAddModal(true)} className="bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Add Product
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map(product => (
                    <div key={product.id} className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-pink-100 hover:scale-105">
                      <div className="relative h-64 bg-gradient-to-br from-pink-50 to-fuchsia-50 overflow-hidden">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-20 h-20 text-pink-200" />
                          </div>
                        )}
                        <div className="absolute top-4 right-4">
                          <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg backdrop-blur-sm ${product.quantity < 10 ? 'bg-red-500/90 text-white' : 'bg-emerald-500/90 text-white'}`}>
                            {product.quantity} left
                          </span>
                        </div>
                        {product.quantity < 5 && (
                          <div className="absolute top-4 left-4">
                            <span className="bg-rose-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">LOW STOCK</span>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-bold text-xl text-gray-800 mb-1 line-clamp-1">{product.name}</h3>
                            {product.sku && <p className="text-xs text-gray-500 font-mono">SKU: {product.sku}</p>}
                          </div>
                        </div>
                        {product.category && (
                          <div className="flex items-center gap-2 mb-3">
                            <Tag className="w-4 h-4 text-fuchsia-500" />
                            <span className="text-sm text-fuchsia-600 font-medium">{product.category}</span>
                          </div>
                        )}
                        <div className="flex items-baseline gap-2 mb-3">
                          <span className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-fuchsia-600 bg-clip-text text-transparent">${product.price.toFixed(2)}</span>
                        </div>
                        {product.description && (
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">{product.description}</p>
                        )}
                        <div className="flex gap-2">
                          <button onClick={() => openEditModal(product)} className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-3 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 font-medium">
                            <Edit2 className="w-4 h-4" />
                            Edit
                          </button>
                          <button onClick={() => handleDeleteProduct(product.id)} className="bg-gradient-to-r from-rose-500 to-red-500 text-white px-4 py-3 rounded-xl hover:shadow-lg transition-all duration-300">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredProducts.length === 0 && (
                  <div className="text-center py-20">
                    <div className="bg-gradient-to-br from-pink-100 to-fuchsia-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Package className="w-16 h-16 text-fuchsia-400" />
                    </div>
                    <p className="text-gray-600 text-xl font-light">No products in your collection yet</p>
                    <p className="text-gray-400 text-sm mt-2">Add your first item to get started</p>
                  </div>
                )}
              </>
            )}

            {activeTab === 'sales' && (
              <div className="space-y-6">
                {sales.map(sale => (
                  <div key={sale.id} className="group bg-gradient-to-br from-white to-pink-50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-pink-100">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="bg-gradient-to-br from-fuchsia-500 to-pink-500 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg">
                            <ShoppingBag className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-xl text-gray-800">{sale.productName}</h3>
                            <p className="text-sm text-gray-500">Order #{sale.id}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">{new Date(sale.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Heart className="w-4 h-4 text-pink-500" />
                          <span className="font-semibold">{sale.customerName || 'Guest'}</span>
                          <span>•</span>
                          <span>{sale.customerEmail}</span>
                        </div>
                        {sale.notes && <p className="text-sm text-gray-600 mt-2 italic bg-pink-50 p-3 rounded-lg">{sale.notes}</p>}
                      </div>
                      <div className="text-right">
                        <p className="text-4xl font-bold bg-gradient-to-r from-fuchsia-600 to-pink-600 bg-clip-text text-transparent mb-1">${sale.total.toFixed(2)}</p>
                        <p className="text-sm text-gray-600 mb-4">{sale.quantity} × ${sale.price.toFixed(2)}</p>
                        <button onClick={() => sendReceipt(sale)} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2 font-medium">
                          <Mail className="w-4 h-4" />
                          Resend Receipt
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {sales.length === 0 && (
                  <div className="text-center py-20">
                    <div className="bg-gradient-to-br from-purple-100 to-pink-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6">
                      <BarChart3 className="w-16 h-16 text-fuchsia-400" />
                    </div>
                    <p className="text-gray-600 text-xl font-light">No sales recorded yet</p>
                    <p className="text-gray-400 text-sm mt-2">Your sales history will appear here</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {(showAddModal || editingProduct) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-pink-100">
            <div className="bg-gradient-to-r from-rose-50 via-pink-50 to-fuchsia-50 p-8 border-b border-pink-100">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-fuchsia-500 to-pink-500 p-3 rounded-2xl">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-serif font-bold bg-gradient-to-r from-rose-600 to-fuchsia-600 bg-clip-text text-transparent">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              </div>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Product Name *</label>
                <input type="text" name="name" value={formData.name} onChange={(e) => handleInputChange(e.target)} className="w-full px-5 py-4 border-2 border-pink-100 rounded-2xl focus:outline-none focus:border-fuchsia-300 transition-all" placeholder="Enter product name" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Price ($) *</label>
                  <input type="number" name="price" value={formData.price} onChange={(e) => handleInputChange(e.target)} className="w-full px-5 py-4 border-2 border-pink-100 rounded-2xl focus:outline-none focus:border-fuchsia-300 transition-all" placeholder="0.00" step="0.01" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Quantity *</label>
                  <input type="number" name="quantity" value={formData.quantity} onChange={(e) => handleInputChange(e.target)} className="w-full px-5 py-4 border-2 border-pink-100 rounded-2xl focus:outline-none focus:border-fuchsia-300 transition-all" placeholder="0" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">SKU</label>
                  <input type="text" name="sku" value={formData.sku} onChange={(e) => handleInputChange(e.target)} className="w-full px-5 py-4 border-2 border-pink-100 rounded-2xl focus:outline-none focus:border-fuchsia-300 transition-all" placeholder="Product SKU" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Category</label>
                  <input type="text" name="category" value={formData.category} onChange={(e) => handleInputChange(e.target)} className="w-full px-5 py-4 border-2 border-pink-100 rounded-2xl focus:outline-none focus:border-fuchsia-300 transition-all" placeholder="e.g., Dresses" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Description</label>
                <textarea name="description" value={formData.description} onChange={(e) => handleInputChange(e.target)} className="w-full px-5 py-4 border-2 border-pink-100 rounded-2xl focus:outline-none focus:border-fuchsia-300 transition-all" placeholder="Product description" rows="3" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Product Image</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full px-5 py-4 border-2 border-pink-100 rounded-2xl focus:outline-none focus:border-fuchsia-300 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-gradient-to-r file:from-fuchsia-500 file:to-pink-500 file:text-white file:font-semibold hover:file:shadow-lg" />
                {formData.image && (
                  <div className="mt-4">
                    <img src={formData.image} alt="Preview" className="h-40 rounded-2xl object-cover shadow-lg border-2 border-pink-100" />
                  </div>
                )}
              </div>
            </div>
            <div className="p-8 border-t border-pink-100 flex gap-4 justify-end bg-gradient-to-r from-rose-50 to-fuchsia-50">
              <button onClick={() => { resetForm(); setEditingProduct(null); }} className="px-8 py-4 border-2 border-pink-200 rounded-2xl hover:bg-pink-50 transition-all font-semibold text-gray-700">Cancel</button>
              <button onClick={editingProduct ? handleUpdateProduct : handleAddProduct} className="px-8 py-4 bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 text-white rounded-2xl hover:shadow-2xl hover:scale-105 transition-all font-semibold">{editingProduct ? 'Update Product' : 'Add Product'}</button>
            </div>
          </div>
        </div>
      )}

      {showSaleModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-pink-100">
            <div className="bg-gradient-to-r from-rose-50 via-pink-50 to-fuchsia-50 p-8 border-b border-pink-100">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-fuchsia-500 to-pink-500 p-3 rounded-2xl">
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-serif font-bold bg-gradient-to-r from-rose-600 to-fuchsia-600 bg-clip-text text-transparent">New Sale</h2>
              </div>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Select Product *</label>
                <select value={saleData.productId} onChange={(e) => setSaleData(prev => ({ ...prev, productId: e.target.value }))} className="w-full px-5 py-4 border-2 border-pink-100 rounded-2xl focus:outline-none focus:border-fuchsia-300 transition-all bg-white">
                  <option value="">Choose a product...</option>
                  {products.filter(p => p.quantity > 0).map(p => (
                    <option key={p.id} value={p.id}>{p.name} - ${p.price.toFixed(2)} ({p.quantity} available)</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Quantity *</label>
                <input type="number" min="1" value={saleData.quantity} onChange={(e) => setSaleData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))} className="w-full px-5 py-4 border-2 border-pink-100 rounded-2xl focus:outline-none focus:border-fuchsia-300 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Customer Name</label>
                <input type="text" value={saleData.customerName} onChange={(e) => setSaleData(prev => ({ ...prev, customerName: e.target.value }))} className="w-full px-5 py-4 border-2 border-pink-100 rounded-2xl focus:outline-none focus:border-fuchsia-300 transition-all" placeholder="Enter customer name" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Customer Email *</label>
                <input type="email" value={saleData.customerEmail} onChange={(e) => setSaleData(prev => ({ ...prev, customerEmail: e.target.value }))} className="w-full px-5 py-4 border-2 border-pink-100 rounded-2xl focus:outline-none focus:border-fuchsia-300 transition-all" placeholder="customer@example.com" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Notes</label>
                <textarea value={saleData.notes} onChange={(e) => setSaleData(prev => ({ ...prev, notes: e.target.value }))} className="w-full px-5 py-4 border-2 border-pink-100 rounded-2xl focus:outline-none focus:border-fuchsia-300 transition-all" placeholder="Additional notes..." rows="2" />
              </div>
              {saleData.productId && (
                <div className="bg-gradient-to-br from-pink-50 to-fuchsia-50 p-6 rounded-2xl border-2 border-pink-200">
                  <p className="text-sm text-gray-600 mb-2 font-light tracking-wide uppercase">Total Amount</p>
                  <p className="text-5xl font-bold bg-gradient-to-r from-fuchsia-600 to-pink-600 bg-clip-text text-transparent">${(products.find(p => p.id === parseInt(saleData.productId))?.price * saleData.quantity || 0).toFixed(2)}</p>
                </div>
              )}
            </div>
            <div className="p-8 border-t border-pink-100 flex gap-4 justify-end bg-gradient-to-r from-rose-50 to-fuchsia-50">
              <button onClick={() => { setShowSaleModal(false); resetSaleForm(); }} className="px-8 py-4 border-2 border-pink-200 rounded-2xl hover:bg-pink-50 transition-all font-semibold text-gray-700">Cancel</button>
              <button onClick={handleSale} className="px-8 py-4 bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 text-white rounded-2xl hover:shadow-2xl hover:scale-105 transition-all font-semibold flex items-center gap-3">
                <Mail className="w-5 h-5" />
                Complete Sale & Send Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
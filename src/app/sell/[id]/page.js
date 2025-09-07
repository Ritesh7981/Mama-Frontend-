"use client"

import React, { useState } from 'react';
import { Trash2, AlertTriangle, Check, X, Smartphone, Tag, TagIcon } from 'lucide-react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useSearchParams } from "next/navigation";
const DeleteItemForm = () => {
    const { id } = useParams();
    const router = useRouter();
   const query= useSearchParams()
   const name = query.get('name');
   const price = query.get('price');
   const description = query.get('description');
  const [formData, setFormData] = useState({
    id: id,
    name: name,
    price: price,
    quantity:1,
    description: description
  });
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'quantity' ? Number(value) : value
    }));
  };

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await axios.post('https://mama-two-lime.vercel.app/api/delete', {
       
        ...formData
      });

      const data = await res.data;
       setResponse(data);
        setShowConfirmDialog(false);
     
    } catch (err) {
        setError(data.message || 'Failed to delete item');
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      price: 0,
      quantity: 0,
      description: ""
    });
    setResponse(null);
    setError(null);
    setShowConfirmDialog(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mb-6">
            <TagIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Sell <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-400">Item</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Remove items from your inventory with confirmation and tracking
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
            {/* Form Header */}
            <div className="flex items-center gap-3 mb-8">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl">
                <Smartphone className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">Item Details</h3>
            </div>

            <div className="space-y-6">
              {/* Item ID Field */}
            

              {/* Item Name Field */}
              <div>
                <label className="block text-lg font-semibold text-white mb-3">
                  Item Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-6 py-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                  placeholder="Enter item name"
                  required
                />
              </div>

              {/* Price and Quantity Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-lg font-semibold text-white mb-3">
                    Price
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-400" />
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-6 py-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                      placeholder="Enter price"
                      required
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-semibold text-white mb-3">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                    placeholder="Enter quantity"
                    required
                    min="0"
                  />
                </div>
              </div>

              {/* Description Field */}
              <div>
                <label className="block text-lg font-semibold text-white mb-3">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-6 py-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all resize-none"
                  placeholder="Enter item description"
                  required
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8 mb-8">
              <button
                type="button"
                onClick={() => setShowConfirmDialog(true)}
                disabled={!formData.id || !formData.name || !formData.description || loading}
                className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <Trash2 size={20} />
                Sell Item
              </button>
              
              <button
                type="button"
                onClick={resetForm}
                className="px-8 py-4 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                Reset
              </button>
            </div>

            {/* Confirmation Dialog */}
            {showConfirmDialog && (
              <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-8 max-w-md w-full">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-red-500/20 rounded-full">
                      <AlertTriangle className="text-red-400" size={28} />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Confirm Deletion</h3>
                  </div>
                  
                  <div className="mb-8">
                    <p className="text-slate-300 text-lg leading-relaxed mb-4">
                      Are you sure you want to delete this item? This action cannot be undone and will permanently remove the item from your inventory.
                    </p>
                    <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-600/30">
                      <h4 className="text-white font-semibold mb-2">Item to delete:</h4>
                      <div className="text-sm text-slate-300 space-y-1">
                        <div><span className="text-slate-400">Name:</span> {formData.name}</div>
                        <div><span className="text-slate-400">Price:</span> {formatPrice(formData.price)}</div>
                        <div><span className="text-slate-400">Quantity:</span> {formData.quantity}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <button
                      onClick={handleDelete}
                      disabled={loading}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      ) : (
                        <Check size={18} />
                      )}
                      {loading ? 'Deleting...' : 'Yes, Delete'}
                    </button>
                    
                    <button
                      onClick={() => setShowConfirmDialog(false)}
                      disabled={loading}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all duration-300"
                    >
                      <X size={18} />
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

         
            {/* Error Display */}
            {error && (
              <div className="p-6 bg-red-900/20 border border-red-500/30 rounded-xl mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-red-500/20 rounded-full">
                    <AlertTriangle className="text-red-400" size={20} />
                  </div>
                  <span className="font-semibold text-red-300 text-lg">Error</span>
                </div>
                <p className="text-red-200">{error}</p>
              </div>
            )}

           
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 bg-slate-800/30 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-slate-400">
            Powered by modern web technologies • Built with React & Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
};

export default DeleteItemForm;
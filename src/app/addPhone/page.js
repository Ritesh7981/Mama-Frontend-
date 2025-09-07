"use client"

import React, { useState } from 'react';
import { Plus, X, Smartphone, Tag, AlertCircle, Check } from 'lucide-react';
import { phoneAPI } from '@/utils/api';
import { ProtectedRoute } from '@/context/AuthContext';

const AddPhoneForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    description: '',
    quantity: 0,
    useIn: ['']
  });

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'quantity' ? Number(value) : value
    }));
  };

  const handleUseInChange = (index, value) => {
    const newUseIn = [...formData.useIn];
    newUseIn[index] = value;
    setFormData(prev => ({
      ...prev,
      useIn: newUseIn
    }));
  };

  const addUseInItem = () => {
    setFormData(prev => ({
      ...prev,
      useIn: [...prev.useIn, '']
    }));
  };

  const removeUseInItem = (index) => {
    setFormData(prev => ({
      ...prev,
      useIn: prev.useIn.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const data = await phoneAPI.create(formData);
      setResponse(data);
      // Reset form on successful submission
      setTimeout(() => {
        resetForm();
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to add phone');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: 0,
      description: '',
      quantity: 0,
      useIn: ['']
    });
    setResponse(null);
    setError(null);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-6">
              <Plus className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-white mb-4">
              Add <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Phone</span>
            </h1>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Add new smartphones to your inventory with detailed specifications and features
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
              {/* Form Header */}
              <div className="flex items-center gap-3 mb-8">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl">
                  <Smartphone className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Phone Details</h3>
              </div>

              <div className="space-y-6">
                {/* Phone Name Field */}
                <div>
                  <label className="block text-lg font-semibold text-white mb-3">
                    Phone Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                    placeholder="Enter phone name (e.g., iPhone 15 Pro Max)"
                    required
                  />
                </div>

                {/* Price and Quantity Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-lg font-semibold text-white mb-3">
                      Price (₹)
                    </label>
                    <div className="relative">
                      <Tag className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-400" />
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-6 py-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                        placeholder="Enter price in INR"
                        required
                        min="0"
                      />
                    </div>
                    {formData.price > 0 && (
                      <p className="text-sm text-green-400 mt-2">
                        {formatPrice(formData.price)}
                      </p>
                    )}
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
                      min="1"
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
                    placeholder="Enter detailed phone description, features, and specifications"
                    required
                  />
                </div>

                {/* Use Cases/Compatible With Field */}
                <div>
                  <label className="block text-lg font-semibold text-white mb-3">
                    Compatible With / Use Cases
                  </label>
                  <div className="space-y-3">
                    {formData.useIn.map((use, index) => (
                      <div key={index} className="flex gap-3">
                        <input
                          type="text"
                          value={use}
                          onChange={(e) => handleUseInChange(index, e.target.value)}
                          className="flex-1 px-6 py-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                          placeholder="Enter use case (Photography, Gaming, Business, etc.)"
                        />
                        {formData.useIn.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeUseInItem(index)}
                            className="px-4 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105"
                          >
                            <X size={20} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addUseInItem}
                      className="flex items-center gap-3 px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105"
                    >
                      <Plus size={20} />
                      Add Use Case
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!formData.name || !formData.description || formData.price <= 0 || formData.quantity <= 0 || loading}
                  className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  ) : (
                    <Plus size={20} />
                  )}
                  {loading ? 'Adding Phone...' : 'Add Phone'}
                </button>
                
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={loading}
                  className="px-8 py-4 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  Reset
                </button>
              </div>

              {/* Success Response Display */}
              {response && (
                <div className="p-6 bg-green-900/20 border border-green-500/30 rounded-xl mt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-500/20 rounded-full">
                      <Check className="text-green-400" size={20} />
                    </div>
                    <span className="font-semibold text-green-300 text-lg">Phone Added Successfully!</span>
                  </div>
                  <p className="text-green-200 mb-4">
                    {formData.name} has been successfully added to your inventory with {formData.quantity} units.
                  </p>
                  <div className="bg-green-800/20 rounded-lg p-4 border border-green-600/30">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-green-400">Name:</span>
                        <p className="text-green-200">{response.name || formData.name}</p>
                      </div>
                      <div>
                        <span className="text-green-400">Price:</span>
                        <p className="text-green-200">{formatPrice(response.price || formData.price)}</p>
                      </div>
                      <div>
                        <span className="text-green-400">Quantity:</span>
                        <p className="text-green-200">{response.quantity || formData.quantity} units</p>
                      </div>
                      <div>
                        <span className="text-green-400">ID:</span>
                        <p className="text-green-200 font-mono">{response._id || response.id || 'Generated'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="p-6 bg-red-900/20 border border-red-500/30 rounded-xl mt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-red-500/20 rounded-full">
                      <AlertCircle className="text-red-400" size={20} />
                    </div>
                    <span className="font-semibold text-red-300 text-lg">Failed to Add Phone</span>
                  </div>
                  <p className="text-red-200 mb-3">{error}</p>
                  <button
                    onClick={() => setError(null)}
                    className="text-sm text-red-300 hover:text-red-200 underline"
                  >
                    Dismiss
                  </button>
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
    </ProtectedRoute>
  );
};

export default AddPhoneForm;
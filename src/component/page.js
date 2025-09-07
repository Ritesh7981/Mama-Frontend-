"use client"

import React, { useState } from 'react';
import { Plus, X, Send, Check, AlertCircle } from 'lucide-react';

const PhoneAPIForm = () => {
  const [formData, setFormData] = useState({
    name: 'max display',
    price: 999,
    description: "Apple's latest flagship with A17 Pro chip, titanium frame, and improved cameras.",
    quantity: 20,
    useIn: ['vivo', 'realme', 'OPPO', 'test']
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
      const res = await fetch('https://mama-two-lime.vercel.app/api/Phone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      
      if (res.ok) {
        setResponse(data);
      } else {
        setError(data.message || 'Failed to submit');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Part Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter phone name"
                required
              />
            </div>

            {/* Price Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter price"
                required
                min="0"
              />
            </div>

            {/* Description Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="Enter phone description"
                required
              />
            </div>

            {/* Quantity Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter quantity"
                required
                min="0"
              />
            </div>

            {/* Use In Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Use In (Compatible Brands)
              </label>
              <div className="space-y-2">
                {formData.useIn.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleUseInChange(index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter brand name"
                    />
                    <button
                      type="button"
                      onClick={() => removeUseInItem(index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      disabled={formData.useIn.length === 1}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addUseInItem}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Plus size={16} />
                  Add Brand
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                ) : (
                  <Send size={16} />
                )}
                {loading ? 'Submitting...' : 'Submit Phone Data'}
              </button>
              
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Response/Error Display */}
          {response && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-800 font-medium mb-2">
                <Check size={16} />
                Success!
              </div>
              <pre className="text-sm text-green-700 overflow-x-auto">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-800 font-medium mb-2">
                <AlertCircle size={16} />
                Error
              </div>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* JSON Preview */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-800 mb-3">JSON Preview</h3>
            <pre className="text-sm text-gray-700 overflow-x-auto">
              {JSON.stringify(formData, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneAPIForm;
"use client"
import axios from 'axios';
import React, { useState } from 'react';
import { Smartphone, Search, Filter, ShoppingCart, Eye, Edit, Trash2, Package, Star, Zap } from 'lucide-react';

const PhoneInventoryUI = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterBy, setFilterBy] = useState('all');

  // Enhanced data based on your new response
  const phones = [
    {
        "_id": "68746f1aa697c8161d93a35f",
        "name": "iPhone 15 Pro Max",
        "price": 159999,
        "description": "Apple's latest flagship with A17 Pro chip, titanium frame, and improved cameras.",
        "useIn": [
            "Photography",
            "Gaming",
            "Business",
            "Content Creation"
        ],
        "__v": 0,
        "quantity": 50
    },
    {
        "_id": "6874733ef900359a7c84ec34",
        "name": "max display",
        "price": 999,
        "description": "Apple's latest flagship with A17 Pro chip, titanium frame, and improved cameras.",
        "useIn": [
            "vivo",
            "realme",
            "OPPO",
            "test",
            "vivo",
            "realme",
            "OPPO",
            "test"
        ],
        "__v": 0,
        "quantity": 50
    },
    {
        "_id": "687473868c1bff743211f2ec",
        "name": "max display",
        "price": 999,
        "quantity": 20,
        "description": "Apple's latest flagship with A17 Pro chip, titanium frame, and improved cameras.",
        "useIn": [
            "vivo",
            "realme",
            "OPPO",
            "test",
            "vivo",
            "realme",
            "OPPO",
            "test"
        ],
        "__v": 0
    },
    {
        "_id": "68b40c9ee51c21c68d75723f",
        "name": "max display",
        "price": 999,
        "quantity": 20,
        "description": "Apple's latest flagship with A17 Pro chip, titanium frame, and improved cameras.",
        "useIn": [
            "vivo",
            "realme",
            "OPPO",
            "test"
        ],
        "__v": 0
    }
  ];

  // Get all unique use cases for filtering
  const allUseCases = [...new Set(phones.flatMap(phone => phone.useIn || []))];

  const filteredPhones = phones.filter(phone => {
    const matchesSearch = phone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         phone.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (phone.useIn || []).some(use => use.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterBy === 'all' || 
                         (phone.useIn || []).some(use => use.toLowerCase() === filterBy.toLowerCase());
    
    return matchesSearch && matchesFilter;
  });

  const sortedPhones = [...filteredPhones].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'price') return a.price - b.price;
    if (sortBy === 'quantity') return b.quantity - a.quantity;
    return 0;
  });

  const formatPrice = (price) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const getQuantityStatus = (quantity) => {
    if (quantity === 0) return { color: 'text-red-400', bg: 'bg-red-900/30', label: 'Out of Stock' };
    if (quantity <= 10) return { color: 'text-yellow-400', bg: 'bg-yellow-900/30', label: 'Low Stock' };
    return { color: 'text-green-400', bg: 'bg-green-900/30', label: 'In Stock' };
  };

  const getUseInIcon = (useCase) => {
    const lowerCase = useCase.toLowerCase();
    if (lowerCase.includes('photography')) return '📸';
    if (lowerCase.includes('gaming')) return '🎮';
    if (lowerCase.includes('business')) return '💼';
    if (lowerCase.includes('content')) return '🎬';
    if (lowerCase.includes('vivo')) return '⚡';
    if (lowerCase.includes('realme')) return '🔥';
    if (lowerCase.includes('oppo')) return '✨';
    return '🔧';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
              Phone Gallery
            </h1>
          </div>
          <p className="text-purple-200">
            Discover the latest smartphones with cutting-edge technology and innovative features
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-slate-800/50 backdrop-blur-lg border border-purple-700/30 rounded-2xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-purple-400" />
                <input
                  type="text"
                  placeholder="Search phones, features..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-700/50 border border-purple-600/50 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-3 h-4 w-4 text-purple-400" />
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="bg-slate-700/50 border border-purple-600/50 rounded-lg pl-10 pr-8 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none cursor-pointer min-w-[150px]"
                >
                  <option value="all">All Categories</option>
                  {allUseCases.map(useCase => (
                    <option key={useCase} value={useCase}>{useCase}</option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div className="relative">
                <Zap className="absolute left-3 top-3 h-4 w-4 text-purple-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-700/50 border border-purple-600/50 rounded-lg pl-10 pr-8 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none cursor-pointer"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price">Sort by Price</option>
                  <option value="quantity">Sort by Stock</option>
                </select>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{phones.length}</div>
                <div className="text-purple-300">Total Items</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {phones.reduce((sum, phone) => sum + phone.quantity, 0)}
                </div>
                <div className="text-purple-300">Total Stock</div>
              </div>
            </div>
          </div>
        </div>

        {/* Phone Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedPhones.map((phone, index) => {
            const quantityStatus = getQuantityStatus(phone.quantity);
            const uniqueUseIn = [...new Set(phone.useIn || [])];
            
            return (
              <div
                key={phone._id}
                className="bg-slate-800/40 backdrop-blur-lg border border-purple-700/30 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300 group hover:transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20"
              >
                {/* Phone Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Smartphone className="w-8 h-8 text-white" />
                </div>

                {/* Phone Details */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors duration-300">
                      {phone.name}
                    </h3>
                    <p className="text-purple-200 text-sm mt-1 leading-relaxed">
                      {phone.description}
                    </p>
                  </div>

                  {/* Perfect For Section */}
                  {phone.useIn && phone.useIn.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm font-semibold text-white">Perfect For:</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {uniqueUseIn.slice(0, 4).map((useCase, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-purple-600/30 border border-purple-500/50 rounded-full text-xs text-purple-200 font-medium"
                          >
                            <span>{getUseInIcon(useCase)}</span>
                            {useCase}
                          </span>
                        ))}
                        {uniqueUseIn.length > 4 && (
                          <span className="inline-flex items-center px-2 py-1 bg-slate-600/30 border border-slate-500/50 rounded-full text-xs text-slate-300 font-medium">
                            +{uniqueUseIn.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-green-400">
                        {formatPrice(phone.price)}
                      </div>
                    </div>
                  </div>

                  {/* Quantity Status */}
                  <div className="flex items-center justify-between">
                    <div className={`px-3 py-1 rounded-full ${quantityStatus.bg} ${quantityStatus.color} text-sm font-medium`}>
                      {quantityStatus.label}
                    </div>
                    <div className="text-white font-semibold">
                      Qty: {phone.quantity}
                    </div>
                  </div>

                  {/* ID */}
                  <div className="text-xs text-purple-400 font-mono bg-slate-700/50 px-2 py-1 rounded">
                    ID: {phone._id.slice(-8)}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <button className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1.5 shadow-lg hover:shadow-purple-500/25 transform hover:scale-105">
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>
                    <button className="bg-slate-600/50 hover:bg-slate-600 text-white py-2.5 px-3 rounded-lg text-sm font-medium transition-colors duration-200 backdrop-blur-sm">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {sortedPhones.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-slate-700 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-purple-300" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-3">No phones found</h3>
            <p className="text-purple-300 text-lg">Try adjusting your search criteria or filters</p>
            <button 
              onClick={() => {setSearchTerm(''); setFilterBy('all');}}
              className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhoneInventoryUI;
"use client"
import React, { useEffect, useState } from 'react';
import { Smartphone, Search, Filter, ShoppingCart, Eye, Edit, Trash2, Package } from 'lucide-react';
import axios from 'axios';

const PhoneInventoryUI = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [phones, setPhones] = useState([]);

 
 useEffect( () => {
    const fetchData = async () => {
        const res =await axios.get('http://localhost:8080/api/sellouts')
        setPhones(res?.data || [])
    }
    fetchData()
 }, [])
  const filteredPhones = phones.filter(phone =>
    phone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    phone.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              Phone Inventory
            </h1>
          </div>
          <p className="text-purple-200">
            Manage your smartphone inventory with real-time stock tracking
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-slate-800/50 backdrop-blur-lg border border-purple-700/30 rounded-2xl p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-purple-400" />
                <input
                  type="text"
                  placeholder="Search phones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-700/50 border border-purple-600/50 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Sort */}
              <div className="relative">
                <Filter className="absolute left-3 top-3 h-4 w-4 text-purple-400" />
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
            
            return (
              <div
                key={phone._id}
                className="bg-slate-800/40 backdrop-blur-lg border border-purple-700/30 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300 group hover:transform hover:scale-[1.02]"
              >
                {/* Phone Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Smartphone className="w-8 h-8 text-white" />
                </div>

                {/* Phone Details */}
                <div className="space-y-3">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors duration-300">
                      {phone.name}
                    </h3>
                    <p className="text-purple-200 text-sm mt-1 line-clamp-2">
                      {phone.description}
                    </p>
                  </div>

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
                    <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-1">
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button className="flex-1 bg-slate-600 hover:bg-slate-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-1">
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {sortedPhones.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No phones found</h3>
            <p className="text-purple-300">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhoneInventoryUI;
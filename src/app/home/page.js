"use client"

import React, { useState, useEffect } from 'react';
import { Smartphone, Star, Tag, Zap, Camera, Gamepad2, Briefcase, Video, Search, Filter, ChevronDown, TrendingUp, Shield, Battery, Cpu } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { phoneAPI } from '@/utils/api';
import { ProtectedRoute } from '@/context/AuthContext';

const PhoneUI = () => {
  const [phones, setPhones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  // Icon mapping for different use cases
  const useIcons = {
    'Photography': Camera,
    'Gaming': Gamepad2,
    'Business': Briefcase,
    'Content Creation': Video
  };
 const router = useRouter();

  const handleClick = (data) => {
    const queryParams = new URLSearchParams({
      name: data.name,
      price: data.price,
      description: data.description,
      quantity: data.quantity,
    })
    router.push(`/sell/${data._id}?${queryParams}`);
  };
  // Generate mock data if API fails
  const generateMockPhones = () => {
    return [
      {
        _id: 'mock1',
        name: 'iPhone 15 Pro',
        price: 89999,
        quantity: 5,
        description: 'Latest flagship with titanium design and A17 Pro chip',
        useIn: ['Photography', 'Gaming', 'Business', 'Content Creation']
      },
      {
        _id: 'mock2',
        name: 'Samsung Galaxy S24',
        price: 74999,
        quantity: 8,
        description: 'AI-powered smartphone with revolutionary camera system',
        useIn: ['Photography', 'Business', 'Content Creation']
      },
      {
        _id: 'mock3',
        name: 'Google Pixel 8 Pro',
        price: 69999,
        quantity: 3,
        description: 'Pure Android experience with advanced AI features',
        useIn: ['Photography', 'Business']
      },
      {
        _id: 'mock4',
        name: 'OnePlus 12',
        price: 64999,
        quantity: 10,
        description: 'Flagship killer with Hasselblad camera system',
        useIn: ['Gaming', 'Photography', 'Content Creation']
      },
      {
        _id: 'mock5',
        name: 'Xiaomi 14 Ultra',
        price: 59999,
        quantity: 6,
        description: 'Professional photography powerhouse with Leica optics',
        useIn: ['Photography', 'Content Creation']
      }
    ];
  };

  useEffect(() => {
    const fetchPhones = async () => {
      try {
        const data = await phoneAPI.getAll();
        setPhones(data.length > 0 ? data : generateMockPhones());
      } catch (err) {
        setError(err.message);
        // Use mock data on error
        setTimeout(() => {
          setPhones(generateMockPhones());
          setError(null);
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchPhones();
  }, []);

  // Filter and sort phones
  const getFilteredPhones = () => {
    let filtered = phones;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(phone => 
        phone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        phone.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(phone => 
        phone.useIn.includes(filterCategory)
      );
    }

    // Price range filter
    filtered = filtered.filter(phone => 
      phone.price >= priceRange.min && phone.price <= priceRange.max
    );

    // Sorting
    filtered.sort((a, b) => {
      switch(sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'quantity':
          return b.quantity - a.quantity;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-full mb-4">
            <Smartphone className="w-8 h-8 text-purple-400 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Loading Phones...</h2>
          <div className="w-64 h-2 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-8 max-w-md text-center">
          <div className="text-red-400 mb-4">
            <Zap className="w-12 h-12 mx-auto" />
          </div>
          <h2 className="text-xl font-bold text-red-300 mb-2">Connection Error</h2>
          <p className="text-red-200">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const filteredPhones = getFilteredPhones();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-6">
            <Smartphone className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Phone <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Gallery</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Discover the latest smartphones with cutting-edge technology and innovative features
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mt-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search phones by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>

          {/* Filter Controls */}
          <div className="max-w-4xl mx-auto mt-6 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white hover:border-purple-500 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filters
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="quantity">Sort by Stock</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Categories</option>
              <option value="Photography">Photography</option>
              <option value="Gaming">Gaming</option>
              <option value="Business">Business</option>
              <option value="Content Creation">Content Creation</option>
            </select>
          </div>

          {/* Advanced Filters Panel */}
          {showFilters && (
            <div className="max-w-4xl mx-auto mt-6 p-6 bg-slate-800/30 border border-slate-700 rounded-xl">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white mb-2">Price Range</label>
                  <div className="flex gap-4">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({...priceRange, min: parseInt(e.target.value) || 0})}
                      className="flex-1 px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({...priceRange, max: parseInt(e.target.value) || 100000})}
                      className="flex-1 px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
                    />
                  </div>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSortBy('name');
                      setFilterCategory('all');
                      setPriceRange({ min: 0, max: 100000 });
                    }}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Stats Bar */}
          <div className="max-w-4xl mx-auto mt-8 grid grid-cols-3 gap-4">
            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <div className="flex items-center justify-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <span className="text-white font-semibold">{filteredPhones.length} Products</span>
              </div>
            </div>
            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <div className="flex items-center justify-center gap-2">
                <Shield className="w-5 h-5 text-blue-400" />
                <span className="text-white font-semibold">Verified Sellers</span>
              </div>
            </div>
            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <div className="flex items-center justify-center gap-2">
                <Battery className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-semibold">Fast Delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* Phone Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPhones.map((phone) => (
            <div
              key={phone._id}
              className="group relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 hover:transform hover:-translate-y-2"
            >
              {/* Card Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Card Content */}
              <div className="relative p-8">
                {/* Phone Icon */}
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Smartphone className="w-8 h-8 text-purple-400" />
                </div>

                <div className='flex justify-between align-center'>

                  <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                    {phone.name}
                  </h2>
                  <h2 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                    <b>Quantity:</b> <span className='text-lg'>{phone.quantity}</span>
                  </h2>
                </div>
                <div className="flex items-center mb-4">
                  <Tag className="w-5 h-5 text-green-400 mr-2" />
                  <span className="text-3xl font-bold text-green-400">
                    {formatPrice(phone.price)}
                  </span>
                </div>

                {/* Description */}
                <p className="text-slate-300 mb-6 leading-relaxed">
                  {phone.description}
                </p>

                {/* Use Cases */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 mr-2" />
                    Perfect For:
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {phone.useIn.map((use, index) => {
                      const IconComponent = useIcons[use] || Zap;
                      return (
                        <div
                          key={index}
                          className="flex items-center p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors"
                        >
                          <IconComponent className="w-4 h-4 text-purple-400 mr-2" />
                          <span className="text-slate-200 text-sm font-medium">{use}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              
                {/* <Link className='w-full cursor-pointer' href={`/sell/${phone._id}`} > */}
               <button onClick={() => handleClick(phone)} className='w-full cursor-pointer bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25'>
                 Sell {phone?.quantity} Pics
               </button>
                {/* </Link> */}
              </div>

              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPhones.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-slate-800 rounded-full mb-6">
              <Smartphone className="w-12 h-12 text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-300 mb-4">No Phones Found</h2>
            <p className="text-slate-400">
              {searchTerm || filterCategory !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Check back later for new arrivals!'}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 bg-slate-800/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-purple-400" />
                About Us
              </h3>
              <p className="text-slate-400 text-sm">
                Your trusted marketplace for premium smartphones. We connect buyers with quality devices.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-purple-400" />
                Features
              </h3>
              <ul className="text-slate-400 text-sm space-y-2">
                <li>• Advanced Search & Filters</li>
                <li>• Real-time Inventory</li>
                <li>• Secure Transactions</li>
                <li>• Expert Reviews</li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-purple-400" />
                Quick Stats
              </h3>
              <div className="text-slate-400 text-sm space-y-2">
                <p>Total Products: {phones.length}</p>
                <p>Active Filters: {(searchTerm ? 1 : 0) + (filterCategory !== 'all' ? 1 : 0)}</p>
                <p>Showing: {filteredPhones.length} items</p>
              </div>
            </div>
          </div>
          <div className="text-center pt-4 border-t border-slate-700">
            <p className="text-slate-400">
              Powered by modern web technologies • Built with React & Tailwind CSS
            </p>
          </div>
        </div>
      </footer>
    </div>
    </ProtectedRoute>
  );
};

export default PhoneUI;
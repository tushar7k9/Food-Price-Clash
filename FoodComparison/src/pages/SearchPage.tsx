import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';
import { Search, X, Filter, TrendingUp } from 'lucide-react';
import { mockResults } from '../utils/mockData';
import { useUser } from '../context/UserContext';

const SearchPage = () => {
  const navigate = useNavigate();
  const { searchQuery, updateSearchQuery, updateResults } = useSearch();
  const [query, setQuery] = useState(searchQuery || '');
  const [isSearching, setIsSearching] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [cuisineFilters, setCuisineFilters] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const { user } = useUser();

  const popularSearches = [
    'Butter Chicken', 'Pizza', 'Biryani', 'Chinese', 'Burger',
    'Dosa', 'North Indian', 'South Indian', 'Italian', 'Desserts'
  ];

  const cuisines = [
    'North Indian', 'South Indian', 'Chinese', 'Italian', 
    'Mexican', 'Fast Food', 'Desserts', 'Beverages'
  ];

  useEffect(() => {
    setQuery(searchQuery || '');
  }, [searchQuery]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    console.log(query);
    setIsSearching(true);
    updateSearchQuery(query);

    const location = user?.location?.name;
    
    try {
      const response = await fetch(`http://127.0.0.1:8000/${location}/${query}`);
      const data = await response.json();
      console.log(data);
      
      if (data && data.message) {
        console.log("API Response:", data.message);
        
        // Check if the new unified menu structure exists
        if (data.message.menu) {
          console.log("Using new unified menu structure");
          const transformedResults = transformUnifiedMenuData(data.message.menu);
          updateResults(transformedResults);
        } else {
          console.log("Using legacy structure with improved matching");
          const transformedResults = transformBackendDataWithFuzzyMatching(data.message);
          updateResults(transformedResults);
        }
        
        setIsSearching(false);
        navigate('/results');
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      // Fallback to mock data in case of error
      updateResults(mockResults);
      setIsSearching(false);
      navigate('/results');
    }
  };

  // Function to transform the new unified menu structure
  const transformUnifiedMenuData = (menuData: Record<string, any>) => {
    const results: typeof mockResults = [];
    let id = 1;

    Object.entries(menuData).forEach(([itemName, itemData]: [string, any]) => {
      const swiggyData = itemData.swiggy?.available ? {
        basePrice: parseInt(itemData.swiggy.price),
        finalPrice: parseInt(itemData.swiggy.price),
        discount: 0,
        deliveryFee: 40,
        taxes: Math.round(parseInt(itemData.swiggy.price) * 0.05),
        deliveryTime: 30,
        coupon: 'SWIGGY50',
        couponDesc: 'Get 50% off up to ₹100',
        paymentOffers: [{
          bank: 'HDFC Bank',
          description: '20% off up to ₹100 on HDFC cards'
        }]
      } : {
        basePrice: 0,
        finalPrice: 0,
        discount: 0,
        deliveryFee: 0,
        taxes: 0,
        deliveryTime: 0,
        coupon: '',
        couponDesc: 'Not available on Swiggy',
        paymentOffers: []
      };

      const zomatoData = itemData.zomato?.available ? {
        basePrice: parseInt(itemData.zomato.price),
        finalPrice: parseInt(itemData.zomato.price),
        discount: 0,
        deliveryFee: 35,
        taxes: Math.round(parseInt(itemData.zomato.price) * 0.05),
        deliveryTime: 35,
        coupon: 'ZOMATO20',
        couponDesc: 'Get 20% off up to ₹150',
        paymentOffers: [{
          bank: 'ICICI Bank',
          description: '15% off up to ₹75 on ICICI cards'
        }]
      } : {
        basePrice: 0,
        finalPrice: 0,
        discount: 0,
        deliveryFee: 0,
        taxes: 0,
        deliveryTime: 0,
        coupon: '',
        couponDesc: 'Not available on Zomato',
        paymentOffers: []
      };

      // Create description based on availability
      let description = '';
      if (itemData.availability === 'both') {
        description = `${itemName} is available on both platforms. ${itemData.cheaper_platform} is cheaper by ₹${itemData.price_difference}.`;
      } else if (itemData.availability === 'swiggy_only') {
        description = `${itemName} is currently only available on Swiggy.`;
      } else if (itemData.availability === 'zomato_only') {
        description = `${itemName} is currently only available on Zomato.`;
      }

      results.push({
        id: id.toString(),
        name: itemName,
        restaurant: itemData.availability === 'both' ? 'Available on Both Platforms' : 
                   itemData.availability === 'swiggy_only' ? 'Available on Swiggy' : 'Available on Zomato',
        cuisine: 'Various',
        veg: false,
        description,
        swiggy: swiggyData,
        zomato: zomatoData
      });
      id++;
    });

    // Sort by availability (both platforms first)
    results.sort((a, b) => {
      const aOnBoth = a.swiggy && a.zomato;
      const bOnBoth = b.swiggy && b.zomato;
      
      if (aOnBoth && !bOnBoth) return -1;
      if (!aOnBoth && bOnBoth) return 1;
      return a.name.localeCompare(b.name);
    });

    console.log("Transformed unified menu results:", results);
    return results;
  };

  // Function to normalize food names for better matching
  const normalizeFoodName = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/[*\-_\.]/g, '') // Remove special characters
      .trim(); // Remove leading/trailing spaces
  };

  // Function with improved fuzzy matching for legacy structure
  const transformBackendDataWithFuzzyMatching = (apiData: {swiggy?: Record<string, any>, zomato?: Record<string, any>}) => {
    const results: typeof mockResults = [];
    
    // Get all items with normalized names for matching
    const swiggyItems = apiData.swiggy ? Object.keys(apiData.swiggy) : [];
    const zomatoItems = apiData.zomato ? Object.keys(apiData.zomato) : [];
    
    // Create normalized lookup maps
    const swiggyNormalized = new Map();
    const zomatoNormalized = new Map();
    
    swiggyItems.forEach(item => {
      swiggyNormalized.set(normalizeFoodName(item), item);
    });
    
    zomatoItems.forEach(item => {
      zomatoNormalized.set(normalizeFoodName(item), item);
    });
    
    // Find matches and create unified items
    const processedItems = new Set<string>();
    let id = 1;
    
    // Process Swiggy items and find matches
    swiggyItems.forEach(swiggyItem => {
      if (processedItems.has(swiggyItem)) return;
      
      const normalizedSwiggy = normalizeFoodName(swiggyItem);
      let matchedZomatoItem = null;
      
      // Try to find exact normalized match
      if (zomatoNormalized.has(normalizedSwiggy)) {
        matchedZomatoItem = zomatoNormalized.get(normalizedSwiggy);
      } else {
        // Try fuzzy matching
        for (const [normalizedZomato, originalZomato] of zomatoNormalized.entries()) {
          if (similarity(normalizedSwiggy, normalizedZomato) > 0.8) {
            matchedZomatoItem = originalZomato;
            break;
          }
        }
      }
      
      const swiggyPrice = apiData.swiggy ? parseInt(apiData.swiggy[swiggyItem].price || apiData.swiggy[swiggyItem]) : null;
      const zomatoPrice = matchedZomatoItem && apiData.zomato ? 
        parseInt(apiData.zomato[matchedZomatoItem].price || apiData.zomato[matchedZomatoItem]) : null;
      
      if (swiggyPrice || zomatoPrice) {
        results.push({
          id: id.toString(),
          name: swiggyItem,
          restaurant: swiggyPrice && zomatoPrice ? 'Available on Both Platforms' : 
                     swiggyPrice ? 'Available on Swiggy' : 'Available on Zomato',
          cuisine: 'Various',
          veg: false,
          description: swiggyPrice && zomatoPrice ? 
            `${swiggyItem} is available on both platforms.` :
            swiggyPrice ? `${swiggyItem} is only available on Swiggy.` : 
            `${swiggyItem} is only available on Zomato.`,
          swiggy: swiggyPrice ? {
            basePrice: swiggyPrice,
            finalPrice: swiggyPrice,
            discount: 0,
            deliveryFee: 40,
            taxes: Math.round(swiggyPrice * 0.05),
            deliveryTime: 30,
            coupon: 'SWIGGY50',
            couponDesc: 'Get 50% off up to ₹100',
            paymentOffers: [{ bank: 'HDFC Bank', description: '20% off up to ₹100 on HDFC cards' }]
          } : null,
          zomato: zomatoPrice ? {
            basePrice: zomatoPrice,
            finalPrice: zomatoPrice,
            discount: 0,
            deliveryFee: 35,
            taxes: Math.round(zomatoPrice * 0.05),
            deliveryTime: 35,
            coupon: 'ZOMATO20',
            couponDesc: 'Get 20% off up to ₹150',
            paymentOffers: [{ bank: 'ICICI Bank', description: '15% off up to ₹75 on ICICI cards' }]
          } : null
        });
        
        processedItems.add(swiggyItem);
        if (matchedZomatoItem) processedItems.add(matchedZomatoItem);
        id++;
      }
    });
    
    // Process remaining Zomato items that weren't matched
    zomatoItems.forEach(zomatoItem => {
      if (processedItems.has(zomatoItem)) return;
      
      const zomatoPrice = apiData.zomato ? parseInt(apiData.zomato[zomatoItem].price || apiData.zomato[zomatoItem]) : null;
      
      if (zomatoPrice) {
        results.push({
          id: id.toString(),
          name: zomatoItem,
          restaurant: 'Available on Zomato',
          cuisine: 'Various',
          veg: false,
          description: `${zomatoItem} is only available on Zomato.`,
          swiggy: null,
          zomato: {
            basePrice: zomatoPrice,
            finalPrice: zomatoPrice,
            discount: 0,
            deliveryFee: 35,
            taxes: Math.round(zomatoPrice * 0.05),
            deliveryTime: 35,
            coupon: 'ZOMATO20',
            couponDesc: 'Get 20% off up to ₹150',
            paymentOffers: [{ bank: 'ICICI Bank', description: '15% off up to ₹75 on ICICI cards' }]
          }
        });
        id++;
      }
    });
    
    return results;
  };

  // Simple string similarity function
  const similarity = (s1: string, s2: string): number => {
    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  };

  // Levenshtein distance calculation
  const levenshteinDistance = (s1: string, s2: string): number => {
    const matrix = [];
    
    for (let i = 0; i <= s2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= s1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= s2.length; i++) {
      for (let j = 1; j <= s1.length; j++) {
        if (s2.charAt(i - 1) === s1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[s2.length][s1.length];
  };

  const handlePopularSearch = (term: string) => {
    setQuery(term);
    updateSearchQuery(term);
    
    setIsSearching(true);
    // Simulate API call delay
    setTimeout(() => {
      updateResults(mockResults);
      setIsSearching(false);
      navigate('/results');
    }, 1500);
  };

  const toggleCuisineFilter = (cuisine: string) => {
    if (cuisineFilters.includes(cuisine)) {
      setCuisineFilters(cuisineFilters.filter(c => c !== cuisine));
    } else {
      setCuisineFilters([...cuisineFilters, cuisine]);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 min-h-[80vh]">
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by dish, restaurant, or cuisine..."
              className="w-full py-3 pl-10 pr-20 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] shadow-sm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-2">
              <button
                type="button"
                onClick={() => setFilterOpen(!filterOpen)}
                className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition"
              >
                <Filter size={20} className="text-gray-600" />
              </button>
              <button
                type="submit"
                className="bg-gradient-to-r from-[#FF5A5F] to-[#FC8019] text-white py-1.5 px-4 rounded-full hover:shadow-md transition disabled:opacity-70"
                disabled={isSearching}
              >
                {isSearching ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Searching...</span>
                  </div>
                ) : 'Compare'}
              </button>
            </div>
          </div>
        </form>

        {/* Filters */}
        {filterOpen && (
          <div className="bg-white rounded-lg shadow-md p-4 mb-6 border border-gray-100">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">Filters</h3>
              <button onClick={() => setFilterOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
            
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Cuisines</h4>
              <div className="flex flex-wrap gap-2">
                {cuisines.map((cuisine) => (
                  <button
                    key={cuisine}
                    onClick={() => toggleCuisineFilter(cuisine)}
                    className={`text-sm rounded-full px-3 py-1 transition ${
                      cuisineFilters.includes(cuisine)
                        ? 'bg-[#FF5A5F] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cuisine}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Price Range</h4>
              <div className="px-2">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>₹{priceRange[0]}</span>
                  <span>₹{priceRange[1]}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="50"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#FF5A5F]"
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                className="bg-gradient-to-r from-[#FF5A5F] to-[#FC8019] text-white py-2 px-4 rounded-full hover:shadow-md transition"
                onClick={() => setFilterOpen(false)}
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Popular and Trending Searches */}
        <div>
          <div className="mb-8">
            <div className="flex items-center mb-3">
              <Search size={16} className="text-gray-400 mr-2" />
              <h2 className="text-lg font-semibold">Popular Searches</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((term, index) => (
                <button
                  key={index}
                  className="bg-white border border-gray-200 text-gray-700 rounded-full px-4 py-2 hover:bg-gray-50 transition"
                  onClick={() => handlePopularSearch(term)}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <div className="flex items-center mb-3">
              <TrendingUp size={16} className="text-gray-400 mr-2" />
              <h2 className="text-lg font-semibold">Trending Now</h2>
            </div>
            <div className="space-y-4">
              {[
                { name: 'Chicken Biryani', trend: '+15% searches today' },
                { name: 'Pizza', trend: '+8% searches today' },
                { name: 'Burgers', trend: '+5% searches today' }
              ].map((item, index) => (
                <button
                  key={index}
                  className="w-full bg-white border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition text-left"
                  onClick={() => handlePopularSearch(item.name)}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-sm text-green-600 flex items-center">
                      <TrendingUp size={14} className="mr-1" />
                      {item.trend}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
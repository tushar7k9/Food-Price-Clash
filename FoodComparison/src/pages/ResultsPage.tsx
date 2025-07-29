import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';
import { ArrowLeft, Filter, ExternalLink, Heart, Clock, Info, Tag, CreditCard, X } from 'lucide-react';

const ResultsPage = () => {
  const navigate = useNavigate();
  const { searchQuery, results } = useSearch();
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('priceLowToHigh');
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedInfoIndex, setSelectedInfoIndex] = useState<number | null>(null);

  if (!results || results.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-600">No results found. Try another search.</p>
        <button
          className="mt-4 text-[#FF5A5F] hover:underline flex items-center mx-auto"
          onClick={() => navigate('/search')}
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to search
        </button>
      </div>
    );
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  const openInfoModal = (index: number) => {
    setSelectedInfoIndex(index);
    setShowInfoModal(true);
  };

  const handlePlatformRedirect = (platform: string, item: { name: string }) => {
    // In a real app, this would redirect to Zomato or Swiggy
    alert(`Redirecting to ${platform} for ${item.name}`);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header with search info */}
      <div className="mb-6">
        <button
          className="text-gray-600 hover:text-gray-900 flex items-center mb-3"
          onClick={() => navigate('/search')}
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to search
        </button>
        <div className="flex flex-wrap justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-0">
            Results for "{searchQuery}"
          </h1>
          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                className="bg-white border border-gray-300 rounded-lg py-2 px-3 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] text-sm"
                value={sortBy}
                onChange={handleSortChange}
              >
                <option value="priceLowToHigh">Price: Low to High</option>
                <option value="priceHighToLow">Price: High to Low</option>
                <option value="deliveryTime">Delivery Time</option>
                <option value="discount">Highest Discount</option>
              </select>
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <button
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 border border-gray-100">
          <h3 className="font-semibold mb-3">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Price Range</h4>
              <div className="flex flex-wrap gap-2">
                <button className="text-sm bg-[#FF5A5F] text-white rounded-full px-3 py-1">
                  Under ₹200
                </button>
                <button className="text-sm bg-gray-100 text-gray-700 rounded-full px-3 py-1 hover:bg-gray-200">
                  ₹200-₹400
                </button>
                <button className="text-sm bg-gray-100 text-gray-700 rounded-full px-3 py-1 hover:bg-gray-200">
                  ₹400+
                </button>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Platform</h4>
              <div className="flex gap-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-1" defaultChecked />
                  <span>Zomato</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-1" defaultChecked />
                  <span>Swiggy</span>
                </label>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Offers</h4>
              <div className="flex gap-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-1" />
                  <span>With Coupons Only</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="space-y-6">
        {results.map((item, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden transform transition hover:shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-5">
              <div className="lg:col-span-2 p-4 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-gray-100">
                <div>
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-bold">{item.name}</h2>
                    <button className="p-1 text-gray-400 hover:text-[#FF5A5F]">
                      <Heart size={20} />
                    </button>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{item.restaurant}</p>
                  <div className="flex flex-wrap gap-2 text-xs mb-4">
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                      {item.cuisine}
                    </span>
                    {item.veg && (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        Veg
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {item.description}
                  </p>
                </div>
                <div className="mt-auto pt-3">
                  <button
                    onClick={() => openInfoModal(index)}
                    className="text-sm text-[#FF5A5F] hover:underline flex items-center"
                  >
                    <Info size={14} className="mr-1" />
                    View details
                  </button>
                </div>
              </div>
              
              {/* Zomato */}
              <div className="lg:col-span-1.5 p-4 flex flex-col justify-between relative border-b lg:border-b-0 lg:border-r border-gray-100">
                <div className="absolute top-0 left-0 bg-[#FF5A5F] text-white text-xs px-2 py-1 rounded-br-lg font-medium">
                  Zomato
                </div>
                
                {item.zomato && item.zomato.finalPrice > 0 ? (
                  <div className="mt-6">
                    <div className="flex items-baseline mb-1">
                      <span className="text-lg font-bold">₹{item.zomato.finalPrice}</span>
                      {item.zomato.discount > 0 && (
                        <span className="ml-2 text-sm text-gray-500 line-through">
                          ₹{item.zomato.basePrice}
                        </span>
                      )}
                    </div>
                    
                    {item.zomato.discount > 0 && (
                      <div className="flex items-center text-green-600 text-sm mb-2">
                        <Tag size={14} className="mr-1" />
                        {item.zomato.discount}% OFF
                      </div>
                    )}
                    
                    <div className="flex text-sm text-gray-600 items-center mb-1">
                      <Clock size={14} className="mr-1" />
                      {item.zomato.deliveryTime} mins
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-3">
                      Delivery: ₹{item.zomato.deliveryFee}
                    </div>
                    
                    {item.zomato.coupon && (
                      <div className="flex items-center text-sm mb-3 p-2 bg-green-50 border border-green-100 rounded-lg">
                        <CreditCard size={14} className="mr-1 flex-shrink-0 text-green-500" />
                        <div>
                          <span className="font-medium text-green-600">{item.zomato.coupon}</span>
                          <span className="text-xs text-gray-500 block">{item.zomato.couponDesc}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mt-6 flex items-center justify-center h-full">
                    <div className="text-center text-gray-500">
                      <div className="text-sm font-medium mb-2">Not Available</div>
                      <div className="text-xs">This item is not available on Zomato</div>
                    </div>
                  </div>
                )}
                
                {item.zomato && item.zomato.finalPrice > 0 ? (
                  <button
                    onClick={() => handlePlatformRedirect('Zomato', item)}
                    className="mt-2 flex items-center justify-center bg-white border border-[#FF5A5F] text-[#FF5A5F] py-2 rounded-lg hover:bg-[#FF5A5F] hover:text-white transition"
                  >
                    <ExternalLink size={14} className="mr-1" />
                    Order Now
                  </button>
                ) : (
                  <button
                    disabled
                    className="mt-2 flex items-center justify-center bg-gray-100 border border-gray-300 text-gray-400 py-2 rounded-lg cursor-not-allowed"
                  >
                    Not Available
                  </button>
                )}
              </div>
              
              {/* Swiggy */}
              <div className="lg:col-span-1.5 p-4 flex flex-col justify-between relative">
                <div className="absolute top-0 left-0 bg-[#FC8019] text-white text-xs px-2 py-1 rounded-br-lg font-medium">
                  Swiggy
                </div>
                
                {item.swiggy && item.swiggy.finalPrice > 0 ? (
                  <div className="mt-6">
                    <div className="flex items-baseline mb-1">
                      <span className="text-lg font-bold">₹{item.swiggy.finalPrice}</span>
                      {item.swiggy.discount > 0 && (
                        <span className="ml-2 text-sm text-gray-500 line-through">
                          ₹{item.swiggy.basePrice}
                        </span>
                      )}
                    </div>
                    
                    {item.swiggy.discount > 0 && (
                      <div className="flex items-center text-green-600 text-sm mb-2">
                        <Tag size={14} className="mr-1" />
                        {item.swiggy.discount}% OFF
                      </div>
                    )}
                    
                    <div className="flex text-sm text-gray-600 items-center mb-1">
                      <Clock size={14} className="mr-1" />
                      {item.swiggy.deliveryTime} mins
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-3">
                      Delivery: ₹{item.swiggy.deliveryFee}
                    </div>
                    
                    {item.swiggy.coupon && (
                      <div className="flex items-center text-sm mb-3 p-2 bg-green-50 border border-green-100 rounded-lg">
                        <CreditCard size={14} className="mr-1 flex-shrink-0 text-green-500" />
                        <div>
                          <span className="font-medium text-green-600">{item.swiggy.coupon}</span>
                          <span className="text-xs text-gray-500 block">{item.swiggy.couponDesc}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mt-6 flex items-center justify-center h-full">
                    <div className="text-center text-gray-500">
                      <div className="text-sm font-medium mb-2">Not Available</div>
                      <div className="text-xs">This item is not available on Swiggy</div>
                    </div>
                  </div>
                )}
                
                {item.swiggy && item.swiggy.finalPrice > 0 ? (
                  <button
                    onClick={() => handlePlatformRedirect('Swiggy', item)}
                    className="mt-2 flex items-center justify-center bg-white border border-[#FC8019] text-[#FC8019] py-2 rounded-lg hover:bg-[#FC8019] hover:text-white transition"
                  >
                    <ExternalLink size={14} className="mr-1" />
                    Order Now
                  </button>
                ) : (
                  <button
                    disabled
                    className="mt-2 flex items-center justify-center bg-gray-100 border border-gray-300 text-gray-400 py-2 rounded-lg cursor-not-allowed"
                  >
                    Not Available
                  </button>
                )}
              </div>
              
              {/* Comparison */}
              <div className="hidden lg:block lg:col-span-0.5 bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
                {item.swiggy && item.zomato ? (
                  <>
                    {item.swiggy.finalPrice < item.zomato.finalPrice ? (
                      <>
                        <div className="rotate-90 text-sm font-medium text-green-600 whitespace-nowrap mb-3">
                          Save ₹{item.zomato.finalPrice - item.swiggy.finalPrice}
                        </div>
                        <div className="h-20 flex items-center">
                          <div className="h-20 w-2 bg-gray-200 rounded-full overflow-hidden relative">
                            <div className="absolute bottom-0 w-full bg-[#FC8019]" style={{ height: '70%' }}></div>
                          </div>
                        </div>
                        <div className="rotate-90 text-xs text-[#FC8019] font-medium whitespace-nowrap mt-3">
                          Swiggy Cheaper
                        </div>
                      </>
                    ) : item.zomato.finalPrice < item.swiggy.finalPrice ? (
                      <>
                        <div className="rotate-90 text-sm font-medium text-green-600 whitespace-nowrap mb-3">
                          Save ₹{item.swiggy.finalPrice - item.zomato.finalPrice}
                        </div>
                        <div className="h-20 flex items-center">
                          <div className="h-20 w-2 bg-gray-200 rounded-full overflow-hidden relative">
                            <div className="absolute bottom-0 w-full bg-[#FF5A5F]" style={{ height: '70%' }}></div>
                          </div>
                        </div>
                        <div className="rotate-90 text-xs text-[#FF5A5F] font-medium whitespace-nowrap mt-3">
                          Zomato Cheaper
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="rotate-90 text-sm font-medium text-gray-600 whitespace-nowrap mb-3">
                          Same Price
                        </div>
                        <div className="h-20 flex items-center">
                          <div className="h-20 w-2 bg-gray-200 rounded-full overflow-hidden relative">
                            <div className="absolute bottom-0 w-full bg-gray-400" style={{ height: '50%' }}></div>
                          </div>
                        </div>
                        <div className="rotate-90 text-xs text-gray-500 font-medium whitespace-nowrap mt-3">
                          Equal
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <div className="rotate-90 text-sm font-medium text-gray-600 whitespace-nowrap mb-3">
                      No Comparison Available
                    </div>
                    <div className="h-20 flex items-center">
                      <div className="h-20 w-2 bg-gray-200 rounded-full overflow-hidden relative">
                        <div className="absolute bottom-0 w-full bg-gray-400" style={{ height: '50%' }}></div>
                      </div>
                    </div>
                    <div className="rotate-90 text-xs text-gray-500 font-medium whitespace-nowrap mt-3">
                      Data Missing
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Mobile Comparison */}
            <div className="lg:hidden bg-gray-50 p-3 grid grid-cols-2 gap-3 border-t border-gray-100">
              <div className="text-center">
                <span className="text-sm font-medium">Zomato</span>
                <div className="font-bold">₹{item.zomato?.finalPrice || 'N/A'}</div>
              </div>
              <div className="text-center">
                <span className="text-sm font-medium">Swiggy</span>
                <div className="font-bold">₹{item.swiggy?.finalPrice || 'N/A'}</div>
              </div>
              <div className="col-span-2 text-center text-sm font-medium">
                {item.swiggy && item.zomato ? (
                  item.swiggy.finalPrice < item.zomato.finalPrice ? (
                    <span className="text-green-600">
                      Swiggy is cheaper by ₹{item.zomato.finalPrice - item.swiggy.finalPrice}
                    </span>
                  ) : item.zomato.finalPrice < item.swiggy.finalPrice ? (
                    <span className="text-green-600">
                      Zomato is cheaper by ₹{item.swiggy.finalPrice - item.zomato.finalPrice}
                    </span>
                  ) : (
                    <span className="text-gray-600">
                      Same price on both platforms
                    </span>
                  )
                ) : (
                  <span className="text-gray-600">
                    Data Missing
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Item Details Modal */}
      {showInfoModal && selectedInfoIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-5">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">{results[selectedInfoIndex].name}</h2>
                <button onClick={() => setShowInfoModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Detailed Comparison</h3>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Detail</th>
                        <th className="text-right py-2 text-[#FF5A5F]">Zomato</th>
                        <th className="text-right py-2 text-[#FC8019]">Swiggy</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2">Base Price</td>
                        <td className="text-right py-2">₹{results[selectedInfoIndex].zomato?.basePrice || 'N/A'}</td>
                        <td className="text-right py-2">₹{results[selectedInfoIndex].swiggy?.basePrice || 'N/A'}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Discount</td>
                        <td className="text-right py-2">{results[selectedInfoIndex].zomato?.discount || 0}%</td>
                        <td className="text-right py-2">{results[selectedInfoIndex].swiggy?.discount || 0}%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Delivery Fee</td>
                        <td className="text-right py-2">₹{results[selectedInfoIndex].zomato?.deliveryFee || 'N/A'}</td>
                        <td className="text-right py-2">₹{results[selectedInfoIndex].swiggy?.deliveryFee || 'N/A'}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Taxes</td>
                        <td className="text-right py-2">₹{results[selectedInfoIndex].zomato?.taxes || 'N/A'}</td>
                        <td className="text-right py-2">₹{results[selectedInfoIndex].swiggy?.taxes || 'N/A'}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Coupon Applied</td>
                        <td className="text-right py-2">{results[selectedInfoIndex].zomato?.coupon || "None"}</td>
                        <td className="text-right py-2">{results[selectedInfoIndex].swiggy?.coupon || "None"}</td>
                      </tr>
                      <tr className="border-b font-semibold">
                        <td className="py-2">Final Price</td>
                        <td className="text-right py-2">₹{results[selectedInfoIndex].zomato?.finalPrice || 'N/A'}</td>
                        <td className="text-right py-2">₹{results[selectedInfoIndex].swiggy?.finalPrice || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td className="py-2">Delivery Time</td>
                        <td className="text-right py-2">{results[selectedInfoIndex].zomato?.deliveryTime || 'N/A'} mins</td>
                        <td className="text-right py-2">{results[selectedInfoIndex].swiggy?.deliveryTime || 'N/A'} mins</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                {(results[selectedInfoIndex].zomato?.paymentOffers?.length > 0 || 
                  results[selectedInfoIndex].swiggy?.paymentOffers?.length > 0) && (
                  <div>
                    <h3 className="font-semibold mb-2">Payment Offers</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <h4 className="text-sm font-medium mb-1 text-[#FF5A5F]">Zomato Offers</h4>
                        {results[selectedInfoIndex].zomato?.paymentOffers?.length > 0 ? (
                          <ul className="text-sm space-y-2">
                            {results[selectedInfoIndex].zomato.paymentOffers.map((offer, i) => (
                              <li key={i} className="bg-gray-50 p-2 rounded">
                                <div className="font-medium">{offer.bank}</div>
                                <div className="text-xs text-gray-600">{offer.description}</div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-500">No payment offers available</p>
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-1 text-[#FC8019]">Swiggy Offers</h4>
                        {results[selectedInfoIndex].swiggy?.paymentOffers?.length > 0 ? (
                          <ul className="text-sm space-y-2">
                            {results[selectedInfoIndex].swiggy.paymentOffers.map((offer, i) => (
                              <li key={i} className="bg-gray-50 p-2 rounded">
                                <div className="font-medium">{offer.bank}</div>
                                <div className="text-xs text-gray-600">{offer.description}</div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-500">No payment offers available</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  className="bg-white border border-[#FF5A5F] text-[#FF5A5F] py-2 rounded-lg hover:bg-[#FF5A5F] hover:text-white transition flex items-center justify-center"
                  onClick={() => handlePlatformRedirect('Zomato', results[selectedInfoIndex])}
                >
                  <ExternalLink size={14} className="mr-1" />
                  Order on Zomato
                </button>
                <button
                  className="bg-white border border-[#FC8019] text-[#FC8019] py-2 rounded-lg hover:bg-[#FC8019] hover:text-white transition flex items-center justify-center"
                  onClick={() => handlePlatformRedirect('Swiggy', results[selectedInfoIndex])}
                >
                  <ExternalLink size={14} className="mr-1" />
                  Order on Swiggy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsPage;
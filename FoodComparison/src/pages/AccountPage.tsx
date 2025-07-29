import React, { useState } from 'react';
import { User, Key, CreditCard, History, Heart, LogOut, Lock, MapPin } from 'lucide-react';
import { useUser } from '../context/UserContext';

const AccountPage = () => {
  const { user, isLoggedIn, logout } = useUser();
  const [activeTab, setActiveTab] = useState('profile');

  // Only for demonstration purposes
  const [remainingSearches, setRemainingSearches] = useState(3);
  const [isPremium, setIsPremium] = useState(false);
  
  if (!isLoggedIn) {
    return <LoginSignupSection />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Account</h1>
        
        {/* Usage Status Banner */}
        <div className={`mb-6 py-4 px-5 rounded-lg ${isPremium ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50 border border-gray-200'}`}>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-semibold flex items-center">
                {isPremium ? (
                  <>
                    <span className="bg-yellow-200 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded mr-2">
                      Premium
                    </span>
                    Unlimited Access
                  </>
                ) : (
                  <>
                    <span className="bg-gray-200 text-gray-700 text-xs font-medium px-2.5 py-0.5 rounded mr-2">
                      Free Plan
                    </span>
                    {remainingSearches} searches remaining this month
                  </>
                )}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {isPremium 
                  ? 'Your premium subscription is active until 23 July, 2025' 
                  : 'Upgrade to premium for unlimited searches, favorites, and more!'}
              </p>
            </div>
            {!isPremium && (
              <button 
                className="bg-gradient-to-r from-[#FF5A5F] to-[#FC8019] text-white px-4 py-2 rounded-lg hover:shadow-md transition"
                onClick={() => setIsPremium(true)} // For demo purposes
              >
                Upgrade Now
              </button>
            )}
          </div>
        </div>
        
        {/* Tabs and Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <nav className="flex flex-col">
                <button
                  className={`text-left px-4 py-3 flex items-center text-sm font-medium ${
                    activeTab === 'profile' 
                      ? 'bg-gray-50 text-[#FF5A5F] border-l-2 border-[#FF5A5F]' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setActiveTab('profile')}
                >
                  <User size={16} className="mr-3" />
                  Profile
                </button>
                <button
                  className={`text-left px-4 py-3 flex items-center text-sm font-medium ${
                    activeTab === 'password' 
                      ? 'bg-gray-50 text-[#FF5A5F] border-l-2 border-[#FF5A5F]' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setActiveTab('password')}
                >
                  <Key size={16} className="mr-3" />
                  Password & Security
                </button>
                <button
                  className={`text-left px-4 py-3 flex items-center text-sm font-medium ${
                    activeTab === 'location'
                      ? 'bg-gray-50 text-[#FF5A5F] border-l-2 border-[#FF5A5F]'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setActiveTab('location')}
                >
                  <MapPin size={16} className="mr-3" />
                  Saved Locations
                </button>
                <button
                  className={`text-left px-4 py-3 flex items-center text-sm font-medium ${
                    activeTab === 'payment'
                      ? 'bg-gray-50 text-[#FF5A5F] border-l-2 border-[#FF5A5F]'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setActiveTab('payment')}
                >
                  <CreditCard size={16} className="mr-3" />
                  Subscription & Payments
                </button>
                <button
                  className={`text-left px-4 py-3 flex items-center text-sm font-medium ${
                    activeTab === 'favorites' 
                      ? 'bg-gray-50 text-[#FF5A5F] border-l-2 border-[#FF5A5F]' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setActiveTab('favorites')}
                >
                  <Heart size={16} className="mr-3" />
                  Favorites
                </button>
                <button
                  className={`text-left px-4 py-3 flex items-center text-sm font-medium ${
                    activeTab === 'history' 
                      ? 'bg-gray-50 text-[#FF5A5F] border-l-2 border-[#FF5A5F]' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setActiveTab('history')}
                >
                  <History size={16} className="mr-3" />
                  Search History
                </button>
                <button
                  className="text-left px-4 py-3 flex items-center text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-t border-gray-200"
                  onClick={logout}
                >
                  <LogOut size={16} className="mr-3" />
                  Sign Out
                </button>
              </nav>
            </div>
          </div>
          
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
                  
                  <div className="mb-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]"
                        value="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]"
                        value="john.doe@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]"
                        value="+91 9876543210"
                      />
                    </div>
                  </div>
                  
                  <button className="bg-gradient-to-r from-[#FF5A5F] to-[#FC8019] text-white px-4 py-2 rounded-lg hover:shadow-md transition">
                    Save Changes
                  </button>
                </div>
              )}
              
              {activeTab === 'payment' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Subscription & Payments</h2>
                  
                  <div className="mb-6">
                    <div className={`p-4 rounded-lg ${isPremium ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50 border border-gray-200'}`}>
                      <h3 className="font-medium text-lg mb-2">Current Plan</h3>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-gray-700">
                            {isPremium ? 'Premium Plan' : 'Free Plan'}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {isPremium 
                              ? 'Unlimited searches, saved favorites, and early access to deals' 
                              : '5 searches per month, limited features'}
                          </p>
                        </div>
                        {isPremium ? (
                          <button className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm">
                            Cancel Subscription
                          </button>
                        ) : (
                          <button className="bg-gradient-to-r from-[#FF5A5F] to-[#FC8019] text-white px-3 py-1.5 rounded-lg hover:shadow-md transition text-sm">
                            Upgrade to Premium
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {isPremium && (
                    <div className="mb-6">
                      <h3 className="font-medium text-lg mb-3">Payment Method</h3>
                      <div className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="bg-blue-50 p-2 rounded mr-3">
                            <CreditCard size={20} className="text-blue-500" />
                          </div>
                          <div>
                            <p className="font-medium">HDFC Bank Credit Card</p>
                            <p className="text-sm text-gray-500">xxxx-xxxx-xxxx-4242</p>
                          </div>
                        </div>
                        <button className="text-sm text-[#FF5A5F] hover:underline">
                          Change
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="font-medium text-lg mb-3">Billing History</h3>
                    {isPremium ? (
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Amount
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Invoice
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                23 Jun, 2025
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                ₹30.00
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  Paid
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500 hover:underline">
                                <a href="#">Download</a>
                              </td>
                            </tr>
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                23 May, 2025
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                ₹30.00
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  Paid
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500 hover:underline">
                                <a href="#">Download</a>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No billing history available on the free plan.</p>
                    )}
                  </div>
                </div>
              )}
              
              {activeTab === 'password' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Password & Security</h2>
                  
                  <div className="mb-6">
                    <h3 className="font-medium text-lg mb-3">Change Password</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]"
                            placeholder="Enter your current password"
                          />
                          <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <Lock size={16} />
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            type="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]"
                            placeholder="Enter new password"
                          />
                          <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <Lock size={16} />
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <input
                            type="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]"
                            placeholder="Confirm new password"
                          />
                          <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <Lock size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <button className="bg-gradient-to-r from-[#FF5A5F] to-[#FC8019] text-white px-4 py-2 rounded-lg hover:shadow-md transition">
                    Update Password
                  </button>
                </div>
              )}
              
              {activeTab === 'favorites' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Favorite Items</h2>
                    
                    {!isPremium && (
                      <div className="bg-yellow-50 border border-yellow-200 px-3 py-1 rounded-lg text-xs text-yellow-700 flex items-center">
                        <span className="mr-1">✨</span>
                        Premium feature
                      </div>
                    )}
                  </div>
                  
                  {isPremium ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Favorite Item 1 */}
                      <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition">
                        <div className="flex p-3">
                          <div className="flex-grow">
                            <h3 className="font-medium">Butter Chicken</h3>
                            <p className="text-sm text-gray-500">Punjab Grill</p>
                            <div className="mt-2 flex justify-between items-center">
                              <div className="flex items-center">
                                <span className="text-sm font-semibold mr-1">From ₹320</span>
                                <span className="text-xs text-green-600">(Swiggy Cheaper)</span>
                              </div>
                              <button className="text-[#FF5A5F]">
                                <Heart size={18} fill="#FF5A5F" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Favorite Item 2 */}
                      <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition">
                        <div className="flex p-3">
                          <div className="flex-grow">
                            <h3 className="font-medium">Margherita Pizza</h3>
                            <p className="text-sm text-gray-500">Domino's</p>
                            <div className="mt-2 flex justify-between items-center">
                              <div className="flex items-center">
                                <span className="text-sm font-semibold mr-1">From ₹249</span>
                                <span className="text-xs text-green-600">(Zomato Cheaper)</span>
                              </div>
                              <button className="text-[#FF5A5F]">
                                <Heart size={18} fill="#FF5A5F" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 px-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                      <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-3">
                        <Heart size={24} className="text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-700 mb-2">Unlock Favorites</h3>
                      <p className="text-gray-500 mb-4 max-w-md mx-auto">
                        Upgrade to premium to save and organize your favorite dishes and restaurants.
                      </p>
                      <button 
                        className="bg-gradient-to-r from-[#FF5A5F] to-[#FC8019] text-white px-4 py-2 rounded-lg hover:shadow-md transition"
                        onClick={() => setIsPremium(true)}
                      >
                        Upgrade to Premium
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'history' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Search History</h2>
                  
                  <div className="space-y-3">
                    <div className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">Butter Chicken</h3>
                          <p className="text-sm text-gray-500">Searched 2 hours ago</p>
                        </div>
                        <button 
                          className="text-[#FF5A5F] text-sm hover:underline"
                          onClick={() => console.log('Search again')}
                        >
                          Search Again
                        </button>
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">Domino's Pizza</h3>
                          <p className="text-sm text-gray-500">Searched 1 day ago</p>
                        </div>
                        <button 
                          className="text-[#FF5A5F] text-sm hover:underline"
                          onClick={() => console.log('Search again')}
                        >
                          Search Again
                        </button>
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">Biryani</h3>
                          <p className="text-sm text-gray-500">Searched 3 days ago</p>
                        </div>
                        <button 
                          className="text-[#FF5A5F] text-sm hover:underline"
                          onClick={() => console.log('Search again')}
                        >
                          Search Again
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <button className="text-gray-500 text-sm mt-4 hover:underline">
                    Clear Search History
                  </button>
                </div>
              )}
              
              {activeTab === 'location' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Saved Locations</h2>
                  
                  <div className="space-y-3 mb-6">
                    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center mb-1">
                            <h3 className="font-medium">Home</h3>
                            <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                              Default
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">123 Main Street, Indiranagar, Bangalore - 560038</p>
                        </div>
                        <div className="flex gap-2">
                          <button className="text-gray-500 hover:text-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                            </svg>
                          </button>
                          <button className="text-gray-500 hover:text-red-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                              <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium mb-1">Office</h3>
                          <p className="text-sm text-gray-600">456 Business Park, Whitefield, Bangalore - 560066</p>
                        </div>
                        <div className="flex gap-2">
                          <button className="text-gray-500 hover:text-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                            </svg>
                          </button>
                          <button className="text-gray-500 hover:text-red-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                              <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition">
                    + Add New Location
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoginSignupSection = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login } = useUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login/signup
    login({ email: 'demo@example.com', name: 'Demo User' });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#FF5A5F] to-[#FC8019] bg-clip-text text-transparent">
              {isLogin ? 'Welcome Back!' : 'Create Account'}
            </h1>
            <p className="text-gray-600 mt-2">
              {isLogin 
                ? 'Sign in to access your account' 
                : 'Join us to start comparing food prices'}
            </p>
          </div>
          
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]"
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]"
                placeholder="Enter your password"
                required
              />
              {isLogin && (
                <div className="text-right mt-1">
                  <a href="#" className="text-sm text-[#FF5A5F] hover:underline">
                    Forgot password?
                  </a>
                </div>
              )}
            </div>
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#FF5A5F] to-[#FC8019] text-white py-2 rounded-lg hover:shadow-md transition"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                className="text-[#FF5A5F] hover:underline"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
import { Link } from 'react-router-dom';
import { Search, TrendingUp, CreditCard, Zap } from 'lucide-react';
import SearchBar from '../components/SearchBar';

const HomePage = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#FF5A5F]/10 to-[#FC8019]/10 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Compare Food Prices Across
              <span className="bg-gradient-to-r from-[#FF5A5F] to-[#FC8019] bg-clip-text text-transparent">
                {' '}Zomato & Swiggy
              </span>
            </h1>
            <p className="text-gray-600 text-lg mb-8 md:mb-10">
              Find the best deals on your favorite food with our real-time price comparison tool.
              Save money on every order!
            </p>
            
            <div className="mb-10 max-w-2xl mx-auto">
              <SearchBar />
            </div>
            
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              <Link
                to="/search"
                className="bg-gradient-to-r from-[#FF5A5F] to-[#FC8019] text-white px-6 py-3 rounded-full font-medium hover:shadow-lg transition transform hover:-translate-y-0.5"
              >
                Compare Now
              </Link>
              <Link
                to="/premium"
                className="bg-white text-gray-800 border border-gray-300 px-6 py-3 rounded-full font-medium hover:bg-gray-50 transition transform hover:-translate-y-0.5"
              >
                Go Premium ₹30/mo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Why Use FoodCompare?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition">
              <div className="w-12 h-12 bg-[#FF5A5F]/10 rounded-full flex items-center justify-center mb-4">
                <Search className="text-[#FF5A5F]" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Search</h3>
              <p className="text-gray-600">
                Find any dish or restaurant across multiple platforms with our smart search.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition">
              <div className="w-12 h-12 bg-[#FC8019]/10 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="text-[#FC8019]" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Live Comparison</h3>
              <p className="text-gray-600">
                See real-time price differences, delivery fees, and taxes side by side.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition">
              <div className="w-12 h-12 bg-[#FF5A5F]/10 rounded-full flex items-center justify-center mb-4">
                <CreditCard className="text-[#FF5A5F]" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Coupon Engine</h3>
              <p className="text-gray-600">
                Automatically finds and applies the best available coupons for maximum savings.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition">
              <div className="w-12 h-12 bg-[#FC8019]/10 rounded-full flex items-center justify-center mb-4">
                <Zap className="text-[#FC8019]" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Quick Order</h3>
              <p className="text-gray-600">
                Redirect to your preferred platform with a single click to complete your order.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Section */}
      <section className="py-16 bg-gradient-to-r from-[#FF5A5F]/10 to-[#FC8019]/10">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="inline-block bg-yellow-100 text-yellow-800 text-xs font-medium px-3 py-1 rounded-full mb-4">
                  Premium Plan
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Unlock Unlimited Comparisons
                </h2>
                <p className="text-gray-600 mb-6">
                  Get unlimited food comparisons, early access to deals, and save your favorite dishes for just ₹30/month.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Unlimited comparisons (vs. 5/month on free plan)</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Save favorite dishes and restaurants</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Early access to exclusive deals and offers</span>
                  </li>
                </ul>
                <Link
                  to="/premium"
                  className="bg-gradient-to-r from-[#FF5A5F] to-[#FC8019] text-white px-6 py-3 rounded-full font-medium text-center hover:shadow-lg transition transform hover:-translate-y-0.5 inline-block"
                >
                  Go Premium for ₹30/mo
                </Link>
              </div>
              <div className="bg-gradient-to-br from-[#FF5A5F] to-[#FC8019] flex items-center justify-center p-8 md:p-12">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 w-full max-w-sm border border-white/20">
                  <div className="text-white text-center">
                    <h3 className="font-bold text-xl mb-3">Subscription Benefits</h3>
                    <div className="bg-white/20 h-px mb-4"></div>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Monthly Price</span>
                        <span className="font-semibold">₹30</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Comparisons</span>
                        <span className="font-semibold">Unlimited</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Saved Favorites</span>
                        <span className="font-semibold">Unlimited</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Exclusive Deals</span>
                        <span className="font-semibold">Early Access</span>
                      </div>
                      <div className="bg-white/20 h-px"></div>
                      <div className="flex justify-between text-lg">
                        <span>Annual Savings</span>
                        <span className="font-bold">₹360+</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            What Our Users Say
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-[#FF5A5F] text-white flex items-center justify-center font-bold">
                  A
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold">Ananya S.</h4>
                  <p className="text-sm text-gray-500">Bangalore</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "I saved over ₹200 on my dinner order last night! Found that the same pizza was ₹150 cheaper on Swiggy compared to Zomato."
              </p>
              <div className="flex text-yellow-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-[#FC8019] text-white flex items-center justify-center font-bold">
                  R
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold">Rahul M.</h4>
                  <p className="text-sm text-gray-500">Delhi</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "The coupon engine is fantastic! Found a BOGO deal on Zomato that wasn't shown on the app. FoodCompare pays for itself every month."
              </p>
              <div className="flex text-yellow-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#FF5A5F] to-[#FC8019] text-white flex items-center justify-center font-bold">
                  P
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold">Priya K.</h4>
                  <p className="text-sm text-gray-500">Mumbai</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "I love how it shows me which platform has a shorter delivery time. Sometimes paying a bit more is worth it if I can get my food 30 minutes faster!"
              </p>
              <div className="flex text-yellow-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
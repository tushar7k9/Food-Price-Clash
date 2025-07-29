import React, { createContext, useContext, useState, ReactNode } from 'react';

type FoodItem = {
  id: string;
  name: string;
  restaurant: string;
  cuisine: string;
  veg: boolean;
  description: string;
  zomato: {
    basePrice: number;
    finalPrice: number;
    discount: number;
    deliveryFee: number;
    taxes: number;
    deliveryTime: number;
    coupon: string | null;
    couponDesc: string | null;
    paymentOffers: Array<{
      bank: string;
      description: string;
    }>;
  };
  swiggy: {
    basePrice: number;
    finalPrice: number;
    discount: number;
    deliveryFee: number;
    taxes: number;
    deliveryTime: number;
    coupon: string | null;
    couponDesc: string | null;
    paymentOffers: Array<{
      bank: string;
      description: string;
    }>;
  };
};

type SearchContextType = {
  searchQuery: string | null;
  results: FoodItem[] | null;
  updateSearchQuery: (query: string) => void;
  updateResults: (results: FoodItem[]) => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [results, setResults] = useState<FoodItem[] | null>(null);

  const updateSearchQuery = (query: string) => {
    setSearchQuery(query);
  };

  const updateResults = (newResults: FoodItem[]) => {
    setResults(newResults);
  };

  return (
    <SearchContext.Provider value={{ searchQuery, results, updateSearchQuery, updateResults }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};
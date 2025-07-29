import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import ResultsPage from './pages/ResultsPage';
import AccountPage from './pages/AccountPage';
import { UserProvider } from './context/UserContext';
import { SearchProvider } from './context/SearchContext';

function App() {
  return (
      <BrowserRouter>
        <UserProvider>
          <SearchProvider>
            <div className="flex flex-col min-h-screen bg-gray-50">
              <Header />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/results" element={<ResultsPage />} />
                  <Route path="/account" element={<AccountPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </SearchProvider>
        </UserProvider>
      </BrowserRouter>
  );
}

export default App;
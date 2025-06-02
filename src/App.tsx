import React from 'react';
import { Toaster } from 'react-hot-toast';
import { WheelProvider } from './context/WheelContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';

function App() {
  return (
    <WheelProvider>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Toaster position="top-center" />
        <Header />
        <main className="flex-1">
          <Home />
        </main>
        <Footer />
      </div>
    </WheelProvider>
  );
}

export default App;
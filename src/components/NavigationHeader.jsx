import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const NavigationHeader = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <motion.header
      className="bg-white shadow-sm border-b border-gray-200"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            {!isHomePage && (
              <Link
                to="/"
                className="mr-4 p-2 text-gray-500 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
            )}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 flex items-center justify-center bg-white overflow-hidden">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdc1BPv6_Lup3QSF271X-hZZic3-5cumPIGQ&s"
                  alt="Walmart Logo"
                  className="w-8 h-8 object-contain"
                />
              </div>
              <span className="text-xl font-bold text-gray-900">
                Smart Returns
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-gray-600 font-medium">Powered by AI</span>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default NavigationHeader;
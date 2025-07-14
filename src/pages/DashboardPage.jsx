import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Heart, ShoppingCart, Recycle, Target, Plus } from 'lucide-react';
import { mockImpactMetrics } from '../data/mockData';

const DashboardPage = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const pieData = [
    { name: 'Resales', value: mockImpactMetrics.resalesCount, color: '#10B981' },
    { name: 'Donations', value: mockImpactMetrics.donationsCount, color: '#EF4444' },
    { name: 'Recycling', value: mockImpactMetrics.recycleCount, color: '#3B82F6' }
  ];

  const barData = [
    { month: 'Jan', profit: 45000, carbon: 4200 },
    { month: 'Feb', profit: 52000, carbon: 4800 },
    { month: 'Mar', profit: 48000, carbon: 4500 },
    { month: 'Apr', profit: 61000, carbon: 5200 },
    { month: 'May', profit: 58000, carbon: 5100 },
    { month: 'Jun', profit: 65000, carbon: 5500 }
  ];

  const zeroWasteProgress = 78; // Percentage towards zero waste goal

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Impact Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                Real-time sustainability and profit metrics
              </p>
            </div>
            <Link
              to="/return-form"
              className="mt-4 sm:mt-0 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Return
            </Link>
          </div>
        </motion.div>

        {/* Key Metrics Cards */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {[
            {
              title: 'Total Products Optimized',
              value: mockImpactMetrics.totalProductsOptimized.toLocaleString(),
              icon: TrendingUp,
              color: 'blue'
            },
            {
              title: 'Carbon Saved (kg)',
              value: mockImpactMetrics.carbonFootprintSaved.toLocaleString(),
              icon: Recycle,
              color: 'green'
            },
            {
              title: 'Total Profit Recovered',
              value: `$${mockImpactMetrics.totalProfitRecovered.toLocaleString()}`,
              icon: ShoppingCart,
              color: 'purple'
            },
            {
              title: 'Community Donations',
              value: mockImpactMetrics.donationsCount.toLocaleString(),
              icon: Heart,
              color: 'red'
            }
          ].map((metric, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl shadow-sm p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                </div>
                <div className={`p-3 bg-${metric.color}-100 rounded-lg`}>
                  <metric.icon className={`w-6 h-6 text-${metric.color}-600`} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Zero Waste Progress */}
        <motion.div
          className="bg-white rounded-xl shadow-sm p-8 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="flex items-center mb-6">
            <Target className="w-6 h-6 text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">
              Zero Waste Goal Progress
            </h2>
          </div>
          
          <div className="flex items-center">
            <div className="flex-1">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress to Zero Waste by 2025</span>
                <span>{zeroWasteProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <motion.div
                  className="bg-gradient-to-r from-green-500 to-blue-600 h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${zeroWasteProgress}%` }}
                  transition={{ duration: 1.5, delay: 0.8 }}
                />
              </div>
            </div>
            <div className="ml-6 text-right">
              <p className="text-2xl font-bold text-gray-900">{zeroWasteProgress}%</p>
              <p className="text-sm text-gray-600">Complete</p>
            </div>
          </div>
        </motion.div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Disposition Methods Chart */}
          <motion.div
            className="bg-white rounded-xl shadow-sm p-8"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Disposition Methods
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Monthly Trends Chart */}
          <motion.div
            className="bg-white rounded-xl shadow-sm p-8"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Monthly Trends
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="profit" fill="#3B82F6" name="Profit Recovered ($)" />
                  <Bar yAxisId="right" dataKey="carbon" fill="#10B981" name="Carbon Saved (kg)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          className="mt-16 text-center text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <p>Built for Sparkathon 2025 | Walmart Reverse Logistics Sustainability Engine</p>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
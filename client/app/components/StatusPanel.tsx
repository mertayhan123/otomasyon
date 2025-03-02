"use client";
import React from "react";
import { motion } from "framer-motion";

interface StatusPanelProps {
  statusData: {
    waterPressure: string;
    waterLevel: string;
    phValue: string;
  };
}

const StatusPanel: React.FC<StatusPanelProps> = ({ statusData }) => {
  // Animasyon varyantları
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
        duration: 0.5
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  const progressVariants = {
    hidden: { width: 0 },
    visible: (width: string) => ({
      width,
      transition: { duration: 0.8, ease: "easeOut" }
    })
  };

  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-6">
        <motion.h2 
          className="text-2xl font-bold text-gray-900 dark:text-white flex items-center mb-6"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" 
            viewBox="0 0 20 20" 
            fill="currentColor"
            animate={{ rotate: [0, 10, -10, 10, 0] }}
            transition={{ duration: 1, delay: 0.5, repeat: 0 }}
          >
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </motion.svg>
          Sistem Durumu
        </motion.h2>
        
        <div className="space-y-6">
          {/* Su Basıncı */}
          <motion.div 
            className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4"
            variants={itemVariants}
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)" }}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300">Su Basıncı</h3>
              <motion.span 
                className="text-xl font-bold text-blue-700 dark:text-blue-300"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 5 }}
              >
                {statusData.waterPressure}
              </motion.span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
              <motion.div 
                className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full"
                variants={progressVariants}
                custom="70%"
              ></motion.div>
            </div>
          </motion.div>
          
          {/* Su Seviyesi */}
          <motion.div 
            className="bg-teal-50 dark:bg-teal-900/30 rounded-lg p-4"
            variants={itemVariants}
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(20, 184, 166, 0.5)" }}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-teal-800 dark:text-teal-300">Su Seviyesi</h3>
              <motion.span 
                className="text-xl font-bold text-teal-700 dark:text-teal-300"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 6 }}
              >
                {statusData.waterLevel}
              </motion.span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
              <motion.div 
                className="bg-teal-600 dark:bg-teal-500 h-2.5 rounded-full"
                variants={progressVariants}
                custom="75%"
              ></motion.div>
            </div>
          </motion.div>
          
          {/* pH Değeri */}
          <motion.div 
            className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-4"
            variants={itemVariants}
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(147, 51, 234, 0.5)" }}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-300">pH Değeri</h3>
              <motion.span 
                className="text-xl font-bold text-purple-700 dark:text-purple-300"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 7 }}
              >
                {statusData.phValue}
              </motion.span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
              <motion.div 
                className="bg-purple-600 dark:bg-purple-500 h-2.5 rounded-full"
                variants={progressVariants}
                custom="65%"
              ></motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default StatusPanel;

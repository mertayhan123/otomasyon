"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Alarm {
  id: number;
  message: string;
  timestamp: string;
  type: "critical" | "warning" | "info";
}

interface AlarmPanelProps {
  alarms: Alarm[];
}

const AlarmPanel: React.FC<AlarmPanelProps> = ({ alarms }) => {
  // Animasyon varyantları
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.5
      }
    }
  };

  const headerVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const alarmItemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { duration: 0.4 }
    },
    exit: { 
      x: 20, 
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  // Alarm tipine göre renk ve ikon belirleme
  const getAlarmStyle = (type: string) => {
    switch (type) {
      case "critical":
        return {
          containerClass: "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800",
          iconClass: "text-red-600 dark:text-red-400",
          textClass: "text-red-800 dark:text-red-300",
          icon: (
            <motion.svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              viewBox="0 0 20 20" 
              fill="currentColor"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
            >
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </motion.svg>
          )
        };
      case "warning":
        return {
          containerClass: "bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800",
          iconClass: "text-yellow-600 dark:text-yellow-400",
          textClass: "text-yellow-800 dark:text-yellow-300",
          icon: (
            <motion.svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              viewBox="0 0 20 20" 
              fill="currentColor"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </motion.svg>
          )
        };
      default:
        return {
          containerClass: "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800",
          iconClass: "text-blue-600 dark:text-blue-400",
          textClass: "text-blue-800 dark:text-blue-300",
          icon: (
            <motion.svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              viewBox="0 0 20 20" 
              fill="currentColor"
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
            >
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </motion.svg>
          )
        };
    }
  };

  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.01 }}
    >
      <div className="p-6">
        <motion.h2 
          className="text-2xl font-bold text-gray-900 dark:text-white flex items-center mb-6"
          variants={headerVariants}
        >
          <motion.svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 mr-2 text-red-600 dark:text-red-400" 
            viewBox="0 0 20 20" 
            fill="currentColor"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              repeatDelay: 1 
            }}
          >
            <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
          </motion.svg>
          Alarm Paneli
        </motion.h2>
        
        <motion.div className="space-y-4">
          <AnimatePresence>
            {alarms.length > 0 ? (
              alarms.map((alarm) => {
                const style = getAlarmStyle(alarm.type);
                return (
                  <motion.div 
                    key={alarm.id} 
                    className={`border rounded-lg p-4 ${style.containerClass}`}
                    variants={alarmItemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    whileHover={{ 
                      scale: 1.02, 
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" 
                    }}
                  >
                    <div className="flex items-start">
                      <div className={`flex-shrink-0 ${style.iconClass}`}>
                        {style.icon}
                      </div>
                      <motion.div 
                        className="ml-3 flex-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <motion.p 
                          className={`text-sm font-medium ${style.textClass}`}
                          initial={{ y: 5, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          {alarm.message}
                        </motion.p>
                        <motion.p 
                          className="text-xs text-gray-500 dark:text-gray-400 mt-1"
                          initial={{ y: 5, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.4 }}
                        >
                          {alarm.timestamp}
                        </motion.p>
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <motion.div 
                className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-gray-600 dark:text-gray-400">Aktif alarm bulunmuyor</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AlarmPanel;

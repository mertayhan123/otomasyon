"use client";
import React from "react";
import { motion } from "framer-motion";

interface Sensor {
  id: number;
  name: string;
  type: string;
  location: string;
}

interface SensorTableProps {
  sensorData: Sensor[];
}

const SensorTable: React.FC<SensorTableProps> = ({ sensorData }) => {
  // Animasyon varyantları
  const tableRowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
        ease: "easeOut"
      }
    }),
    hover: {
      backgroundColor: "rgba(243, 244, 246, 0.8)",
      scale: 1.01,
      transition: { duration: 0.2 }
    }
  };

  return (
    <>
      {sensorData.map((sensor, index) => (
        <motion.tr 
          key={sensor.id} 
          className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          variants={tableRowVariants}
          initial="hidden"
          animate="visible"
          custom={index}
          whileHover="hover"
          whileTap={{ scale: 0.98 }}
          layout
        >
          <motion.td 
            className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white"
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.1 }}
          >
            #{sensor.id}
          </motion.td>
          <motion.td 
            className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300"
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.2 }}
          >
            {sensor.name}
          </motion.td>
          <motion.td 
            className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300"
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.3 }}
          >
            <motion.span 
              className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
              whileHover={{ scale: 1.1, backgroundColor: "#dcfce7" }}
            >
              {sensor.type}
            </motion.span>
          </motion.td>
          <motion.td 
            className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300"
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.4 }}
          >
            {sensor.location}
          </motion.td>
        </motion.tr>
      ))}
    </>
  );
};

export default SensorTable;

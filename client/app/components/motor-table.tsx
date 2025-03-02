// components/MotorTable.tsx

"use client";
import React from "react";
import { motion } from "framer-motion";

// Motor verisinin yapısını tanımlayan arayüz
interface Motor {
  id: number;
  name: string;
  type: string;
  location: string;
}

// Bileşenin prop'larının tipini tanımlayan arayüz
interface MotorTableProps {
  motorData: Motor[];
}

const MotorTable: React.FC<MotorTableProps> = ({ motorData }) => {
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
    },
    darkHover: {
      backgroundColor: "rgba(55, 65, 81, 0.8)",
      scale: 1.01,
      transition: { duration: 0.2 }
    }
  };

  return (
    <>
      {motorData.map((motor, index) => (
        <motion.tr 
          key={motor.id} 
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
            #{motor.id}
          </motion.td>
          <motion.td 
            className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300"
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.2 }}
          >
            {motor.name}
          </motion.td>
          <motion.td 
            className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300"
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.3 }}
          >
            <motion.span 
              className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200"
              whileHover={{ scale: 1.1, backgroundColor: "#c7d2fe" }}
            >
              {motor.type}
            </motion.span>
          </motion.td>
          <motion.td 
            className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300"
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.4 }}
          >
            {motor.location}
          </motion.td>
        </motion.tr>
      ))}
    </>
  );
};

export default MotorTable;
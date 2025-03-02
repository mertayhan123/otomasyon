"use client";
import { useSession } from "next-auth/react";
import React from "react";
import { motion } from "framer-motion";
import PageTransition from "./components/PageTransition";

function Home() {
  const { data: session } = useSession();

  // Animasyon varyantları
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const listItemVariants = {
    hidden: { x: -10, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <motion.div 
          className="bg-white p-8 rounded-lg shadow-md max-w-2xl text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
          transition={{ duration: 0.3 }}
        >
          <motion.h1 
            className="text-4xl font-bold mb-6 text-blue-600"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
          >
            Otomasyon Sistemi
          </motion.h1>

          <motion.p 
            className="text-lg text-gray-700 mb-4"
            variants={itemVariants}
          >
            Bu sistem, sensörlerden gelen verileri analiz ederek, motor ve diğer
            cihazları uzaktan kontrol etmenizi sağlar. Veriler anlık olarak takip
            edilir ve sistem üzerinde kolayca değişiklik yapılabilir.
          </motion.p>

          <motion.div 
            className="text-left mb-6"
            variants={itemVariants}
          >
            <motion.h2 
              className="text-2xl font-semibold text-gray-800 mb-2"
              whileHover={{ color: "#3b82f6" }}
            >
              Özellikler:
            </motion.h2>
            <ul className="list-disc list-inside text-gray-700">
              <motion.li variants={listItemVariants} custom={1}>
                Gerçek zamanlı sensör verilerini izleme
              </motion.li>
              <motion.li variants={listItemVariants} custom={2}>
                Motor değerlerini anlık olarak değiştirme
              </motion.li>
              <motion.li variants={listItemVariants} custom={3}>
                Kullanıcı dostu ve dinamik arayüz
              </motion.li>
            </ul>
          </motion.div>

          <motion.div 
            className="text-left"
            variants={itemVariants}
          >
            <motion.h2 
              className="text-2xl font-semibold text-gray-800 mb-2"
              whileHover={{ color: "#3b82f6" }}
            >
              Kullanılan Teknolojiler:
            </motion.h2>
            <ul className="list-disc list-inside text-gray-700">
              <motion.li variants={listItemVariants} custom={1}>
                ReactJS
              </motion.li>
              <motion.li variants={listItemVariants} custom={2}>
                DaisyUI & TailwindCSS
              </motion.li>
              <motion.li variants={listItemVariants} custom={3}>
                Node.js & Express.js
              </motion.li>
              <motion.li variants={listItemVariants} custom={4}>
                Arduino & ESP8266
              </motion.li>
            </ul>
          </motion.div>

          <motion.div 
            className="mt-8"
            variants={itemVariants}
          >
            <motion.p 
              className="text-gray-600"
              animate={{ 
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.02, 1]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                repeatType: "reverse" 
              }}
            >
              Bu sistem, geleceğin otomasyon çözümlerine öncülük eder.
            </motion.p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {session ? (
              <motion.a 
                href="/main" 
                className="btn btn-success mt-6 inline-block"
                whileHover={{ 
                  backgroundColor: "#059669",
                  boxShadow: "0 10px 15px -3px rgba(16, 185, 129, 0.4)"
                }}
              >
                {session.user?.name}
              </motion.a>
            ) : (
              <motion.a 
                href="/login" 
                className="btn btn-success mt-6 inline-block"
                whileHover={{ 
                  backgroundColor: "#059669",
                  boxShadow: "0 10px 15px -3px rgba(16, 185, 129, 0.4)"
                }}
              >
                Login
              </motion.a>
            )}
          </motion.div>
        </motion.div>
      </div>
    </PageTransition>
  );
}

export default Home;

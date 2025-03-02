"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => {
  const variants = {
    hidden: { opacity: 0, y: 20 },
    enter: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4, 
        ease: "easeInOut",
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { 
        duration: 0.3,
        ease: "easeInOut" 
      }
    }
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="enter"
      exit="exit"
      className="w-full"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition; 
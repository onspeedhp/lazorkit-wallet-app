"use client"

import { motion, AnimatePresence } from "framer-motion"
import type React from "react"

interface PageTransitionProps {
  children: React.ReactNode
  className?: string
}

export function PageTransition({ children, className = "" }: PageTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{
          duration: 0.3,
          ease: "easeOut",
        }}
        className={`${className}`}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export function SlideTransition({ children, className = "" }: PageTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{
          duration: 0.4,
          ease: "easeOut",
        }}
        className={`${className}`}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export function ScaleTransition({ children, className = "" }: PageTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{
          duration: 0.2,
          ease: "easeOut",
        }}
        className={`${className}`}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

"use client"

import { motion } from "framer-motion"

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15
    }
  }
}

const item = {
  hidden: {
    opacity: 0,
    y: 60
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
}

export function StaggerGrid({ children, className }) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className }) {
  return (
    <motion.div
      variants={item}
      className={className}
    >
      {children}
    </motion.div>
  )
}
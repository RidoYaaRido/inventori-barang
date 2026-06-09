import React, { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import LandingPage from './components/LandingPage'
import Dashboard from './components/Dashboard'

export default function Homepage() {
  const [view, setView] = useState('landing')

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#121c2a] selection:bg-[#00bcd4]/30">
      <AnimatePresence mode="wait">
        {view === 'landing' ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          >
            <LandingPage onEnterDemo={() => setView('dashboard')} />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <Dashboard onBackToLanding={() => setView('landing')} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
import React from 'react'
import { motion } from 'framer-motion'

const steps = [
  {
    title: 'Search & Discover',
    description: 'Browse by speciality, symptoms, or doctor name to find the right expert for you.',
    icon: '🔍'
  },
  {
    title: 'Choose Slot & Book',
    description: 'Pick a convenient date and time, share a few details, and confirm your visit.',
    icon: '📅'
  },
  {
    title: 'Visit & Stay Updated',
    description: 'Receive reminders, visit the clinic or consult online, and track your appointments.',
    icon: '✅'
  }
]

const HowItWorks = () => {
  return (
    <section className="relative mt-4 sm:mt-6 pt-0 pb-10 sm:pb-12 md:pb-14 bg-white dark:bg-gray-900 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-[#262626] dark:text-gray-100 mb-2">
          How It Works
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 md:mb-10">
          Book your appointment with HealthEase in just a few simple steps.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              className="relative bg-white dark:bg-gray-800 border border-blue-100 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 px-6 py-7 flex flex-col items-start text-left"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -6 }}
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-purple-600 text-xl mb-4">
                <span aria-hidden="true">{step.icon}</span>
              </div>
              <h3 className="text-lg font-semibold text-[#262626] dark:text-gray-100 mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks



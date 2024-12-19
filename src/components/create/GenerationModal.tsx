import { motion, AnimatePresence } from 'framer-motion';

interface GenerationModalProps {
  isOpen: boolean;
  status: string;
}

export function GenerationModal({ isOpen, status }: GenerationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 max-w-md w-full">
              <div className="flex flex-col items-center text-center space-y-6">
                {/* Loading Animation */}
                <div className="relative w-24 h-24">
                  <motion.div
                    className="absolute inset-0 border-4 border-blue-500 rounded-full"
                    animate={{
                      rotate: 360,
                      borderRadius: ["50% 50%", "30% 70%", "50% 50%"]
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 3,
                      ease: "linear"
                    }}
                  />
                  <motion.div
                    className="absolute inset-2 border-4 border-purple-500 rounded-full"
                    animate={{
                      rotate: -360,
                      borderRadius: ["30% 70%", "50% 50%", "30% 70%"]
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2.5,
                      ease: "linear"
                    }}
                  />
                </div>

                {/* Status Text */}
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">Creating Your Video</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {getStatusMessage(status)}
                  </p>
                </div>

                {/* Progress Steps */}
                <div className="w-full space-y-3">
                  <Step 
                    label="Initializing" 
                    isComplete={status !== 'waiting'} 
                    isActive={status === 'waiting'}
                  />
                  <Step 
                    label="Processing" 
                    isComplete={status === 'completed'} 
                    isActive={status === 'processing'}
                  />
                  <Step 
                    label="Finalizing" 
                    isComplete={false} 
                    isActive={status === 'completed'}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Step({ label, isComplete, isActive }: { 
  label: string; 
  isComplete: boolean; 
  isActive: boolean;
}) {
  return (
    <div className="flex items-center space-x-3">
      <div className={`
        w-6 h-6 rounded-full flex items-center justify-center
        ${isComplete ? 'bg-green-500' : isActive ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'}
      `}>
        {isComplete ? (
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-white' : 'bg-gray-400 dark:bg-gray-500'}`} />
        )}
      </div>
      <span className={`text-sm ${isActive ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
        {label}
      </span>
    </div>
  );
}

function getStatusMessage(status: string): string {
  switch (status) {
    case 'waiting':
      return 'Preparing your assets...';
    case 'processing':
      return 'Generating your video...';
    case 'completed':
      return 'Finalizing your masterpiece...';
    default:
      return 'Processing your request...';
  }
} 
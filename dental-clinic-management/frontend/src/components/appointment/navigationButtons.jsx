import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const NavigationButtons = ({
  currentStep,
  prevStep,
  nextStep,
  canProceed,
  isSubmitting,
  handleSubmit,
  totalSteps = 6,
}) => {
  return (
    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
      {currentStep > 1 && (
        <button
          type="button"
          onClick={prevStep}
          className="my-global-btn inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-white bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <ChevronLeft size={16} className="mr-1" />
          Quay lại
        </button>
      )}

      {currentStep < totalSteps ? (
        <button
          type="button"
          onClick={nextStep}
          disabled={!canProceed}
          className={`my-global-btn inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white 
            ${canProceed
              ? 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              : 'bg-blue-300 cursor-not-allowed'
            }`}
        >
          Tiếp tục
          <ChevronRight size={16} className="ml-1" />
        </button>
      ) : (
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`my-global-btn inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white 
            ${isSubmitting
              ? 'bg-blue-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            }`}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang xử lý...
            </>
          ) : (
            'Xác nhận đặt lịch'
          )}
        </button>
      )}
    </div>
  );
};

export default NavigationButtons;
import React, { useState } from 'react';

const EmergencyPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleEmergencyClick = () => {
    try {
      // Directly open the phone dialer for a normal call
      window.location.href = 'tel:+98102346798'; // Replace with the desired phone number
    } catch (error) {
      console.error('Error triggering the emergency call:', error);
    }
    setIsModalVisible(true);
  };
  

  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="w-full md:w-4/5 h-[50vh] md:h-full p-6 md:p-8 relative animate-gradientFade">
      <style>
        {`
          @keyframes slideIn {
            from { transform: translateY(-50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          @keyframes gradientFade {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes pulseText {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
          @keyframes pulseButton {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
          @keyframes pulseIcon {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
          .animate-slideIn { animation: slideIn 0.3s ease-out; }
          .animate-gradientFade {
            background: linear-gradient(135deg, #e2e8f0, #f1f5f9, #e2e8f0);
            background-size: 200% 200%;
            animation: gradientFade 15s ease infinite;
          }
          .animate-pulseText:hover { animation: pulseText 1s infinite; }
          .animate-pulseButton:hover { animation: pulseButton 0.8s infinite; }
          .animate-pulseIcon { animation: pulseIcon 1.5s infinite; }
        `}
      </style>
      <div className="flex flex-col justify-center  h-full items-center md:items-center mb-8 text-center">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent animate-pulseText">
            Emergency Alert
          </h2>
          <p className="text-sm bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent mt-2 animate-slideIn">
            Trigger emergency services or notify the management team.
          </p>
        </div>
        <button
          onClick={handleEmergencyClick}
          className="mt-4 bg-gradient-to-r from-red-600 to-rose-600 text-white px-6 py-3 rounded-lg text-sm font-semibold flex items-center justify-center space-x-2 animate-pulseButton hover:ring-2 hover:ring-cyan-300 hover:scale-105 transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Trigger Emergency</span>
        </button>
      </div>

      {isModalVisible && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="border-2 border-transparent bg-gradient-to-r from-cyan-500 to-purple-500 p-1 rounded-lg animate-slideIn">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4 text-center">
              <div className="flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-red-600 animate-pulseIcon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-bold text-red-600 ml-2">Emergency Triggered</h3>
              </div>
              <p className="text-sm text-gray-700 mt-4">
                An emergency has been reported. Authorities or building management will be notified immediately.
              </p>
              <button
                onClick={closeModal}
                className="mt-6 bg-gradient-to-r from-red-600 to-rose-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:scale-105 hover:ring-2 hover:ring-cyan-300 transition-all duration-200 animate-pulseButton"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyPage;
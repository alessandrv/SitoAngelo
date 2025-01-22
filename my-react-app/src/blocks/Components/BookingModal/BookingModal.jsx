import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import StarBorder from '../../Animations/StarBorder/StarBorder.jsx'
import FadeContent from '../../Animations/FadeContent/FadeContent.jsx'

const BookingModal = ({ isOpen, onClose, systemName }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    date: new Date(),
    message: ''
  });

  
  // Example busy dates - these would come from your backend
  const busyDates = [
    new Date(2025, 2, 11),
    new Date(2024, 3, 16),
    new Date(2024, 3, 17),
    new Date(2024, 4, 1),
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
    onClose();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      date
    }));
  };

  // Function to determine if a date should be disabled
  const tileDisabled = ({ date }) => {
    return busyDates.some(busyDate => 
      busyDate.getFullYear() === date.getFullYear() &&
      busyDate.getMonth() === date.getMonth() &&
      busyDate.getDate() === date.getDate()
    );
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <FadeContent 
        blur={true} 
        duration={300} 
        easing="ease-in-out" 
        initialOpacity={0}
        show={isOpen}
      >
        <div 
          className="bg-[#111111] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Book {systemName}</h2>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Information */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-black/30 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-black/30 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-black/30 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Event Type
                    </label>
                    <select
                      name="eventType"
                      required
                      value={formData.eventType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-black/30 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value="">Select event type</option>
                      <option value="wedding">Wedding</option>
                      <option value="party">Private Party</option>
                      <option value="corporate">Corporate Event</option>
                      <option value="festival">Festival</option>
                      <option value="club">Club Night</option>
                    </select>
                  </div>
                </div>

                {/* Calendar */}
                <div className="calendar-container">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Select Date
                  </label>
                  <Calendar
                    onChange={handleDateChange}
                    value={formData.date}
                    tileDisabled={tileDisabled}
                    minDate={new Date()}
                    className="booking-calendar"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Additional Information
                </label>
                <textarea
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-black/30 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Submit Button */}
              <StarBorder
as="button"
type="submit"
className="custom-class"
color="cyan"
speed="5s"
>
BOOK THIS SYSTEM
</StarBorder>
            </form>
          </div>
        </div>
      </FadeContent>
    </div>
  );
};

export default BookingModal; 
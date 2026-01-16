import axios from 'axios';
import React, { useState, useEffect } from 'react';

const Events = () => {
  const isAdmin = localStorage.getItem('admin') && localStorage.getItem('token');
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    venue: '',
  });

  useEffect(() => {
    const fetchEvents = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`https://societysync-890y.onrender.com/api/events`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { page: 1, limit: 10 },
        });
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  const openModal = (mode, event = null) => {
    setModalMode(mode);
    setIsModalVisible(true);
    setSelectedEvent(event);
    if (mode === 'edit' && event) {
      setFormData({
        title: event.title,
        description: event.description,
        date: event.date,
        venue: event.venue,
      });
    } else if (mode === 'create') {
      setFormData({ title: '', description: '', date: '', venue: '' });
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setFormData({ title: '', description: '', date: '', venue: '' });
    setSelectedEvent(null);
    setModalMode('create');
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      if (modalMode === 'create') {
        await axios.post(`https://societysync-890y.onrender.com/api/events/create`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else if (modalMode === 'edit') {
        await axios.put(`https://societysync-890y.onrender.com/api/events/${selectedEvent._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      closeModal();
      window.location.reload();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`https://societysync-890y.onrender.com/api/events/${selectedEvent._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      closeModal();
      window.location.reload();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return (
    <div className="w-full md:w-4/5 p-6 md:p-8 relative animate-gradientFade">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">
            Society Events
          </h2>
          <p className="text-md bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent mt-2 animate-slideIn">
            View and manage upcoming community <br />events with excitement.
          </p>
        </div>
        <button
          onClick={() => openModal('create')}
          className={`${isAdmin || "hidden"} mt-4 md:mt-0 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-5 py-2 rounded-lg text-sm font-medium flex items-center justify-center space-x-2 transition-colors duration-200 ${
            isAdmin ? '' : 'opacity-50 cursor-not-allowed'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Create Event</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event, index) => (
          <div
            key={event._id}
            onClick={() => openModal('view', event)}
            className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-4 py-6 rounded-xl transition-colors duration-300 cursor-pointer relative overflow-hidden"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className='w-fit'>
              <h3 className="text-2xl font-semibold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                {event.title}
              </h3>
              <hr className='border-gray-200 mt-1'/>
            </div>
            <p className="text-lg mt-2">Venue: {event.venue}</p>
            <p className="text-lg mt-1">Date: {event.date}</p>
            {event.description && (
              <p className="text-lg mt-1">
                {event.description.slice(0, 70)}{event.description.length > 70 ? '...' : ''}
              </p>
            )}
            {isAdmin && (
              <div
                className='mt-2 flex items-center justify-start gap-4'
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  onClick={() => openModal('edit', event)}
                  className='py-1 px-3 text-black text-lg hover:bg-gray-200 bg-gray-100 shadow-xl rounded-xl cursor-pointer'
                >
                  ✏️ Edit
                </div>
                <div
                  onClick={() => openModal('delete', event)}
                  className='py-1 px-3 text-black text-lg hover:bg-gray-200 bg-gray-100 shadow-xl rounded-xl cursor-pointer'
                >
                  ❌ Delete
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {isModalVisible && selectedEvent && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="border-2 border-transparent bg-gradient-to-r from-cyan-500 to-purple-500 p-1 rounded-lg animate-slideIn">
            <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
              {modalMode === 'delete' ? (
                <>
                  <h3 className="text-xl font-semibold text-gray-800 text-center">Confirm Delete</h3>
                  <p className="text-sm text-center text-gray-600 mt-4">
                    Are you sure you want to delete this event?
                  </p>
                  <div className="flex mt-6 gap-4 justify-center">
                    <button
                      onClick={handleDelete}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
                    >
                      Yes, Delete
                    </button>
                    <button
                      onClick={closeModal}
                      className="bg-gray-300 text-black px-4 py-2 rounded-lg text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : modalMode === 'view' ? (
                <>
                  <h3 className="text-2xl font-bold text-center text-gray-800">{selectedEvent.title}</h3>
                  <p className="mt-2 text-center text-gray-600">{selectedEvent.date} | {selectedEvent.venue}</p>
                  <hr className="my-4" />
                  <p className="text-gray-700 whitespace-pre-line">{selectedEvent.description}</p>
                  <button
                    onClick={closeModal}
                    className="mt-6 w-full bg-gradient-to-r from-red-600 to-rose-600 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Close
                  </button>
                </>
              ) : (
                <>
                  <h3 className="text-2xl font-semibold text-gray-800 text-center">
                    {modalMode === 'create' ? 'Create an Event' : 'Edit Event'}
                  </h3>
                  <form onSubmit={handleFormSubmit} className="space-y-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Event Title</label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleFormChange}
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleFormChange}
                        rows="4"
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-lg text-sm"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date</label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleFormChange}
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Venue</label>
                      <input
                        type="text"
                        name="venue"
                        value={formData.venue}
                        onChange={handleFormChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-2 px-4 rounded-lg font-semibold"
                    >
                      {modalMode === 'create' ? 'Create Event' : 'Update Event'}
                    </button>
                  </form>
                  <button
                    onClick={closeModal}
                    className="mt-4 w-full bg-gradient-to-r from-red-600 to-rose-600 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Close
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;

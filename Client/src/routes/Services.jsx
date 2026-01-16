  import axios from 'axios';
  import React, { useState, useEffect } from 'react';

  const Services = () => {
    const isAdmin = localStorage.getItem('admin') && localStorage.getItem('token');
    const [services, setServices] = useState([]);
    const [selectedServiceId, setSelectedServiceId] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'delete'
    const [formData, setFormData] = useState({
      detail: '',
      category: '',
    });

    useEffect(() => {
      const fetchServices = async () => {
        const token = localStorage.getItem('token');
        try {
          const response = await axios.get(`https://societysync-890y.onrender.com/api/services`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { page: 1, limit: 10 },
          });
          setServices(response.data);
        } catch (error) {
          console.error('Error fetching service requests:', error);
        }
      };
      fetchServices();
    }, []);

    const openModal = (mode, service = null) => {
      setModalMode(mode);
      if (mode === 'edit' && service) {
        setSelectedServiceId(service._id);
        setFormData({
          detail: service.detail,
          category: service.category,
        });
      } else if (mode === 'delete' && service) {
        setSelectedServiceId(service._id);
      } else {
        setFormData({ detail: '', category: '' });
      }
      setIsModalVisible(true);
    };

    const closeModal = () => {
      setIsModalVisible(false);
      setFormData({ detail: '', category: '' });
      setSelectedServiceId(null);
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
          await axios.post(`https://societysync-890y.onrender.com/api/services/create`, formData, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } else if (modalMode === 'edit') {
          await axios.put(
            `https://societysync-890y.onrender.com/api/services/${selectedServiceId}`,
            formData,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        }
        closeModal();
        window.location.reload();
      } catch (error) {
        console.error('Error submitting service request:', error);
      }
    };

    const handleDelete = async () => {
      const token = localStorage.getItem('token');
      try {
        await axios.delete(`https://societysync-890y.onrender.com/api/services/${selectedServiceId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        closeModal();
        window.location.reload();
      } catch (error) {
        console.error('Error deleting service request:', error);
      }
    };

    return (
      <div className="w-full md:w-4/5 p-6 md:p-8 relative animate-gradientFade">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              Service Dashboard
            </h2>
            <p className="text-lg bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mt-2 animate-slideIn">
              We're here top help! Request a Service.
            </p>
          </div>
          <button
            onClick={() => openModal('create')}
            className={`${isAdmin && "hidden"} mt-4 md:mt-0 bg-gradient-to-r from-red-600 to-pink-500 text-white px-5 py-2 rounded-lg text-sm font-medium flex items-center justify-center space-x-2 transition-colors duration-200`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Lodge Service Request</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={service._id}
              className="bg-gradient-to-r relative from-red-400 to-pink-500 text-white p-6 rounded-xl transition-colors duration-300 relative"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <h2 className={`absolute right-[5%] top-[7%] md:top-[4%] text-md md:text-sm capitalize ${service.status === "open" ? "text-green-300" : "text-yellow-300"}`}>· {service.status === "open" ? "In Queue" : "Completed"}</h2>
              <div className='w-fit'>
              <h3 className="text-xl">
                {service.houseNo}, {new Date(service.request).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </h3>
              <hr className='border-gray-200 my-2'/>
              </div>

              <p className="text-xl mt-1">Category: {service.category}</p>
              {service.detail && (
                <p className="text-xl mt-2">
                  {service.detail.slice(0, 70)}{service.detail.length > 70 ? '...' : ''}
                </p>
              )}
                <div className="mt-3 flex gap-4">
                  <div
                    onClick={() => openModal('edit', service)}
                    className="py-1 px-3 text-black text-lg hover:bg-gray-200 bg-gray-100 shadow-xl rounded-xl cursor-pointer"
                  >
                    ✏️ Edit
                  </div>
                  <div
                    onClick={() => openModal('delete', service)}
                    className="py-1 px-3 text-black text-lg hover:bg-gray-200 bg-gray-100 shadow-xl rounded-xl cursor-pointer"
                  >
                    ❌ Delete
                  </div>
                </div>
            </div>
          ))}
        </div>

        {isModalVisible && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="border-2 border-transparent bg-gradient-to-r from-red-500 to-pink-500 p-1 rounded-lg animate-slideIn">
              <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
                {modalMode === 'delete' ? (
                  <>
                    <h3 className="text-xl font-semibold text-gray-800 text-center">Confirm Delete</h3>
                    <p className="text-sm text-center text-gray-600 mt-4">
                      Are you sure you want to delete this Request?
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
                ) : (
                  <>
                    <h3 className="text-2xl font-semibold text-gray-800 text-center">
                      {modalMode === 'create' ? 'Lodge Complaint' : 'Edit Complaint'}
                    </h3>
                    <form onSubmit={handleFormSubmit} className="space-y-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <select className='mt-1 block w-full p-2 border border-gray-300 rounded-lg text-sm' name="category" value={formData.category} onChange={handleFormChange}>
                          <option value="">Select category</option>
                          <option value="Plumbing">Plumbing</option>
                          <option value="Carpentary">Carpentary</option>
                          <option value="Electrical">Electrical</option>
                          <option value="Masonry">Masonry</option>
                          <option value="Cleaning">Cleaning</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">detail</label>
                        <textarea
                          name="detail"
                          value={formData.detail}
                          onChange={handleFormChange}
                          rows="4"
                          required
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-lg text-sm"
                        ></textarea>
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white py-2 px-4 rounded-lg font-semibold"
                      >
                        {modalMode === 'create' ? 'Submit Request' : 'Update Request'}
                      </button>
                    </form>
                    <button
                      onClick={closeModal}
                      className="mt-4 w-full bg-gradient-to-r from-gray-600 to-gray-800 text-white px-4 py-2 rounded-lg text-sm"
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

  export default Services;

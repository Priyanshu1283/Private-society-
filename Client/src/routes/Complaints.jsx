import axios from 'axios';
import React, { useState, useEffect } from 'react';

const Complaints = () => {
  const isAdmin = localStorage.getItem('admin') && localStorage.getItem('token');
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'delete'
  const [formData, setFormData] = useState({
    detail: '', 
    category: '',
  });

  useEffect(() => {
    const fetchComplaints = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`https://societysync-890y.onrender.com/api/complaints`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { page: 1, limit: 10 },
        });
        setComplaints(response.data);
      } catch (error) {
        console.error('Error fetching complaints:', error);
      }
    };
    fetchComplaints();
  }, []);

  const openModal = (mode, complaint = null) => {
    setModalMode(mode);
    if (mode === 'edit' && complaint) {
      setSelectedComplaintId(complaint._id);
      setFormData({
        detail: complaint.detail,
        category: complaint.category,
      });
    } else if (mode === 'delete' && complaint) {
      setSelectedComplaintId(complaint._id);
    } else {
      setFormData({ detail: '', category: '' });
    }
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setFormData({ detail: '', category: '' });
    setSelectedComplaintId(null);
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
        await axios.post(`https://societysync-890y.onrender.com/api/complaints/create`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else if (modalMode === 'edit') {
        await axios.put(
          `https://societysync-890y.onrender.com/api/complaints/${selectedComplaintId}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
      closeModal();
      window.location.reload();
    } catch (error) {
      console.error('Error submitting complaint:', error);
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`https://societysync-890y.onrender.com/api/complaints/${selectedComplaintId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      closeModal();
      window.location.reload();
    } catch (error) {
      console.error('Error deleting complaint:', error);
    }
  };

  return (
    <div className="w-full md:w-4/5 p-6 md:p-8 relative animate-gradientFade">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
            Complaint Dashboard
          </h2>
          <p className="text-lg bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mt-2 animate-slideIn">
            Monitor and address community <br />complaints efficiently.
          </p>
        </div>
        <button
          onClick={() => openModal('create')}
          disabled={isAdmin}
          className={` ${isAdmin && "hidden"} mt-4 md:mt-0 bg-gradient-to-r from-red-600 to-pink-500 text-white px-5 py-2 rounded-lg text-sm font-medium flex items-center justify-center space-x-2 transition-colors duration-200 ${
            !isAdmin ? '' : 'opacity-50 cursor-not-allowed'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Lodge Complaint</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {complaints.map((complaint, index ) => (
          
          <div
            key={complaint.id}
            className="bg-gradient-to-r from-red-400 to-pink-500 text-white p-6 rounded-xl transition-colors duration-300 relative"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className='h-fit w-fit'>
              <h3 className="text-[22px]">
                {complaint.houseNo}, {new Date(complaint.date).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </h3>
              <hr className='border-gray-200 mt-1'/>
            </div>

            <p className="text-lg mt-2">Category: {complaint.category}</p>
            {complaint.detail && (
              <p className="text-lg mt-1">
                {complaint.detail.slice(0, 70)}{complaint.detail.length > 70 ? '...' : ''}
              </p>
            )}
            {!isAdmin && (
              <div className="mt-3 flex gap-4">
                <div
                  onClick={() => openModal('edit', complaint)}
                  className="py-1 px-3 shadow-xl text-lg rounded-xl cursor-pointer text-black hover:bg-gray-200 bg-gray-100"
                >
                  ✏️ Edit
                </div>
                <div
                  onClick={() => openModal('delete', complaint)}
                  className="py-1 px-3 text-black text-lg hover:bg-gray-200 bg-gray-100 shadow-xl rounded-xl cursor-pointer"
                >
                  ❌ Delete
                </div>
              </div>
            )}
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
                    Are you sure you want to delete this complaint?
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
                        <option value="Water">Water</option>
                        <option value="Electricity">Electricity</option>
                        <option value="Security">Security</option>
                        <option value="Garbage">Garbage</option>
                        <option value="Billing">Billing</option>
                        <option value="Noise">Noise</option>
                        <option value="Maintainance">Maintainance</option>
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
                      {modalMode === 'create' ? 'Submit Complaint' : 'Update Complaint'}
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

export default Complaints;

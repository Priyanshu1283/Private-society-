import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const WorkerDashBoard = () => {
  const [workerData, setWorkerData] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    const fn = async () => {
      const userData = localStorage.getItem('worker');
      const token = localStorage.getItem('token');

      if (!userData || !token) {
        navigate('/login'); 
      } else {
        try {
          const parsedUser = JSON.parse(userData);
          setWorkerData(parsedUser);

          const response = await axios.get('http://localhost:3000/api/services', {
            headers: { Authorization: `Bearer ${token}` },
            params: { page: 1, limit: 10 },
          });

          setTasks(response.data);
        } catch (e) {
          console.error('Error fetching complaints:', e);
          navigate('/login');
        }
      }
    };

    fn(); // corrected position
  }, [navigate]);

  const pendingTasks = tasks.filter(t => t.status === 'open');
  const completedTasks = tasks.filter(t => t.status === 'closed');

  const filteredTasks =
    filter === 'Pending'
      ? pendingTasks
      : filter === 'Completed'
      ? completedTasks
      : tasks;


  const handleCompletion = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.patch(`http://localhost:3000/${id}`,
        console.log(response),
        {}, {
        headers: { 
          Authorization: `Bearer ${token}`,
         "Content-Type": "application/json", },
      });
      
    } catch (error) {
      console.error('Error updating service:', error);
    }
  }    

  const today = new Date();
  const parts = today.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).split(" ");
  const formattedDate = `${parts[0]}, ${parts.slice(1).join(' ')}`; 

  return (
    workerData && (
      <div className="w-full md:w-4/5 p-6 md:p-8 relative animate-gradientFade">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-3xl md:text-3xl font-bold bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent animate-pulseText">
              {`${workerData.name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}`}, <span className='text-red-800 text-2xl font-semibold'>[Worker]</span>
            </h2>
            <p className="text-lg bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent animate-slideIn">
              Today is {`${formattedDate}`}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl shadow-xl bg-gradient-to-br from-emerald-400 to-green-500 text-white">
            <h2 className="text-xl font-semibold">Total Tasks</h2>
            <p className="text-4xl mt-2">{tasks.length}</p>
          </div>

          <div className="p-6 rounded-2xl shadow-xl bg-gradient-to-br from-yellow-400 to-orange-500 text-white">
            <h2 className="text-xl font-semibold">Pending</h2>
            <p className="text-4xl mt-2">{pendingTasks.length}</p>
          </div>

          <div className="p-6 rounded-2xl shadow-xl bg-gradient-to-br from-blue-400 to-indigo-500 text-white">
            <h2 className="text-xl font-semibold">Completed</h2>
            <p className="text-4xl mt-2">{completedTasks.length}</p>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex flex-col items-center justify-between mb-4">
            <h3 className="text-4xl font-bold mb-6">Task List</h3>
            <div className="space-x-4 mb-4">
              <button
                onClick={() => setFilter('All')}
                className={`px-3 py-1 rounded-full text-md ${
                  filter === 'All'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                All ({tasks.length})
              </button>
              <button
                onClick={() => setFilter('Pending')}
                className={`px-3 py-1 rounded-full text-md bg-gray-300 ${
                  filter === 'Pending'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                Pending ({pendingTasks.length})
              </button>
              <button
                onClick={() => setFilter('Completed')}
                className={`px-3 py-1 rounded-full text-md bg-gray-300 ${
                  filter === 'Completed'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                Completed ({completedTasks.length})
              </button>
            </div>
          </div>

          <ul className="space-y-4">
            {filteredTasks.length > 0 ? (
              filteredTasks.map(task => (
                <li
                  key={task._id || task.id}
                  className={`p-4 rounded-lg shadow-md ${
                    task.status === 'closed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  <div className='flex justify-between items-center'>
                    <div>
                      <h1 className='text-xl font-semibold mb-2'>{task.category}, {task.houseNo}</h1>
                      <hr className='border-black'/>
                      <h2 className='text-lg mt-1'>{task.detail}</h2>
                    </div>
                    <span className="font-semibold text-xl uppercase text-green-600">
                      {task.status === "open" ? "pending" : "completed"}
                    </span>
                  </div>

                  {task.status === "open" && (
                    <div className="flex justify-center mt-4">
                      <button onClick={() => handleCompletion(task._id)} className='px-4 py-2 bg-green-500 hover:bg-green-800 text-white rounded-lg shadow'>
                        Mark as Completed
                      </button>
                    </div>
                  )}
                </li>

              ))
            ) : (
              <p className="text-gray-500 italic">No tasks in this category.</p>
            )}
          </ul>
        </div>
      </div>
    )
  );
};

export default WorkerDashBoard;

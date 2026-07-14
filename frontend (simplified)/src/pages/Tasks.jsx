import { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from "react-router-dom";

const Tasks = () => {
  const apiUrl = import.meta.env.VITE_API_URL || '';
  const navigate = useNavigate();

  const fetchTasks = async () => {
      const response = await axios.get(`${apiUrl}/api/tasks`,{withCredentials:true});
      return response.data.data
  };

  const {
    data:tasks,isLoading,error,refetch
  } = useQuery({
    queryKey:["tasks"],
    queryFn:fetchTasks,
    staleTime:1000 * 60,
    gcTime:1000 * 60 * 5
  })

  const handleDelete = async (taskId) => {
    await axios.post(
      `${apiUrl}/api/tasks/delete`,
      { id: taskId },
      { withCredentials: true }
    );
    refetch();
  };



  return (
    <main style={{ padding: "20px" }}>
      <nav className="flex justify-start items-center gap-10 pb-3">
      <h1 className="text-2xl font-bold text-green-500">My Tasks</h1>
      <button
      onClick={()=> navigate("/add-task")}
       className='cursor-pointer bg-[#009919] px-3 pb-2 pt-1 rounded-lg'>Add Task</button>
      </nav>
      {
        isLoading && <h1 className="text-yellow-500">Loading.....</h1>
      }
      {
        error && <h1 className="text-red-500">{`Error ${error}`}</h1>
      }
      {
      !tasks ? (
        <p>No tasks found.</p>
      ) : (
        tasks.map((task) => (
          <div
            key={task.taskId}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "15px",
              marginBottom: "15px",
            }}
          >
            <h3>{task.title}</h3>

            <p>
              <strong>Description:</strong> {task.description}
            </p>

            <p>
              <strong>Category:</strong> {task.category}
            </p>

            <p>
              <strong>Priority:</strong> {task.priority}
            </p>

            <p>
              <strong>Due Date:</strong> {task.dueDate}
            </p>

            <button
              type="button"
              onClick={() => handleDelete(task.taskId)}
              className="cursor-pointer rounded-lg bg-red-600 px-3 py-2 text-white hover:bg-red-700"
            >
              Delete Task
            </button>
          </div>
        ))
      )}
    </main>
  );
};

export default Tasks;

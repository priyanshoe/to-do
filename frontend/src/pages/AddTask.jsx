import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const AddTask = () => {
  const apiUrl = import.meta.env.VITE_API_URL || '';
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [task, setTask] = useState({
    title: "",
    description: "",
    category: "",
    dueDate: "",
    priority: "Low",
  });

  const handleChange = (e) => {
    setTask({
      ...task,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreate = async () => {
    const response = await axios.post(
      `${apiUrl}/api/tasks/add`,
      task,
      { withCredentials: true }
    );
    return response.data.data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // INVALIDATE TANSTACK QUERY
    // queryClient.invalidateQueries({
    //     queryKey:["tasks"]
    // })

    mutate();
    
    //   alert("Task added successfully!");
      setTask({
          title: "",
          description: "",
          category: "",
          dueDate: "",
          priority: "Low",
        });
  };

const {
    mutate,
    data,
    isPending,
    isError,
    error,
    isSuccess
} = useMutation({
    mutationFn: handleCreate,
    onSuccess:(res)=>{
      console.log("Task Added:", res);
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError:(err)=>{console.log("Errors",err)}
})

        if(isPending) return <h1 className="text-yellow-500">Loading.....</h1>
        if(isError) return <h1 className="text-red-500">{`Error ${error}`}</h1>

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-gray-900 rounded-xl shadow-lg border border-gray-800 p-8">
        <h1 className="text-3xl font-bold text-white mb-6">
          Add New Task
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-gray-300 mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={task.title}
              onChange={handleChange}
              placeholder="Enter task title"
              required
              className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2 text-white outline-none focus:border-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-300 mb-2">
              Description
            </label>
            <textarea
              name="description"
              rows="4"
              value={task.description}
              onChange={handleChange}
              placeholder="Enter task description"
              className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2 text-white outline-none focus:border-blue-500 resize-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-gray-300 mb-2">
              Category
            </label>
            <input
              type="text"
              name="category"
              value={task.category}
              onChange={handleChange}
              placeholder="Study, Work, Personal..."
              className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2 text-white outline-none focus:border-blue-500"
            />
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-gray-300 mb-2">
              Due Date
            </label>
            <input
              type="date"
              name="dueDate"
              value={task.dueDate}
              onChange={handleChange}
              className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2 text-white outline-none focus:border-blue-500"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-gray-300 mb-2">
              Priority
            </label>
            <select
              name="priority"
              value={task.priority}
              onChange={handleChange}
              className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2 text-white outline-none focus:border-blue-500"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold py-3 rounded-lg"
          >
            Add Task
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTask;

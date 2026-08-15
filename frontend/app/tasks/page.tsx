'use client'
import axios from "axios";
import { useRouter } from "next/navigation";
import { Trash2, CirclePlus, LogOut } from "lucide-react";
import { useEffect, useState } from "react";


export default function TodoPage() {

  const router = useRouter();
  const colors = [
    "bg-green-700",
    "bg-purple-700",
    "bg-blue-700",
    "bg-yellow-700",
    "bg-pink-700",
    "bg-indigo-700",
    "bg-red-700",
    "bg-teal-700",
    "bg-orange-700",
    "bg-cyan-700"
  ];


  const [tasks, setTasks] = useState([])
  // const tasks = tasksData;

  async function fetchTask() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("please login first");
        router.push("/")
      }
      const taskData = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/task/user`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTasks(taskData.data.data);

    } catch (err: any) {
      console.log(err.response);
      alert(err.response.data.message);

    }

  }


  const handleComplete = (taskId: number) => {

    const token = localStorage.getItem("token");
    axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/task/user/${taskId}`, {}, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        fetchTask();
        alert(res.data.message)
      })
      .catch((err) => {
        console.log(err.response)
        alert(err.response.data.message)
      })
  }



  useEffect(() => {
    fetchTask();


  }, [])

  const handleLogOut = () => {
    localStorage.clear();
    router.push('/')
  }

  const handleDelete = (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (!confirmed) {
      return;
    }

    const token = localStorage.getItem("token");
    axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/task/user/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        alert(res.data.message)
        window.location.reload()
      })
      .catch(err => {
        alert(err.response.data.message)
        console.error(err.response)
      });
  }




  return (
    <div className="main w-full h-full bg-zinc-800 p-4">

      <div className="nav flex justify-between">
        <h1 className="text-4xl font-extrabold">To-Do List</h1>
        <div className="flex gap-4">
          <button onClick={() => router.push('/tasks/add')} >
            <CirclePlus size={36} />
          </button>
          <button onClick={handleLogOut}>
            <LogOut />
          </button>
        </div>
      </div>

      <div className='task-container mt-8'>

        {tasks &&
          tasks.map((elem: {
            task_id: number,
            bgcolor: string,
            title: string,
            description: string,
            isCompleted: boolean
          }, index) => (
            <div key={index} className={`flex items-center justify-between px-2 py-1 mt-6  ${elem.isCompleted ? "bg-gray-800 text-gray-500" : colors[index % colors.length]}`}>
              <div>
                <h2 className="text-2xl font-medium">{elem.title}</h2>
                <h3 className="text-base w-9/10 ml-2">{elem.description}</h3>
              </div>
              <div>

                <div className="flex flex-wrap items-center justify-center gap-6 md:gap-14">
                  <label className="flex gap-3 items-center cursor-pointer">
                    <span className={`${elem.isCompleted ? "hidden" : ""} text-white-700 select-none`}>Mark as Complete</span>
                    <input type="checkbox" className="hidden peer" checked={elem.isCompleted} onChange={() => handleComplete(elem.task_id)} />
                    <span className="w-5 h-5 border border-white-600 rounded-full relative flex items-center justify-center peer-checked:after:content-[''] peer-checked:after:w-2.5 peer-checked:after:h-2.5 peer-checked:after:bg-black peer-checked:border-black peer-checked:after:rounded-full peer-checked:after:absolute"></span>
                  </label>

                  <button
                    onClick={() => handleDelete(elem.task_id)}
                    className="">
                    <Trash2 />
                  </button>
                </div>
              </div>
            </div>

          ))
        }

      </div>


    </div>


  )
}
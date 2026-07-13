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


  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks`, { withCredentials: true })
      .then(res => {
        setTasks(res.data.data);
      })
      .catch(err => {
        alert(err.response.data.message)
        router.push("/")
        console.error(err.data)
      });

  }, [])

  const handleLogOut = () => {
    axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,{}, { withCredentials: true })
      .then(res => {
        alert(res.data.message)
        router.push('/')
      })
      .catch(err => {
        alert(err.response.data.message)
        console.error(err.data)
      });
  }

  const handleDelete = (id: number) => {
    axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/delete`, { id }, { withCredentials: true })
      .then(() => window.location.reload())
      .catch(err => {
        alert(err.response.data.message)
        console.error(err)
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

        {
          tasks.map((elem: {
            taskId: number,
            bgcolor: string,
            title: string,
            description: string
          }, index) => (
            <div key={index} className={`flex items-center justify-between px-2 py-1 mt-6 ${colors[index % colors.length]} `}>
              <div>
                <h2 className="text-2xl font-medium">{elem.title}</h2>
                <h3 className="text-base w-9/10 ml-2">{elem.description}</h3>
              </div>
              <button
                onClick={() => handleDelete(elem.taskId)}
                className="">
                <Trash2 />
              </button>
            </div>

          ))
        }

      </div>


    </div>


  )
}
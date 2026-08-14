'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export default function Add() {
  const [task, setTask] = useState({ title: '', description: '' })
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("please login first")
    e.preventDefault()
    axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/task/user`, task, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => router.push('/tasks'))
      .catch(err => console.error(err));
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Add Task</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Task title"
          value={task.title}
          onChange={(e) => setTask({ ...task, title: e.target.value })}
          className="border px-3 py-2 w-full"
          required
        />
        <textarea
          placeholder="Description"
          value={task.description}
          onChange={(e) => setTask({ ...task, description: e.target.value })}
          className="border px-3 py-2 w-full"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>
    </div>
  )
}
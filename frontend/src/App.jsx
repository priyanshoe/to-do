import React from 'react'
import { Route, Router, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Tasks from './pages/Tasks'
import AddTask from './pages/AddTask'
import NotFound from './pages/NotFound'

const App = () => {
  return (
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/tasks' element={<Tasks/>} />
        <Route path='/add-task' element={<AddTask/>} />
        <Route path='/*' element={<NotFound/>} />
      </Routes>
  )
}

export default App
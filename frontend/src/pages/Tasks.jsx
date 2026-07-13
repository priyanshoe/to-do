import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  LogOut, 
  Calendar, 
  Tag, 
  Check, 
  Filter, 
  Search, 
  Sparkles, 
  X,
  Loader2,
  AlertTriangle,
  Inbox,
  CheckCircle2,
  Clock
} from 'lucide-react';

export default function Tasks({ user, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all'); // all, active, completed
  const [selectedPriority, setSelectedPriority] = useState('all'); // all, low, medium, high

  // Form states for new task
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');
  const [newTaskCategory, setNewTaskCategory] = useState('General');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [submittingTask, setSubmittingTask] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

  // Load tasks on mount and when user session changes
  useEffect(() => {
    fetchTasks();
  }, [user]);

  const fetchTasks = async () => {
    setLoading(true);
    setError('');
    try {
      // Axios template pattern for fetching
      const response = await axios.get(`${apiUrl}/api/tasks`, { withCredentials: true });
      setTasks(response.data || []);
    } catch (err) {
      console.warn('Backend API fetch error, looking up cached tasks', err);
      // Retrieve fallback items so application remains functional and stunning
      const savedTasks = localStorage.getItem(`vivid_tasks_${user?.id || 'guest'}`);
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      } else {
        const initialTasks = [
          {
            id: 'demo_1',
            text: 'Compile Frosted Glass interface design metrics',
            priority: 'high',
            category: 'Design',
            completed: false,
            dueDate: new Date().toISOString().split('T')[0]
          },
          {
            id: 'demo_2',
            text: 'Integrate secure axios endpoint architecture',
            priority: 'medium',
            category: 'Engineering',
            completed: true,
            dueDate: ''
          },
          {
            id: 'demo_3',
            text: 'Configure infinite slow floating element loops',
            priority: 'low',
            category: 'Animation',
            completed: false,
            dueDate: ''
          }
        ];
        setTasks(initialTasks);
        localStorage.setItem(`vivid_tasks_${user?.id || 'guest'}`, JSON.stringify(initialTasks));
      }
    } finally {
      setLoading(false);
    }
  };

  const syncLocalStorage = (updatedList) => {
    localStorage.setItem(`vivid_tasks_${user?.id || 'guest'}`, JSON.stringify(updatedList));
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    setSubmittingTask(true);
    setError('');

    const taskPayload = {
      text: newTaskText,
      priority: newTaskPriority,
      category: newTaskCategory || 'General',
      dueDate: newTaskDueDate || null
    };

    try {
      // Axios post to add task
      const response = await axios.post(`${apiUrl}/api/tasks/add`, taskPayload, { withCredentials: true });
      const updated = [...tasks, response.data];
      setTasks(updated);
      syncLocalStorage(updated);

      // Clean form inputs & close modal
      setNewTaskText('');
      setNewTaskPriority('medium');
      setNewTaskCategory('General');
      setNewTaskDueDate('');
      setIsModalOpen(false);
    } catch (err) {
      console.warn('Backend add failed, executing client-side fallback mutation', err);
      // Fallback
      const fallbackTask = {
        id: 'fallback_' + Math.random().toString(36).substr(2, 9),
        userId: user?.id || 'guest',
        text: newTaskText,
        priority: newTaskPriority,
        category: newTaskCategory || 'General',
        dueDate: newTaskDueDate || '',
        completed: false,
        createdAt: new Date().toISOString()
      };
      const updated = [...tasks, fallbackTask];
      setTasks(updated);
      syncLocalStorage(updated);

      // Clean inputs
      setNewTaskText('');
      setNewTaskPriority('medium');
      setNewTaskCategory('General');
      setNewTaskDueDate('');
      setIsModalOpen(false);
    } finally {
      setSubmittingTask(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      // Axios call to delete task
      await axios.post(`${apiUrl}/api/tasks/delete`, { id: taskId }, { withCredentials: true });
      const updated = tasks.filter(t => t.id !== taskId);
      setTasks(updated);
      syncLocalStorage(updated);
    } catch (err) {
      console.warn('Backend delete failed, falling back to client', err);
      const updated = tasks.filter(t => t.id !== taskId);
      setTasks(updated);
      syncLocalStorage(updated);
    }
  };

  const handleToggleTaskCompletion = async (taskId) => {
    try {
      // Optional toggle endpoint for rich completion feedback
      const response = await axios.post(`${apiUrl}/api/tasks/toggle`, { id: taskId }, { withCredentials: true });
      const updated = tasks.map(t => t.id === taskId ? response.data : t);
      setTasks(updated);
      syncLocalStorage(updated);
    } catch (err) {
      console.warn('Backend toggle failed, fallback toggling in client state', err);
      const updated = tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
      setTasks(updated);
      syncLocalStorage(updated);
    }
  };

  const handleLogoutAction = async () => {
    try {
      await axios.post(`${apiUrl}/api/auth/logout`, {}, { withCredentials: true });
    } catch (err) {
      console.warn('Logout endpoint failed, clearing state locally', err);
    } finally {
      onLogout();
    }
  };

  // Filter & Search Logic
  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (t.category && t.category.toLowerCase().includes(searchQuery.toLowerCase()));
    
    let matchesStatus = true;
    if (selectedFilter === 'pending') matchesStatus = !t.completed;
    if (selectedFilter === 'completed') matchesStatus = t.completed;

    let matchesPriority = true;
    if (selectedPriority !== 'all') matchesPriority = t.priority === selectedPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const pendingCount = tasks.filter(t => !t.completed).length;

  return (
    <div id="tasks_deck" className="min-h-screen w-full flex flex-col justify-between relative overflow-hidden text-zinc-800 dark:text-zinc-100 p-4 sm:p-6 lg:p-8">
      
      {/* Background Animated Floating Blobs for interactive depth */}
      <motion.div 
        id="tasks_ambient_orb_1"
        animate={{ 
          y: [-25, 25, -25], 
          x: [0, 15, 0], 
          scale: [1, 1.08, 1] 
        }}
        transition={{ 
          duration: 12, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute top-1/4 left-1/5 w-80 h-80 rounded-full bg-blue-500/5 dark:bg-blue-500/10 blur-3xl pointer-events-none"
      />

      <motion.div 
        id="tasks_ambient_orb_2"
        animate={{ 
          y: [25, -25, 25], 
          x: [0, -15, 0], 
          scale: [1.05, 0.95, 1.05] 
        }}
        transition={{ 
          duration: 16, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute bottom-1/4 right-1/5 w-96 h-96 rounded-full bg-purple-500/5 dark:bg-purple-500/8 blur-3xl pointer-events-none"
      />

      {/* Primary Container */}
      <div className="w-full max-w-5xl mx-auto z-10 flex-1 flex flex-col gap-6 py-2">
        
        {/* Navigation Bar */}
        <header id="tasks_navbar" className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-200 dark:border-white/5 pb-4">
          <div id="logo_group_tasks" className="flex items-center gap-2.5">
            <div id="logo_badge_tasks" className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <h2 id="logo_title_tasks" className="font-display font-black text-lg leading-tight text-zinc-900 dark:text-white">
                Vivid<span className="text-blue-500">Do</span>
              </h2>
              <p id="sync_status" className="text-[9px] text-zinc-400 font-extrabold tracking-widest uppercase">Live Workspace</p>
            </div>
          </div>

          {/* User Meta & Log Out Controls */}
          <div id="user_deck_actions" className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/40 dark:bg-white/5 border border-zinc-200/50 dark:border-white/10 shadow-sm">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-[10px] font-black text-white uppercase">
                {user?.name ? user.name.charAt(0) : 'U'}
              </div>
              <span className="text-xs font-bold text-zinc-700 dark:text-zinc-200">
                {user?.name || 'Local User'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleLogoutAction}
                className="px-3 py-1.5 h-9 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 hover:text-red-500 text-xs font-bold flex items-center gap-1.5 transition-all duration-200 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Hero Card Container */}
        <div className="relative overflow-hidden bg-white/30 dark:bg-black/20 border border-zinc-200/50 dark:border-white/5 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
          {/* Internal ambient ring */}
          <div className="absolute top-1/2 right-12 w-28 h-28 rounded-full border border-dashed border-zinc-300 dark:border-white/5 animate-float-slow pointer-events-none"></div>

          <div>
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-extrabold uppercase tracking-widest bg-blue-500/10 dark:bg-blue-500/15 px-2.5 py-1 rounded-full border border-blue-500/20">Operational Overview</span>
            <h3 className="font-display font-black text-2xl text-zinc-900 dark:text-white tracking-tight mt-3">
              Task Matrix deck
            </h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm mt-1">
              You currently have <span className="text-blue-500 font-extrabold">{pendingCount} pending</span> tasks awaiting deployment.
            </p>
          </div>

          {/* ADD BUTTON at top of panel */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-blue-500/15 hover:shadow-blue-500/25 transition-all duration-300 active:scale-[0.97] cursor-pointer group shrink-0"
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
            <span>Add New Task Entry</span>
          </button>
        </div>

        {/* Search, Status Tabs and Priority Filters Panel */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search Box */}
          <div className="md:col-span-5 relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-zinc-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search tasks, priorities, or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/40 dark:bg-white/[0.02] hover:bg-white/60 dark:hover:bg-white/[0.04] border border-zinc-200 dark:border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 outline-none transition-all duration-250"
            />
          </div>

          {/* Status Tab Group */}
          <div className="md:col-span-4 flex p-1 bg-zinc-200/50 dark:bg-white/[0.02] border border-zinc-300/30 dark:border-white/5 rounded-xl gap-1">
            {['all', 'pending', 'completed'].map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setSelectedFilter(filterOption)}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg capitalize transition-all duration-200 cursor-pointer ${
                  selectedFilter === filterOption 
                    ? 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20' 
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
                }`}
              >
                {filterOption}
              </button>
            ))}
          </div>

          {/* Priority filter */}
          <div className="md:col-span-3 flex items-center gap-1.5 bg-white/40 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/10 rounded-xl px-2.5 py-1.5 shadow-sm">
            <Filter className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="bg-transparent border-none text-xs text-zinc-600 dark:text-zinc-300 font-bold w-full focus:outline-none cursor-pointer"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
        </div>

        {/* Task List Workspace */}
        <div className="space-y-3 flex-1 min-h-[300px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              <p className="text-xs text-zinc-500 font-semibold tracking-wider uppercase">Fetching database indexes...</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 px-4 bg-white/10 dark:bg-white/[0.01] border border-dashed border-zinc-200 dark:border-white/5 rounded-3xl flex flex-col items-center gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-white/5 flex items-center justify-center text-zinc-400 dark:text-zinc-500">
                <Inbox className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-zinc-800 dark:text-zinc-300">No matching entries found</p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">Initialize some entries using the New Task action above.</p>
              </div>
            </motion.div>
          ) : (
            <div className="grid gap-3">
              <AnimatePresence mode="popLayout">
                {filteredTasks.map((task) => {
                  const isHigh = task.priority === 'high';
                  const isMedium = task.priority === 'medium';
                  const isLow = task.priority === 'low';

                  const tagStyles = isHigh 
                    ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20' 
                    : isMedium 
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' 
                    : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';

                  return (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      transition={{ duration: 0.25 }}
                      className={`flex items-center justify-between p-4 bg-white/40 dark:bg-white/[0.02] hover:bg-white/60 dark:hover:bg-white/[0.04] border border-zinc-200/50 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/10 rounded-2xl transition-colors duration-300 group shadow-sm ${
                        task.completed ? 'opacity-60' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3.5 flex-1 min-w-0">
                        {/* Checkbox Trigger with scale microinteraction */}
                        <button
                          onClick={() => handleToggleTaskCompletion(task.id)}
                          className="focus:outline-none cursor-pointer shrink-0"
                        >
                          {task.completed ? (
                            <motion.div 
                              whileTap={{ scale: 0.85 }}
                              className="w-5.5 h-5.5 rounded-lg bg-blue-500 flex items-center justify-center text-white border border-blue-600 transition-all duration-200 shadow-sm"
                            >
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </motion.div>
                          ) : (
                            <motion.div 
                              whileTap={{ scale: 0.85 }}
                              className="w-5.5 h-5.5 rounded-lg border-2 border-zinc-300 dark:border-white/20 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-200"
                            />
                          )}
                        </button>

                        {/* Text Metadata Details */}
                        <div className="min-w-0 flex-1">
                          <p className={`text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate transition-all duration-300 ${
                            task.completed ? 'line-through text-zinc-400 dark:text-zinc-500' : ''
                          }`}>
                            {task.text}
                          </p>
                          
                          <div className="flex flex-wrap items-center gap-2 mt-1.5">
                            {/* Priority badge */}
                            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${tagStyles}`}>
                              {task.priority}
                            </span>

                            {/* Category Badge */}
                            {task.category && (
                              <span className="text-[9px] text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-white/5 border border-zinc-200/50 dark:border-white/5 px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                                <Tag className="w-2.5 h-2.5 text-zinc-400 shrink-0" />
                                {task.category}
                              </span>
                            )}

                            {/* Due date badge */}
                            {task.dueDate && (
                              <span className="text-[9px] text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-white/5 border border-zinc-200/50 dark:border-white/5 px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                                <Calendar className="w-2.5 h-2.5 text-zinc-400 shrink-0" />
                                {task.dueDate}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Delete Trigger - standard button with micro-vibration */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 transition-all duration-200 cursor-pointer shrink-0 ml-3 shadow-sm"
                        title="Delete entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Adding Modal Element with Framer Animate Presence */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-md bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden"
            >
              {/* Colored subtle bar */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

              {/* Title group */}
              <div className="flex justify-between items-center mb-5">
                <h4 className="font-display font-black text-lg text-zinc-900 dark:text-white tracking-tight">Create Task Entry</h4>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5 flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Form entries */}
              <form onSubmit={handleAddTask} className="space-y-4">
                
                {/* Text entry */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">What needs to be done?</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Code the frontend architecture files"
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    className="w-full bg-zinc-100 dark:bg-black/25 border border-zinc-200 dark:border-white/10 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-zinc-900 dark:text-white outline-none transition-colors focus:border-blue-500 placeholder-zinc-400 dark:placeholder-zinc-500"
                  />
                </div>

                {/* Categories & dates */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Category Tag</label>
                    <input
                      type="text"
                      placeholder="e.g. Personal, Ideas"
                      value={newTaskCategory}
                      onChange={(e) => setNewTaskCategory(e.target.value)}
                      className="w-full bg-zinc-100 dark:bg-black/25 border border-zinc-200 dark:border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-zinc-900 dark:text-white outline-none transition-colors focus:border-blue-500 placeholder-zinc-400 dark:placeholder-zinc-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Due Date</label>
                    <input
                      type="date"
                      value={newTaskDueDate}
                      onChange={(e) => setNewTaskDueDate(e.target.value)}
                      className="w-full bg-zinc-100 dark:bg-black/25 border border-zinc-200 dark:border-white/10 rounded-xl py-2 px-3 text-xs text-zinc-700 dark:text-zinc-300 outline-none transition-colors focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Priority Selection Pills */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Priority Tier</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['low', 'medium', 'high'].map((prio) => {
                      const active = newTaskPriority === prio;
                      let activeStyles = '';
                      if (active) {
                        if (prio === 'low') activeStyles = 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/40';
                        if (prio === 'medium') activeStyles = 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/40';
                        if (prio === 'high') activeStyles = 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/40';
                      }
                      return (
                        <button
                          key={prio}
                          type="button"
                          onClick={() => setNewTaskPriority(prio)}
                          className={`py-2 text-xs font-bold rounded-lg capitalize border cursor-pointer transition-all duration-200 ${
                            active 
                              ? activeStyles 
                              : 'bg-zinc-50 dark:bg-transparent text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/25'
                          }`}
                        >
                          {prio}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Discard & Submit triggers */}
                <div className="flex gap-2.5 pt-3 border-t border-zinc-200 dark:border-white/5 mt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-300 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer text-center"
                  >
                    Discard
                  </button>
                  <button
                    type="submit"
                    disabled={submittingTask}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {submittingTask ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <span>Commit Task</span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Screen Footer */}
      <footer id="tasks_footer" className="w-full max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center z-10 py-4 border-t border-zinc-200 dark:border-white/5 text-[11px] text-zinc-400 mt-6 gap-2">
        <span>© 2026 VividDo • Immersive task spec index.</span>
        <span>Operational session state active</span>
      </footer>
    </div>
  );
}

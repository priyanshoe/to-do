'use client'
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";


export default function Home() {

  const router = useRouter();

  const [signUpData, setsignUpData] = useState(
    {
      name: "",
      email: "",
      password: ""
    }
  );
  const [conform_password, setConform_password] = useState("")

  const handleChangeSignUp = (e: React.ChangeEvent<HTMLInputElement>) => {
    setsignUpData({ ...signUpData, [e.target.name]: e.target.value });
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (signUpData.password !== conform_password)
      return alert("Password not matched");
    axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`, signUpData, { withCredentials: true })
      .then(res => {
        alert(res.data.message)
        router.push('/tasks')
      })
      .catch(err => {
        alert(err.response.data.message)
        console.error(err)
      });

  }


  const [signInData, setsignInData] = useState(
    {
      email: "",
      password: ""
    }
  );
  const handleChangeSignIn = (e: React.ChangeEvent<HTMLInputElement>) => {
    setsignInData({ ...signInData, [e.target.name]: e.target.value });

  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, signInData, { withCredentials: true })
      .then(res => {
        alert(res.data.message)
        router.push('/tasks');
      })
      .catch(err => {
        alert(err.response.data.message)
        console.error(err)
      });
  }


  const [isSignIn, setisSignIn] = useState(false)
  return (
    <div className="h-screen w-full flex flex-col lg:flex-row relative">

      <div className={`absolute w-full h-1/2 lg:w-1/2 lg:h-full  ${isSignIn ? "max-lg:top-0 lg:left-0" : "max-lg:top-1/2 lg:left-1/2"} transition-all duration-750 left-0 bg-red-400 flex flex-col items-center justify-center text-center  gap-5 px-6`}>
        <h1 className="text-4xl font-bold transition-all duration-750">{isSignIn ? "Welcome back" : "Join us today"}</h1>
        <p className="px-2">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ratione vitae nostrum eos, quae, amet quidem beatae dolore, atque dolorum eligendi nihil molestias illum rerum est.</p>
        <button
          onClick={() => setisSignIn(!isSignIn)}
          type="submit"
          className="bg-transparent border transition-all duration-750 border-white text-white font-bold rounded-full px-8 py-2 text-lg shadow hover:text-black  hover:cursor-pointer hover:border-red-400"
        >
          {isSignIn ? "Sign In" : "Sign Up"}
        </button>
      </div>


      <div className="w-full h-1/2 lg:w-1/2 lg:h-full  flex flex-col gap-3 items-center justify-center">
        <h1 className="text-5xl font-bold ">Sign In</h1>
        <div className="flex space-x-4 ">
          <button className="w-10 h-10 rounded-full border flex items-center justify-center text-xl bg-white shadow">
            <span className="sr-only">Sign in with Facebook</span>
            <svg width="20" height="20" fill="currentColor" className="text-blue-600" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.406.595 24 1.326 24H12.82v-9.294H9.692v-3.622h3.127V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.406 24 22.674V1.326C24 .592 23.406 0 22.675 0"></path></svg>
          </button>
          <button className="w-10 h-10 rounded-full border flex items-center justify-center text-xl bg-white shadow">
            <span className="sr-only">Sign in with Google</span>
            <svg width="20" height="20" fill="currentColor" className="text-red-500" viewBox="0 0 24 24"><path d="M21.805 10.023h-9.18v3.955h5.273c-.227 1.19-1.364 3.49-5.273 3.49-3.174 0-5.755-2.63-5.755-5.868s2.581-5.868 5.755-5.868c1.805 0 3.017.77 3.713 1.432l2.537-2.47C17.09 3.58 15.09 2.5 12.625 2.5 7.797 2.5 4 6.298 4 11.045s3.797 8.545 8.625 8.545c4.97 0 8.25-3.49 8.25-8.41 0-.57-.062-1.01-.07-1.157z"></path></svg>
          </button>
          <button className="w-10 h-10 rounded-full border flex items-center justify-center text-xl bg-white shadow">
            <span className="sr-only">Sign in with LinkedIn</span>
            <svg width="20" height="20" fill="currentColor" className="text-blue-700" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.968v5.699h-3v-10h2.881v1.367h.041c.401-.761 1.381-1.563 2.845-1.563 3.042 0 3.604 2.003 3.604 4.605v5.591z" /></svg>
          </button>
        </div>
        <p className="text-gray-400  font-semibold">or use your account</p>
        <form
          onSubmit={handleSignIn}
          className="flex flex-col gap-2 items-center w-full text-black max-w-xs">
          <input
            type="email"
            placeholder="Email"
            name="email"
            required
            value={signInData.email}
            onChange={handleChangeSignIn}
            className=" px-4 py-2 w-full rounded bg-gray-200 placeholder-gray-500 focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            required
            value={signInData.password}
            onChange={handleChangeSignIn}
            className=" px-4 py-2 w-full rounded bg-gray-200 placeholder-gray-500 focus:outline-none"
          />
          <Link href="#" className="text-gray-400 mb-4 text-sm font-semibold hover:underline">
            Forgot your password?
          </Link>
          <button
            type="submit"
            className="bg-red-400 text-white font-bold rounded-full px-8 py-2 text-lg shadow hover:bg-black hover:text-red-400 hover:cursor-pointer duration-500 transition-all"
          >
            SIGN IN
          </button>
        </form>
      </div>

      <div className="w-full h-1/2 lg:w-1/2 lg:h-full flex flex-col items-center gap-3 justify-center">
        <h1 className="text-5xl font-bold  text-white">Sign Up</h1>
        <div className="flex space-x-4 ">
          <button className="w-10 h-10 rounded-full border flex items-center justify-center text-xl bg-white shadow">
            <span className="sr-only">Sign up with Facebook</span>
            <svg width="20" height="20" fill="currentColor" className="text-blue-600" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.406.595 24 1.326 24H12.82v-9.294H9.692v-3.622h3.127V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.406 24 22.674V1.326C24 .592 23.406 0 22.675 0"></path></svg>
          </button>
          <button className="w-10 h-10 rounded-full border flex items-center justify-center text-xl bg-white shadow">
            <span className="sr-only">Sign up with Google</span>
            <svg width="20" height="20" fill="currentColor" className="text-red-500" viewBox="0 0 24 24"><path d="M21.805 10.023h-9.18v3.955h5.273c-.227 1.19-1.364 3.49-5.273 3.49-3.174 0-5.755-2.63-5.755-5.868s2.581-5.868 5.755-5.868c1.805 0 3.017.77 3.713 1.432l2.537-2.47C17.09 3.58 15.09 2.5 12.625 2.5 7.797 2.5 4 6.298 4 11.045s3.797 8.545 8.625 8.545c4.97 0 8.25-3.49 8.25-8.41 0-.57-.062-1.01-.07-1.157z"></path></svg>
          </button>
          <button className="w-10 h-10 rounded-full border flex items-center justify-center text-xl bg-white shadow">
            <span className="sr-only">Sign up with LinkedIn</span>
            <svg width="20" height="20" fill="currentColor" className="text-blue-700" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.968v5.699h-3v-10h2.881v1.367h.041c.401-.761 1.381-1.563 2.845-1.563 3.042 0 3.604 2.003 3.604 4.605v5.591z" /></svg>
          </button>
        </div>
        <p className="text-gray-200  font-semibold">or use your email for registration</p>
        <form
          onSubmit={handleSignUp}
          className="flex flex-col items-center gap-2 w-full text-black max-w-xs">
          <input
            type="text"
            placeholder="Name"
            required
            value={signUpData.name}
            name="name"
            onChange={handleChangeSignUp}
            className=" px-4 py-2 w-full rounded bg-gray-200 placeholder-gray-500 focus:outline-none"
          />
          <input
            type="email"
            placeholder="Email"
            value={signUpData.email}
            name="email"
            required
            onChange={handleChangeSignUp}
            className=" px-4 py-2 w-full rounded bg-gray-200 placeholder-gray-500 focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={signUpData.password}
            name="password"
            required
            onChange={handleChangeSignUp}
            className=" px-4 py-2 w-full rounded bg-gray-200 placeholder-gray-500 focus:outline-none"
          />
          <input
            type="password"
            placeholder="Conform Password"
            value={conform_password}
            name="conform_password"
            required
            onChange={(e) => setConform_password(e.target.value)}
            className=" px-4 py-2 w-full rounded bg-gray-200 placeholder-gray-500 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-red-400  font-bold rounded-full px-8 py-2 text-lg text-white shadow hover:bg-black hover:text-red-400 hover:cursor-pointer duration-500 transition-all"
          >
            SIGN UP
          </button>
        </form>
      </div>
    </div>
  )
}
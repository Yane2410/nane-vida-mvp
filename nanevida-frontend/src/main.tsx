import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Diary from './pages/Diary'
import SOS from './pages/SOS'
import RequireAuth from './components/RequireAuth'
import './styles.css'

const router = createBrowserRouter([
  { path: '/', element: <App />, children: [
    { index: true, element: <Home/> },
    { path: 'login', element: <Login/> },
    { path: 'register', element: <Register/> },
    { path: 'diary', element: <RequireAuth><Diary/></RequireAuth> },
    { path: 'sos', element: <SOS/> }
  ]}
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)

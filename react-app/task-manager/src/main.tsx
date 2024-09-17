import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom"

import Root from './routes/Root.tsx'
import Login from './routes/Login.tsx'
import Dashboard from './routes/Dashboard.tsx'

const router =createBrowserRouter([
  {
    path: '/',
    element: <Root />,
  },

  {
    path: '/auth',
    element: <Login />, 
  },

  {
    path: '/my-tasks',
    element: <Dashboard />, 
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

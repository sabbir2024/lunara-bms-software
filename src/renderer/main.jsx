import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import router from './router/router'
import NavProvider from './provider/NavProvider'
import './index.css'
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FuctonProvider } from './provider/FunctionProvider'


const queryClient = new QueryClient()


ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <FuctonProvider>
                <NavProvider>
                    <RouterProvider router={router} />
                    <Toaster position="top-center"
                        reverseOrder={false} />
                </NavProvider>
            </FuctonProvider>

        </QueryClientProvider>
    </React.StrictMode>
)
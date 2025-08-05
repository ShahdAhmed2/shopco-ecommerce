import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CartProvider } from './contexts/CartContext'
import { Toaster } from 'react-hot-toast'
import AdminDashboard from './components/AdminDashboard'
import CartPage from './components/CartPage'
import Header from './components/Header'
import Footer from './components/Footer'


const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/cart" element={
              <>
                <Header />
                <CartPage />
                <Footer />
              </>
            } />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-right" />
      </CartProvider>
    </QueryClientProvider>
  </StrictMode>
)

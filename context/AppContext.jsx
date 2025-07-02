'use client'
import { productsDummyData, userDummyData } from "@/assets/assets"
import { useRouter } from "next/navigation"
import { createContext, useContext, useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"

const AppContext = createContext()

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within AppContextProvider')
  }
  return context
}

export const AppContextProvider = ({ children }) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY || 'USD'
  const router = useRouter()
  const { user } = useUser()
  
  const [products, setProducts] = useState([])
  const [userData, setUserData] = useState(null)
  const [isSeller, setIsSeller] = useState(true)
  const [cartItems, setCartItems] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('cart')
        return saved ? JSON.parse(saved) : {}
      } catch (e) {
        console.error("Failed to parse cart data", e)
        return {}
      }
    }
    return {}
  })

  // Persist cart to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cartItems))
    }
  }, [cartItems])

  const fetchProductData = async () => {
    try {
      setProducts(productsDummyData)
    } catch (error) {
      console.error("Failed to load products", error)
    }
  }

  const addToCart = (itemId) => {
    setCartItems(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }))
  }

  useEffect(() => {
    fetchProductData()
  }, [])

  const value = {
    user,
    currency,
    router,
    isSeller,
    setIsSeller,
    products,
    cartItems,
    addToCart
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}
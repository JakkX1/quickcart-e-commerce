'use client'
import { productsDummyData, userDummyData } from "@/assets/assets"
import { createContext, useContext, useEffect, useState } from "react"
import { useAuth, useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import axios from "axios"
import toast from "react-hot-toast"

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
  const { user } = useUser()
  const router = useRouter()
  const {getToken} = useAuth()

  const [products, setProducts] = useState([])
  const [userData, setUserData] = useState(null)
  const [isSeller, setIsSeller] = useState(false)
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
      try {
        localStorage.setItem('cart', JSON.stringify(cartItems))
      } catch (e) {
        console.error("Failed to persist cart", e)
      }
    }
  }, [cartItems])

  const fetchProductData = async () => {
    try {
      setProducts(productsDummyData)
    } catch (error) {
      console.error("Failed to load products", error)
    }
  }

  const fetchUserData = async () => {
    try {
      if (user?.publicMetadata?.role === 'seller') {
        setIsSeller(true)
      }

      const token = await getToken

      const {data} = await axios.get('/api/user/data',{ headers: { Authorization: `Bearer ${token}`} })

      if (data.success) {
        setUserData(data.user)
        setCartItems(data.user.cartItems)
      } else{
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  const addToCart = (itemId) => {
    setCartItems(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }))
  }

  const updateCartQuantity = (itemId, quantity) => {
    setCartItems(prev => {
      const newCart = { ...prev }
      if (quantity <= 0) {
        delete newCart[itemId]
      } else {
        newCart[itemId] = quantity
      }
      return newCart
    })
  }

  const getCartCount = () => {
    return Object.values(cartItems).reduce((sum, qty) => sum + qty, 0)
  }

  useEffect(() => {
    fetchProductData()
    if (user) fetchUserData()
  }, [user])

  const value = {
    user,
    getToken,
    currency,
    router,
    isSeller,
    setIsSeller,
    products,
    cartItems,
    addToCart,
    updateCartQuantity,
    getCartCount,
    userData
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}
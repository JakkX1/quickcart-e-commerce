'use client'
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import OrderSummary from "@/components/OrderSummary";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useAppContext } from "@/context/AppContext";

const Cart = () => {
  const { products, router, cartItems, addToCart, updateCartQuantity, getCartCount } = useAppContext();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Safe product finder
  const getProduct = (itemId) => {
    return products.find(product => product._id === itemId) || {
      _id: '',
      name: 'Product not found',
      image: [assets.placeholder],
      offerPrice: 0
    };
  };

  if (!isClient) return null; // Or loading skeleton

  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row gap-10 px-6 md:px-16 lg:px-32 pt-14 mb-20">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-8 border-b border-gray-500/30 pb-6">
            <p className="text-2xl md:text-3xl text-gray-500">
              Your <span className="font-medium text-orange-600">Cart</span>
            </p>
            <p className="text-lg md:text-xl text-gray-500/80">{getCartCount()} Items</p>
          </div>
          
          {Object.keys(cartItems).length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 mb-4">Your cart is empty</p>
              <button 
                onClick={() => router.push('/all-products')} 
                className="text-orange-600 hover:underline"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                {/* Table headers remain same */}
                <tbody>
                  {Object.keys(cartItems).map((itemId) => {
                    const quantity = cartItems[itemId];
                    if (quantity <= 0) return null;
                    
                    const product = getProduct(itemId);
                    return (
                      <tr key={itemId}>
                        {/* Table cells remain same, but use product safely */}
                        <td className="py-4 md:px-4 px-1 text-gray-600">
                          <div className="flex items-center md:gap-2 gap-1">
                            <button 
                              onClick={() => updateCartQuantity(itemId, quantity - 1)}
                              aria-label="Decrease quantity"
                            >
                              <Image
                                src={assets.decrease_arrow}
                                alt="Decrease"
                                width={16}
                                height={16}
                              />
                            </button>
                            <input 
                              type="number" 
                              value={quantity}
                              onChange={(e) => {
                                const newQty = Math.max(0, Number(e.target.value));
                                updateCartQuantity(itemId, newQty);
                              }}
                              className="w-8 border text-center appearance-none"
                              min="0"
                            />
                            <button 
                              onClick={() => addToCart(itemId)}
                              aria-label="Increase quantity"
                            >
                              <Image
                                src={assets.increase_arrow}
                                alt="Increase"
                                width={16}
                                height={16}
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          
          <button 
            onClick={() => router.push('/all-products')} 
            className="group flex items-center mt-6 gap-2 text-orange-600"
          >
            <Image
              className="group-hover:-translate-x-1 transition"
              src={assets.arrow_right_icon_colored}
              alt="Continue shopping"
              width={20}
              height={20}
            />
            Continue Shopping
          </button>
        </div>
        <OrderSummary />
      </div>
    </>
  );
};

export default Cart;

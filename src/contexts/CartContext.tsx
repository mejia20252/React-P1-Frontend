// src/contexts/CartContext.tsx
import React, { createContext, useContext, useState } from 'react'
import type { Producto } from '../types'
import type { ReactNode } from 'react';
interface CartItem {
    producto: Producto;
    precioUnitario: number;
    quantity: number;
}
// Contexto que expone el estado y las acciones para gestionar el carrito de compras.

interface CartContextValue {
    items: CartItem[]                             // listado de ítems en el carrito
    addItem: (producto: Producto, precioUnitario: number, qty: number) => void // añade un producto al carrito
    updateQuantity: (id: number, qty: number) => void        // modifica la cantidad de un ítem
    removeItem: (id: number) => void                    // elimina un ítem del carrito
    clearCart: () => void                              // vacía completamente el carrito
    total: number                                  // suma total de todos los ítems
}



const CartContext = createContext<CartContextValue | undefined>(undefined)

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>([])

    const addItem = (
        producto: Producto,
        precioUnitario: number,
        qty: number
    ): void => {
        setItems(prevItems => {
            const itemsCopy = [...prevItems]                               // clona el array
            const index = itemsCopy.findIndex(i => i.producto.id === producto.id)

            if (index !== -1) {                                            // si ya está...
                const existing = itemsCopy[index]                            // línea existente
                const updatedItem: CartItem = {                              // crea línea actualizada
                    producto: existing.producto,
                    precioUnitario: existing.precioUnitario,                  // conserva precio
                    quantity: existing.quantity + qty                    // suma qty
                }
                itemsCopy[index] = updatedItem                               // reemplaza elemento
                return itemsCopy
            }

            const newItem: CartItem = {                                    // si no existía...
                producto,                                                   // producto completo
                precioUnitario,                                             // precio pasado
                quantity: qty                                               // cantidad pasada
            }

            return [...itemsCopy, newItem]                                 // añade línea nueva
        })
    }

    const updateQuantity = (id: number, qty: number) => {
        setItems(curr =>
            curr.map(i => i.producto.id === id ? { ...i, quantity: qty } : i)
        )
    }

    const removeItem = (id: number) =>
        setItems(curr => curr.filter(i => i.producto.id !== id))

    const clearCart = () => setItems([])

    // Calcula el total del carrito sumando el subtotal de cada línea
    const total = items.reduce(
        (sum, i) => sum + i.quantity * i.precioUnitario,
        0
    )

    return (
        <CartContext.Provider value={{
            items, addItem, updateQuantity, removeItem, clearCart, total
        }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = (): CartContextValue => {
    const ctx = useContext(CartContext)
    if (!ctx) throw new Error('useCart must be inside CartProvider')
    return ctx
}

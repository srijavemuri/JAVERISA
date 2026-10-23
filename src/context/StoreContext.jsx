import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { products } from '../data/products'

const StoreContext = createContext(null)
const CART_KEY = 'javerisa-cart-v1'

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY) || '[]')
    if (!Array.isArray(saved)) return { items: [], error: 'Your saved bag was invalid and has been cleared.' }
    const items = saved.flatMap((line) => {
      const product = products.find((item) => item.id === line?.id)
      const quantity = Number(line?.quantity)
      if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) return []
      if (product.sizes.length && !product.sizes.includes(line.size)) return []
      return [{ id: product.id, quantity, size: line.size || '' }]
    })
    return { items, error: items.length < saved.length ? 'Unavailable or invalid items were removed from your saved bag.' : '' }
  } catch {
    return { items: [], error: 'Your saved bag could not be read and has been cleared.' }
  }
}

export function StoreProvider({ children }) {
  const [initialCart] = useState(loadCart)
  const [cart, setCart] = useState(initialCart.items)
  const [notice, setNotice] = useState(initialCart.error)

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart))
    } catch {
      setNotice('Your bag could not be saved in this browser. It may not persist after closing the page.')
    }
  }, [cart])

  useEffect(() => {
    if (!notice) return undefined
    const timer = window.setTimeout(() => setNotice(''), 2800)
    return () => window.clearTimeout(timer)
  }, [notice])

  const addToCart = (id, quantity = 1, size = '') => {
    const product = products.find((item) => item.id === id)
    if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      setNotice('That item or quantity is unavailable.')
      return false
    }
    if (product.sizes.length && !product.sizes.includes(size)) {
      setNotice('Please choose an available size first.')
      return false
    }
    setCart((current) => {
      const key = `${id}:${size}`
      const existing = current.find((line) => `${line.id}:${line.size}` === key)
      if (existing) {
        return current.map((line) =>
          `${line.id}:${line.size}` === key
            ? { ...line, quantity: Math.min(99, line.quantity + quantity) }
            : line,
        )
      }
      return [...current, { id, quantity, size }]
    })
    setNotice(`${product.name} added to your bag.`)
    return true
  }

  const updateQuantity = (id, size, quantity) => {
    if (!Number.isInteger(quantity) || quantity < 1) {
      setCart((current) => current.filter((line) => !(line.id === id && line.size === size)))
      return
    }
    if (quantity > 99) {
      setNotice('A maximum of 99 of each item can be added.')
      return
    }
    setCart((current) =>
      current.map((line) => (line.id === id && line.size === size ? { ...line, quantity } : line)),
    )
  }

  const removeFromCart = (id, size) =>
    setCart((current) => current.filter((line) => !(line.id === id && line.size === size)))
  const clearCart = () => setCart([])

  const lines = useMemo(
    () =>
      cart.flatMap((line) => {
        const product = products.find((item) => item.id === line.id)
        return product ? [{ ...line, product, lineTotal: product.price * line.quantity }] : []
      }),
    [cart],
  )
  const count = lines.reduce((total, line) => total + line.quantity, 0)
  const subtotal = lines.reduce((total, line) => total + line.lineTotal, 0)

  return (
    <StoreContext.Provider
      value={{ cart, lines, count, subtotal, addToCart, updateQuantity, removeFromCart, clearCart }}
    >
      {children}
      {notice && <div className="toast" role="status">{notice}</div>}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) throw new Error('useStore must be used inside StoreProvider')
  return context
}
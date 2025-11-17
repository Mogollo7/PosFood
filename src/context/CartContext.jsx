import { createContext, useContext, useState } from "react";

const CartContext = createContext();

// Callback para agregar pedidos confirmados (se establecerá desde OrdersContext)
let addOrderCallback = null;

export const setAddOrderCallback = (callback) => {
  addOrderCallback = callback;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Agregar producto al carrito
  const addToCart = (producto) => {
    // Siempre agregar como nuevo item (no acumular) para permitir múltiples pedidos del mismo producto con diferentes notas/precios
    setCartItems([...cartItems, producto]);
  };

  // Eliminar producto del carrito
  const removeFromCart = (index) => {
    setCartItems(cartItems.filter((_, i) => i !== index));
  };

  // Actualizar cantidad de un producto
  const updateQuantity = (index, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(index);
      return;
    }
    setCartItems(
      cartItems.map((item, i) =>
        i === index ? { ...item, cantidad: newQuantity } : item
      )
    );
  };

  // Calcular el total del carrito
  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.precio * item.cantidad,
      0
    );
  };

  // Limpiar el carrito
  const clearCart = () => {
    setCartItems([]);
  };

  // Confirmar pedido
  const confirmOrder = () => {
    if (cartItems.length === 0) {
      alert("El carrito está vacío");
      return null;
    }

    const total = calculateTotal();
    const orderData = {
      items: [...cartItems], // Copia de los items
      total: total,
      date: new Date().toISOString(),
    };

    // Agregar el pedido a través del callback si está disponible
    if (addOrderCallback) {
      addOrderCallback(orderData);
    }

    // Limpiar el carrito después de confirmar
    clearCart();
    
    return orderData;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        calculateTotal,
        clearCart,
        confirmOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }
  return context;
};


import { useEffect } from "react";
import { useOrders } from "../../context/OrdersContext";
import { setAddOrderCallback } from "../../context/CartContext";

// Componente wrapper para conectar CartContext con OrdersContext
export function CartOrdersWrapper({ children }) {
  const { addOrder } = useOrders();

  useEffect(() => {
    // Configurar el callback para que CartContext pueda agregar pedidos
    setAddOrderCallback(addOrder);
  }, [addOrder]);

  return <>{children}</>;
}


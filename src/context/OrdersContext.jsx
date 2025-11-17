import { createContext, useContext, useState, useEffect } from "react";
import { 
  guardarPedido, 
  obtenerPedidos, 
  obtenerPedidoPorId,
  actualizarEstadoPedido,
  eliminarPedido,
  generarNumeroPedido
} from "../supabase/crudPedidos";

const OrdersContext = createContext();

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Cargar todos los pedidos al iniciar
  useEffect(() => {
    cargarPedidos();
  }, []);

  // Cargar pedidos de Supabase
  const cargarPedidos = async () => {
    setLoading(true);
    try {
      const pedidos = await obtenerPedidos();
      setOrders(pedidos);
    } catch (err) {
      console.error("Error al cargar pedidos:", err);
    } finally {
      setLoading(false);
    }
  };

  // Agregar un nuevo pedido confirmado (guardar en Supabase)
  const addOrder = async (orderData) => {
    try {
      setLoading(true);
      
      // Generar número de pedido
      const numeroPedido = await generarNumeroPedido();

      // Preparar datos para guardar
      const pedidoParaGuardar = {
        numero: numeroPedido,
        total: orderData.total,
        estado: "pendiente",
        items: orderData.items,
      };

      // Guardar en Supabase
      const pedidoGuardado = await guardarPedido(pedidoParaGuardar);

      // Agregar al estado local
      const newOrder = {
        id: pedidoGuardado.id,
        numero: numeroPedido,
        items: orderData.items,
        total: orderData.total,
        date: pedidoGuardado.fecha,
        estado: "pendiente",
      };

      setOrders([newOrder, ...orders]);
      return newOrder;
    } catch (err) {
      console.error("Error al agregar pedido:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar un pedido
  const deleteOrder = async (id) => {
    try {
      setLoading(true);
      await eliminarPedido(id);
      setOrders(orders.filter(order => order.id !== id));
    } catch (err) {
      console.error("Error al eliminar pedido:", err);
    } finally {
      setLoading(false);
    }
  };

  // Actualizar estado de un pedido
  const updateOrderStatus = async (id, newStatus) => {
    try {
      setLoading(true);
      await actualizarEstadoPedido(id, newStatus);
      setOrders(
        orders.map(order =>
          order.id === id ? { ...order, estado: newStatus } : order
        )
      );
    } catch (err) {
      console.error("Error al actualizar estado:", err);
    } finally {
      setLoading(false);
    }
  };

  // Obtener un pedido por ID
  const getOrderById = (id) => {
    return orders.find(order => order.id === id);
  };

  return (
    <OrdersContext.Provider
      value={{
        orders,
        loading,
        addOrder,
        deleteOrder,
        updateOrderStatus,
        getOrderById,
        cargarPedidos,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error("useOrders debe usarse dentro de OrdersProvider");
  }
  return context;
};


import { supabase } from "./supabase.config";

/**
 * Guardar un pedido completo (pedidos + pedido_items) en Supabase
 * @param {Object} pedidoData - Datos del pedido con estructura:
 *   {
 *     numero: Number,
 *     total: Number,
 *     estado: String,
 *     items: Array
 *   }
 * @returns {Promise<Object>} Pedido guardado con ID
 */
export const guardarPedido = async (pedidoData) => {
  try {
    // 1. Insertar en tabla pedidos
    const { data: pedido, error: pedidoError } = await supabase
      .from("pedidos")
      .insert([
        {
          numero: pedidoData.numero,
          total: pedidoData.total,
          estado: pedidoData.estado || "pendiente",
          fecha: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (pedidoError) {
      console.error("Error al guardar pedido:", pedidoError);
      throw pedidoError;
    }

    // 2. Insertar items en tabla pedido_items
    if (pedidoData.items && pedidoData.items.length > 0) {
      const itemsParaInsertar = pedidoData.items.map((item) => ({
        pedido_id: pedido.id,
        producto_id: item.id, // ID del producto
        cantidad: item.cantidad,
        precio_unitario: item.precio,
        notas: item.notas || null,
      }));

      const { error: itemsError } = await supabase
        .from("pedido_items")
        .insert(itemsParaInsertar);

      if (itemsError) {
        console.error("Error al guardar items del pedido:", itemsError);
        throw itemsError;
      }
    }

    console.log("Pedido guardado exitosamente:", pedido);
    return pedido;
  } catch (err) {
    console.error("Excepción al guardar pedido:", err);
    throw err;
  }
};

/**
 * Obtener todos los pedidos con sus items
 * @returns {Promise<Array>} Array de pedidos con sus items
 */
export const obtenerPedidos = async () => {
  try {
    // Obtener todos los pedidos sin relaciones complejas primero
    const { data: pedidos, error: pedidosError } = await supabase
      .from("pedidos")
      .select("id, numero, total, estado, fecha, tipo_pedido, numero_mesa")
      .order("fecha", { ascending: false });

    if (pedidosError) {
      console.error("Error al obtener pedidos:", pedidosError);
      throw pedidosError;
    }

    // Obtener domicilios asociados (si existen) en una sola consulta
    let domiciliosMap = {}
    try {
      const pedidoIds = (pedidos || []).map((p) => p.id)
      if (pedidoIds.length > 0) {
        const { data: domicilios } = await supabase
          .from('pedidos_domicilio')
          .select('pedido_id, direccion, nombre_remitente, telefono_remitente, costo_domicilio')
          .in('pedido_id', pedidoIds)

        domiciliosMap = (domicilios || []).reduce((acc, d) => {
          acc[d.pedido_id] = d
          return acc
        }, {})
      }
    } catch (err) {
      console.warn('No se pudo obtener pedidos_domicilio:', err)
      domiciliosMap = {}
    }

    // Para cada pedido, obtener sus items
    const pedidosConItems = await Promise.all(
      pedidos.map(async (pedido) => {
        try {
          const { data: items, error: itemsError } = await supabase
            .from("pedido_items")
            .select("id, producto_id, cantidad, precio_unitario, notas")
            .eq("pedido_id", pedido.id);

          if (itemsError) {
            console.error(`Error al obtener items del pedido ${pedido.id}:`, itemsError);
            return {
              id: pedido.id,
              numero: pedido.numero,
              total: parseFloat(pedido.total),
              date: pedido.fecha,
              estado: pedido.estado,
              imagen: null,
              items: [],
              tipo_pedido: pedido.tipo_pedido,
              numero_mesa: pedido.numero_mesa,
            };
          }

          // Obtener info de productos para cada item
          const itemsConProductos = await Promise.all(
            items.map(async (item) => {
              const { data: producto, error: productoError } = await supabase
                .from("productos")
                .select("id, nombre, descripcion, categoria_id, imagen_url")
                .eq("id", item.producto_id)
                .single();

              if (productoError) {
                console.error(`Error al obtener producto ${item.producto_id}:`, productoError);
                return {
                  id: item.id, // ID de pedido_items (IMPORTANTE para borrar)
                  producto_id: item.producto_id,
                  nombre: "Producto no encontrado",
                  cantidad: item.cantidad,
                  precio: parseFloat(item.precio_unitario),
                  notas: item.notas,
                  descripcion: null,
                  categoria: null,
                };
              }

              return {
                id: item.id, // ID de pedido_items (IMPORTANTE para borrar)
                producto_id: item.producto_id,
                nombre: producto.nombre,
                cantidad: item.cantidad,
                precio: parseFloat(item.precio_unitario),
                notas: item.notas,
                descripcion: producto.descripcion,
                categoria: producto.categoria_id,
              };
            })
          );

          return {
            id: pedido.id,
            numero: pedido.numero,
            total: parseFloat(pedido.total),
            date: pedido.fecha,
            estado: pedido.estado,
            tipo_pedido: pedido.tipo_pedido,
            numero_mesa: pedido.numero_mesa,
            imagen: itemsConProductos[0]?.imagen_url || null,
            items: itemsConProductos,
            // Adjuntar domicilio si existe
            domicilio: domiciliosMap[pedido.id] || null,
          };
        } catch (err) {
          console.error(`Error procesando pedido ${pedido.id}:`, err);
          return {
            id: pedido.id,
            numero: pedido.numero,
            total: parseFloat(pedido.total),
            date: pedido.fecha,
            estado: pedido.estado,
            imagen: null,
            items: [],
          };
        }
      })
    );

    return pedidosConItems;
  } catch (err) {
    console.error("Excepción al obtener pedidos:", err);
    throw err;
  }
};

/**
 * Obtener un pedido específico con sus items
 * @param {Number} pedido_id - ID del pedido
 * @returns {Promise<Object>} Pedido con sus items
 */
export const obtenerPedidoPorId = async (pedido_id) => {
  try {
    // Obtener pedido
    const { data: pedido, error: pedidoError } = await supabase
      .from("pedidos")
      .select("id, numero, total, estado, fecha")
      .eq("id", pedido_id)
      .single();

    if (pedidoError) {
      console.error("Error al obtener pedido:", pedidoError);
      throw pedidoError;
    }

    // Obtener items del pedido
    const { data: items, error: itemsError } = await supabase
      .from("pedido_items")
      .select("id, producto_id, cantidad, precio_unitario, notas")
      .eq("pedido_id", pedido.id);

    if (itemsError) {
      console.error("Error al obtener items:", itemsError);
      throw itemsError;
    }

    // Obtener info de productos para cada item
    const itemsConProductos = await Promise.all(
      items.map(async (item) => {
        const { data: producto, error: productoError } = await supabase
          .from("productos")
          .select("id, nombre, descripcion, categoria_id, imagen_url")
          .eq("id", item.producto_id)
          .single();

        if (productoError) {
          console.error(`Error al obtener producto ${item.producto_id}:`, productoError);
          return {
            id: item.id, // ID de pedido_items (IMPORTANTE para borrar)
            producto_id: item.producto_id,
            nombre: "Producto no encontrado",
            cantidad: item.cantidad,
            precio: parseFloat(item.precio_unitario),
            notas: item.notas,
            descripcion: null,
            categoria: null,
          };
        }

        return {
          id: item.id, // ID de pedido_items (IMPORTANTE para borrar)
          producto_id: item.producto_id,
          nombre: producto.nombre,
          cantidad: item.cantidad,
          precio: parseFloat(item.precio_unitario),
          notas: item.notas,
          descripcion: producto.descripcion,
          categoria: producto.categoria_id,
        };
      })
    );

    // Mapear a formato requerido
    const pedidoFormateado = {
      id: pedido.id,
      numero: pedido.numero,
      total: parseFloat(pedido.total),
      date: pedido.fecha,
      estado: pedido.estado,
      items: itemsConProductos,
    };

    // Adjuntar domicilio si existe
    try {
      const { data: domicilioData, error: domErr } = await supabase
        .from('pedidos_domicilio')
        .select('direccion, nombre_remitente, telefono_remitente, costo_domicilio')
        .eq('pedido_id', pedido_id)
        .single()

      if (!domErr && domicilioData) {
        pedidoFormateado.domicilio = domicilioData
      }
    } catch (err) {
      console.warn('Error obteniendo domicilio para pedido:', err)
    }

    return pedidoFormateado;
  } catch (err) {
    console.error("Excepción al obtener pedido:", err);
    throw err;
  }
};

/**
 * Actualizar estado de un pedido
 * @param {Number} pedido_id - ID del pedido
 * @param {String} nuevoEstado - Nuevo estado (pendiente, en_preparacion, listo)
 * @returns {Promise<Object>} Pedido actualizado
 */
export const actualizarEstadoPedido = async (pedido_id, nuevoEstado) => {
  try {
    const { error } = await supabase
      .from("pedidos")
      .update({ estado: nuevoEstado })
      .eq("id", pedido_id);

    if (error) {
      console.error("Error al actualizar estado:", error);
      throw error;
    }

    console.log("Estado actualizado correctamente");
    return { id: pedido_id, estado: nuevoEstado };
  } catch (err) {
    console.error("Excepción al actualizar estado:", err);
    throw err;
  }
};

/**
 * Eliminar un pedido (también elimina sus items por cascada)
 * @param {Number} pedido_id - ID del pedido
 * @returns {Promise<Boolean>} true si se eliminó exitosamente
 */
export const eliminarPedido = async (pedido_id) => {
  try {
    const { error } = await supabase
      .from("pedidos")
      .delete()
      .eq("id", pedido_id);

    if (error) {
      console.error("Error al eliminar pedido:", error);
      throw error;
    }

    console.log("Pedido eliminado exitosamente");
    return true;
  } catch (err) {
    console.error("Excepción al eliminar pedido:", err);
    throw err;
  }
};

/**
 * Generar el siguiente número de pedido disponible
 * @returns {Promise<Number>} Número de pedido a usar
 */
export const generarNumeroPedido = async () => {
  try {
    const { data: pedidos, error } = await supabase
      .from("pedidos")
      .select("numero")
      .order("numero", { ascending: false })
      .limit(1);

    if (error) {
      console.error("Error al obtener último número:", error);
      return 100001;
    }

    const ultimoPedido = pedidos && pedidos.length > 0 ? pedidos[0] : null;
    const proximoNumero = ultimoPedido ? ultimoPedido.numero + 1 : 100001;
    return proximoNumero;
  } catch (err) {
    console.error("Excepción al generar número de pedido:", err);
    return 100001; // Default si hay error
  }
};

import { supabase } from "../index";

export const InsertarUsuarios = async (p) => {
  try {
    const { data } = await supabase.from("usuarios").insert(p).select();
    return data;
  } catch (error) {
    console.error("Error al insertar usuario:", error);
    throw error;
  }
};

export const ObtenerUsuarioPorEmail = async (email) => {
  try {
    if (!email) {
      return null;
    }

    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("email", email)
      .maybeSingle();
    
    // maybeSingle() retorna null si no encuentra el registro, no lanza error
    // Solo lanzamos error si hay un error real de conexión o permisos
    if (error) {
      // Códigos de error comunes de Supabase cuando no se encuentra un registro
      const notFoundCodes = ['PGRST116', '42P01'];
      if (notFoundCodes.includes(error.code)) {
        return null;
      }
      throw error;
    }
    
    // Retornar null si no hay datos (usuario no existe)
    return data || null;
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    // Si es un error de "no encontrado", retornar null en lugar de lanzar error
    const notFoundCodes = ['PGRST116', '42P01'];
    if (notFoundCodes.includes(error.code)) {
      return null;
    }
    throw error;
  }
};

export const ActualizarUsuario = async (email, datosActualizados) => {
  try {
    if (!email) {
      throw new Error("El email es requerido para actualizar el usuario");
    }

    // Mantener todos los campos, incluso si son null (para permitir limpiar campos)
    const datosFiltrados = Object.fromEntries(
      Object.entries(datosActualizados).filter(([_, value]) => value !== undefined)
    );

    console.log("Actualizando usuario con:", { email, datosFiltrados });

    const { data, error } = await supabase
      .from("usuarios")
      .update(datosFiltrados)
      .eq("email", email)
      .select();

    if (error) {
      console.error("Error de Supabase al actualizar:", error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.warn("No se encontró ningún usuario con el email:", email);
      throw new Error("No se encontró el usuario para actualizar");
    }

    console.log("Usuario actualizado exitosamente:", data[0]);
    return data[0];
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    throw error;
  }
};
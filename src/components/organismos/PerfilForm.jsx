import { useState, useEffect } from "react";
import { InputField } from "../moleculas/InputField";
import { Btnsave } from "../moleculas/Btnsave";
import { ObtenerUsuarioPorEmail, ActualizarUsuario, InsertarUsuarios } from "../../supabase/crudUsuarios";
import { LoadingText } from "../atomos/LoadingText";
import { InfoText } from "../atomos/infoText.jsx";
import { v } from "../../styles/variables";

const IconoGuardar = v.iconoguardar;

export function PerfilForm({ userEmail, userMetadata }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    rol: "",
    documento: "",
    cargo: "",
    telefono: "",
  });
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });

  useEffect(() => {
    const cargarUsuario = async () => {
      if (!userEmail) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setMensaje({ tipo: "", texto: "" });

        const datos = await ObtenerUsuarioPorEmail(userEmail);

        if (datos) {
          setUsuario(datos);
          setFormData({
            rol: datos.rol || "",
            documento: datos.documento || "",
            cargo: datos.cargo || "",
            telefono: datos.telefono || "",
          });
        } else {
          setUsuario({
            email: userEmail,
            nombre: userMetadata?.full_name || userMetadata?.name || "",
            created_at: new Date().toISOString(),
          });
        }
      } catch (error) {
        console.error("Error al cargar usuario:", error);
        setMensaje({
          tipo: "error",
          texto: `Error al cargar los datos: ${error.message || "Error desconocido"}`,
        });
        setUsuario({
          email: userEmail,
          nombre: userMetadata?.full_name || userMetadata?.name || "",
          created_at: new Date().toISOString(),
        });
      } finally {
        setLoading(false);
      }
    };

    cargarUsuario();
  }, [userEmail, userMetadata]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userEmail) {
      setMensaje({ tipo: "error", texto: "No se encontró el email del usuario" });
      return;
    }

    try {
      setSaving(true);
      setMensaje({ tipo: "", texto: "" });

      const datosActualizados = {
        rol: formData.rol?.trim() || null,
        documento: formData.documento?.trim() || null,
        cargo: formData.cargo?.trim() || null,
        telefono: formData.telefono?.trim() || null,
      };

      if (!usuario || !usuario.id) {
        const nuevoUsuario = {
          email: userEmail,
          nombre: userMetadata?.full_name || userMetadata?.name || "",
          ...datosActualizados,
        };

        const usuarioCreado = await InsertarUsuarios(nuevoUsuario);
        if (usuarioCreado && usuarioCreado[0]) {
          setUsuario(usuarioCreado[0]);
          setMensaje({ tipo: "exito", texto: "Perfil creado y guardado correctamente" });
        } else {
          throw new Error("No se pudo crear el usuario");
        }
      } else {
        const usuarioActualizado = await ActualizarUsuario(userEmail, datosActualizados);
        if (usuarioActualizado) {
          setUsuario(usuarioActualizado);
          setFormData({
            rol: usuarioActualizado.rol || "",
            documento: usuarioActualizado.documento || "",
            cargo: usuarioActualizado.cargo || "",
            telefono: usuarioActualizado.telefono || "",
          });
          setMensaje({ tipo: "exito", texto: "Perfil actualizado correctamente" });
        } else {
          throw new Error("No se pudo actualizar el usuario");
        }
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      setMensaje({
        tipo: "error",
        texto: `Error al guardar el perfil: ${error.message || "Error desconocido"}`,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingText>Cargando datos del perfil...</LoadingText>;
  }

  if (!userEmail) {
    return (
      <div className="mensaje-error">
        No se pudo obtener el email del usuario. Por favor, inicia sesión nuevamente.
      </div>
    );
  }

  const nombre = usuario?.nombre || userMetadata?.full_name || userMetadata?.name || "Usuario";
  const email = usuario?.email || userEmail || "";
  const created_at = usuario?.created_at
    ? new Date(usuario.created_at).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    : "No disponible";
  const picture = userMetadata?.picture || userMetadata?.avatar_url || "";

  return (
    <div className="Container">
      <header>
        <div className="brandLogo">
          <figure>
            <img src={v.logo} alt="logo" width="40px" height="40px" />
          </figure>
          <span>Profile</span>
        </div>
      </header>
      <section class="userProfile card">

        <div className="perfil-header">
          {picture && <img src={picture} alt="Avatar" className="perfil-avatar" />}
          <h2>Perfil de Usuario</h2>
        </div>
        </section>

        <form onSubmit={handleSubmit} className="perfil-formulario">
          <div className="perfil-grid">
            <div className="campo">
              <InputField label="Nombre" name="nombre" value={nombre} disabled={true} />
              <InfoText>Este campo no se puede editar</InfoText>
            </div>

            <div className="campo">
              <InputField label="Email" name="email" type="email" value={email} disabled={true} />
              <InfoText>Este campo no se puede editar</InfoText>
            </div>

            <InputField
              label="Rol"
              name="rol"
              value={formData.rol}
              onChange={handleChange}
              placeholder="Ej: Administrador, Usuario, etc."
            />

            <InputField
              label="Documento"
              name="documento"
              value={formData.documento}
              onChange={handleChange}
              placeholder="Número de documento"
            />

            <InputField
              label="Cargo"
              name="cargo"
              value={formData.cargo}
              onChange={handleChange}
              placeholder="Ej: Gerente, Vendedor, etc."
            />

            <InputField
              label="Teléfono"
              name="telefono"
              type="tel"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="Número de teléfono"
            />

            <div className="campo">
              <InputField label="Fecha de Creación" name="created_at" value={created_at} disabled={true} />
              <InfoText>Este campo no se puede editar</InfoText>
            </div>
          </div>

          {mensaje.texto && (
            <div className={`mensaje ${mensaje.tipo}`}>{mensaje.texto}</div>
          )}

          <div className="boton-guardar">
            <Btnsave
              funcion={handleSubmit}
              titulo={saving ? "Guardando..." : "Guardar Cambios"}
              bgcolor={v.colorPrincipal}
              icono={<IconoGuardar />}
            />
          </div>
        </form>
    </div>
  );
}

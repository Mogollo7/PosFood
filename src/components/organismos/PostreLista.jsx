import styled from "styled-components";
import { v } from "../../styles/variables";
import { useState, useEffect } from "react";
import ModalOverlay from "../moleculas/ModalOverlay";
import { useCart } from "../../context/CartContext";
import { supabase } from "../../supabase/supabase.config";

export default function EntradaBebidas() {
    const [openModal, setOpenModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const { addToCart } = useCart();

    const handleOpenModal = (item) => {
        setSelectedItem(item);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedItem(null);
    };

    // Productos cargados desde la base de datos (categoria_id = 6)
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const { data, error } = await supabase
                    .from("productos")
                    .select("id, nombre, descripcion, imagen_url, precio_unitario")
                    .eq("categoria_id", 6)
                    .order("id", { ascending: true });

                if (error) {
                    console.error("Error al obtener productos:", error);
                    return;
                }

                const mapped = (data || []).map((p) => ({
                    id: p.id,
                    nombre: p.nombre,
                    descripcion: p.descripcion,
                    imagen: p.imagen_url || v.home,
                    precio: Number(p.precio_unitario)
                }));

                setProductos(mapped);
            } catch (err) {
                console.error("Excepción al obtener productos:", err);
            }
        };

        fetchProductos();
    }, []);

  return (
    <Container>
      {/* Modal utilizando la molécula ModalOverlay */}
      <ModalOverlay isOpen={openModal} onClose={handleCloseModal} selectedItem={selectedItem} />

      <ImgContainer>
        <img src="https://sgyzflydqslwjersmisz.supabase.co/storage/v1/object/public/productos/ImgLarge/postresverano.jpg" />
      </ImgContainer>
      <div className="pedidos">
        <div className="header-pedidos">
          <h2>Postres</h2>
          <span></span>
        </div>
        <div className="cardpedidos">
          {productos.map((producto) => (
            <div 
              key={producto.id} 
              className="cadDetails" 
              onClick={() => handleOpenModal(producto)}
            >
              <img src={producto.imagen} alt={producto.nombre} />
              <h2>{producto.nombre}</h2>
              <p>{producto.descripcion}</p>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}

const Container = styled.div`
  padding: 20px;
  overflow-y: auto;
  background-color: #ffffff;
  height: 100vh;
  width: 100%;
  margin-bottom: 100px;

  &::-webkit-scrollbar {
    width: 0px;
  }
.cardpedidos {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 20px;

  }

  .cardpedidos .cadDetails {
    flex: 1 1 calc(20% - 10px);
    max-width: calc(20% - 10px);
    background-color: #ffffff;
    height: 350px;
    border-radius: 12px;
    cursor: pointer;
    transition: transform 0.3s ease;
}

  .cardpedidos .cadDetails:hover {
    transform: translateY(-5px);
  }

  /* No usar width fijo aquí porque rompe el layout */

  .cadDetails {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 20px;              /* margen interno */
  display: flex;
  flex-direction: column;  gap: 10px;  
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.219),
  0 0 15px rgba(255, 255, 255, 0.1);     
               /* separación entre elementos */

}


/* ===== Imagen cortada y centrada ===== */
.cadDetails img {
  width: 100%;
  height: 220px;
  object-fit: cover;          /* Corta la imagen */
  border-radius: 12px;
  margin-bottom: 10px;
}

/* ===== Título debajo de la imagen ===== */
.cadDetails h2 {
  margin: 0;
  font-size: 22px;
  font-weight: bold;
}
.cadDetails p {
  color: gray;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.header-pedidos {
  display: flex;
  flex-direction: column;
  padding-top: 75px;
  margin-bottom: 15px;
  padding-bottom: 10px;
}

.header-pedidos h2 {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
}

.header-pedidos span {
  width: 100%;
  height: 2px;
  background-color: #c9c9c9;   /* gris */
  margin-top: 8px;
  border-radius: 2px;}
`;

const ImgContainer = styled.div`
  img {
    width: 1350px;
    padding: 0;
    height: 200px;
    border-radius: 12px;
    object-fit: cover;
  }
`;

const Icono = styled.div`
  font-size: 26px;
`;

// Estilos para los detalles del modal
const ModalDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;

  img {
    width: 100%;
    height: 300px;
    object-fit: cover;
    border-radius: 12px;
  }

  h2 {
    font-size: 28px;
    margin: 10px 0;
  }

  p {
    font-size: 18px;
    color: #666;
    text-align: center;
  }
`;
import styled from "styled-components";
import { v } from "../../styles/variables";
import { useState, useEffect } from "react";
import ModalOverlay from "../moleculas/ModalOverlay";
import { useCart } from "../../context/CartContext";
import { supabase } from "../../supabase/supabase.config";

export default function PizzaLista() {
    const [openModal, setOpenModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [categoria, setCategoria] = useState("normales");
    const { addToCart } = useCart();

    const handleOpenModal = (item) => {
        setSelectedItem(item);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedItem(null);
    };

    const [productos, setProductos] = useState([]);

    // Cargar productos según la categoría seleccionada
    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const categoriaId = categoria === "normales" ? 5 : 4;
                const { data, error } = await supabase
                    .from("productos")
                    .select("id, nombre, descripcion, imagen_url, precio_unitario")
                    .eq("categoria_id", categoriaId)
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
                    precio: Number(p.precio_unitario),
                    categoria: categoria
                }));

                setProductos(mapped);
            } catch (err) {
                console.error("Excepción al obtener productos:", err);
            }
        };

        fetchProductos();
    }, [categoria]);

  return (
    <Container>
      {/* Modal utilizando la molécula ModalOverlay */}
      <ModalOverlay isOpen={openModal} onClose={handleCloseModal} selectedItem={selectedItem} />

      <ImgContainer>
        <img src="https://sgyzflydqslwjersmisz.supabase.co/storage/v1/object/public/productos/ImgLarge/pizza.jpg" />
      </ImgContainer>
      <div className="pedidos">
        <div className="header-pedidos">
          <h2>Pizzas</h2>
          <span></span>
        </div>
        <div className="categorias-tabs">
          <button 
            className={`tab ${categoria === "normales" ? "active" : ""}`}
            onClick={() => setCategoria("normales")}
          >
            Pizzas Normales
          </button>
          <button 
            className={`tab ${categoria === "quesudas" ? "active" : ""}`}
            onClick={() => setCategoria("quesudas")}
          >
            Pizzas Quesudas
          </button>
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
  border-radius: 2px;
}

.categorias-tabs {
  display: flex;
  gap: 15px;
  margin-top: 20px;
  margin-bottom: 20px;
}

.categorias-tabs .tab {
  padding: 12px 30px;
  font-size: 18px;
  font-weight: 600;
  border: 2px solid #ddd;
  border-radius: 10px;
  background-color: #ffffff;
  color: #333;
  cursor: pointer;
  transition: all 0.3s ease;
}

.categorias-tabs .tab:hover {
  border-color: #000;
  background-color: #f5f5f5;
}

.categorias-tabs .tab.active {
  background-color: #000;
  color: #fff;
  border-color: #000;
}
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


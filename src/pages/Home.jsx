import styled from "styled-components";
import { useAuthStore, UserAuth, HomeTemplate } from "../index";
import { supabase } from "../index";
import { useEffect, useState } from "react";
import { v } from "../styles/variables";


export function Home() {
  const { user } = UserAuth();
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const obtenerEmail = async () => {
      try {
        const { data: { user: authUser }, error } = await supabase.auth.getUser();
        if (error) {
          console.error("Error al obtener usuario:", error);
          return;
        }
        if (authUser && authUser.email) {
          setUserEmail(authUser.email);
        } else if (user?.email) {
          // Fallback: usar email del contexto si está disponible
          setUserEmail(user.email);
        }
      } catch (error) {
        console.error("Error al obtener email:", error);
      }
    };
    obtenerEmail();
  }, [user]);

  return (
    <Container>
      <HomeTemplate userEmail={userEmail} userMetadata={user} />

    </Container>
  );
}

const Container = styled.div`
  min-height: 100vh;
  position: relative;
`;

const LogoutButton = styled.button`
  position: fixed;
  top: ${v.mdSpacing};
  right: ${v.mdSpacing};
  padding: ${v.smSpacing} ${v.mdSpacing};
  background-color: ${v.colorGastos};
  color: white;
  border: none;
  border-radius: ${v.borderRadius};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${v.smSpacing};
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: ${v.boxshadowGray};

  &:hover {
    background-color: ${v.colorError};
    transform: translateY(-2px);
  }

  svg {
    font-size: 20px;
  }
`;
import styled from "styled-components";
import { v, UserAuth, LinksArray, SecondarylinksArray, ThemeContext, useAuthStore } from "../../../index";
import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";

export function Sidebar({ state, setState }) {
    const { user } = UserAuth();
    const { setTheme, theme } = useContext(ThemeContext);
    const { signout } = useAuthStore();
    const navigate = useNavigate();

    const handleToggleTheme = () => {
        setTheme(theme === "light" ? "Dark" : "light");
    };

    const handleLogout = async () => {
        try {
            await signout();
            navigate("/login");
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };
    return (
        <Main $isOpen={state}>
            <span className="Sidebarbutton" onClick={() => setState(!state)}>
                {<v.iconoflechaderecha />}
            </span>
            <Container $isOpen={state} className={state ? "active" : ""}>
                <div className="Logocontent">
                    <div className="imgcontent">
                        {user?.picture && <img src={user.picture} alt="foto de perfil" />}
                    </div>
                    <div className="userinfo">
                        <h3>{user?.full_name || "Usuario"}</h3>
                        <p>Mesero</p>
                    </div>
                </div>

                {LinksArray.map(({ icon, label, to }) => (
                    <div className={state ? "LinkContainer active" : "LinkContainer"}
                        key={label}>
                        <NavLink to={to} className={({ isActive }) => `Links${isActive ? ` active` : ``}`}>                        <div className="Linkicon">{icon}</div>
                            {state && <span>{label}</span>}
                        </NavLink>
                    </div>
                ))}
                <Divider />
                {SecondarylinksArray.map(({ icon, label, to }) => {
                    // Si es el botón "Tema", cambiar tema en lugar de navegar
                    if (to === "/acercade") {
                        return (
                            <div className={state ? "LinkContainer active" : "LinkContainer"}
                                key={label}>
                                <div
                                    onClick={handleToggleTheme}
                                    className="Links"
                                    style={{ cursor: "pointer" }}
                                >
                                    <div className="Linkicon">{icon}</div>
                                    {state && <span>{label}</span>}
                                </div>
                            </div>
                        );
                    }
                    // Si es el botón "Logout", cerrar sesión
                    if (label === "Logout") {
                        return (
                            <div className={state ? "LinkContainer active" : "LinkContainer"}
                                key={label}>
                                <div
                                    onClick={handleLogout}
                                    className="Links"
                                    style={{ cursor: "pointer" }}
                                >
                                    <div className="Linkicon">{icon}</div>
                                    {state && <span>{label}</span>}
                                </div>
                            </div>
                        );
                    }
                    // Para otros botones, comportamiento normal
                    return (
                        <div className={state ? "LinkContainer active" : "LinkContainer"}
                            key={label}>
                            <NavLink to={to} className={({ isActive }) => `Links${isActive ? ` active` : ``}`}>                        <div className="Linkicon">{icon}</div>
                                {state && <span>{label}</span>}
                            </NavLink>
                        </div>
                    );
                })}
            </Container>
        </Main>
    );
}

// ==== Styled Components ====



const Container = styled.div`
  color: ${(props) => props.theme.text};
  background: ${(props) => props.theme.bg};
  position: fixed;
  padding-top: 20px;
  z-index: 1;
  height: 100%;
  width: 65px;
  transition: 0.3s ease-in-out;
  overflow-y: auto;
  overflow-x: hidden;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.219),
  0 0 15px rgba(255, 255, 255, 0.1);  
  &::-webkit-scrollbar {
    width: 6px;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb{
    background-color: ${(props) => props.theme.colorScroll};
    border-radius: 10px;
  }

  &.active{
    width: 220px;
  }
  .Logocontent {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 60px;
    flex-direction: ${({ $isOpen }) => ($isOpen ? "row" : "column")};
    transition: all 0.3s ease;

    .imgcontent {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 55px;
        height: 55px;
        border-radius: 15px;
        overflow: hidden;
        flex-shrink: 0;
        transition: all 0.3s ease;
        cursor: pointer;

    img  {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 10px;
        
    }}
    
  .userinfo {
    display: ${({ $isOpen }) => ($isOpen ? "flex" : "none")};
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    margin-left: 10px;
    max-width: 120px;
    overflow: hidden;

    h3 {
      margin: 0;
      font-size: 1rem;
      color: ${(props) => props.theme.text};
      white-space: nowrap;
      overflow: hidden;
      text-overflow:ellipsis;
      width: 100%;
    }

    p {
      margin: 0;
      font-size: 0.85rem;
      color: ${(props) => props.theme.textSecondary || "#aaa"};
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 100%;
    }
  }
}

 .LinkContainer {
    margin: 5px 0;
    transition: all 0.3s;
    padding: 0 5%;
    position: relative;

    .Links{
        display: flex;
        align-items: center;
        text-decoration: none;
        padding: calc(${() => v.smSpacing} - 2px) 0;
        color: ${(props) => props.theme.text};
        height: 50px;
        border-radius: 12px;
        transition: all 0.3s ease;
        position: relative;
        .Linkicon {
        padding: ${() => v.smSpacing} ${() => v.mdSpacing};
        display: flex;
        align-items: center;
        svg {
            font-size: 25px;
        }
        }
        &:hover {
            background: ${(props) => props.theme.body};
            color: white;
        }
        &.active {
            background-color: black;     /* 🔥 fondo negro */
            color: white;                /* 🔥 texto blanco */
            font-weight: 600;
            border-radius: 15px;         /* 🔥 bordes redondeados */
            box-shadow: 0 0 6px rgba(0, 0, 0, 0.3); /* opcional: sombra suave */
            &::before {
            content: none; /* elimina la barra lateral anterior */
                }
        }

    }
    &.active {
        padding: 10px;
        img {
            padding: 0;
        }
    }
 }


`;
const Main = styled.div`
.Sidebarbutton {
    position: fixed;
    top: 35px;
    left: 50px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: ${(props) => props.theme.bg};

    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    z-index: 2;
    transform: ${({ $isOpen }) =>
        $isOpen ? `translateX(162px) rotate(3.142rad)` : `initial`};
    color: ${(props) => props.theme.text};
  }
`;
const Divider = styled.div`
  height: 1px;
  width: 100%;
  background: ${(props) => props.theme.bg4};
  margin: ${() => v.lgSpacing} 0;

`;

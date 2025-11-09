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
        <Main isOpen={state}>
            <span className="Sidebarbutton" onClick={() => setState(!state)}>
                {<v.iconoflechaderecha />}
            </span>
            <Container isOpen={state} className={state? "active" : ""}>
                <div className="Logocontent">
                    <div className="imgcontent">
                        {user?.picture && <img src={user.picture} alt="logo" />}
                    </div>
                    <h3>{user?.full_name || "Usuario"}</h3>
                </div>
                {LinksArray.map(({ icon, label, to }) => (
                    <div className={state ? "LinkContainer active" : "LinkContainer"}
                        key={label}>
                        <NavLink to={to} className={({ isActive }) => `Links${isActive ? ` active` : ``}`}>                        <div className="Linkicon">{icon}</div>
                            { state && <span>{label}</span>}
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
                                    { state && <span>{label}</span>}
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
                                    { state && <span>{label}</span>}
                                </div>
                            </div>
                        );
                    }
                    // Para otros botones, comportamiento normal
                    return (
                        <div className={state ? "LinkContainer active" : "LinkContainer"}
                            key={label}>
                            <NavLink to={to} className={({ isActive }) => `Links${isActive ? ` active` : ``}`}>                        <div className="Linkicon">{icon}</div>
                                { state && <span>{label}</span>}
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
  &::-webkit-scrollbar {
    width: 6px;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb{
    background-color: ${(props)=>props.theme.colorScroll};
    border-radius: 10px;
  }

  &.active{
    width: 220px;
  }
  .Logocontent {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 60px;
    flex-direction: column;

    .imgcontent {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 30px;
        cursor: pointer;
        transition: 0.3s ease;
        transform: ${({ isOpen }) => (isOpen ? `scale(0.7)` : `scale(1.5)`)} rotate(${({ theme }) => theme.logorotate}); 
        img  {
            border-radius: 50%;
            width: 100%;
        } 
    }
    h3{
        display: ${({ isOpen }) => (isOpen ? `block` : `none`)};
    }
}
 .LinkContainer {
    margin: 5px 0;
    transition: all 0.3s;
    padding: 0 5%;
    position: relative;
    &:hover {
      background: ${(props) => props.theme.bgAlpha};
    }
    .Links{
        display: flex;
        align-items: center;
        text-decoration: none;
        padding: calc(${() => v.smSpacing} - 2px) 0;
        color: ${(props) => props.theme.text};
        height: 60px;
        .Linkicon {
        padding: ${() => v.smSpacing} ${() => v.mdSpacing};
        display: flex;
        svg {
            font-size: 25px;
        }
        }
        &.active {
            color: ${(props) => props.theme.bg5};
            font-weight: 600;
            &::before{
            content: "";
            position: absolute;
            height: 100%;
            background: ${(props) => props.theme.bg5};
            width: 4px;
            border-radius: 10px;
            left: 0;
        }
        }

    }
    &.active {
        padding: 0;
    }
 }


`;
const Main = styled.div`
.Sidebarbutton {
    position: fixed;
    top: 70px;
    left: 42px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: ${(props) => props.theme.bgtgderecha};

    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    z-index: 2;
    transform: ${({ isOpen }) =>
        isOpen ? `translateX(162px) rotate(3.142rad)` : `initial`};
    color: ${(props) => props.theme.text};
  }
`;
const Divider = styled.div`
  height: 1px;
  width: 100%;
  background: ${(props) => props.theme.bg4};
  margin: ${() => v.lgSpacing} 0;

`;

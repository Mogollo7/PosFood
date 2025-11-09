import { MyRoutes, Sidebar, Device, Light, Dark, AuthContextProvider, Menuambur } from "./index";
import { createContext, useState } from "react";
import { ThemeProvider } from "styled-components";
import { styled } from "styled-components";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useLocation } from "react-router-dom";
export const ThemeContext = createContext(null);
function App() {
  const [theme, setTheme] = useState("Dark");
  const themeStyle = theme === "light" ? Light : Dark;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <>
      <ThemeContext.Provider value={{ setTheme, theme }}>
        <ThemeProvider theme={themeStyle}>
          <AuthContextProvider>
            <Container className={sidebarOpen ? "" : ""}>
              {!isLoginPage && (
                <>
                  < div className="ContentSidebar">
                    <Sidebar state={sidebarOpen} setState={() => setSidebarOpen(!sidebarOpen)}/>
                  </div>
                  <div className="ContentMenuambur">
                    <Menuambur />
                  </div>
                </>
              )}
              <Containerbody $isLoginPage={isLoginPage}>
                <MyRoutes />
              </Containerbody>
            </Container>
            <ReactQueryDevtools initialIsOpen={true} />
          </AuthContextProvider>
        </ThemeProvider>
      </ThemeContext.Provider>
    </>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  background: ${({ theme }) => theme.bgtotal};
  transition: all 0.2s ease-in-out;
  .ContentSidebar {
    display: none;
  }
  .ContentMenuambur {
    display: block;
    position: absolute;
    left: 20px;
  }
  @media ${Device.tablet} {
    grid-template-columns: 65px 1fr;
    &.active {
      grid-template-columns: 220px 1fr;
    }
    .ContentSidebar {
      display: initial;
    }
    .ContentMenuambur {
      display: none;
    }
  }
`;
const Containerbody = styled.div`
  grid-column: ${({ $isLoginPage }) => ($isLoginPage ? "1" : "2")};
  width: 100%;
  @media ${Device.tablet} {
    grid-column: ${({ $isLoginPage }) => ($isLoginPage ? "1" : "1")};
    width: 100%;
    @media ${Device.laptop} {
      grid-column: ${({ $isLoginPage }) => ($isLoginPage ? "1" : "2")};
    }
  }
`;
export default App;
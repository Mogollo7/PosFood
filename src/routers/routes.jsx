import { Routes, Route } from "react-router-dom";
import { Login, Home, ProtectedRoute, UserAuth, Entrada  } from "../index";
import { Bebida } from "../pages/Bebida";
import { Postre } from "../pages/Postre";
export function MyRoutes() {
  const { user } = UserAuth();
  return (
    <Routes>
              <Route path="/entrada" element={<Entrada />} />
      <Route path="/bebida" element={<Bebida />} />
      <Route path="/postre" element={<Postre />} />

      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute user={user} redirectTo="/login" />}>
        <Route path="/" element={<Home />} />
      </Route>
    </Routes>
  );
}


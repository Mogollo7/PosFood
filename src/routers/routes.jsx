import { Routes, Route } from "react-router-dom";
import { Login, Home, ProtectedRoute, UserAuth, Entrada  } from "../index";
import { Bebida } from "../pages/Bebida";
import { Postre } from "../pages/Postre";
import { Pizza } from "../pages/Pizza";
import { Cocina } from "../pages/Cocina";
import DashboardHome from "../pages/DashboardHome";
import DashboardVentas from "../pages/DashboardVentas";
import DashboardPedidos from "../pages/DashboardPedidos";
import Movimientos from "../pages/Movimientos";
import Informes from "../pages/Informes";

export function MyRoutes() {
  const { user } = UserAuth();
  return (
    <Routes>
      <Route path="/entrada" element={<Entrada />} />
      <Route path="/bebida" element={<Bebida />} />
      <Route path="/postre" element={<Postre />} />
      <Route path="/pizza" element={<Pizza />} />
      <Route path="/cocina" element={<Cocina />} />
      <Route path="/movimientos" element={<Movimientos />} />

      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute user={user} redirectTo="/login" />}>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<DashboardHome />} />
        <Route path="/dashboard/ventas" element={<DashboardVentas />} />
        <Route path="/dashboard/pedidos" element={<DashboardPedidos />} />
        <Route path="/informes" element={<Informes />} />
      </Route>
    </Routes>
  );
}


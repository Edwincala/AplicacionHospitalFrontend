import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Home } from "../pages/Home.tsx";
import { Login } from "../pages/Login.tsx";
import { PrivateRoutes } from "./PrivateRoutes.tsx";
import Dashboard from "../pages/Dashboard.tsx";
import { Medicamentos } from "../pages/Medicamentos.tsx";
import { HistoriasClinicas } from "../pages/HistoriasClinicas.tsx";
import { Farmacia } from "../pages/Farmacia.tsx";
import { Citas } from "../pages/Citas.tsx";
import { RoleRoute } from "./RoleRoute.tsx";
import AccessDenied from "../pages/AccessDenied.tsx";
import { Layout } from "../components/layouts/Layout.tsx";
import Perfil from "../pages/Perfil.tsx";
import { Usuarios } from "../pages/Usuarios.tsx";
import { useAuthStore } from "../store/authStore.ts";
import HorariosDoctor from "../pages/HorariosDoctores.tsx";
import CitasDoctor from "../pages/CitasDoctor.tsx";

export const AppRouter: React.FC = () => {
    const user = useAuthStore((state) => state.user);
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/login" element={
                    user ? <Navigate to="/dashboard" /> : <Login />
                } />

                <Route path="/" element={
                    user ? <Navigate to="/dashboard" /> : <Home />
                } />

                <Route path="/access-denied" element={<AccessDenied />} />

                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoutes>
                            <Layout>
                                <Dashboard />
                            </Layout>
                        </PrivateRoutes>
                    }
                />

                <Route
                    path="/perfil"
                    element={
                        <PrivateRoutes>
                            <Layout>
                                <Perfil />
                            </Layout>
                        </PrivateRoutes>
                    }
                />

                <Route
                    path="/medicamentos"
                    element={
                        <PrivateRoutes>

                            <RoleRoute allowedRoles={["ADMINISTRATIVO"]}>
                                <Layout>
                                    <Medicamentos />
                                </Layout>
                            </RoleRoute>
                        </PrivateRoutes>
                    }
                />

                <Route
                    path="/doctor/horarios"
                    element={
                        <PrivateRoutes>
                            <RoleRoute allowedRoles={["DOCTOR"]}>
                                <Layout>
                                    <HorariosDoctor username="doctor" />
                                </Layout>
                            </RoleRoute>
                        </PrivateRoutes>
                    }
                />

                <Route
                    path="/doctor/citas"
                    element={
                        <PrivateRoutes>

                            <RoleRoute allowedRoles={["DOCTOR"]}>
                                <Layout>
                                    <CitasDoctor />
                                </Layout>
                            </RoleRoute>
                        </PrivateRoutes>
                    }
                />

                <Route
                    path="/historiasClinicas"
                    element={
                        <PrivateRoutes>
                            <RoleRoute allowedRoles={["DOCTOR"]}>
                                <Layout>
                                    <HistoriasClinicas />
                                </Layout>
                            </RoleRoute>
                        </PrivateRoutes>
                    }
                />

                <Route
                    path="/farmacia"
                    element={
                        <PrivateRoutes>
                            <RoleRoute allowedRoles={["PACIENTE"]}>
                                <Layout>
                                    <Farmacia />
                                </Layout>
                            </RoleRoute>
                        </PrivateRoutes>
                    }
                />

                <Route
                    path="/usuarios"
                    element={
                        <PrivateRoutes>
                            <RoleRoute allowedRoles={["ADMINISTRATIVO"]}>
                                <Layout>
                                    <Usuarios />
                                </Layout>
                            </RoleRoute>
                        </PrivateRoutes>
                    }
                />

                <Route
                    path="/citas"
                    element={
                        <PrivateRoutes>
                            <RoleRoute allowedRoles={["ADMINISTRATIVO"]}>
                                <Layout>
                                    <Citas />
                                </Layout>
                            </RoleRoute>
                        </PrivateRoutes>
                    }
                />

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    )
}

import {Navigate, useNavigate} from "react-router-dom";
import React, { useEffect } from "react";
import {useAuthStore} from "../store/authStore.ts";

interface PrivateRouteProps {
    children: JSX.Element;
}

export const PrivateRoutes: React.FC<PrivateRouteProps> = ({ children }) => {
    const user = useAuthStore((state) => state.user);

    if (!user) {
        console.log('No hay usuario autenticado, redirigiendo a login');
        return <Navigate to="/login" />;
    }

    return children;
};
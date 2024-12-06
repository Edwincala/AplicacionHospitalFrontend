import {useAuthStore} from "../store/authStore.ts";
import {Navigate} from "react-router-dom";

interface RoleRouteProps {
    children: JSX.Element;
    allowedRoles: string[];
}

export const RoleRoute: React.FC<RoleRouteProps> = ({ children, allowedRoles }) => {
    const user = useAuthStore((state) => state.user);

    console.log('RoleRoute - Usuario actual:', user);
    console.log('RoleRoute - Roles permitidos:', allowedRoles);

    if (!user || !allowedRoles.includes(user.role.replace('ROLE_', ''))) {
        console.log('Acceso denegado - redirigiendo');
        return <Navigate to="/access-denied" />;
    }

    return children;
};
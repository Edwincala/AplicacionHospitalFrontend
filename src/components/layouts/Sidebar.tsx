import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { menuItems } from "../../types/MenuItems";
import { Box, Divider, Drawer, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';

interface SidebarProps {
    open: boolean;
    onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);

    // Filtrar elementos del menú según el rol del usuario
    const filteredMenuItems = menuItems.filter(
        item => user && item.roles.includes(user.role.replace('ROLE_', '') as "ADMINISTRATIVO" | "DOCTOR" | "PACIENTE")
    );

    const handleNavigate = (path: string) => {
        navigate(path);
        onClose();
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

  return (
    <Drawer
            anchor="left"
            open={open}
            onClose={onClose}
            variant="temporary"
            sx={{
                width: 240,
                '& .MuiDrawer-paper': {
                    width: 240,
                    backgroundColor: '#f8f9fa',
                    boxSizing: 'border-box',
                },
            }}
        >
            {/* Perfil del usuario */}
            <Box className="p-4 bg-blue-900 text-white">
                <Box className="text-center">
                    <Box className="w-16 h-16 mx-auto mb-2 rounded-full bg-blue-700 flex items-center justify-center text-2xl">
                        {user?.nombre?.[0]}
                    </Box>
                    <h3 className="font-semibold">{user?.nombre} {user?.apellido}</h3>
                    <p className="text-sm opacity-80">
                        {user?.role.replace('ROLE_', '')}
                    </p>
                </Box>
            </Box>

            <Divider />

            {/* Opciones del menú */}
            <List className="flex-grow">
                {filteredMenuItems.map((item) => (
                    <ListItem
                        component="button"
                        key={item.path}
                        onClick={() => handleNavigate(item.path)}
                        className="hover:bg-gray-100"
                    >
                        <ListItemIcon className="text-blue-900">
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText 
                            primary={item.label}
                            primaryTypographyProps={{
                                className: "text-gray-700"
                            }}
                        />
                    </ListItem>
                ))}
            </List>

            <Divider />

            <List>
                <ListItem
                    component="button"
                    onClick={handleLogout}
                    className="hover:bg-red-50 text-red-600"
                >
                    <ListItemIcon className="text-red-600">
                        <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText primary="Cerrar Sesión" />
                </ListItem>
            </List>
        </Drawer>
  )
}




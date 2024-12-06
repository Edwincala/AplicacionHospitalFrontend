import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Avatar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import { useAuthStore } from "../../store/authStore";

interface HeaderProps {
    onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }: HeaderProps) => {
    const user = useAuthStore((state) => state.user);

    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={onMenuClick}
                    className="mr-2">
                    <MenuIcon />
                </IconButton>

                <Typography variant="h6" className="flex-grow">
                    Sistema de Gestión Hospitalaria
                </Typography>

                <Box className="flex items-center gap-2">
                    <Typography variant='body2' className="mr-2">
                        {user?.nombre} {user?.apellido}
                    </Typography>

                    <Avatar className="bg-blue-700">
                        {user?.nombre?.[0]}
                    </Avatar>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
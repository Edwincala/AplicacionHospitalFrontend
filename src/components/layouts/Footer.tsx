import {Box, Container, Typography} from "@mui/material";
import { Link } from "react-router-dom";

export const Footer = () => {
    return (
        <Box component="footer" className="bg-gray-100 py-3 mt-auto">
            <Container maxWidth="lg">
                <Box className="flex justify-between items-center">
                    <Typography variant="body2" color="text.secondary">
                        © 2024 Sistema Hospitalario
                    </Typography>
                    <Box className="flex gap-4">
                        <Link to="#" color="inherit" style={{textDecoration: 'none'}}>
                            Términos
                        </Link>
                        <Link to="#" color="inherit" style={{textDecoration: 'none'}}>
                            Privacidad
                        </Link>
                        <Link to="#" color="inherit" style={{textDecoration: 'none'}}>
                            Contacto
                        </Link>
                    </Box>
                </Box>
            </Container>
        </Box>
    )
}
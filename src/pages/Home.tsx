import { Button, AppBar, Toolbar, Container, Typography, Box, IconButton, Menu, MenuItem } from "@mui/material";
import React, { useState } from "react";
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MenuIcon from '@mui/icons-material/Menu';
import HeroSection from "../components/landingPage/HeroSection";
import ServicesSection from "../components/landingPage/ServicesSection";
import AboutSection from "../components/landingPage/AboutSection";

export const Home: React.FC = () => {
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    }

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    }

    return (
        <div className="min-h-screen flex flex-col">
            <AppBar position="static" className="bg-blue-500 shadow-md">
                <Container maxWidth="xl">
                    <Toolbar className="container mx-auto flex justify-between items-center" disableGutters>
                        <LocalHospitalIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                        <Typography variant="h6"
                            noWrap
                            component="a"
                            href="#inicio"
                            sx={{
                                mr: 2,
                                display: { xs: 'none', md: 'flex' },
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none'
                            }}>
                            HospitalCare
                        </Typography>

                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit">
                                <MenuIcon />
                            </IconButton>

                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "left"
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "left"
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{ display: { xs: 'block', md: 'none' } }}
                            >
                                <MenuItem onClick={handleCloseNavMenu}>
                                    <Typography component="a" href="#inicio" sx={{ textAlign: 'center', textDecoration: 'none', color: 'inherit' }}>Inicio</Typography>
                                </MenuItem>
                                <MenuItem onClick={handleCloseNavMenu}>
                                    <Typography component="a" href="#about" sx={{ textAlign: 'center', textDecoration: 'none', color: 'inherit' }}>Sobre Nosotros</Typography>
                                </MenuItem>
                                <MenuItem onClick={handleCloseNavMenu}>
                                    <Typography component="a" href="#servicios" sx={{ textAlign: 'center', textDecoration: 'none', color: 'inherit' }}>Servicios</Typography>
                                </MenuItem>
                            </Menu>
                        </Box>
                        <LocalHospitalIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                        <Typography variant="h5"
                            noWrap
                            component="a"
                            href="#inicio"
                            sx={{
                                display: { xs: 'flex', md: 'none' },
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none'
                            }}>HospitalCare</Typography>
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            <Button variant="contained" onClick={handleCloseNavMenu} className="my-2 block" href="#inicio">Inicio</Button>
                            <Button variant="contained" onClick={handleCloseNavMenu} className="my-2 block" href="#about">Sobre nosotros</Button>
                            <Button variant="contained" onClick={handleCloseNavMenu} className="my-2 block" href="#servicios">Servicios</Button>
                        </Box>
                        <Box sx={{ flexGrow: 0 }}>
                            <Button variant="contained" className="my-2 text-white block" href="/login">Ingresar</Button>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            <HeroSection />

            <AboutSection />

            <ServicesSection />

            <footer className="bg-black text-white py-6 text-center">
                <p>© 2024 HospitalCare. All rights reserved.</p>
            </footer>
        </div>
    );
}
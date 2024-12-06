import {Box, Container} from "@mui/material";
import {Header} from "./Header.tsx";
import {Sidebar} from "./Sidebar.tsx";
import {Footer} from "./Footer.tsx";
import { useState } from "react";

export const Layout :React.FC<{children: React.ReactNode}> = ({children}) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleSidebarToggle = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <Box className="min-h-screen flex flex-col">
            <Header onMenuClick={handleSidebarToggle} />
            
            <Box className="flex flex-1">
                <Sidebar 
                    open={sidebarOpen} 
                    onClose={() => setSidebarOpen(false)} 
                />
                
                <Box className="flex-grow">
                    <Container 
                        maxWidth="lg" 
                        className="py-4 px-4 min-h-[calc(100vh-128px)]"
                    >
                        {children}
                    </Container>
                </Box>
            </Box>

            <Footer />
        </Box>
    )

}
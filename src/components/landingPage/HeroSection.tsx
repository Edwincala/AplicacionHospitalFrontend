import { Button, Typography } from "@mui/material"

const HeroSection = () => {
  return (
    <div
  id="inicio"
  className="relative min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat px-8"
  style={{
    backgroundImage: "url('/images/hero_image.jpg')",
  }}
>
        <div className="absolute inset-0 bg-black/50">
            <div className="container mx-auto px-4 h-full">
                <div className="flex flex-col justify-center items-center h-full text-white">
                    <Typography variant="h1" className="text-4xl md:text-2xl mb-8">
                        HospitalCare
                    </Typography>
                    <Typography variant="h6" className="text-xl md:text-2xl mb-8">
                        Cuidando tu salud con excelencia
                    </Typography>
                    <Button variant="contained" className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg" href="/login">
                        Agendar Cita
                    </Button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default HeroSection
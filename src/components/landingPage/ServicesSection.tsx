import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ScienceIcon from '@mui/icons-material/Science';
import { Paper } from '@mui/material';

const ServicesSection = () => {
  const services = [
    {
      id: 1,
      title: "Urgencias 24/7",
      description: "Atención médica inmediata con personal altamente calificado.",
      icon: <LocalHospitalIcon sx={{ fontSize: 40 }} />
    },
    {
      id: 2,
      title: "Consulta Externa",
      description: "Consultas programadas con especialistas en diversas áreas.",
      icon: <MedicalServicesIcon sx={{ fontSize: 40 }} />
    },
    {
      id: 3,
      title: "Laboratorio Clínico",
      description: "Análisis y pruebas diagnósticas con tecnología de punta.",
      icon: <ScienceIcon sx={{ fontSize: 40 }} />
    }
  ];

  return (
    <section id='servicios' className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nuestros Servicios
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Ofrecemos una amplia gama de servicios médicos especializados para el cuidado integral de su salud.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <Paper 
              key={service.id}
              elevation={2}
              className="p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex flex-col items-center">
                <div className="text-blue-500 mb-4">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-center">
                  {service.description}
                </p>
              </div>
            </Paper>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
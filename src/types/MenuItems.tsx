import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import MedicationIcon from '@mui/icons-material/Medication';
import HistoryIcon from '@mui/icons-material/History';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import PeopleIcon from '@mui/icons-material/People';
import ScheduleIcon from '@mui/icons-material/Schedule';


type UserRole = "ADMINISTRATIVO" | "DOCTOR" | "PACIENTE";

interface MenuItem {
    label: string;
    icon: JSX.Element;
    path: string;
    roles: UserRole[];
}


export const menuItems: MenuItem[] = [
    {
        label: "Inicio",
        icon: <HomeIcon />, 
        path: "/dashboard",
        roles: ["ADMINISTRATIVO", "DOCTOR", "PACIENTE"]
    },
    {
        label: "Perfil",
        icon: <PersonIcon />, 
        path: "/perfil",
        roles: ["ADMINISTRATIVO", "DOCTOR", "PACIENTE"]
    },
    {
        label: "Medicamentos",
        icon: <MedicationIcon />, 
        path: "/medicamentos",
        roles: ["ADMINISTRATIVO"]
    },
    {
        label: "Horarios",
        icon: <ScheduleIcon />, 
        path: "/doctor/horarios",
        roles: ["DOCTOR"]
    },
    {
        label: "Citas",
        icon: <EditCalendarIcon />, 
        path: "/doctor/citas",
        roles: ["DOCTOR"]
    },
    {
        label: "Historias Clinicas",
        icon: <HistoryIcon />, 
        path: "/historiasClinicas",
        roles: ["DOCTOR"]
    },
    {
        label: "Farmacia",
        icon: <LocalPharmacyIcon />, 
        path: "/farmacia",
        roles: ["PACIENTE"]
    },
    {
        label: "Mi Historia Clínica",
        icon: <HistoryIcon />, 
        path: "/mi-historia-clinica",
        roles: ["PACIENTE"]
    },
    {
        label: "Agendar Citas",
        icon: <EditCalendarIcon />, 
        path: "/citas",
        roles: ["PACIENTE"]
    },
    {
        label: "Gestionar Usuarios",
        icon: <PeopleIcon />, 
        path: "/usuarios",
        roles: ["ADMINISTRATIVO"]
    },
    {
        label: "Gestionar Citas",
        icon: <EditCalendarIcon />, 
        path: "/citas",
        roles: ["ADMINISTRATIVO"]
    },
];
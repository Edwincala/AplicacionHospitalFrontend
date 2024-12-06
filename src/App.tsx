import { createTheme, ThemeProvider } from '@mui/material';
import './App.css'
import {AppRouter} from "./routes/AppRouter.tsx";

const theme = createTheme({
  palette: {
    primary: {main: "#1E88E5"},
    secondary: {main: "#43A047"}
  }
})

const App: React.FC = () => {
  return (
      <ThemeProvider theme={theme}>
        <AppRouter/>
      </ThemeProvider>
  );
}

export default App;
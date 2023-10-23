import { BrowserRouter, Route, Routes } from 'react-router-dom';
import EstilosGlobais from './components/GlobalStyles';
import Inicio from './pages/Inicio';
import PrimeiroAcesso from './pages/PrimeiroAcesso';
import Login from './pages/Login';

function AppRouter() {

  return (
    <BrowserRouter>
      <EstilosGlobais />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/primeiroacesso" element={<PrimeiroAcesso />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter

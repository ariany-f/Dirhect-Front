import { BrowserRouter, Route, Routes } from 'react-router-dom';
import EstilosGlobais from '@components/GlobalStyles';
import Inicio from '@pages/Inicio';
import PrimeiroAcesso from '@pages/PrimeiroAcesso';
import SenhaDeAcesso from '@pages/PrimeiroAcesso/senha-acesso';
import Login from '@pages/Login';
import Seguranca from './pages/Login/seguranca';

function AppRouter() {

  return (
    <BrowserRouter>
      <EstilosGlobais />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/primeiro-acesso" element={<PrimeiroAcesso />} />
        <Route path="/primeiro-acesso/senha-acesso" element={<SenhaDeAcesso />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login/seguranca" element={<Seguranca />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter

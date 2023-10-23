import { BrowserRouter, Route, Routes } from 'react-router-dom';
import EstilosGlobais from '@components/GlobalStyles';
import Inicio from '@pages/Inicio';
import PrimeiroAcesso from '@pages/PrimeiroAcesso';
import SenhaDeAcesso from '@pages/PrimeiroAcesso/password-access';
import Login from '@pages/Login';

function AppRouter() {

  return (
    <BrowserRouter>
      <EstilosGlobais />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/primeiro-acesso" element={<PrimeiroAcesso />} />
        <Route path="/senha-acesso" element={<SenhaDeAcesso />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter

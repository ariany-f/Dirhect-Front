import { BrowserRouter, Route, Routes } from 'react-router-dom';
import EstilosGlobais from '@components/GlobalStyles';
import Inicio from '@pages/Inicio';
import PrimeiroAcesso from '@pages/PrimeiroAcesso';
import SenhaDeAcesso from '@pages/PrimeiroAcesso/senha-acesso';
import Login from '@pages/Login';
import EsqueciASenha from '@pages/EsqueciASenha';
import Seguranca from '@pages/EsqueciASenha/seguranca';
import RedefinirSenha from '@pages/EsqueciASenha/redefinir';

function AppRouter() {

  return (
    <BrowserRouter>
      <EstilosGlobais />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/primeiro-acesso" element={<PrimeiroAcesso />} />
        <Route path="/primeiro-acesso/senha-acesso" element={<SenhaDeAcesso />} />
        <Route path="/login" element={<Login />} />
        <Route path="/esqueci-a-senha" element={<EsqueciASenha />} />
        <Route path="/esqueci-a-senha/seguranca" element={<Seguranca />} />
        <Route path="/esqueci-a-senha/redefinir" element={<RedefinirSenha />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
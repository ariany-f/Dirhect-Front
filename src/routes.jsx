import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Inicio from '@pages/Inicio';
import PrimeiroAcesso from '@pages/PrimeiroAcesso';
import SenhaDeAcesso from '@pages/PrimeiroAcesso/senha-acesso';
import Login from '@pages/Login';
import SelecionarEmpresa from '@pages/Login/selecionar-empresa';
import EsqueciASenha from '@pages/EsqueciASenha';
import Seguranca from '@pages/EsqueciASenha/seguranca';
import RedefinirSenha from '@pages/EsqueciASenha/redefinir';
import Dashboard from '@pages/Dashboard';
import Autenticado from '@common/Autenticado'
import Publico from '@common/Publico'
import Colaboradores from '@pages/Colaboradores';

function AppRouter() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Publico/>}>
          <Route index element={<Inicio />} />
          <Route path="primeiro-acesso" element={<PrimeiroAcesso />} />
          <Route path="primeiro-acesso/senha-acesso" element={<SenhaDeAcesso />} />
          <Route path="login" element={<Login />} />
          <Route path="login/selecionar-empresa" element={<SelecionarEmpresa />} />
          <Route path="esqueci-a-senha" element={<EsqueciASenha />} />
          <Route path="esqueci-a-senha/seguranca" element={<Seguranca />} />
          <Route path="esqueci-a-senha/redefinir" element={<RedefinirSenha />} />
        </Route>
        <Route path="/dashboard" element={<Autenticado/>}>
          <Route index element={<Dashboard />} />
          <Route path="colaboradores" element={<Colaboradores />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
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
import NaoEncontrada from '@pages/NaoEncontrada';
import AdicionarCnpj from '@pages/AdicionarCnpj';
import AdicionarCelular from '@pages/AdicionarCelular';
import AdicionarEmail from '@pages/AdicionarEmail';
import ColaboradorDetalhes from '@pages/Colaboradores/detalhes';
import ColaboradorRegistro from '@pages/Colaboradores/Registro/registro';
import ColaboradorRegistroSucesso from '@pages/Colaboradores/Registro/sucesso';
import Departamentos from '@pages/Departamentos';
import DepartamentoDetalhes from '@pages/Departamentos/detalhes';
import Premiacoes from '@pages/Premiacoes';
import PremiacaoDetalhes from '@pages/Premiacoes/detalhes';
import PremiacaoRegistro from '@pages/Premiacoes/registro';
import PremiacaoSelecaoPremiados from './pages/Premiacoes/selecao-premiados';
import PremiacaoEditarValor from './pages/Premiacoes/editar-valor';
import Despesas from './pages/Despesas';
import DespesaAdiantarSaldo from './pages/Despesas/adiantar-saldo';
import DespesaSelecionarTipoAdiantamento from './pages/Despesas/selecao-tipo-adiantamento';
import DespesaSelecionarAlvoAdiantamento from './pages/Despesas/selecao-alvo-adiantamento';
import DespesaEditarValor from './pages/Despesas/editar-valor';
import DespesaDetalhesAdiantamento from './pages/Despesas/detalhes-adiantamento';
import DespesaDetalhes from './pages/Despesas/detalhes';
import Cartoes from './pages/Cartoes';
import CartaoDetalhes from './pages/Cartoes/detalhes';
import CartaoSolicitarSegundaVia from './pages/Cartoes/solicitar-segunda-via';
import Beneficios from './pages/Beneficios';
import BeneficioOndeUsar from './pages/Beneficios/onde-usar';
import BeneficioSelecionarTipoRecarga from './pages/Beneficios/selecao-tipo-recarga';
import BeneficioSelecionarAlvoRecarga from './pages/Beneficios/selecao-alvo-recarga';
import BeneficioEditarValor from './pages/Beneficios/editar-valor';

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
          
          <Route path="colaborador" element={<Colaboradores />} />
          <Route path="colaborador/detalhes" element={<ColaboradorDetalhes />} />
          <Route path="colaborador/registro" element={<ColaboradorRegistro />} />
          <Route path="colaborador/registro/sucesso" element={<ColaboradorRegistroSucesso />} />
         
          <Route path="departamento" element={<Departamentos />} />
          <Route path="departamento/detalhes" element={<DepartamentoDetalhes />} />
         
          <Route path="premiacao" element={<Premiacoes />} />
          <Route path="premiacao/detalhes" element={<PremiacaoDetalhes />} />
          <Route path="premiacao/registro" element={<PremiacaoRegistro />} />
          <Route path="premiacao/editar-valor" element={<PremiacaoEditarValor />} />
          <Route path="premiacao/selecao-premiados" element={<PremiacaoSelecaoPremiados />} />
          
          <Route path="despesa" element={<Despesas />} />
          <Route path="despesa/adiantar-saldo" element={<DespesaAdiantarSaldo />} />
          <Route path="despesa/selecao-tipo-adiantamento" element={<DespesaSelecionarTipoAdiantamento />} />
          <Route path="despesa/selecao-alvo-adiantamento" element={<DespesaSelecionarAlvoAdiantamento />} />
          <Route path="despesa/editar-valor" element={<DespesaEditarValor />} />
          <Route path="despesa/detalhes-adiantamento" element={<DespesaDetalhesAdiantamento />} />
          <Route path="despesa/detalhes" element={<DespesaDetalhes />} />
          
          <Route path="cartao" element={<Cartoes />} />
          <Route path="cartao/detalhes" element={<CartaoDetalhes />} />
          <Route path="cartao/solicitar-segunda-via" element={<CartaoSolicitarSegundaVia />} />
          
          <Route path="beneficio" element={<Beneficios />} />
          <Route path="beneficio/onde-usar" element={<BeneficioOndeUsar />} />
          <Route path="beneficio/selecao-tipo-recarga" element={<BeneficioSelecionarTipoRecarga />} />
          <Route path="beneficio/selecao-alvo-recarga" element={<BeneficioSelecionarAlvoRecarga />} />
          <Route path="beneficio/editar-valor" element={<BeneficioEditarValor />} />

          <Route path="adicionar-cnpj" element={<AdicionarCnpj />} />
          <Route path="adicionar-celular" element={<AdicionarCelular />} />
          <Route path="adicionar-email" element={<AdicionarEmail />} />
        </Route>
        <Route path="*" element={<NaoEncontrada />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
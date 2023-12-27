import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PrimeiroAcesso from '@pages/PrimeiroAcesso';
import SenhaDeAcesso from '@pages/PrimeiroAcesso/senha-acesso';
import Login from '@pages/Login';
import SelecionarEmpresa from '@pages/Login/selecionar-empresa';
import EsqueciASenha from '@pages/EsqueciASenha';
import Seguranca from '@pages/EsqueciASenha/seguranca';
import RedefinirSenha from '@pages/EsqueciASenha/redefinir';
import Dashboard from '@pages/Dashboard';
import Autenticado from '@common/Autenticado'
import PrimeiroAcessoCommon from '@common/PrimeiroAcesso'
import Publico from '@common/Publico'
import Colaboradores from '@pages/Colaboradores';
import ColaboradoresCadastrados from '@pages/Colaboradores/cadastrados';
import ColaboradoresAguardando from '@pages/Colaboradores/aguardando-cadastro';
import ColaboradoresDesativados from '@pages/Colaboradores/desativados';
import NaoEncontrada from '@pages/NaoEncontrada';
import AdicionarCnpj from '@pages/AdicionarCnpj';
import AdicionarCelular from '@pages/AdicionarCelular';
import AdicionarEmail from '@pages/AdicionarEmail';
import ColaboradorDetalhes from '@pages/Colaboradores/detalhes';
import ColaboradorDadosPessoais from '@pages/Colaboradores/Detalhes/dados-pessoais';
import ColaboradorCartoes from '@pages/Colaboradores/Detalhes/cartoes';
import ColaboradorSaldo from '@pages/Colaboradores/Detalhes/saldo';
import ColaboradorCarteiras from '@pages/Colaboradores/Detalhes/carteiras';
import ColaboradorRegistro from '@pages/Colaboradores/Registro/registro';
import ColaboradorRegistroSucesso from '@pages/Colaboradores/Registro/sucesso';
import Departamentos from '@pages/Departamentos';
import DepartamentoLista from '@pages/Departamentos/lista';
import DepartamentoDetalhes from '@pages/Departamentos/detalhes';
import DepartamentoAdicionarColaboradores from '@pages/Departamentos/adicionar-colaboradores';
import DepartamentoColaboradores from '@pages/Departamentos/colaboradores-sem-departamento';
import Premiacoes from '@pages/Premiacoes';
import PremiacaoDetalhes from '@pages/Premiacoes/detalhes';
import PremiacaoRegistro from '@pages/Premiacoes/registro';
import PremiacaoSelecaoPremiados from '@pages/Premiacoes/selecao-premiados';
import PremiacaoEditarValor from '@pages/Premiacoes/editar-valor';
import Despesas from '@pages/Despesas';
import DespesaAdiantarSaldo from '@pages/Despesas/adiantar-saldo';
import DespesaSelecionarTipoAdiantamento from '@pages/Despesas/selecao-tipo-adiantamento';
import DespesaSelecionarAlvoAdiantamento from '@pages/Despesas/selecao-alvo-adiantamento';
import DespesaEditarValor from '@pages/Despesas/editar-valor';
import DespesaDetalhesAdiantamento from '@pages/Despesas/detalhes-adiantamento';
import DespesaDetalhes from '@pages/Despesas/detalhes';
import Cartoes from '@pages/Cartoes';
import CartaoDetalhes from '@pages/Cartoes/detalhes';
import CartaoSolicitarSegundaVia from '@pages/Cartoes/solicitar-segunda-via';
import Beneficios from '@pages/Beneficios';
import BeneficioOndeUsar from '@pages/Beneficios/onde-usar';
import BeneficioSelecionarTipoRecarga from '@pages/Beneficios/selecao-tipo-recarga';
import BeneficioSelecionarAlvoRecarga from '@pages/Beneficios/selecao-alvo-recarga';
import BeneficioEditarValor from '@pages/Beneficios/editar-valor';
import Extrato from '@pages/Extrato';
import DepartamentoConfiguracaoBeneficios from '@pages/Departamentos/configuracao-beneficios';
import DepartamentoListaColaboradores from '@pages/Departamentos/lista-colaboradores';
import ColaboradorEnvioCartao from './pages/Colaboradores/Registro/envio-cartao';
import ColaboradorDadosIniciais from './pages/Colaboradores/Registro/dados-iniciais';
import { SessaoUsuarioProvider } from "./contexts/SessaoUsuario";
import ColaboradorBandeiraCartao from './pages/Colaboradores/Registro/bandeira-cartao';
import RedefinirSenhaCheckInbox from './pages/EsqueciASenha/check-inbox';
import RedefinirSenhaSucesso from './pages/EsqueciASenha/sucesso';
import MeusDados from './pages/MeusDados'
import MeusDadosDadosGerais from './pages/MeusDados/dados-gerais'
import MeusDadosEndereco from './pages/MeusDados/endereco'
import MeusDadosDadosFaturamento from './pages/MeusDados/dados-faturamento'
import Operador from './pages/Operadores';
import OperadorRegistro from './pages/Operadores/Registro/registro';
import OperadorRegistroPermissoes from './pages/Operadores/Registro/permissoes';
import OperadorRegistroSucesso from './pages/Operadores/Registro/sucesso';
import OperadorRegistroSelecionar from './pages/Operadores/Registro/selecionar';
import OperadorDetalhes from './pages/Operadores/detalhes/';
import OperadorDados from './pages/Operadores/Detalhes/dados';
import OperadorPermissoes from './pages/Operadores/Detalhes/permissoes';

function AppRouter() {
  
  return (
    <BrowserRouter>
      <SessaoUsuarioProvider>
        <Routes>
            <Route path="/primeiro-acesso" element={<PrimeiroAcessoCommon/>}>
              <Route index element={<PrimeiroAcesso />} />
              <Route path="senha-acesso/" element={<SenhaDeAcesso />} />
            </Route>
            <Route path="/login" element={<Publico/>}>
              <Route index element={<Login />} />
              <Route path="selecionar-empresa" element={<SelecionarEmpresa />} />
            </Route>
            <Route path="/esqueci-a-senha" element={<Publico/>}>
              <Route index element={<EsqueciASenha />} />
              <Route path="seguranca" element={<Seguranca />} />
              <Route path="redefinir" element={<RedefinirSenha />} />
              <Route path="check-inbox" element={<RedefinirSenhaCheckInbox />} />
              <Route path="sucesso" element={<RedefinirSenhaSucesso />} />
            </Route>

            <Route path="/" element={<Autenticado/>}>
              <Route index element={<Dashboard />} />
              <Route path="colaborador" element={<Colaboradores />} >
                  <Route index element={<ColaboradoresCadastrados />} />
                  <Route path="aguardando-cadastro" element={<ColaboradoresAguardando />} />
                  <Route path="desativados" element={<ColaboradoresDesativados />} />
              </Route>
              <Route path="colaborador/detalhes/:id" element={<ColaboradorDetalhes />} >
                  <Route index element={<ColaboradorDadosPessoais />} />
                  <Route path="cartoes" element={<ColaboradorCartoes />} />
                  <Route path="saldo" element={<ColaboradorSaldo />} />
                  <Route path="carteiras" element={<ColaboradorCarteiras />} />
              </Route>
              <Route path="colaborador/registro" element={<ColaboradorRegistro />} >
                    <Route index element={<ColaboradorDadosIniciais />} />
                    <Route path="envio-cartao" element={<ColaboradorEnvioCartao />} />
                    <Route path="bandeira-cartao" element={<ColaboradorBandeiraCartao />} />
                    <Route path="sucesso" element={<ColaboradorRegistroSucesso />} />
              </Route>

              <Route path="operador" element={<Operador/>} />
              <Route path="operador/registro" element={<OperadorRegistro />} >
                    <Route index element={<OperadorRegistroSelecionar />} />
                    <Route path="permissoes" element={<OperadorRegistroPermissoes />} />
                    <Route path="sucesso" element={<OperadorRegistroSucesso />} />
              </Route>
              <Route path="operador/detalhes/:id" element={<OperadorDetalhes />} >
                  <Route index element={<OperadorDados />} />
                  <Route path="permissoes" element={<OperadorPermissoes />} />
              </Route>

              <Route path="extrato" element={<Extrato />} />
            
              <Route path="departamento" element={<Departamentos />} >
                  <Route index element={<DepartamentoLista />} />
                  <Route path="colaboradores-sem-departamento" element={<DepartamentoColaboradores />} />
              </Route>
              
              <Route path="departamento/:id/adicionar-colaboradores" element={<DepartamentoAdicionarColaboradores />} />
              <Route path="departamento/detalhes/:id" element={<DepartamentoDetalhes />} >
                  <Route index element={<DepartamentoListaColaboradores />} />
                  <Route path="configuracao-beneficios" element={<DepartamentoConfiguracaoBeneficios />} />
              </Route>
            
              <Route path="saldo-livre" element={<Premiacoes />} />
              <Route path="saldo-livre/detalhes" element={<PremiacaoDetalhes />} />
              <Route path="saldo-livre/registro" element={<PremiacaoRegistro />} />
              <Route path="saldo-livre/editar-valor" element={<PremiacaoEditarValor />} />
              <Route path="saldo-livre/selecao-premiados" element={<PremiacaoSelecaoPremiados />} />
              
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
              <Route path="adicionar-celular/:id" element={<AdicionarCelular />} />
              <Route path="adicionar-email/:id" element={<AdicionarEmail />} />

              <Route path="usuario" element={<MeusDados />} >
                    <Route index element={<MeusDadosDadosGerais />} />
                    <Route path="endereco" element={<MeusDadosEndereco />} />
                    <Route path="dados-faturamento" element={<MeusDadosDadosFaturamento />} />
              </Route>
            </Route>
            <Route path="*" element={<NaoEncontrada />}></Route>
          </Routes>
        </SessaoUsuarioProvider>
    </BrowserRouter>
  )
}

export default AppRouter
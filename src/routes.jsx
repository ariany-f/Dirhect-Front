import { BrowserRouter, Route, Routes } from 'react-router-dom'
import PrimeiroAcesso from '@pages/PrimeiroAcesso'
import SenhaDeAcesso from '@pages/PrimeiroAcesso/senha-acesso'
import Login from '@pages/Login'
import SelecionarEmpresa from '@pages/Login/selecionar-empresa'
import EsqueciASenha from '@pages/EsqueciASenha'
import Seguranca from '@pages/EsqueciASenha/seguranca'
import RedefinirSenha from '@pages/EsqueciASenha/redefinir'
import Dashboard from '@pages/Dashboard'
import Autenticado from '@common/Autenticado'
import PrimeiroAcessoCommon from '@common/PrimeiroAcesso'
import Publico from '@common/Publico'
import Colaboradores from '@pages/Colaboradores'
import ColaboradoresCadastrados from '@pages/Colaboradores/cadastrados'
import ColaboradoresAguardando from '@pages/Colaboradores/aguardando-cadastro'
import ColaboradoresDesativados from '@pages/Colaboradores/desativados'
import NaoEncontrada from '@pages/NaoEncontrada'
import AdicionarCnpj from '@pages/AdicionarCnpj'
import AdicionarCelular from '@pages/AdicionarCelular'
import AdicionarEmail from '@pages/AdicionarEmail'
import ColaboradorDetalhes from '@pages/Colaboradores/detalhes'
import ColaboradorDadosPessoais from '@pages/Colaboradores/Detalhes/dados-pessoais'
import ColaboradorCartoes from '@pages/Colaboradores/Detalhes/cartoes'
import ColaboradorSaldo from '@pages/Colaboradores/Detalhes/saldo'
import ColaboradorCarteiras from '@pages/Colaboradores/Detalhes/carteiras'
import ColaboradorRegistro from '@pages/Colaboradores/Registro/registro'
import ColaboradorRegistroSucesso from '@pages/Colaboradores/Registro/sucesso'
import Departamentos from '@pages/Departamentos'
import DepartamentoLista from '@pages/Departamentos/lista'
import DepartamentoDetalhes from '@pages/Departamentos/detalhes'
import DepartamentoAdicionarColaboradores from '@pages/Departamentos/adicionar-colaboradores'
import DepartamentoColaboradores from '@pages/Departamentos/colaboradores-sem-departamento'
import RecargaPremiacoes from '@pages/Premiacoes'
import Premiacoes from '@pages/Premiacoes/lista'
import PremiacaoDetalhes from '@pages/Premiacoes/adicionar-detalhes'
import PremiacaoSelecionarTipoRecarga from '@pages/Premiacoes/selecao-tipo-recarga'
import PremiacaoEditarValor from '@pages/Premiacoes/editar-valor'
import PremiacaoComoFunciona from '@pages/Premiacoes/como-funciona'
import PremiacaoSelecionarColaboradores from '@pages/Premiacoes/selecao-colaboradores'
import PremiacaoSelecionarDepartamentos from '@pages/Premiacoes/selecao-departamentos'
import Despesas from '@pages/Despesas';
import DespesaAdiantarSaldo from '@pages/Despesas/adiantar-saldo'
import DespesaSelecionarTipoAdiantamento from '@pages/Despesas/selecao-tipo-adiantamento'
import DespesaSelecionarAlvoAdiantamento from '@pages/Despesas/selecao-alvo-adiantamento'
import DespesaEditarValor from '@pages/Despesas/editar-valor'
import DespesaDetalhesAdiantamento from '@pages/Despesas/detalhes-adiantamento'
import DespesaDetalhes from '@pages/Despesas/detalhes'
import Cartoes from '@pages/Cartoes'
import CartaoDetalhes from '@pages/Cartoes/detalhes'
import CartaoSolicitarSegundaVia from '@pages/Cartoes/SolicitarSegundaVia'
import CartaoSolicitarSegundaViaEndereco from '@pages/Cartoes/SolicitarSegundaVia/endereco'
import CartaoSolicitarSegundaViaSucesso from '@pages/Cartoes/SolicitarSegundaVia/sucesso'
import RecargaBeneficios from '@pages/Beneficios'
import Beneficios from '@pages/Beneficios/lista'
import BeneficioOndeUsar from '@pages/Beneficios/onde-usar'
import BeneficioSelecionarTipoRecarga from '@pages/Beneficios/selecao-tipo-recarga'
import BeneficioSelecionarColaboradores from '@pages/Beneficios/selecao-colaboradores'
import BeneficioSelecionarDepartamentos from '@pages/Beneficios/selecao-departamentos'
import BeneficioEditarValor from '@pages/Beneficios/editar-valor'
import ExtratoCommon from '@pages/Extrato'
import Extrato from '@pages/Extrato/extrato'
import ExtratoAdicionarSaldo from '@pages/Extrato/adicionar-saldo'
import DepartamentoConfiguracaoBeneficios from '@pages/Departamentos/configuracao-beneficios'
import DepartamentoListaColaboradores from '@pages/Departamentos/lista-colaboradores'
import ColaboradorEnvioCartao from '@pages/Colaboradores/Registro/envio-cartao'
import ColaboradorDadosIniciais from '@pages/Colaboradores/Registro/dados-iniciais'
import ColaboradorBandeiraCartao from '@pages/Colaboradores/Registro/bandeira-cartao'
import RedefinirSenhaCheckInbox from '@pages/EsqueciASenha/check-inbox'
import RedefinirSenhaSucesso from '@pages/EsqueciASenha/sucesso'
import MeusDados from '@pages/MeusDados'
import MeusDadosDadosGerais from '@pages/MeusDados/dados-gerais'
import MeusDadosEndereco from '@pages/MeusDados/endereco'
import MeusDadosDadosFaturamento from '@pages/MeusDados/dados-faturamento'
import Operador from '@pages/Operadores'
import OperadorRegistro from '@pages/Operadores/Registro/registro'
import OperadorRegistroPermissoes from '@pages/Operadores/Registro/permissoes'
import OperadorRegistroSucesso from '@pages/Operadores/Registro/sucesso'
import OperadorRegistroSelecionar from '@pages/Operadores/Registro/selecionar'
import OperadorDetalhes from '@pages/Operadores/detalhes'
import OperadorDados from '@pages/Operadores/Detalhes/dados'
import OperadorPermissoes from '@pages/Operadores/Detalhes/permissoes'
import { SessaoUsuarioProvider } from "./contexts/SessaoUsuario"
import BeneficioSelecionarFormaPagamento from './pages/Beneficios/selecao-forma-pagamento'
import BeneficioPagamento from './pages/Beneficios/pagamento'
import CartoesLista from './pages/Cartoes/lista'
import CartoesAtivados from './pages/Cartoes/ativados'
import CartaoSolicitarSegundaViaAcompanhar from './pages/Cartoes/SolicitarSegundaVia/acompanhar'
import CartaoSolicitarSegundaViaCommon from './pages/Cartoes/SolicitarSegundaVia/common'
import ExtratoPagamento from './pages/Extrato/pagamento'
import Vagas from './pages/Vagas'
import VagasAbertas from './pages/Vagas/abertas'
import VagasCanceladas from './pages/Vagas/canceladas'
import VagasRegistro from './pages/Vagas/Registro'
import DetalhesVaga from './pages/Vagas/detalhes'
import Admissoes from './pages/Admissoes'
import CandidatoRegistro from './pages/Candidato/Registro'
import CandidatoRegistroDadosGerais from './pages/Candidato/Registro/dados-gerais'
import CandidatoRegistroEducacao from './pages/Candidato/Registro/educacao'
import CandidatoRegistroHabilidades from './pages/Candidato/Registro/habilidades'
import CandidatoRegistroProfissional from './pages/Candidato/Registro/profissional'
import CandidatoRegistroArquivos from './pages/Candidato/Registro/arquivos'
import ValidarAdmissoes from './pages/Admissoes/validar'
import DetalhesAdmissao from './pages/Admissoes/detalhes'
import FiliaisLista from './pages/Departamentos/filiais'
import CargosLista from './pages/Departamentos/cargos'
import SecoesLista from './pages/Departamentos/secoes'
import Contratos from './pages/Contratos'
import ContratosListagem from './pages/Contratos/lista'
import ColaboradorDependentes from './pages/Colaboradores/Detalhes/dependentes'
import Dependentes from './pages/Dependentes'
import DependentesListagem from './pages/Dependentes/lista'
import ColabroadorFerias from './pages/Colaboradores/Detalhes/ferias'
import FeriasListagem from './pages/Ausencias/ferias'
import Ausencias from './pages/Ausencias'
import FeriasAusenciasListagem from './pages/Ausencias/lista'
import AusenciasListagem from './pages/Ausencias/ausencias'
import AusenciaDadosIniciais from './pages/Ausencias/Registro/dados-iniciais'
import AusenciaRegistro from './pages/Ausencias/Registro/registro'
import ColabroadorESocial from './pages/Colaboradores/Detalhes/esocial'
import ColaboradorAusencias from './pages/Colaboradores/Detalhes/ausencias'

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
                  <Route path="dependentes" element={<ColaboradorDependentes />} />
                  <Route path="ferias" element={<ColabroadorFerias />} />
                  <Route path="ausencias" element={<ColaboradorAusencias />} />
                  <Route path="esocial" element={<ColabroadorESocial />} />
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
              <Route path="extrato" element={<ExtratoCommon />} >
                <Route index element={<Extrato />} />
                <Route path="adicionar-saldo" element={<ExtratoAdicionarSaldo />} />
                <Route path="adicionar-saldo/pagamento/:id" element={<ExtratoPagamento />} />
              </Route>
            
              <Route path="estrutura" element={<Departamentos />} >
                <Route index element={<FiliaisLista />} />
                <Route path="departamentos" element={<DepartamentoLista />} />
                <Route path="cargos" element={<CargosLista />} />
                <Route path="secoes" element={<SecoesLista />} />
                <Route path="colaboradores-sem-departamento" element={<DepartamentoColaboradores />} />
                <Route path=":id/adicionar-colaboradores" element={<DepartamentoAdicionarColaboradores />} />
                <Route path="adicionar-colaboradores" element={<DepartamentoAdicionarColaboradores />} />
                <Route path="detalhes/:id" element={<DepartamentoDetalhes />} >
                    <Route index element={<DepartamentoListaColaboradores />} />
                    <Route path="configuracao-beneficios" element={<DepartamentoConfiguracaoBeneficios />} />
                </Route>
              </Route>
            
              <Route path="linhas-transporte" element={<RecargaPremiacoes/>}>
                <Route index element={<Premiacoes />} />
                <Route path="adicionar-detalhes" element={<PremiacaoDetalhes />} />
                <Route path="como-funciona" element={<PremiacaoComoFunciona />} />
                <Route path="selecao-tipo-recarga" element={<PremiacaoSelecionarTipoRecarga />} />
                <Route path="selecao-colaboradores" element={<PremiacaoSelecionarColaboradores />} />
                <Route path="selecao-departamentos" element={<PremiacaoSelecionarDepartamentos />} />
                <Route path="editar-valor/:tipo" element={<PremiacaoEditarValor />} />
              </Route>
            
            <Route path="dependentes" element={<Dependentes/>}>
              <Route index element={<DependentesListagem />} />
              <Route path="adicionar-detalhes" element={<PremiacaoDetalhes />} />
              <Route path="como-funciona" element={<PremiacaoComoFunciona />} />
              <Route path="selecao-tipo-recarga" element={<PremiacaoSelecionarTipoRecarga />} />
              <Route path="selecao-colaboradores" element={<PremiacaoSelecionarColaboradores />} />
              <Route path="selecao-departamentos" element={<PremiacaoSelecionarDepartamentos />} />
              <Route path="editar-valor/:tipo" element={<PremiacaoEditarValor />} />
            </Route>
            
            <Route path="contratos" element={<Contratos/>}>
              <Route index element={<ContratosListagem />} />
            </Route>

            <Route path="ausencias" element={<AusenciasListagem/>} />
            
            <Route path="ferias" element={<Ausencias/>}>
              <Route index element={<FeriasListagem />} />
              <Route path="all" element={<FeriasAusenciasListagem />} />
              <Route path="ausencias" element={<AusenciasListagem />} />
              <Route path="solicitar" element={<ValidarAdmissoes />} />
            </Route>
            
            <Route path="ferias/registro" element={<AusenciaRegistro />} >
                  <Route index element={<AusenciaDadosIniciais />} />
            </Route>
              
              {/* <Route path="despesa" element={<Despesas />} />
              <Route path="despesa/adiantar-saldo" element={<DespesaAdiantarSaldo />} />
              <Route path="despesa/selecao-tipo-adiantamento" element={<DespesaSelecionarTipoAdiantamento />} />
              <Route path="despesa/selecao-alvo-adiantamento" element={<DespesaSelecionarAlvoAdiantamento />} />
              <Route path="despesa/editar-valor" element={<DespesaEditarValor />} />
              <Route path="despesa/detalhes-adiantamento" element={<DespesaDetalhesAdiantamento />} />
              <Route path="despesa/detalhes" element={<DespesaDetalhes />} /> */}

              <Route path="vagas" element={<Vagas />} >
                <Route index element={<VagasAbertas />} />
                <Route path="canceladas" element={<VagasCanceladas />} />
              </Route>
              <Route path="vagas/detalhes/:id" element={<DetalhesVaga />} />
              <Route path="vagas/registro" element={<VagasRegistro />} />

              <Route path="/admissao" element={<Admissoes />} />
              <Route path="/admissao/validar" element={<ValidarAdmissoes />} />
              <Route path="/admissao/detalhes/:id/:candidato" element={<DetalhesAdmissao />} />

              <Route path="/candidato/registro" element={<CandidatoRegistro />} >
                <Route path=":id" element={<CandidatoRegistroDadosGerais />} />
                <Route path=":id/educacao" element={<CandidatoRegistroEducacao />} />
                <Route path=":id/habilidades" element={<CandidatoRegistroHabilidades />} />
                <Route path=":id/profissional" element={<CandidatoRegistroProfissional />} />
                <Route path=":id/arquivos" element={<CandidatoRegistroArquivos />} />
              </Route>
             
              <Route path="/elegibilidade" element={<Cartoes />} >
                <Route index element={<CartoesLista />} />
              </Route>
              <Route path="/elegibilidade/detalhes/:id" element={<CartaoDetalhes />} />
              <Route path="/elegibilidade/solicitar-segunda-via" element={<CartaoSolicitarSegundaViaCommon />} >
                <Route path=":id" element={<CartaoSolicitarSegundaVia/>} />
                <Route path=":id/endereco" element={<CartaoSolicitarSegundaViaEndereco />} />
                <Route path=":id/sucesso" element={<CartaoSolicitarSegundaViaSucesso />} />
                <Route path=":id/entrega/acompanhar" element={<CartaoSolicitarSegundaViaAcompanhar />} />
              </Route>
              
              <Route path="/beneficio" element={<RecargaBeneficios/>}>
                <Route index element={<Beneficios />} />
                <Route path="onde-usar" element={<BeneficioOndeUsar />} />
                <Route path="selecao-tipo-recarga" element={<BeneficioSelecionarTipoRecarga />} />
                <Route path="selecao-colaboradores" element={<BeneficioSelecionarColaboradores />} />
                <Route path="selecao-departamentos" element={<BeneficioSelecionarDepartamentos />} />
                <Route path="editar-valor/:tipo" element={<BeneficioEditarValor />} />
                <Route path="selecao-forma-pagamento/:id" element={<BeneficioSelecionarFormaPagamento />} />
                <Route path="pagamento/:id" element={<BeneficioPagamento />} />
              </Route>
              
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
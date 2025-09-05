import { BrowserRouter, Route, Routes } from 'react-router-dom'
import PrimeiroAcesso from '@pages/PrimeiroAcesso'
import SenhaDeAcesso from '@pages/PrimeiroAcesso/senha-acesso'
import Login from '@pages/Login'
import LoginMobile from '@pages/Login/mobile'
import Mfa from '@pages/Login/mfa'
import SelecionarEmpresa from '@pages/Login/selecionar-empresa'
import SelecionarEmpresaMobile from '@pages/Login/selecionar-empresa-mobile'
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
import ColaboradorDadosContratuais from '@pages/Colaboradores/Detalhes/dados-contratuais'
import ColaboradorBeneficios from '@pages/Colaboradores/Detalhes/beneficios'
import ColaboradorCartoes from '@pages/Colaboradores/Detalhes/cartoes'
import ColaboradorSaldo from '@pages/Colaboradores/Detalhes/saldo'
import ColaboradorCarteiras from '@pages/Colaboradores/Detalhes/carteiras'
import ColaboradorRegistro from '@pages/Colaboradores/Registro/registro'
import ColaboradorRegistroSucesso from '@pages/Colaboradores/Registro/sucesso'
import EstruturaOrganizacional from '@pages/Estrutura'
import DepartamentoLista from '@pages/Estrutura/departamentos'
import DepartamentoDetalhes from '@pages/Estrutura/departamento/detalhes'
import DepartamentoAdicionarColaboradores from '@pages/Estrutura/adicionar-colaboradores'
import DepartamentoColaboradores from '@pages/Estrutura/colaboradores-sem-departamento'
import LinhasTransporte from '@pages/LinhasTransporte'
import ListaLinhasTransporte from '@pages/LinhasTransporte/lista'
import PremiacaoEditarValor from '@pages/Pedidos/editar-valor'
import PremiacaoComoFunciona from '@pages/Pedidos/como-funciona'
import PremiacaoSelecionarColaboradores from '@pages/Pedidos/selecao-colaboradores'
import PremiacaoSelecionarDepartamentos from '@pages/Pedidos/selecao-departamentos'
import RecargaBeneficios from '@pages/Beneficios'
import Beneficios from '@pages/Beneficios/lista'
import TiposBeneficio from '@pages/TiposBeneficio'
import TiposBeneficioLista from '@pages/TiposBeneficio/lista'
import BeneficioOndeUsar from '@pages/Beneficios/onde-usar'
import BeneficioSelecionarColaboradores from '@pages/Beneficios/selecao-colaboradores'
import BeneficioSelecionarDepartamentos from '@pages/Beneficios/selecao-departamentos'
import BeneficioEditarValor from '@pages/Beneficios/editar-valor'
import ExtratoCommon from '@pages/Extrato'
import Extrato from '@pages/Extrato/extrato'
import ExtratoAdicionarSaldo from '@pages/Extrato/adicionar-saldo'
import EstruturaConfiguracaoBeneficios from '@pages/Estrutura/configuracao-beneficios'
import EstruturaListaColaboradores from '@pages/Estrutura/lista-colaboradores'
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
import BeneficioSelecionarFormaPagamento from '@pages/Beneficios/selecao-forma-pagamento'
import BeneficioPagamento from '@pages/Beneficios/pagamento'
import ExtratoPagamento from '@pages/Extrato/pagamento'
import Vagas from '@pages/Vagas'
import VagasAbertas from '@pages/Vagas/abertas'
import VagasCanceladas from '@pages/Vagas/canceladas'
import VagasTransferidas from '@pages/Vagas/transferidas'
import VagasRegistro from '@pages/Vagas/Registro'
import DetalhesVaga from '@pages/Vagas/detalhes'
import Admissoes from '@pages/Admissoes'
import CandidatoRegistro from '@pages/Admissoes/Registro'
import ValidarAdmissoes from '@pages/Admissoes/validar'
import DetalhesAdmissao from '@pages/Admissoes/detalhes'
import AcessoCandidato from '@pages/AcessoCandidato'
import FiliaisLista from '@pages/Estrutura/filiais'
import CargosLista from '@pages/Estrutura/cargos'
import SecoesLista from '@pages/Estrutura/secoes'
import HorariosLista from '@pages/Estrutura/horarios'
import Contratos from '@pages/Contratos'
import ContratosListagem from '@pages/Contratos/lista'
import KitAdmissional from '@pages/KitAdmissional'
import KitAdmissionalLista from '@pages/KitAdmissional/lista'
import KitAdmissionalDetalhes from '@pages/KitAdmissional/detalhes'
import ColaboradorDependentes from '@pages/Colaboradores/Detalhes/dependentes'
import Dependentes from '@pages/Dependentes'
import DependentesListagem from '@pages/Dependentes/lista'
import ColabroadorFerias from '@pages/Colaboradores/Detalhes/ferias'
import Ferias from '@pages/Ferias'
import FeriasListagem from '@pages/Ferias/lista'
import Ausencias from '@pages/Ausencias'
import FeriasAusenciasListagem from '@pages/Ausencias/lista'
import AusenciasListagem from '@pages/Ausencias/ausencias'
import ColabroadorESocial from '@pages/Colaboradores/Detalhes/esocial'
import ColaboradorAusencias from '@pages/Colaboradores/Detalhes/ausencias'
import ColabroadorDemissoes from '@pages/Colaboradores/Detalhes/demissoex'
import Demissoes from '@pages/Demissoes'
import Ciclos from '@pages/Ciclos'
import CiclosLista from '@pages/Ciclos/lista'
import DetalhesCiclos from '@pages/Ciclos/detalhes'
import ColabroadorCiclos from '@pages/Colaboradores/Detalhes/ciclos'
import Pedidos from '@pages/Pedidos'
import PedidosLista from '@pages/Pedidos/lista'
import DetalhesPedidos from '@pages/Pedidos/detalhes'
import ColaboradorPedidos from '@pages/Colaboradores/Detalhes/pedidos'
import ColaboradorMovimentos from '@pages/Colaboradores/Detalhes/movimentos'
import Movimentos from '@pages/Movimentos'
import MovimentosLista from '@pages/Movimentos/lista'
import DetalhesMovimentos from '@pages/Movimentos/detalhes'
import Tarefas from '@pages/Tarefas'
import TarefasLista from '@pages/Tarefas/lista'
import DetalhesTarefas from '@pages/Tarefas/detalhes'
import MeusCiclos from '@pages/Ciclos/meusCiclos'
import DetalhesMeusCiclos from '@pages/Ciclos/detalhesMeusCiclos'
import DetalhesContratos from '@pages/Contratos/detalhes'
import CentrosCustoLista from '@pages/Estrutura/centros_custo'
import SindicatosLista from '@pages/Estrutura/sindicatos'
import Marketplace from '@pages/Marketplace'
import MarketplaceLista from '@pages/Marketplace/grid'
import PedidoAdicionarDetalhes from '@pages/Pedidos/adicionar-detalhes'
import MobileBlocker from '@components/MobileBlocker'
import { useEffect, useState } from 'react'
import Elegibilidade from '@pages/Elegibilidade'
import ElegibilidadeLista from '@pages/Elegibilidade/lista'
import ElegibilidadeConfigurar from '@pages/Elegibilidade/configurar'
import ElegibilidadeSelecionarFiliais from '@pages/Elegibilidade/selecao-filiais'
import ElegibilidadeSelecionarDepartamentos from '@pages/Elegibilidade/selecao-departamentos'
import ElegibilidadeEditarValor from '@pages/Elegibilidade/editar-valor'
import DetalhesElegibilidade from '@pages/Elegibilidade/detalhes'
import Operadoras from '@pages/Operadoras'
import OperadorasListagem from '@pages/Operadoras/lista'
import DetalhesOperadoras from '@pages/Operadoras/detalhes'
import FuncoesLista from '@pages/Estrutura/funcoes'
import ColaboradorDependentesDetalhes from '@pages/Colaboradores/Detalhes/Dependentes/detalhes'
import FilialDetalhes from '@pages/Estrutura/filial/detalhes'
import EstruturaColaboradorDetalhes from '@pages/Estrutura/colaborador/detalhes'
import CargoDetalhes from '@pages/Estrutura/cargo/detalhes'
import FuncaoDetalhes from '@pages/Estrutura/funcao/detalhes'
import SecaoDetalhes from '@pages/Estrutura/secao/detalhes'
import HorarioDetalhes from '@pages/Estrutura/horario/detalhes'
import CentrosCustoDetalhes from '@pages/Estrutura/centro_custo/detalhes'
import SindicatoDetalhes from '@pages/Estrutura/sindicato/detalhes'
import MobileScrollToTop from '@components/MobileScrollToTop'
import MeusDadosSistema from '@pages/MeusDados/sistema'
import { Toast } from 'primereact/toast'
import { ToastContainer } from 'react-toastify'
import ConfiguracoesEmails from '@pages/MeusDados/configuracoes'
import MfaGenerate from '@pages/Login/mfa_generate'
import Documentos from '@pages/DocumentosRequeridos'
import DocumentosConfiguracoes from '@pages/DocumentosRequeridos/configuracoes'
import SelecionarGrupo from '@pages/Login/selecionar-grupo'
import Atividades from '@pages/Tarefas/atividades'
import AtividadesLista from '@pages/Tarefas/lista_atividades'
import AtividadesKanban from '@pages/Tarefas/kanban_atividades'
import Candidato from './common/Candidato'
import TabelasSistema from '@pages/TabelasSistema'
import EstadoCivil from '@pages/TabelasSistema/estado_civil'
import Genero from '@pages/TabelasSistema/genero'
import Nacionalidade from '@pages/TabelasSistema/nacionalidade'
import CorRaca from '@pages/TabelasSistema/cor_raca'
import TipoSanguineo from '@pages/TabelasSistema/tipo_sanguineo'
import GrauInstrucao from '@pages/TabelasSistema/grau_instrucao'
import GrauParentesco from '@pages/TabelasSistema/grau_parentesco'
import TipoRua from '@pages/TabelasSistema/tipo_rua'
import TipoBairro from '@pages/TabelasSistema/tipo_bairro'
import TipoFuncionario from '@pages/TabelasSistema/tipo_funcionario'
import CodigoCategoriaEsocial from '@pages/TabelasSistema/codigo_categoria_esocial'
import TipoRecebimento from '@pages/TabelasSistema/tipo_recebimento'
import TipoSituacao from '@pages/TabelasSistema/tipo_situacao'
import MotivoAdmissao from '@pages/TabelasSistema/motivo_admissao'
import TipoAdmissao from '@pages/TabelasSistema/tipo_admissao'
import MotivoDemissao from '@pages/TabelasSistema/motivo_demissao'
import TipoDemissao from '@pages/TabelasSistema/tipo_demissao'
import CodigoOcorrenciaSefip from '@pages/TabelasSistema/codigo_ocorrencia_sefip'
import CodigoCategoriaSefip from '@pages/TabelasSistema/codigo_categoria_sefip'
import CodigoSituacaoFgts from '@pages/TabelasSistema/codigo_situacao_fgts'
import CodigoVinculoRais from '@pages/TabelasSistema/codigo_vinculo_rais'
import CodigoSituacaoRais from '@pages/TabelasSistema/codigo_situacao_rais'
import DePara from '@pages/TabelasSistema/depara'
import MeusDadosEmpresa from '@pages/MeusDados/empresa'
import usePageMetadata from '@hooks/usePageMetadata';
import ColaboradorEstabilidade from '@pages/Colaboradores/Detalhes/estabilidade'
import Metadados from '@pages/Metadados'
import Credenciais from '@pages/Credenciais'
import Agendamentos from './pages/Agendamentos'
import Syync from './pages/Syync'

function AppRouter() {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);

  useEffect(() => {
    
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  usePageMetadata();

  return (
    <BrowserRouter>
      <MobileScrollToTop />
      <ToastContainer />
      <SessaoUsuarioProvider>
        <Routes>
            <Route path="/primeiro-acesso" element={<PrimeiroAcessoCommon/>}>
              <Route index element={<PrimeiroAcesso />} />
              <Route path="senha-acesso/" element={<SenhaDeAcesso />} />
            </Route>
            <Route path="/login" element={<Publico/>}>
              {isDesktop ? 
                <Route index element={<Login />} /> 
                :
                  <Route index element={<LoginMobile />} />
              }
              <Route path="mfa/:confirmed/:method" element={<Mfa />} />
              <Route path="mfa/generate" element={<MfaGenerate />} />
              <Route path="selecionar-grupo" element={<SelecionarGrupo />} />
              {isDesktop ?
                <Route path="selecionar-empresa" element={<SelecionarEmpresa />} />
                :
                <Route path="selecionar-empresa" element={<SelecionarEmpresaMobile />} />
              }
            </Route>
            <Route path="/esqueci-a-senha" element={<Publico/>}>
              <Route index element={<EsqueciASenha />} />
              <Route path="redefinir/:uid/:token" element={<RedefinirSenha />} />
              <Route path="seguranca" element={<Seguranca />} />
              <Route path="check-inbox" element={<RedefinirSenhaCheckInbox />} />
              <Route path="sucesso" element={<RedefinirSenhaSucesso />} />
            </Route>

            <Route path="/acesso-candidato/:token/:uuid" element={<Candidato/>}>
              <Route index element={<AcessoCandidato />} />
            </Route>

            <Route path="/" element={<Autenticado/>}>
              <Route index element={<Dashboard />} />
              <Route path="colaborador" element={<Colaboradores />} >
                  <Route index element={<ColaboradoresCadastrados />} />
                  <Route path="aguardando-cadastro" element={<ColaboradoresAguardando />} />
                  <Route path="desativados" element={<ColaboradoresDesativados />} />
              </Route>
              <Route path="colaborador/detalhes/:id" element={<ColaboradorDetalhes />} >
                  <Route index element={<ColaboradorBeneficios />} />
                  <Route path="dados-contratuais" element={<ColaboradorDadosContratuais />} />
                  <Route path="dados-pessoais" element={<ColaboradorDadosPessoais />} />
                  <Route path="cartoes" element={<ColaboradorCartoes />} />
                  <Route path="saldo" element={<ColaboradorSaldo />} />
                  <Route path="dependentes" element={<ColaboradorDependentes />} />
                  <Route path="dependentes/:codigo" element={<ColaboradorDependentesDetalhes />} />
                  <Route path="ferias" element={<ColabroadorFerias />} />
                  <Route path="ausencias" element={<ColaboradorAusencias />} />
                  <Route path="estabilidade" element={<ColaboradorEstabilidade />} />
                  <Route path="esocial" element={<ColabroadorESocial />} />
                  <Route path="demissoes" element={<ColabroadorDemissoes />} />
                  <Route path="ciclos" element={<ColabroadorCiclos />} />
                  <Route path="pedidos" element={<ColaboradorPedidos />} />
                  <Route path="movimentos" element={<ColaboradorMovimentos />} />
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
              
              <Route path="tabelas-de-sistema" element={<TabelasSistema />} >
                <Route index element={<DePara />} />
                <Route path="estado-civil" element={<EstadoCivil />} />
                <Route path="genero" element={<Genero />} />
                <Route path="nacionalidade" element={<Nacionalidade />} />
                <Route path="cor-raca" element={<CorRaca />} />
                <Route path="tipo-sanguineo" element={<TipoSanguineo />} />
                <Route path="grau-instrucao" element={<GrauInstrucao />} />
                <Route path="grau-parentesco" element={<GrauParentesco />} />
                <Route path="tipo-rua" element={<TipoRua />} />
                <Route path="tipo-bairro" element={<TipoBairro />} />
                <Route path="tipo-funcionario" element={<TipoFuncionario />} />
                <Route path="codigo-categoria-esocial" element={<CodigoCategoriaEsocial />} />
                <Route path="tipo-recebimento" element={<TipoRecebimento />} />
                <Route path="tipo-situacao" element={<TipoSituacao />} />
                <Route path="motivo-admissao" element={<MotivoAdmissao />} />
                <Route path="tipo-admissao" element={<TipoAdmissao />} />
                <Route path="motivo-demissao" element={<MotivoDemissao />} />
                <Route path="tipo-demissao" element={<TipoDemissao />} />
                <Route path="codigo-ocorrencia-sefip" element={<CodigoOcorrenciaSefip />} />
                <Route path="codigo-categoria-sefip" element={<CodigoCategoriaSefip />} />
                <Route path="codigo-situacao-fgts" element={<CodigoSituacaoFgts />} />
                <Route path="codigo-vinculo-rais" element={<CodigoVinculoRais />} />
                <Route path="codigo-situacao-rais" element={<CodigoSituacaoRais />} />
              </Route>
            
              <Route path="metadados" element={<Metadados />} />
              <Route path="credenciais" element={<Credenciais />} />
              <Route path="agendamentos" element={<Agendamentos />} />
              <Route path="syync" element={<Syync />} />

              <Route path="estrutura" element={<EstruturaOrganizacional />} >
                <Route index element={<FiliaisLista />} />
                <Route path="departamentos" element={<DepartamentoLista />} />
                <Route path="cargos" element={<CargosLista />} />
                <Route path="funcoes" element={<FuncoesLista />} />
                <Route path="secoes" element={<SecoesLista />} />
                <Route path="sindicatos" element={<SindicatosLista />} />
                <Route path="centros-custo" element={<CentrosCustoLista />} />
                <Route path="horarios" element={<HorariosLista />} />
                <Route path="colaboradores-sem-departamento" element={<DepartamentoColaboradores />} />
                <Route path=":id/adicionar-colaboradores" element={<DepartamentoAdicionarColaboradores />} />
                <Route path="adicionar-colaboradores" element={<DepartamentoAdicionarColaboradores />} />
                <Route path="departamento/detalhes/:id" element={<DepartamentoDetalhes />} >
                    <Route index element={<EstruturaConfiguracaoBeneficios type="departamento" />} />
                    <Route path="adicionar-colaboradores" element={<EstruturaListaColaboradores />} />
                </Route>
                <Route path="filial/detalhes/:id" element={<FilialDetalhes />} >
                    <Route index element={<EstruturaConfiguracaoBeneficios type="filial" />} />
                    <Route  path="adicionar-colaboradores" element={<EstruturaListaColaboradores />} />
                </Route>
                <Route path="colaborador/detalhes/:id" element={<EstruturaColaboradorDetalhes />} >
                    <Route index element={<EstruturaConfiguracaoBeneficios type="funcionario" />} />
                </Route>
                <Route path="cargo/detalhes/:id" element={<CargoDetalhes />} >
                    <Route path="adicionar-colaboradores" element={<EstruturaListaColaboradores />} />
                    <Route index element={<EstruturaConfiguracaoBeneficios type="cargo" />} />
                </Route>
                <Route path="funcao/detalhes/:id" element={<FuncaoDetalhes />} >
                    <Route path="adicionar-colaboradores" element={<EstruturaListaColaboradores />} />
                    <Route index element={<EstruturaConfiguracaoBeneficios type="funcao" />} />
                </Route>
                <Route path="centro_custo/detalhes/:id" element={<CentrosCustoDetalhes />} >
                    <Route path="adicionar-colaboradores" element={<EstruturaListaColaboradores />} />
                    <Route index element={<EstruturaConfiguracaoBeneficios type="centro_custo" />} />
                </Route>
                <Route path="secao/detalhes/:id" element={<SecaoDetalhes />} >
                    <Route path="adicionar-colaboradores" element={<EstruturaListaColaboradores />} />
                    <Route index element={<EstruturaConfiguracaoBeneficios type="secao" />} />
                </Route>
                <Route path="horario/detalhes/:id" element={<HorarioDetalhes />} >
                    <Route path="adicionar-colaboradores" element={<EstruturaListaColaboradores />} />
                    <Route index element={<EstruturaConfiguracaoBeneficios type="horario" />} />
                </Route>
                <Route path="sindicato/detalhes/:id" element={<SindicatoDetalhes />} >
                    <Route path="adicionar-colaboradores" element={<EstruturaListaColaboradores />} />
                    <Route index element={<EstruturaConfiguracaoBeneficios type="sindicato" />} />
                </Route>
              </Route>
            
              <Route path="linhas-transporte" element={<LinhasTransporte/>}>
                <Route index element={<ListaLinhasTransporte />} />
              </Route>
            
            <Route path="dependentes" element={<Dependentes/>}>
              <Route index element={<DependentesListagem />} />
            </Route>
            
            <Route path="operadoras" element={<Operadoras/>}>
              <Route index element={<OperadorasListagem />} />
              <Route path="detalhes/:id" element={<DetalhesOperadoras />} />
            </Route>
            
            <Route path="contratos" element={<Contratos/>}>
              <Route index element={<ContratosListagem />} />
              <Route path="detalhes/:id" element={<DetalhesContratos />} />
            </Route>

            <Route path="marketplace" element={<Marketplace/>}>
              <Route index element={<MarketplaceLista />} />
            </Route>

            <Route path="ausencias" element={<AusenciasListagem/>} />
            
            <Route path="ferias" element={<FeriasListagem />} />
            {/* <Route path="ferias" element={<Ferias/>}>
              <Route index element={<FeriasListagem />} />
              <Route path="all" element={<FeriasAusenciasListagem />} />
              <Route path="ausencias" element={<AusenciasListagem />} />
              <Route path="solicitar" element={<ValidarAdmissoes />} />
            </Route> */}

              <Route path="vagas" element={<Vagas />} >
                <Route index element={<VagasAbertas />} />
                <Route path="fechadas" element={<VagasCanceladas />} />
                <Route path="transferidas" element={<VagasTransferidas />} />
              </Route>
              <Route path="vagas/detalhes/:id" element={<DetalhesVaga />} />
              <Route path="vagas/registro" element={<VagasRegistro />} />

              <Route path="documentos" element={<Documentos />}>
                <Route path="configuracoes" element={<DocumentosConfiguracoes />} />
              </Route>

              <Route path="/demissoes" element={<Demissoes />} />

              <Route path="ciclos" element={<Ciclos />} >
                <Route index element={<CiclosLista />} />
                <Route path="detalhes/:id" element={<DetalhesCiclos />} />
                <Route path=":id" element={<MeusCiclos />} />
                <Route path=":colaborador/detalhes/:id" element={<DetalhesMeusCiclos />} />
              </Route>

              <Route path="pedidos" element={<Pedidos />} >
                <Route index element={<PedidosLista />} />
                <Route path="detalhes/:id" element={<DetalhesPedidos />} />
                <Route path="adicionar-detalhes" element={<PedidoAdicionarDetalhes />} />
                <Route path="como-funciona" element={<PremiacaoComoFunciona />} />
                <Route path="selecao-colaboradores" element={<PremiacaoSelecionarColaboradores />} />
                <Route path="selecao-departamentos" element={<PremiacaoSelecionarDepartamentos />} />
                <Route path="editar-valor/:tipo" element={<PremiacaoEditarValor />} />
              </Route>

              <Route path="tarefas" element={<Tarefas />} >
                <Route index element={<TarefasLista />} />
                <Route path="detalhes/:id" element={<DetalhesTarefas />} />
              </Route>

              <Route path="atividades" element={<Atividades />} >
                <Route index element={<AtividadesLista />} />
                <Route path="kanban" element={<AtividadesKanban />} />
              </Route>

              <Route path="movimentos" element={<Movimentos />} >
                <Route index element={<MovimentosLista />} />
                <Route path="detalhes/:id" element={<DetalhesMovimentos />} />
              </Route>

              <Route path="admissao" element={<Admissoes />} />
              <Route path="admissao/validar" element={<ValidarAdmissoes />} />
              <Route path="admissao/detalhes/:id/:candidato" element={<DetalhesAdmissao />} />
              <Route path="admissao/registro/:id" element={<CandidatoRegistro />} />
              <Route path="admissao/registro/:id/:self" element={<CandidatoRegistro />} />
            
              <Route path="elegibilidade" element={<Elegibilidade />} >
                <Route index element={<ElegibilidadeLista />} />
                <Route path="detalhes/:id" element={<DetalhesElegibilidade />} />
                <Route path="configurar" element={<ElegibilidadeConfigurar />} />
                <Route path="como-funciona" element={<PremiacaoComoFunciona />} />
                <Route path="selecao-filiais" element={<ElegibilidadeSelecionarFiliais />} />
                <Route path="selecao-departamentos" element={<ElegibilidadeSelecionarDepartamentos />} />
                <Route path="editar-valor/:tipo" element={<ElegibilidadeEditarValor />} />
              </Route>

              {/* <Route path="/elegibilidade" element={<Cartoes />} >
                <Route index element={<CartoesLista />} />
              </Route>
              <Route path="/elegibilidade/detalhes/:id" element={<CartaoDetalhes />} />
              <Route path="/elegibilidade/solicitar-segunda-via" element={<CartaoSolicitarSegundaViaCommon />} >
                <Route path=":id" element={<CartaoSolicitarSegundaVia/>} />
                <Route path=":id/endereco" element={<CartaoSolicitarSegundaViaEndereco />} />
                <Route path=":id/sucesso" element={<CartaoSolicitarSegundaViaSucesso />} />
                <Route path=":id/entrega/acompanhar" element={<CartaoSolicitarSegundaViaAcompanhar />} />
              </Route> */}
              
              <Route path="/beneficio" element={<RecargaBeneficios/>}>
                <Route index element={<Beneficios />} />
                <Route path="onde-usar" element={<BeneficioOndeUsar />} />
                <Route path="selecao-colaboradores" element={<BeneficioSelecionarColaboradores />} />
                <Route path="selecao-departamentos" element={<BeneficioSelecionarDepartamentos />} />
                <Route path="editar-valor/:tipo" element={<BeneficioEditarValor />} />
                <Route path="selecao-forma-pagamento/:id" element={<BeneficioSelecionarFormaPagamento />} />
                <Route path="pagamento/:id" element={<BeneficioPagamento />} />
              </Route>

              <Route path="/tipos-beneficio" element={<TiposBeneficio/>}>
                <Route index element={<TiposBeneficioLista />} />
              </Route>
              
              <Route path="adicionar-cnpj" element={<AdicionarCnpj />} />
              <Route path="adicionar-celular/:id" element={<AdicionarCelular />} />
              <Route path="adicionar-email/:id" element={<AdicionarEmail />} />

              <Route path="usuario" element={<MeusDados />} >
                  <Route index element={<MeusDadosDadosGerais />} />
                  <Route path="endereco" element={<MeusDadosEndereco />} />
                  <Route path="dados-faturamento" element={<MeusDadosDadosFaturamento />} />
                  <Route path="sistema" element={<MeusDadosSistema />} />
                  <Route path="email" element={<ConfiguracoesEmails />} />
                  <Route path="empresa" element={<MeusDadosEmpresa />} />
                  <Route path="kit-admissional" element={<KitAdmissional />} >
                    <Route index element={<KitAdmissionalLista />} />
                    <Route path="detalhes/:id" element={<KitAdmissionalDetalhes />} />
                  </Route>
              </Route>
            </Route>
            <Route path="*" element={<NaoEncontrada />}></Route>
          </Routes>
        </SessaoUsuarioProvider>
    </BrowserRouter>
  )
}

export default AppRouter
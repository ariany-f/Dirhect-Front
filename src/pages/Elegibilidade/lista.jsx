import Botao from '@components/Botao'
import BotaoGrupo from '@components/BotaoGrupo'
import styles from './Elegibilidade.module.css'
import { GrAddCircle } from 'react-icons/gr'
import QuestionCard from '@components/QuestionCard'
import http from '@http'
import Container from '@components/Container'
import { ConfirmDialog } from 'primereact/confirmdialog'
import DataTableFiliaisElegibilidade from '@components/DataTableFiliaisElegibilidade'
import DataTableSindicatosElegibilidade from '@components/DataTableSindicatosElegibilidade'
import DataTableDepartamentosElegibilidade from '@components/DataTableDepartamentosElegibilidade'
import DataTableSecoesElegibilidade from '@components/DataTableSecoesElegibilidade'
import DataTableCentrosCustoElegibilidade from '@components/DataTableCentrosCustoElegibilidade'
import DataTableCargosElegibilidade from '@components/DataTableCargosElegibilidade'
import DataTableFuncoesElegibilidade from '@components/DataTableFuncoesElegibilidade'
import DataTableHorariosElegibilidade from '@components/DataTableHorariosElegibilidade'
import Loading from '@components/Loading'
import Frame from '@components/Frame'
import styled from "styled-components"
import { Link, useOutletContext } from "react-router-dom"
import { AiFillQuestionCircle } from 'react-icons/ai'
import { Toast } from 'primereact/toast'
import { TabPanel, TabView } from 'primereact/tabview'
import { useState, useEffect, useRef } from 'react'
import { BiChevronRight } from 'react-icons/bi'
import { Real } from '@utils/formats'
import { InputSwitch } from 'primereact/inputswitch'
import SwitchInput from '@components/SwitchInput'

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`

const ElegibilidadeLista = () => {
    const context = useOutletContext()
    const toast = useRef(null)
    const [loading, setLoading] = useState(true)
    const [atualizado, setAtualizado] = useState(false)
    const [dadosCarregados, setDadosCarregados] = useState(false)
    const [mostrarTodas, setMostrarTodas] = useState(false)
    const [activeIndex, setActiveIndex] = useState(0)

    const [filiais, setFiliais] = useState([])
    const [departamentos, setDepartamentos] = useState([])
    const [secoes, setSecoes] = useState([])
    const [cargos, setCargos] = useState([])
    const [funcoes, setFuncoes] = useState([])
    const [centros_custo, setCentrosCusto] = useState([])
    const [sindicatos, setSindicatos] = useState([])
    const [horarios, setHorarios] = useState([])
    const [abasDisponiveis, setAbasDisponiveis] = useState([])

    const fetchData = (endpoint, setter) => {
        http.get(`${endpoint}/?format=json`)
            .then((response) => { setter(response); })
            .catch((err) => { console.log(err); setLoading(false); })
    }

    // Primeiro useEffect para carregar os dados iniciais
    useEffect(() => {
        fetchData('filial', setFiliais);
        fetchData('departamento', setDepartamentos);
        fetchData('secao', setSecoes);
        fetchData('cargo', setCargos);
        fetchData('centro_custo', setCentrosCusto);
        fetchData('sindicato', setSindicatos);
        fetchData('horario', setHorarios);
        fetchData('funcao', setFuncoes);
    }, [])

    useEffect(() => {
        if (context) {
            console.log('Contexto completo:', context);
            const abas = context
                .filter(item => {
                    console.log('Item sendo filtrado:', item);
                    console.log('Tem itens configurados?', item.itens_configurados && item.itens_configurados.length > 0);
                    return item.itens_configurados && item.itens_configurados.length > 0;
                })
                .map(item => {
                    console.log('Item após filtro:', item);
                    console.log('Tipo da entidade:', item.entidade.tipo);
                    return item.entidade.tipo;
                });
            console.log('Abas antes do Set:', abas);
            const abasUnicas = [...new Set(abas)];
            console.log('Abas disponíveis:', abasUnicas);
            setAbasDisponiveis(abasUnicas);
        }
    }, [context]);

    // Segundo useEffect para verificar se todos os dados foram carregados
    useEffect(() => {
        const todasAsListasCarregadas = [
            filiais, departamentos, secoes, cargos,
            funcoes, centros_custo, sindicatos, horarios
        ].every(lista => Array.isArray(lista) && lista.length > 0);

        if (todasAsListasCarregadas && !dadosCarregados) {
            setDadosCarregados(true)
            setLoading(false)
        }
    }, [filiais, departamentos, secoes, cargos, funcoes, centros_custo, sindicatos, horarios, dadosCarregados])

    // Terceiro useEffect para processar os dados de elegibilidade
    useEffect(() => {
        if (context && context.length > 0 && dadosCarregados) {
            const adicionarElegibilidade = (lista, setLista, nomeEntidade) => {
                if (!lista || lista.length === 0) return false;
                
                const listaAtualizada = lista.map(item => {
                    // Procura por itens configurados que correspondam ao id_origem da entidade
                    const itensConfigurados = context
                        .filter(el => el.entidade.tipo === nomeEntidade && el.entidade.id_origem == item.id)
                        .flatMap(el => el.itens_configurados || []);
                    
                    return {
                        ...item,
                        elegibilidade: itensConfigurados
                    };
                });
                
                setLista(listaAtualizada);
                // Retorna true se houver pelo menos um item com elegibilidade
                return listaAtualizada.some(item => item.elegibilidade && item.elegibilidade.length > 0);
            };

            const abasComElegibilidade = {
                filial: adicionarElegibilidade(filiais, setFiliais, 'filial'),
                departamento: adicionarElegibilidade(departamentos, setDepartamentos, 'departamento'),
                secao: adicionarElegibilidade(secoes, setSecoes, 'secao'),
                cargo: adicionarElegibilidade(cargos, setCargos, 'cargo'),
                funcao: adicionarElegibilidade(funcoes, setFuncoes, 'funcao'),
                centro_custo: adicionarElegibilidade(centros_custo, setCentrosCusto, 'centro_custo'),
                sindicato: adicionarElegibilidade(sindicatos, setSindicatos, 'sindicato'),
                horario: adicionarElegibilidade(horarios, setHorarios, 'horario')
            };

            const novasAbas = Object.entries(abasComElegibilidade)
                .filter(([_, temElegibilidade]) => temElegibilidade)
                .map(([key]) => key);

            setAbasDisponiveis(novasAbas);
        }
    }, [context, dadosCarregados]);

    const renderizarAba = (nome, componente) => {
        if (!mostrarTodas && !abasDisponiveis.includes(nome)) return null;
        return (
            <TabPanel header={nome.charAt(0).toUpperCase() + nome.slice(1).replace('_', ' ')}>
                {componente}
            </TabPanel>
        );
    };

    useEffect(() => {
        if (!mostrarTodas && abasDisponiveis.length > 0) {
            // Encontra o índice da primeira aba disponível
            const primeiroIndiceDisponivel = ['filial', 'departamento', 'secao', 'centro_custo', 'cargo', 'funcao', 'sindicato', 'horario']
                .findIndex(aba => abasDisponiveis.includes(aba));
            
            // Se o índice atual não estiver entre as abas disponíveis, muda para a primeira aba disponível
            if (!abasDisponiveis.includes(['filial', 'departamento', 'secao', 'centro_custo', 'cargo', 'funcao', 'sindicato', 'horario'][activeIndex])) {
                setActiveIndex(primeiroIndiceDisponivel);
            }
        }
    }, [mostrarTodas, abasDisponiveis, activeIndex]);

    return (
        <ConteudoFrame style={{ position: 'relative' }}>
            <Toast ref={toast} />
            <Loading opened={loading} />
            <ConfirmDialog />
            <div style={{ position: 'absolute', top: 2, right: 32, zIndex: 2, display: 'flex', alignItems: 'center', gap: 8 }}>
                <SwitchInput checked={mostrarTodas} onChange={setMostrarTodas} />
                <span style={{ whiteSpace: 'nowrap' }}>
                    Visualizar todos os registros
                </span>
            </div>
            <Frame>
                <Container gap="32px">
                    <TabView 
                        activeIndex={activeIndex} 
                        onTabChange={e => {
                            // Se não estiver mostrando todas as abas, verifica se a aba selecionada está disponível
                            if (!mostrarTodas) {
                                const abaSelecionada = ['filial', 'departamento', 'secao', 'centro_custo', 'cargo', 'funcao', 'sindicato', 'horario'][e.index];
                                if (abasDisponiveis.includes(abaSelecionada)) {
                                    setActiveIndex(e.index);
                                }
                            } else {
                                setActiveIndex(e.index);
                            }
                        }}
                    >
                        {renderizarAba('filial', <DataTableFiliaisElegibilidade filiais={filiais} showSearch={false} />)}
                        {renderizarAba('departamento', <DataTableDepartamentosElegibilidade departamentos={departamentos} showSearch={false} />)}
                        {renderizarAba('secao', <DataTableSecoesElegibilidade secoes={secoes} showSearch={false} />)}
                        {renderizarAba('centro_custo', <DataTableCentrosCustoElegibilidade centros_custo={centros_custo} showSearch={false} />)}
                        {renderizarAba('cargo', <DataTableCargosElegibilidade cargos={cargos} showSearch={false} />)}
                        {renderizarAba('funcao', <DataTableFuncoesElegibilidade funcoes={funcoes} showSearch={false} />)}
                        {renderizarAba('sindicato', <DataTableSindicatosElegibilidade sindicatos={sindicatos} showSearch={false} />)}
                        {renderizarAba('horario', <DataTableHorariosElegibilidade horarios={horarios} showSearch={false} />)}
                    </TabView>
                </Container>
            </Frame>
        </ConteudoFrame>
    )
}

export default ElegibilidadeLista

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

    const [filiais, setFiliais] = useState([])
    const [departamentos, setDepartamentos] = useState([])
    const [secoes, setSecoes] = useState([])
    const [cargos, setCargos] = useState([])
    const [funcoes, setFuncoes] = useState([])
    const [centros_custo, setCentrosCusto] = useState([])
    const [sindicatos, setSindicatos] = useState([])
    const [horarios, setHorarios] = useState([])
    const [atualizado, setAtualizado] = useState(false)
    const [abasDisponiveis, setAbasDisponiveis] = useState([])

    const fetchData = (endpoint, setter) => {
        http.get(`${endpoint}/?format=json`)
            .then((response) => { setter(response); })
            .catch((err) => { console.log(err); setLoading(false); })
    }

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
        const todasAsListasCarregadas = [
            filiais, departamentos, secoes, cargos,
            funcoes, centros_custo, sindicatos, horarios
        ].every(lista => Array.isArray(lista) && lista.length > 0)

        if (context && context.length > 0 && todasAsListasCarregadas && !atualizado) {
            const adicionarElegibilidade = (lista, setLista, nomeEntidade) => {
                if (!lista || lista.length === 0) return false
                
                const listaAtualizada = lista.map(item => {
                    const correspondente = context.filter(
                        el => el.content_type_name === nomeEntidade && el.entidade_id_origem === item.id_origem
                    )
                    return {
                        ...item,
                        elegibilidade: correspondente || null
                    }
                })
                
                setLista(listaAtualizada)
                // Retorna true se houver pelo menos uma elegibilidade na lista
                return listaAtualizada.some(item => item.elegibilidade && item.elegibilidade.length > 0)
            }

            // Objeto para mapear as abas e suas elegibilidades
            const abasComElegibilidade = {
                filiais: adicionarElegibilidade(filiais, setFiliais, 'Filial'),
                departamentos: adicionarElegibilidade(departamentos, setDepartamentos, 'Departamento'),
                secoes: adicionarElegibilidade(secoes, setSecoes, 'Secao'),
                cargos: adicionarElegibilidade(cargos, setCargos, 'Cargo'),
                funcoes: adicionarElegibilidade(funcoes, setFuncoes, 'Funcao'),
                centros_custo: adicionarElegibilidade(centros_custo, setCentrosCusto, 'Centro de Custo'),
                sindicatos: adicionarElegibilidade(sindicatos, setSindicatos, 'Sindicato'),
                horarios: adicionarElegibilidade(horarios, setHorarios, 'Horario')
            }

            // Atualiza as abas disponíveis
            setAbasDisponiveis(Object.entries(abasComElegibilidade)
                .filter(([_, temElegibilidade]) => temElegibilidade)
                .map(([key]) => key))

            setAtualizado(true)
            setLoading(false)
        } else if (todasAsListasCarregadas) {
            setLoading(false)
        }
    }, [context, filiais, departamentos, secoes, cargos, funcoes, centros_custo, sindicatos, horarios])

    const renderizarAba = (nome, componente) => {
        if (!abasDisponiveis.includes(nome)) return null;
        return (
            <TabPanel header={nome.charAt(0).toUpperCase() + nome.slice(1).replace('_', ' ')}>
                {componente}
            </TabPanel>
        );
    };

    return (
        <ConteudoFrame>
            <Toast ref={toast} />
            <Loading opened={loading} />
            <ConfirmDialog />
            <Frame>
                <Container gap="32px">
                    <TabView>
                        {renderizarAba('filiais', <DataTableFiliaisElegibilidade filiais={filiais} showSearch={false} />)}
                        {renderizarAba('departamentos', <DataTableDepartamentosElegibilidade departamentos={departamentos} showSearch={false} />)}
                        {renderizarAba('secoes', <DataTableSecoesElegibilidade secoes={secoes} showSearch={false} />)}
                        {renderizarAba('centros_custo', <DataTableCentrosCustoElegibilidade centros_custo={centros_custo} showSearch={false} />)}
                        {renderizarAba('cargos', <DataTableCargosElegibilidade cargos={cargos} showSearch={false} />)}
                        {renderizarAba('funcoes', <DataTableFuncoesElegibilidade funcoes={funcoes} showSearch={false} />)}
                        {renderizarAba('sindicatos', <DataTableSindicatosElegibilidade sindicatos={sindicatos} showSearch={false} />)}
                        {renderizarAba('horarios', <DataTableHorariosElegibilidade horarios={horarios} showSearch={false} />)}
                    </TabView>
                </Container>
            </Frame>
        </ConteudoFrame>
    )
}

export default ElegibilidadeLista

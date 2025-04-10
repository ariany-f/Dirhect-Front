import Botao from '@components/Botao'
import BotaoGrupo from '@components/BotaoGrupo'
import Titulo from '@components/Titulo'
import BotaoVoltar from '@components/BotaoVoltar'
import styles from './SaldoLivre.module.css'
import { GrAddCircle } from 'react-icons/gr'
import QuestionCard from '@components/QuestionCard'
import Texto from '@components/Texto'
import http from '@http'
import CheckboxContainer from "@components/CheckboxContainer"
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

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`

let Real = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});

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

    const fetchData = (endpoint, setter) => {
        http.get(`${endpoint}/?format=json`)
            .then( (response) => {setter(response);})
            .catch((err) => {console.log(err); setLoading(false);})
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
                if (!lista || lista.length === 0) return
                const atualizada = lista.map(item => {
                    const correspondente = context.find(
                        el => el.content_type_name === nomeEntidade && el.entidade_id_origem === item.id
                    )
                    return {
                        ...item,
                        elegibilidade: correspondente || null
                    }
                })
                setLista(atualizada)
            }

            adicionarElegibilidade(filiais, setFiliais, 'Filial')
            adicionarElegibilidade(departamentos, setDepartamentos, 'Departamento')
            adicionarElegibilidade(secoes, setSecoes, 'Secao')
            adicionarElegibilidade(cargos, setCargos, 'Cargo')
            adicionarElegibilidade(funcoes, setFuncoes, 'Funcao')
            adicionarElegibilidade(centros_custo, setCentrosCusto, 'Centro de Custo')
            adicionarElegibilidade(sindicatos, setSindicatos, 'Sindicato')
            adicionarElegibilidade(horarios, setHorarios, 'Horario')
            setAtualizado(true)
            setLoading(false)
        } else if (todasAsListasCarregadas) {
            setLoading(false)
        }
    }, [context, filiais, departamentos, secoes, cargos, funcoes, centros_custo, sindicatos, horarios])

    return (
        <ConteudoFrame>
            <Toast ref={toast} />
            <Loading opened={loading} />
            <ConfirmDialog />
            <BotaoGrupo align="end">
                <BotaoGrupo>
                    <Link to="/elegibilidade/configurar">
                        <Botao estilo="vermilion" size="small" tab>
                            <GrAddCircle className={styles.icon} /> Configurar
                        </Botao>
                    </Link>
                </BotaoGrupo>
            </BotaoGrupo>
            <QuestionCard alinhamento="end" element={<AiFillQuestionCircle className="question-icon" size={18} />}>
                <Link to="/elegibilidade/como-funciona" style={{ fontSize: '14px', marginLeft: '8px' }}>
                    Como funciona?
                </Link>
            </QuestionCard>
            <Frame>
                <Container gap="32px">
                    <TabView>
                        <TabPanel header="Filiais">
                            <DataTableFiliaisElegibilidade filiais={filiais} showSearch={false} />
                        </TabPanel>
                        <TabPanel header="Departamentos">
                            <DataTableDepartamentosElegibilidade departamentos={departamentos} showSearch={false} />
                        </TabPanel>
                        <TabPanel header="Seções">
                            <DataTableSecoesElegibilidade secoes={secoes} showSearch={false} />
                        </TabPanel>
                        <TabPanel header="Centros de Custo">
                            <DataTableCentrosCustoElegibilidade centros_custo={centros_custo} showSearch={false} />
                        </TabPanel>
                        <TabPanel header="Cargos">
                            <DataTableCargosElegibilidade cargos={cargos} showSearch={false} />
                        </TabPanel>
                        <TabPanel header="Funções">
                            <DataTableFuncoesElegibilidade funcoes={funcoes} showSearch={false} />
                        </TabPanel>
                        <TabPanel header="Sindicatos">
                            <DataTableSindicatosElegibilidade sindicatos={sindicatos} showSearch={false} />
                        </TabPanel>
                        <TabPanel header="Horários">
                            <DataTableHorariosElegibilidade horarios={horarios} showSearch={false} />
                        </TabPanel>
                    </TabView>
                </Container>
            </Frame>
        </ConteudoFrame>
    )
}

export default ElegibilidadeLista

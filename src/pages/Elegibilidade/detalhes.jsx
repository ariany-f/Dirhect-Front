import styles from './Pedidos.module.css'
import styled from "styled-components"
import { Link, Outlet, useLocation, useParams } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import http from '@http'
import Texto from '@components/Texto'
import Frame from '@components/Frame'
import Titulo from '@components/Titulo'
import Botao from '@components/Botao'
import BadgeGeral from '@components/BadgeGeral'
import { Skeleton } from 'primereact/skeleton'
import Container from "@components/Container"
import { FaArrowAltCircleRight, FaDownload, FaTrash } from 'react-icons/fa'
import BotaoVoltar from "@components/BotaoVoltar"
import Loading from '@components/Loading'
import BotaoGrupo from "@components/BotaoGrupo"
import BotaoSemBorda from "@components/BotaoSemBorda"
import { Toast } from 'primereact/toast'
import DataTableElegibilidadeDetalhes from '@components/DataTableElegibilidadeDetalhes'
import DataTableFiliais from '@components/DataTableFiliais'
import DataTableDepartamentos from '@components/DataTableDepartamentos'
import DataTableSecoes from '@components/DataTableSecoes'
import DataTableCentrosCusto from '@components/DataTableCentrosCusto'
import DataTableCargos from '@components/DataTableCargos'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import elegibilidades from '@json/elegibilidade.json'
import FrameVertical from '@components/FrameVertical'
import { Tag } from 'primereact/tag'
import { TabPanel, TabView } from 'primereact/tabview'

let Real = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`

function DetalhesElegibilidade() {

    let { id } = useParams()
    const [elegibilidade, setElegibilidade] = useState([])
    const toast = useRef(null)
    const [loading, setLoading] = useState(false)
    const [filiais, setFiliais] = useState(null)
    const [departamentos, setDepartamentos] = useState(null)
    const [secoes, setSecoes] = useState(null)
    const [cargos, setCargos] = useState(null)
    const [centros_custo, setCentrosCusto] = useState(null)
    const [sindicatos, setSindicatos] = useState(null)
    const [selectedFiliais, setSelectedFiliais] = useState([])
    const [selectedDepartamentos, setSelectedDepartamentos] = useState([])
    const [selectedCargos, setSelectedCargos] = useState([])
    const [selectedSecoes, setSelectedSecoes] = useState([])
    const [selectedSindicatos, setSelectedSindicatos] = useState([])
    const [selectedCentrosCusto, setSelectedCentrosCusto] = useState([])
   
    useEffect(() => {
        if(elegibilidade.length == 0)
        {
            let cc = elegibilidades.filter(evento => evento.id == id);
            if(cc.length > 0)
            {
                setElegibilidade(cc[0])
                setSelectedFiliais(cc[0].configuracoes.filiais.lista)
                setSelectedDepartamentos(cc[0].configuracoes.departamentos.lista)
                setSelectedCargos(cc[0].configuracoes.cargos.lista)
                setSelectedSecoes(cc[0].configuracoes.secoes.lista)
                setSelectedSindicatos(cc[0].configuracoes.sindicatos.lista)
            }
        }
    }, [elegibilidade])

    useEffect(() => {
        http.get('filial/?format=json')
            .then(response => {
                setFiliais(response)
            })
            .catch(erro => {
                
            })
            .finally(function() {
                // setLoading(false)
            })

            http.get('departamento/?format=json')
            .then(response => {
                setDepartamentos(response)
            })
            .catch(erro => {
                
            })
            .finally(function() {
                // setLoading(false)
            })

            http.get('secao/?format=json')
            .then(response => {
                setSecoes(response)
            })
            .catch(erro => {
                
            })
            .finally(function() {
                // setLoading(false)
            })

            http.get('cargo/?format=json')
            .then(response => {
                setCargos(response)
            })
            .catch(erro => {
                
            })
            .finally(function() {
                // setLoading(false)
            })

            http.get('centro_custo/?format=json')
            .then(response => {
                setCentrosCusto(response)
                
            })
            .catch(erro => {
                
            })
            .finally(function() {
                // setLoading(false)
            })
    }, [])
    
    function representativSituacaoTemplate() {
        let status = elegibilidade?.status;
        
        switch(elegibilidade?.status)
        {
            case 'Ativo':
                status = <Tag severity="success" value="Ativo"></Tag>;
                break;
            case 'Cancelada':
                status = <Tag severity="danger" value="Cancelada"></Tag>;
                break;
        }
        return status
    }
    
    return (
        <>
        <Frame>
            <Toast ref={toast} />
            <Loading opened={loading} />
            <ConfirmDialog />
            <Container gap="32px">
                <BotaoVoltar linkFixo="/elegibilidade" />
                {elegibilidade && elegibilidade?.nome ?
                    <>
                        <BotaoGrupo align="space-between">
                            <FrameVertical gap="10px">
                                <h3>{elegibilidade.nome}</h3>
                                {representativSituacaoTemplate()}
                            </FrameVertical>
                            <BotaoGrupo align="center">
                                <BotaoSemBorda color="var(--primaria)">
                                    <FaDownload/><Link onClick={() => setModalOpened(true)} className={styles.link}>Importar planilha</Link>
                                </BotaoSemBorda>
                            </BotaoGrupo>
                        </BotaoGrupo>
                        <div className={styles.card_dashboard}>
                            <Texto>Total de Colaboradores</Texto>
                            {elegibilidade?.total_colaboradores ?
                                <Texto weight="800">{elegibilidade?.total_colaboradores}</Texto>
                                : <Skeleton variant="rectangular" width={200} height={25} />
                            }
                        </div>
                    </>
                    : <></>
                }
                
                <DataTableElegibilidadeDetalhes elegibilidade={elegibilidade?.contratos} pagination={false} />
                <TabView>
                    <TabPanel header="Filiais">
                        <DataTableFiliais filiais={filiais} showSearch={false} selected={selectedFiliais} setSelected={setSelectedFiliais} />
                    </TabPanel>
                    <TabPanel header="Departamentos">
                        <DataTableDepartamentos departamentos={departamentos} showSearch={false} selected={selectedDepartamentos} setSelected={setSelectedDepartamentos} />
                    </TabPanel>
                    <TabPanel header="Seções">
                        <DataTableSecoes secoes={secoes} showSearch={false} selected={selectedSecoes} setSelected={setSelectedSecoes} />
                    </TabPanel>
                    <TabPanel header="Centros de Custo">
                        <DataTableCentrosCusto centros_custo={centros_custo} showSearch={false} selected={selectedCentrosCusto} setSelected={setSelectedCentrosCusto} />
                    </TabPanel>
                    <TabPanel header="Cargos e Funções">
                        <DataTableCargos cargos={cargos} showSearch={false} selected={selectedCargos} setSelected={setSelectedCargos} />
                    </TabPanel>
                    <TabPanel header="Sindicatos">
                        <DataTableFiliais filiais={sindicatos} showSearch={false} selected={selectedSindicatos} setSelected={setSelectedSindicatos} />
                    </TabPanel>
                </TabView>
            </Container>
        </Frame>
        </>
    )
}

export default DetalhesElegibilidade
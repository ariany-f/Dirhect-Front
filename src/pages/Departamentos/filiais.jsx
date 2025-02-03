import styles from './Departamento.module.css'
import styled from 'styled-components'
import { useEffect, useState, useRef } from 'react'
import http from '@http'
import DataTableDepartamentos from '@components/DataTableDepartamentos'
import departments from '@json/departments.json'
import CardText from '@components/CardText'
import Botao from '@components/Botao'
import BotaoGrupo from '@components/BotaoGrupo'
import Loading from '@components/Loading'
import { GrAddCircle } from 'react-icons/gr'
import ModalAdicionarDepartamento from '@components/ModalAdicionarDepartamento'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Toast } from 'primereact/toast'
import { useDepartamentoContext } from '../../contexts/Departamento'
import filiais from '@json/filiais.json'
import DataTableFiliais from '../../components/DataTableFiliais'

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`

function FiliaisLista() {

    const [loading, setLoading] = useState(false)
    const [filiais, setFiliais] = useState(null)
    const [modalOpened, setModalOpened] = useState(false)
    const toast = useRef(null)

    useEffect(() => {
         
        if(!filiais) {
            
            http.get('filial/?format=json')
                .then(response => {
                    setFiliais(response)
                })
                .catch(erro => {
                    setLoading(false)
                })
        }    
    }, [filiais])

    return (
        <>
        <ConteudoFrame>
            <Toast ref={toast} />
            <Loading opened={loading} />
            <BotaoGrupo align="space-between">
                <BotaoGrupo>
                    <Link to="/estrutura/filiais">
                        <Botao estilo={'black'} size="small" tab>Filiais</Botao>
                    </Link>
                    <Link to="/estrutura">
                        <Botao estilo={''} size="small" tab>Departamentos</Botao>
                    </Link>
                    <Link to="/estrutura/secoes">
                        <Botao estilo={''} size="small" tab>Seções</Botao>
                    </Link>
                    <Link to="/estrutura/cargos">
                        <Botao estilo={''} size="small" tab>Cargos e Funções</Botao>
                    </Link>
                </BotaoGrupo>
                <Botao aoClicar={() => setModalOpened(true)} estilo="vermilion" size="small" tab><GrAddCircle className={styles.icon}/> Criar uma filial</Botao>
            </BotaoGrupo>
                <CardText>
                    <p className={styles.subtitulo}>Sempre que cadastrar um novo colaborador, você terá a opção de colocá-lo em um departamento, isso facilita na organização e na recarga de benefícios.</p>
                </CardText>
                <DataTableFiliais filiais={filiais} />
        </ConteudoFrame>
        <ModalAdicionarDepartamento aoSalvar={() => true} aoSucesso={toast} aoFechar={() => setModalOpened(false)} opened={modalOpened} />
        </>
    )
}

export default FiliaisLista
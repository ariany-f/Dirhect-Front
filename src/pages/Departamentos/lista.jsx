import styles from './Departamento.module.css'
import styled from 'styled-components'
import { useEffect, useState, useRef } from 'react'
import http from '@http'
import DataTableDepartamentos from '@components/DataTableDepartamentos'
import Botao from '@components/Botao'
import BotaoGrupo from '@components/BotaoGrupo'
import Loading from '@components/Loading'
import { GrAddCircle } from 'react-icons/gr'
import ModalAdicionarDepartamento from '@components/ModalAdicionarDepartamento'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Toast } from 'primereact/toast'
import { useDepartamentoContext } from '../../contexts/Departamento'

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
`

const CardText = styled.div`
    display: flex;
    width: 584px;
    padding: 10px 16px;
    justify-content: center;
    align-items: center;
    gap: 8px;
    border-radius: 8px;
    background: var(--neutro-100);
`

function DepartamentoLista() {

    const [loading, setLoading] = useState(false)
    const [departamentos, setDepartamentos] = useState([])
    const [modalOpened, setModalOpened] = useState(false)
    const location = useLocation()
    const toast = useRef(null)
    const navegar = useNavigate()
    
    const {
        setNome
    } = useDepartamentoContext()


    const adicionarNome = (nome) => {
        setNome(nome)
        navegar('/departamento/adicionar-colaboradores')
    }

    useEffect(() => {
        if(departamentos.length === 0)
        {
            setLoading(true)
            http.get('api/dashboard/department')
                .then(response => {
                    setLoading(false)
                    if(response.data.departments)
                    {
                        setDepartamentos(response.data.departments)
                    }
                })
                .catch(erro => {
                    console.log(erro)
                    setLoading(false)
                })
        }
    }, [departamentos])

    return (
        <>
        <ConteudoFrame>
            <Toast ref={toast} />
            <Loading opened={loading} />
            <BotaoGrupo align="space-between">
                <BotaoGrupo>
                    <Link to="/departamento">
                        <Botao estilo={'black'} size="small" tab>Departamentos</Botao>
                    </Link>
                    {/* <Link to="/departamento/lista/colaboradores-sem-departamento">
                        <Botao estilo={''} size="small" tab>Colaboradores sem departamento</Botao>
                    </Link> */}
                </BotaoGrupo>
                <Botao aoClicar={() => setModalOpened(true)} estilo="vermilion" size="small" tab><GrAddCircle className={styles.icon}/> Criar um departamento</Botao>
            </BotaoGrupo>
                <CardText>
                    <p className={styles.subtitulo}>Sempre que cadastrar um novo colaborador, você terá a opção de colocá-lo em um departamento, isso facilita na organização e na recarga de benefícios.</p>
                </CardText>
                <DataTableDepartamentos departamentos={departamentos} />
        </ConteudoFrame>
        <ModalAdicionarDepartamento aoSalvar={adicionarNome} aoSucesso={toast} aoFechar={() => setModalOpened(false)} opened={modalOpened} />
        </>
    )
}

export default DepartamentoLista
import styles from './Departamento.module.css'
import styled from 'styled-components'
import { useEffect, useState, useRef } from 'react'
import http from '@http'
import DataTableDepartamentos from '@components/DataTableDepartamentos'
import CardText from '@components/CardText'
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
    width: 100%;
`

function DepartamentoLista() {

    const [loading, setLoading] = useState(false)
    const [departamentos, setDepartamentos] = useState(null)
    const [modalOpened, setModalOpened] = useState(false)
    const location = useLocation()
    const toast = useRef(null)
    const navegar = useNavigate()
    
    const {
        setDepartamento,
        setNome,
        setDescription
    } = useDepartamentoContext()


    const adicionarNome = (nome) => {
            setDepartamento()
            setDescription('')
            setNome(nome)
            navegar('/departamento/adicionar-colaboradores')
    }

    useEffect(() => {
        if(!departamentos)
        {
            setLoading(true)
            http.get('api/department/index')
                .then(response => {
                    setLoading(false)
                    if(response.data)
                    {
                        setDepartamentos(response.data)
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
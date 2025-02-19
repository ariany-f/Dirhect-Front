import styles from './Departamento.module.css'
import styled from 'styled-components'
import { useEffect, useState, useRef } from 'react'
import DataTableDepartamentos from '@components/DataTableDepartamentos'
import Botao from '@components/Botao'
import BotaoGrupo from '@components/BotaoGrupo'
import Loading from '@components/Loading'
import { GrAddCircle } from 'react-icons/gr'
import Management from '@assets/Management.svg'
import ModalAdicionarDepartamento from '@components/ModalAdicionarDepartamento'
import { Link, Outlet, useLocation, useNavigate, useOutletContext } from 'react-router-dom'
import { Toast } from 'primereact/toast'
import { useDepartamentoContext } from '../../contexts/Departamento'
import http from '../../http'

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`

const ContainerSemRegistro = styled.div`
    display: flex;
    padding: 96px 12px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 48px;
    width: 100%;
    text-align: center;
    & p {
        margin: 0 auto;
    }

    & h6 {
        width: 60%;
    }
`

function DepartamentoLista() {

    const [loading, setLoading] = useState(false)
    const [departamentos, setDepartamentos] = useState(null)
    const [modalOpened, setModalOpened] = useState(false)
    const location = useLocation()
    const toast = useRef(null)
    const navegar = useNavigate()
    
    const {
        departamento,
        setDepartamento,
        setNome,
        setDescription
    } = useDepartamentoContext()


    const adicionarDepartamento = (nome) => {

        setLoading(true)
        setDepartamento()
        setDescription('')
        setNome(nome)
        const data = {};
        data.nome = nome;

        http.post('departamento/', data)
            .then(response => {
                if(response.id)
                {
                    setModalOpened(false)
                }
            })
            .catch(erro => {
                
            })
            .finally(function() {
                setLoading(false)
            })
    }

    useEffect(() => {
        setLoading(true)
        http.get('departamento/?format=json')
            .then(response => {
                setDepartamentos(response)
            })
            .catch(erro => {
                
            })
            .finally(function() {
                setLoading(false)
            })
    }, [modalOpened])

    return (
        <>
        <ConteudoFrame>
            <Toast ref={toast} />
            <Loading opened={loading} />
            <BotaoGrupo align="space-between">
                <BotaoGrupo>
                    <Link to="/estrutura">
                        <Botao estilo={''} size="small" tab>Filiais</Botao>
                    </Link>
                    <Link to="/estrutura/departamentos">
                        <Botao estilo={'black'} size="small" tab>Departamentos</Botao>
                    </Link>
                    <Link to="/estrutura/secoes">
                        <Botao estilo={''} size="small" tab>Seções</Botao>
                    </Link>
                    <Link to="/estrutura/centros-custo">
                        <Botao estilo={''} size="small" tab>Centros de Custo</Botao>
                    </Link>
                    <Link to="/estrutura/cargos">
                        <Botao estilo={''} size="small" tab>Cargos e Funções</Botao>
                    </Link>
                    <Link to="/estrutura/sindicatos">
                        <Botao estilo={''} size="small" tab>Sindicatos</Botao>
                    </Link>
                </BotaoGrupo>
                <Botao aoClicar={() => setModalOpened(true)} estilo="vermilion" size="small" tab><GrAddCircle className={styles.icon}/> Criar um departamento</Botao>
            </BotaoGrupo>
            {
                departamentos && departamentos.length > 0 ?
                    <DataTableDepartamentos departamentos={departamentos} />
                :
                <ContainerSemRegistro>
                    <section className={styles.container}>
                        <img src={Management} />
                        <h6>Não há departamentos registrados</h6>
                        <p>Aqui você verá todos os departamentos registrados.</p>
                    </section>
                </ContainerSemRegistro>
            }
        </ConteudoFrame>
        <ModalAdicionarDepartamento aoSalvar={adicionarDepartamento} aoSucesso={toast} aoFechar={() => setModalOpened(false)} opened={modalOpened} />
        </>
    )
}

export default DepartamentoLista
import styles from './Departamento.module.css'
import styled from 'styled-components'
import { useEffect, useState, useRef } from 'react'
import DataTableDepartamentos from '@components/DataTableDepartamentos'
import Botao from '@components/Botao'
import BotaoGrupo from '@components/BotaoGrupo'
import Loading from '@components/Loading'
import { GrAddCircle } from 'react-icons/gr'
import Management from '@assets/Management.svg'
import ModalAdicionarSecao from '@components/ModalAdicionarSecao'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Toast } from 'primereact/toast'
import http from '../../http'
import DataTableSecoes from '@components/DataTableSecoes'

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


function SecoesLista() {

    const [loading, setLoading] = useState(false)
    const [secoes, setSecoes] = useState(null)
    const [modalOpened, setModalOpened] = useState(false)
    const toast = useRef(null)
    const navegar = useNavigate()
    

    useEffect(() => {
        setLoading(true)
        http.get('secao/?format=json')
            .then(response => {
                setSecoes(response)
                setLoading(false)
            })
            .catch(erro => {
                setLoading(false)
            })
    }, [modalOpened])

    
    const adicionarSecao = (nome) => {

        setLoading(true)
       
        const data = {};
        data.nome = nome;

        http.post('secao/', data)
            .then(response => {
                if(response.id)
                {
                    setModalOpened(false)
                }
                setLoading(false)
            })
            .catch(erro => {
                setLoading(false)
            })
    }

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
                        <Botao estilo={''} size="small" tab>Departamentos</Botao>
                    </Link>
                    <Link to="/estrutura/secoes">
                        <Botao estilo={'black'} size="small" tab>Seções</Botao>
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
                <Botao aoClicar={() => setModalOpened(true)} estilo="vermilion" size="small" tab><GrAddCircle className={styles.icon}/> Criar uma seção</Botao>
            </BotaoGrupo>
            {
                secoes && secoes.length > 0 ?
                    <DataTableSecoes secoes={secoes} />
                :
                <ContainerSemRegistro>
                    <section className={styles.container}>
                        <img src={Management} />
                        <h6>Não há seções registradas</h6>
                        <p>Aqui você verá todas as seções registradas.</p>
                    </section>
                </ContainerSemRegistro>
            }
        </ConteudoFrame>
        <ModalAdicionarSecao aoSalvar={adicionarSecao} aoSucesso={toast} aoFechar={() => setModalOpened(false)} opened={modalOpened} />
        </>
    )
}

export default SecoesLista
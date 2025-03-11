import styles from './Departamento.module.css'
import styled from 'styled-components'
import { useEffect, useState, useRef } from 'react'
import http from '@http'
import DataTableFuncoes from '@components/DataTableFuncoes'
import Botao from '@components/Botao'
import BotaoGrupo from '@components/BotaoGrupo'
import Loading from '@components/Loading'
import { GrAddCircle } from 'react-icons/gr'
import Management from '@assets/Management.svg'
import ModalAdicionarDepartamento from '@components/ModalAdicionarDepartamento'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Toast } from 'primereact/toast'

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


function FuncoesLista() {

    const [loading, setLoading] = useState(false)
    const [funcoes, setFuncoes] = useState(null)
    const [modalOpened, setModalOpened] = useState(false)
    const toast = useRef(null)
    const navegar = useNavigate()
    

    useEffect(() => {
        if(!funcoes) {
            
            setLoading(true)
            http.get('funcao/?format=json')
                .then(response => {
                    setFuncoes(response)
                    
                })
                .catch(erro => {
                    
                })
                .finally(function() {
                    setLoading(false)
                })
        }    
    }, [funcoes])

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
                        <Botao estilo={''} size="small" tab>Seções</Botao>
                    </Link>
                    <Link to="/estrutura/centros-custo">
                        <Botao estilo={''} size="small" tab>Centros de Custo</Botao>
                    </Link>
                    <Link to="/estrutura/cargos">
                        <Botao estilo={''} size="small" tab>Cargos</Botao>
                    </Link>
                    <Link to="/estrutura/funcoes">
                        <Botao estilo={'black'} size="small" tab>Funções</Botao>
                    </Link>
                    <Link to="/estrutura/sindicatos">
                        <Botao estilo={''} size="small" tab>Sindicatos</Botao>
                    </Link>
                    <Link to="/estrutura/horarios">
                        <Botao estilo={''} size="small" tab>Horários</Botao>
                    </Link>
                </BotaoGrupo>
                <Botao aoClicar={() => setModalOpened(true)} estilo="vermilion" size="small" tab><GrAddCircle className={styles.icon}/> Criar uma função</Botao>
            </BotaoGrupo>
            {
                funcoes && funcoes.length > 0 ?
                    <DataTableFuncoes funcoes={funcoes} />
                :
                <ContainerSemRegistro>
                    <section className={styles.container}>
                        <img src={Management} />
                        <h6>Não há funcoes registrados</h6>
                        <p>Aqui você verá todos os funcoes registrados.</p>
                    </section>
                </ContainerSemRegistro>
            }
        </ConteudoFrame>
        <ModalAdicionarDepartamento aoSalvar={() => true} aoSucesso={toast} aoFechar={() => setModalOpened(false)} opened={modalOpened} />
        </>
    )
}

export default FuncoesLista
import styles from './Departamento.module.css'
import styled from 'styled-components'
import { useEffect, useState, useRef } from 'react'
import http from '@http'
import DataTableCentrosCusto from '@components/DataTableCentrosCusto'
import Botao from '@components/Botao'
import BotaoGrupo from '@components/BotaoGrupo'
import Loading from '@components/Loading'
import { GrAddCircle } from 'react-icons/gr'
import Management from '@assets/Management.svg'
import ModalAdicionarCentroCusto from '@components/ModalAdicionarCentroCusto'
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


function CentrosCustoLista() {

    const [loading, setLoading] = useState(false)
    const [centros_custo, setCentrosCusto] = useState(null)
    const [modalOpened, setModalOpened] = useState(false)
    const toast = useRef(null)
    const navegar = useNavigate()
    
    useEffect(() => {
       
        setLoading(true)
        http.get('centro_custo/?format=json')
            .then(response => {
                setCentrosCusto(response)
                setLoading(false)
            })
            .catch(erro => {
                setLoading(false)
            })
    }, [modalOpened])

    
    const adicionarCentroCusto = (nome, cc_pai) => {

        setLoading(true)
       
        const data = {};
        data.nome = nome;
        data.cc_pai = cc_pai.code;

        http.post('centro_custo/', data)
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
                        <Botao estilo={''} size="small" tab>Seções</Botao>
                    </Link>
                    <Link to="/estrutura/centros-custo">
                        <Botao estilo={'black'} size="small" tab>Centros de Custo</Botao>
                    </Link>
                    <Link to="/estrutura/cargos">
                        <Botao estilo={''} size="small" tab>Cargos e Funções</Botao>
                    </Link>
                    <Link to="/estrutura/sindicatos">
                        <Botao estilo={''} size="small" tab>Sindicatos</Botao>
                    </Link>
                </BotaoGrupo>
                <Botao aoClicar={() => setModalOpened(true)} estilo="vermilion" size="small" tab><GrAddCircle className={styles.icon}/> Criar um centro de custo</Botao>
            </BotaoGrupo>
            {
                centros_custo && centros_custo.length > 0 ?
                    <DataTableCentrosCusto centros_custo={centros_custo} />
                :
                <ContainerSemRegistro>
                    <section className={styles.container}>
                        <img src={Management} />
                        <h6>Não há centros de custo registrados</h6>
                        <p>Aqui você verá todos os centros de custo registrados.</p>
                    </section>
                </ContainerSemRegistro>
            }
        </ConteudoFrame>
        <ModalAdicionarCentroCusto aoSalvar={adicionarCentroCusto} aoSucesso={toast} aoFechar={() => setModalOpened(false)} centros_custo={centros_custo} opened={modalOpened} />
        </>
    )
}

export default CentrosCustoLista
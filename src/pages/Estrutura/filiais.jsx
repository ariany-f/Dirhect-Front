import styles from '@pages/Estrutura/Departamento.module.css'
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
import Management from '@assets/Management.svg'
import ModalAdicionarFilial from '@components/ModalAdicionarFilial'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Toast } from 'primereact/toast'
import DataTableFiliais from '@components/DataTableFiliais'

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


function FiliaisLista() {

    const [loading, setLoading] = useState(false)
    const [filiais, setFiliais] = useState(null)
    const [modalOpened, setModalOpened] = useState(false)
    const toast = useRef(null)

    useEffect(() => {
        setLoading(true)
        http.get('filial/?format=json')
            .then(response => {
                setFiliais(response)
            })
            .catch(erro => {
                
            })
            .finally(function() {
                setLoading(false)
            })
    }, [modalOpened])

    const removerMascaraCNPJ = (cnpj) => {
        return cnpj.replace(/[^\d]/g, ''); // Remove tudo que não for número
    }
    
    const adicionarFilial = (nome, cnpj) => {

        setLoading(true)
       
        const data = {};
        data.nome = nome;
        data.cnpj = removerMascaraCNPJ(cnpj);

        http.post('filial/', data)
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

    return (
        <>
        <ConteudoFrame>
            <Toast ref={toast} />
            <Loading opened={loading} />
            <BotaoGrupo align="space-between">
                <BotaoGrupo>
                    <Link to="/estrutura">
                        <Botao estilo={'black'} size="small" tab>Filiais</Botao>
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
                        <Botao estilo={''} size="small" tab>Funções</Botao>
                    </Link>
                    <Link to="/estrutura/sindicatos">
                        <Botao estilo={''} size="small" tab>Sindicatos</Botao>
                    </Link>
                    <Link to="/estrutura/horarios">
                        <Botao estilo={''} size="small" tab>Horários</Botao>
                    </Link>
                </BotaoGrupo>
                <Botao aoClicar={() => setModalOpened(true)} estilo="vermilion" size="small" tab><GrAddCircle className={styles.icon}/> Criar uma filial</Botao>
            </BotaoGrupo>
            
            {
                filiais && filiais.length > 0 ?
                <DataTableFiliais filiais={filiais} />
                :
                <ContainerSemRegistro>
                    <section className={styles.container}>
                        <img src={Management} />
                        <h6>Não há filiais registradas</h6>
                        <p>Aqui você verá todas as filiais registradas.</p>
                    </section>
                </ContainerSemRegistro>
            }
        </ConteudoFrame>
        <ModalAdicionarFilial aoSalvar={adicionarFilial} aoSucesso={toast} aoFechar={() => setModalOpened(false)} opened={modalOpened} />
        </>
    )
}

export default FiliaisLista
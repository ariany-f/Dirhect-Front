import styles from './Departamento.module.css'
import styled from 'styled-components'
import { useEffect, useState, useRef } from 'react'
import http from '@http'
import Botao from '@components/Botao'
import BotaoGrupo from '@components/BotaoGrupo'
import Loading from '@components/Loading'
import { GrAddCircle } from 'react-icons/gr'
import Management from '@assets/Management.svg'
import ModalAdicionarSindicato from '@components/ModalAdicionarSindicato'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Toast } from 'primereact/toast'
import DataTableSindicatos from '@components/DataTableSindicatos'

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


function SindicatosLista() {

    const [loading, setLoading] = useState(false)
    const [sindicatos, setSindicatos] = useState(null)
    const [modalOpened, setModalOpened] = useState(false)
    const toast = useRef(null)

    useEffect(() => {
         
        if(!sindicatos) {
            
            setLoading(true)
            http.get('sindicato/?format=json')
                .then(response => {
                    setSindicatos(response)
                    setLoading(false)
                })
                .catch(erro => {
                    setLoading(false)
                })
        }    
    }, [sindicatos])

    const adicionarSindicato = (cnpj, codigo, descricao) => {

        setLoading(true)
       
        const data = {};
        data.cnpj = cnpj;
        data.codigo = codigo;
        data.descricao = descricao;

        http.post('sindicato/', data)
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
                        <Botao estilo={''} size="small" tab>Cargos e Funções</Botao>
                    </Link>
                    <Link to="/estrutura/sindicatos">
                        <Botao estilo={'black'} size="small" tab>Sindicatos</Botao>
                    </Link>
                    <Link to="/estrutura/horarios">
                        <Botao estilo={''} size="small" tab>Horários</Botao>
                    </Link>
                </BotaoGrupo>
                <Botao aoClicar={() => setModalOpened(true)} estilo="vermilion" size="small" tab><GrAddCircle className={styles.icon}/> Criar um sindicato</Botao>
            </BotaoGrupo>
            
            {
                sindicatos && sindicatos.length > 0 ?
                <DataTableSindicatos sindicatos={sindicatos} />
                :
                <ContainerSemRegistro>
                    <section className={styles.container}>
                        <img src={Management} />
                        <h6>Não há sindicatos registradas</h6>
                        <p>Aqui você verá todas as sindicatos registradas.</p>
                    </section>
                </ContainerSemRegistro>
            }
        </ConteudoFrame>
        <ModalAdicionarSindicato aoSalvar={adicionarSindicato} aoSucesso={toast} aoFechar={() => setModalOpened(false)} opened={modalOpened} />
        </>
    )
}

export default SindicatosLista
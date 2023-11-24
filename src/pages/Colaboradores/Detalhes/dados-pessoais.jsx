import { useEffect, useState } from "react"
import http from '@http'
import Texto from '@components/Texto'
import Frame from '@components/Frame'
import Titulo from '@components/Titulo'
import ContainerHorizontal from '@components/ContainerHorizontal'
import { Link, useParams } from "react-router-dom"
import { Skeleton } from 'primereact/skeleton'
import styles from './Detalhes.module.css'
import styled from "styled-components"
import { RiEditBoxFill } from 'react-icons/ri';

const AlterarBotao = styled.div`
    display: flex;
    font-family: var(--secundaria);
    font-size: 14px;
    font-weight: 700;
    gap: 8px;
    & svg * {
        fill: var(--primaria);
    }
`

function ColaboradorDadosPessoais() {

    let { id } = useParams()
    const [colaborador, setColaborador] = useState({})

    useEffect(() => {
        http.get(`api/dashboard/collaborator/${id}`)
            .then(response => {
                if (response.collaborator) {
                    setColaborador(response.collaborator)
                }
            })
            .catch(erro => console.log(erro))
    }, [])


    function formataCPF(cpf) {
        cpf = cpf.replace(/[^\d]/g, "");
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }

    return (
        <>
            <Titulo><h6>Informações gerais</h6></Titulo>

            <div className={styles.card_dashboard}>
                <Texto>Nome completo</Texto>
                {colaborador.name ?
                    <Texto weight="800">{colaborador?.name}</Texto>
                    : <Skeleton variant="rectangular" width={200} height={25} />
                }
                <Texto>Nome social</Texto>
                {colaborador.name ?
                    <Texto weight="800">{colaborador?.name}</Texto>
                    : <Skeleton variant="rectangular" width={200} height={25} />
                }
                <Texto>CPF</Texto>
                {colaborador.document ?
                    <Texto weight="800">{formataCPF(colaborador?.document)}</Texto>
                    : <Skeleton variant="rectangular" width={200} height={25} />
                }
            </div>
            <Titulo><h6>Informações de contato</h6></Titulo>

            <div className={styles.card_dashboard}>
                <ContainerHorizontal width="50%">
                    <Frame gap="5px">
                        <Texto>Telefone/Celular</Texto>
                        {colaborador.phone_number ?
                            <Texto weight="800">{colaborador?.phone_number}</Texto>
                            : <Skeleton variant="rectangular" width={200} height={25} />
                        }
                    </Frame>
                    <AlterarBotao>
                        <RiEditBoxFill size={18} />
                        <Link className={styles.link}>Alterar</Link>
                    </AlterarBotao>
                </ContainerHorizontal>
                <ContainerHorizontal width="50%">
                    <Frame gap="5px">
                        <Texto>E-mail</Texto>
                        {colaborador.email ?
                            <Texto weight="800">{colaborador?.email}</Texto>
                            : <Skeleton variant="rectangular" width={200} height={25} />
                        }
                    </Frame>
                    <AlterarBotao>
                        <RiEditBoxFill size={18} />
                        <Link className={styles.link}>Alterar</Link>
                    </AlterarBotao>
                </ContainerHorizontal>
            </div>
        </>
    )
}

export default ColaboradorDadosPessoais
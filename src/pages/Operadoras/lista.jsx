import { useEffect, useState } from "react"
import styles from './Operadoras.module.css'
import styled from "styled-components"
import { Link, useOutletContext } from "react-router-dom"
import Management from '@assets/Management.svg'
import { GrAddCircle } from 'react-icons/gr'
import Botao from '@components/Botao'
import http from "@http"
import BotaoGrupo from '@components/BotaoGrupo'
import DataTableOperadoras from '@components/DataTableOperadoras'
import ModalOperadoras from "../../components/ModalOperadoras"

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

function OperadorasListagem() {

    const [operadoras, setOperadoras] = useState(null)
    const context = useOutletContext()
    const [modalOpened, setModalOpened] = useState(false)

    
    useEffect(() => {
        if(context)
        {
            setOperadoras(context)
        }
    }, [context])

    
    const adicionarOperadora = (nome) => {

        const data = {};
        data.nome = nome;

        http.post('operadora/', data)
            .then(response => {
                if(response.id)
                {
                    context.push(response)
                    setModalOpened(false)
                }
            })
            .catch(erro => {
                
            })
            .finally(function() {
                
            })
    }
    
    return (
        <ConteudoFrame>
            
            <BotaoGrupo align="end">
                <BotaoGrupo>
                    <Botao aoClicar={() => setModalOpened(true)} estilo="vermilion" size="small" tab><GrAddCircle className={styles.icon}/> Adicionar Operadora</Botao>
                </BotaoGrupo>
            </BotaoGrupo>
            {
                operadoras ?
                <DataTableOperadoras operadoras={operadoras} />
                :
                <ContainerSemRegistro>
                <section className={styles.container}>
                        <img src={Management} />
                        <h6>Não há operadoras registrados</h6>
                        <p>Aqui você verá todos os operadoras registradas.</p>
                    </section>
                </ContainerSemRegistro>
            }

            <ModalOperadoras opened={modalOpened} aoFechar={() => setModalOpened(false)} aoSalvar={adicionarOperadora} />
        </ConteudoFrame>
    )
}

export default OperadorasListagem
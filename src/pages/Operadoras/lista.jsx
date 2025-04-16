import { useEffect, useRef, useState } from "react"
import styles from './Operadoras.module.css'
import styled from "styled-components"
import { Link, useOutletContext } from "react-router-dom"
import Management from '@assets/Management.svg'
import { GrAddCircle } from 'react-icons/gr'
import Botao from '@components/Botao'
import { Toast } from 'primereact/toast'
import http from "@http"
import axios from 'axios';
import BotaoGrupo from '@components/BotaoGrupo'
import Container from '@components/Container'
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
    const toast = useRef(null)
    
    useEffect(() => {
        if(context)
        {
            setOperadoras(context)
        }
    }, [context])

    
    const adicionarOperadora = async (operadora) => {
        const formData = new FormData();

        // Adiciona o nome normalmente
        formData.append('nome', operadora.nome);

        // Adiciona o arquivo de imagem
        formData.append('imagem', operadora.imagem); // operadora.imagem deve ser do tipo File

        const API_BASE_DOMAIN = import.meta.env.VITE_API_BASE_DOMAIN || "dirhect.net"; // Para Vite
        const PROTOCOL = import.meta.env.MODE === 'development' ? 'http' : 'https';
        const companyDomain = sessionStorage.getItem("company_domain") || 'geral';
        const baseUrl = `${PROTOCOL}://${companyDomain}.${API_BASE_DOMAIN}/api/`;            
        const response = await axios.post(`${baseUrl}operadora/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        if(response?.data.id)
        {
            context.push(response?.data)
            setModalOpened(false)
            toast.current.show({
                message: 'Operadora adicionada com sucesso!',
                type: 'success',
            });
            return true;
        }
        else
        {
            toast.current.show({
                message: 'Erro ao adicionar operadora!',
                type: 'error',
            });
            return false;
        }
    }
    
    return (
        <ConteudoFrame>
            <Toast ref={toast} />
            <BotaoGrupo align="end">
                <BotaoGrupo>
                    <Botao aoClicar={() => setModalOpened(true)} estilo="vermilion" size="small" tab><GrAddCircle className={styles.icon}/> Adicionar Operadora</Botao>
                </BotaoGrupo>
            </BotaoGrupo>
            {
                operadoras ?
                <Container>
                    <DataTableOperadoras search={false} operadoras={operadoras} />
                </Container>
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
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
import DataTableOperadorasDetalhes from '@components/DataTableOperadorasDetalhes'
import ModalBeneficios from '@components/ModalBeneficios'

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

const Col12 = styled.div`
    display: flex;
    gap: 6px;
    justify-content: space-between;
    margin-top: 24px;
`;

const Col4 = styled.div`
    width: ${(props) => (props.expanded ? "calc(33% - 6px)" : "100%")};
    transition: all 0.3s ease;
    padding: 0px;
`;

const Col7 = styled.div`
    width: ${(props) => (props.expanded ? "calc(66% - 6px)" : "100%")};
    transition: all 0.3s ease;
    padding: 0px;
`;

function OperadorasListagem() {

    const [operadoras, setOperadoras] = useState(null)
    const context = useOutletContext()
    const [modalOpened, setModalOpened] = useState(false)
    const [modalBeneficioOpened, setModalBeneficioOpened] = useState(false)
    const toast = useRef(null)
    const [selectedOperadora, setSelectedOperadora] = useState(null)
    const [beneficios, setBeneficios] = useState(null)
    
    useEffect(() => {
        if(context)
        {
            setOperadoras(context)
        }
    }, [context])

    useEffect(() => {
        if (selectedOperadora) {
            http.get(`operadora/${selectedOperadora.id}/?format=json`)
                .then(response => {
                    setBeneficios(response.beneficios_vinculados)
                })
                .catch(erro => {
                    console.error('Erro ao carregar benefícios:', erro)
                })
        }
    }, [selectedOperadora])
    
    const adicionarOperadora = async (operadora) => {
        const formData = new FormData();

        formData.append('nome', operadora.nome);
        formData.append('imagem', operadora.imagem);

        const API_BASE_DOMAIN = import.meta.env.VITE_API_BASE_DOMAIN || "dirhect.net";
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

    const adicionarBeneficio = () => {
        setModalBeneficioOpened(true)
    }

    const handleSalvarBeneficio = async (dadosBeneficio) => {
        try {
            const response = await http.post('beneficio/', {
                ...dadosBeneficio,
                operadora: selectedOperadora.id
            })
            
            if (response) {
                // Atualiza a lista de benefícios
                const updatedBeneficios = [...beneficios, response]
                setBeneficios(updatedBeneficios)
                
                toast.current.show({
                    message: 'Benefício adicionado com sucesso!',
                    type: 'success',
                })
            }
        } catch (error) {
            console.error('Erro ao adicionar benefício:', error)
            toast.current.show({
                message: 'Erro ao adicionar benefício!',
                type: 'error',
            })
        } finally {
            setModalBeneficioOpened(false)
        }
    }
    
    return (
        <ConteudoFrame>
            <Toast ref={toast} />
            <BotaoGrupo align="end">
                <BotaoGrupo>
                    <Botao aoClicar={() => setModalOpened(true)} estilo="neutro" size="small" tab>
                        <GrAddCircle fill="black" color="black"/> Adicionar Operadora
                    </Botao>
                </BotaoGrupo>
            </BotaoGrupo>
            {
                operadoras ?
                <Col12>
                    <Col4 expanded={selectedOperadora}>
                        <DataTableOperadoras 
                            search={false} 
                            operadoras={operadoras} 
                            onSelectionChange={setSelectedOperadora}
                        />
                    </Col4>
                    {selectedOperadora && beneficios ? 
                        <Col7 expanded={selectedOperadora}>
                            <DataTableOperadorasDetalhes 
                                beneficios={beneficios} 
                                onAddBeneficio={adicionarBeneficio}
                                operadora={selectedOperadora}
                            />
                        </Col7>
                    : null}
                </Col12>
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
            <ModalBeneficios 
                opened={modalBeneficioOpened} 
                aoFechar={() => setModalBeneficioOpened(false)} 
                aoSalvar={handleSalvarBeneficio} 
            />
        </ConteudoFrame>
    )
}

export default OperadorasListagem
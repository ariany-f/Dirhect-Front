import Botao from "@components/Botao"
import Frame from "@components/Frame"
import Titulo from "@components/Titulo"
import Texto from "@components/Texto"
import SubTitulo from "@components/SubTitulo"
import { useState, useEffect } from "react"
import styles from './Registro.module.css'
import Loading from "@components/Loading"
import styled from "styled-components"
import { MdOutlineChevronRight } from 'react-icons/md'
import { Link, useNavigate } from "react-router-dom"
import { useColaboradorContext } from "../../../contexts/Colaborador"
import Mastercard from '@assets/Mastercard.svg'
import Elo from '@assets/Elo.svg'
 
const ContainerButton = styled.div`
    display: flex;
    width: 100%;
    padding: 20px;
    justify-content: space-between;
    & button {
        width: initial;
    }
`

const CardLine = styled.div`
    padding: 16px 6px;
    border-bottom: 1px solid var(--neutro-200);
    width: 100%;
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: space-between;
    &:nth-child(1) {
        padding-top: 8px;
    }
    &:last-of-type {
        border-bottom: none;
        padding-bottom: 8px;
    }
    & svg * {
        color: var(--primaria)
    }
`

function ColaboradorBandeiraCartao() {

    const navegar = useNavigate()
    const [classError, setClassError] = useState([])
    const [loading, setLoading] = useState(false)
    const [selectedBrand, setSelectedBrand] = useState(1)

    const { 
        colaborador,
        submeterUsuario,
        setBrandCardEnum,
    } = useColaboradorContext()
    
    const sendData = (evento) => {
        evento.preventDefault()

        document.querySelectorAll('input').forEach(function(element, index) {
            
            if(element.value !== '' && (!element.classList.contains('not_required')))
            {
                if(classError.includes(element.name))
                {
                    setClassError(classError.filter(item => item !== element.name))
                }
            }
            else
            {
                if(!classError.includes(element.name))
                {
                    setClassError(estadoAnterior => [...estadoAnterior, element.name])
                }
            }
        })

        if(document.querySelectorAll("form .error").length === 0)
        {
            setLoading(true)
            submeterUsuario().then(response => {
                if(response.success)
                {
                    navegar('/colaborador/registro/sucesso')
                }
            }).catch((erro) => {
                toast.current.show({ severity: 'error', summary: 'Erro', detail: erro.message })
                setLoading(false)
            })
        }
    }

    function handleChange(valor)
    {
        setSelectedBrand(valor)
        setBrandCardEnum(valor)
    }

    return (
        <form>
            <Loading opened={loading} />
            <Frame estilo="spaced">
                <Titulo>
                    <h6>Bandeira do cartão</h6>
                    <SubTitulo>
                        Escolha uma bandeira para o cartão do seu colaborador:
                    </SubTitulo>
                </Titulo>
            </Frame>
            <Frame estilo="spaced">
                <div className={styles.card_dashboard}>
                    <CardLine>
                        <Texto aoClicar={() => handleChange(1)} weight="800">
                            <div className={styles.listaVantagens}>
                                <div className={styles.brand}>
                                    <img src={Elo} />
                                    &nbsp;Elo
                                    <div className={styles.badge}>
                                        <p>Recomendado</p>
                                    </div>
                                </div>
                                <ul>
                                    <li>90% nas principais plataformas de ensino</li>
                                    <li>75% de desconto em diversas drogarias</li>
                                    <li>Pague meia entrada em toda rede Cinemark</li>
                                    <li>Pré-vendas de shows</li>
                                </ul>
                            </div>
                        </Texto>
                        <Link onClick={sendData}>
                            <MdOutlineChevronRight size={20} />
                        </Link>
                    </CardLine>
                    
                    <CardLine>
                        <Texto aoClicar={() => handleChange(2)} weight="800">
                            <div className={styles.listaVantagens}>
                                <div className={styles.brand}>
                                    <img src={Mastercard} />
                                    &nbsp;Mastercard
                                </div>
                                <ul>
                                    <li>Aceito em mais de 4 milhões de estabelecimentos</li>
                                    <li>Mastercard Surpreenda</li>
                                    <li>Mastercard Global Service</li>
                                </ul>
                            </div>
                        </Texto>
                        <Link onClick={sendData}>
                            <MdOutlineChevronRight size={20} />
                        </Link>
                        
                    </CardLine>
                </div>
            
            </Frame>
            <ContainerButton>
                <Botao aoClicar={() => navegar('/colaborador/registro')} estilo="neutro" formMethod="dialog" size="medium" filled>Voltar</Botao>
            </ContainerButton>
        </form>
    )
}

export default ColaboradorBandeiraCartao
import { useRecargaSaldoLivreContext } from "@contexts/RecargaSaldoLivre"
import http from '@http'
import { useEffect, useRef, useState } from "react"
import { Link, useNavigate, useParams } from 'react-router-dom'
import Botao from "@components/Botao"
import Frame from "@components/Frame"
import Texto from "@components/Texto"
import CampoTexto from "@components/CampoTexto"
import Titulo from "@components/Titulo"
import './SelecionarFiliais.css'
import { Toast } from 'primereact/toast'
import styled from 'styled-components'
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import ContainerHorizontal from '@components/ContainerHorizontal'
import BotaoSemBorda from '@components/BotaoSemBorda'
import { FaPencilAlt, FaUser } from 'react-icons/fa'
import { HiArrowLeft, HiArrowRight, HiUserGroup } from 'react-icons/hi'

const ContainerButton = styled.div`
    display: flex;
    width: 100%;
    padding: 20px;
    justify-content: space-between;
    & button {
        width: initial;
    }
`

const LadoALado = styled.div`
    display: flex;
    gap: 24px;
    & span {
        display: flex;
        align-items: center;
    }
`

const CardText = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 10px 16px;
    justify-content: center;
    align-items: center;
    gap: 8px;
    border-radius: 8px;
    border:  ${ props => props.$border ?  props.$border : 'none'};
    background: ${ props => props.$background ?  props.$background : 'var(--neutro-100)'};
`

const Col12 = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
`

const Col6 = styled.div`
    padding: 10px;
    flex: 1 1 50%;
    display: flex;
`

const CardSelecao = styled.div`
    border: 1px solid var(--neutro-200);
    border-radius: 16px;
    padding: 20px;
    gap: 5vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`

function ElegibilidadeConfigurar() {

    const navegar = useNavigate()
    const [classError, setClassError] = useState([])
    const toast = useRef(null)
    const stepperRef = useRef(null);
    
    const {
        recarga,
        setNome
    } = useRecargaSaldoLivreContext()
    
    return (
        <>
            <Frame>
                <Toast ref={toast} />
                <div className="card flex justify-content-center">
                    <Stepper headerPosition="top" ref={stepperRef} style={{ flexBasis: '50rem' }}>
                        <StepperPanel>
                            <Titulo>
                                <h6>Escolha como quer configurar elegibilidade</h6>
                            </Titulo>
                            <Col12>
                                <Col6>
                                    <CardSelecao>
                                        <Frame>
                                            <ContainerHorizontal gap={'16px'}>
                                                <FaUser size={20} />
                                                <Texto weight={700}>Filial</Texto>
                                            </ContainerHorizontal>
                                            <Frame alinhamento="center">
                                                <ul style={{padding: '20px', textAlign: 'left', fontSize: '14px'}}>
                                                    <li>
                                                        Essa opção você selecionara cada filial e pode configurar o valor dos benefícios um a um ou selecionando todos
                                                    </li>
                                                </ul>
                                            </Frame>
                                        </Frame>
                                        <Botao aoClicar={() => navegar('/elegibilidade/selecao-filiais')} size="medium">Configurar elegibilidade por filial</Botao>
                                    </CardSelecao>
                                </Col6>
                                <Col6>
                                    <CardSelecao>
                                        <Frame>
                                            <ContainerHorizontal gap={'16px'}>
                                                <HiUserGroup size={28} />
                                                <Texto weight={700}>Departamento</Texto>
                                            </ContainerHorizontal>
                                            <Frame alinhamento="center">
                                                <ul style={{padding: '20px', textAlign: 'left', fontSize: '14px'}}>
                                                    <li>
                                                        Essa opção você selecionara o departamento e configura o valor para todos os colaboradores do departamento selecionando.
                                                    </li>
                                                    <li>
                                                        Caso já tenha configurado os valores dos benefícios anteriormente dentro da área do departamento.
                                                    </li>
                                                </ul>
                                            </Frame>
                                        </Frame>
                                        <Botao aoClicar={() => navegar('/elegibilidade/selecao-departamentos')} size="medium">Configurar elegibilidade por departamento</Botao>
                                    </CardSelecao>
                                </Col6>
                            </Col12>
                        </StepperPanel>
                    </Stepper>
                </div>
            </Frame>
        </>
    )
}

export default ElegibilidadeConfigurar


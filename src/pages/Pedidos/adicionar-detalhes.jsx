import { useRecargaSaldoLivreContext } from "@contexts/RecargaSaldoLivre"
import http from '@http'
import { useEffect, useRef, useState } from "react"
import { Link, useNavigate, useParams } from 'react-router-dom'
import Botao from "@components/Botao"
import Frame from "@components/Frame"
import Texto from "@components/Texto"
import CampoTexto from "@components/CampoTexto"
import Titulo from "@components/Titulo"
import './SelecionarColaboradores.css'
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

function PedidoAdicionarDetalhes() {

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
                                <h5>Detalhes da recarga</h5>
                            </Titulo>
                            <br/>
                            <CampoTexto camposVazios={classError} valor={recarga.name} setValor={setNome} numeroCaracteres={50} placeholder='ex. Pagamento de Janeiro' label='Nome do Pedido' />
                            <CardText>
                                <p>Os pagamentos feitos como prêmios devem aderir aos parâmetros definidos no artigo 457 da CLT e na Solução de Consulta COSIT nº 151/2019, com a devida atenção à retenção do Imposto de Renda.</p>
                            </CardText>
                            <CardText $border={'1px solid var(--neutro-200)'} $background={'var(--neutro-50)'}>
                                <Texto weight={700}>Para seus colaboradores</Texto>
                                <p>Os seus colaboradores podem utilizar esse saldo livre nas compras em qualquer estabelecimento que aceite bandeira Mastercard utilizando a função crédito à vista.</p>
                            </CardText>
                            <Frame padding="30px" alinhamento="end">
                                <Botao label="Next" iconPos="right" aoClicar={() => {recarga.name ? stepperRef.current.nextCallback() : toast.current.show({severity: 'info', detail: 'Preencha o nome do Pedido', life: 15000})}}><HiArrowRight fill="var(--secundaria)"/> Continuar</Botao>
                            </Frame>
                        </StepperPanel>
                        <StepperPanel>
                            <Titulo>
                                <h6>Escolha como quer recarregar os benefícios</h6>
                            </Titulo>
                            <Col12>
                                <Col6>
                                    <CardSelecao>
                                        <Frame>
                                            <ContainerHorizontal gap={'16px'}>
                                                <FaUser size={20} />
                                                <Texto weight={700}>Individualmente</Texto>
                                            </ContainerHorizontal>
                                            <Frame alinhamento="center">
                                                <ul style={{padding: '20px', textAlign: 'left', fontSize: '14px'}}>
                                                    <li>
                                                        Essa opção você selecionara cada colaborador e pode configurar o valor dos benefícios um a um ou selecionando todos
                                                    </li>
                                                </ul>
                                            </Frame>
                                        </Frame>
                                        <Botao aoClicar={() => navegar('/pedidos/selecao-colaboradores')} size="medium">Recarregar por colaborador</Botao>
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
                                            <BotaoSemBorda>
                                                <FaPencilAlt />
                                                <Link to={'/estrutura'}>Configurar meus departamentos</Link>
                                            </BotaoSemBorda>
                                        </Frame>
                                        <Botao aoClicar={() => navegar('/pedidos/selecao-departamentos')} size="medium">Recarregar por departamento</Botao>
                                    </CardSelecao>
                                </Col6>
                            </Col12>
                            <Frame padding="30px" estilo="spaced">
                                <Botao estilo="neutro" aoClicar={() => stepperRef.current.prevCallback()}><HiArrowLeft/> Voltar</Botao>
                                {/* <Botao label="Next" iconPos="right" aoClicar={() => stepperRef.current.nextCallback()}><HiArrowRight fill="var(--secundaria)"/> Continuar</Botao> */}
                            </Frame>
                        </StepperPanel>
                    </Stepper>
                </div>
            </Frame>
        </>
    )
}

export default PedidoAdicionarDetalhes


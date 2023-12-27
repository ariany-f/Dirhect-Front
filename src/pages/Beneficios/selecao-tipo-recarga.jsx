import Titulo from '@components/Titulo'
import Texto from '@components/Texto'
import ContainerHorizontal from '@components/ContainerHorizontal'
import BotaoSemBorda from '@components/BotaoSemBorda'
import Frame from '@components/Frame'
import Botao from '@components/Botao'
import styled from 'styled-components'
import { FaPencilAlt, FaUser } from 'react-icons/fa'
import { HiUserGroup } from 'react-icons/hi'
import { Link } from 'react-router-dom'

const Col12 = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
`

const Col6 = styled.div`
    padding: 10px;
    width: 455px;
`

const CardSelecao = styled.div`
    border: 1px solid var(--neutro-200);
    border-radius: 16px;
    padding: 20px;
    gap: 24px;
    display: flex;
    flex-direction: column;
`

function BeneficioSelecionarTipoRecarga() {
   
    return (
       <>
            <Titulo>
                <h6>Escolha como quer recarregar os benefícios</h6>
            </Titulo>
            <Col12>
                <Col6>
                    <CardSelecao>
                        <ContainerHorizontal>
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
                        <Botao size="small">Recarregar por colaborador</Botao>
                    </CardSelecao>
                </Col6>
                <Col6>
                    <CardSelecao>
                        <ContainerHorizontal>
                            <HiUserGroup size={20} />
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
                            <Link to={'/departamento'}>Configurar meus departamentos</Link>
                        </BotaoSemBorda>
                        <Botao size="small">Recarregar por departamento</Botao>
                    </CardSelecao>
                </Col6>
            </Col12>
       </>
    )
}

export default BeneficioSelecionarTipoRecarga
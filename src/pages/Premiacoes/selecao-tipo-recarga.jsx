import Titulo from '@components/Titulo'
import Texto from '@components/Texto'
import ContainerHorizontal from '@components/ContainerHorizontal'
import BotaoSemBorda from '@components/BotaoSemBorda'
import Frame from '@components/Frame'
import Botao from '@components/Botao'
import styled from 'styled-components'
import { FaPencilAlt, FaUser } from 'react-icons/fa'
import { HiUserGroup } from 'react-icons/hi'
import { Link, useNavigate } from 'react-router-dom'

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

function PremiacaoSelecionarTipoRecarga() {

    const navegar = useNavigate()
   
    return (
       <>
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
                        <Botao aoClicar={() => navegar('/saldo-livre/selecao-colaboradores')} size="medium">Recarregar por colaborador</Botao>
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
                                <Link to={'/departamento'}>Configurar meus departamentos</Link>
                            </BotaoSemBorda>
                        </Frame>
                        <Botao aoClicar={() => navegar('/saldo-livre/selecao-departamentos')} size="medium">Recarregar por departamento</Botao>
                    </CardSelecao>
                </Col6>
            </Col12>
       </>
    )
}

export default PremiacaoSelecionarTipoRecarga
import CampoTexto from "@components/CampoTexto"
import Titulo from "@components/Titulo"
import SubTitulo from "@components/SubTitulo"
import Botao from "@components/Botao"
import { useState } from "react";
import styled from "styled-components"
import { useNavigate,useParams } from "react-router-dom";
        
const Col12 = styled.div`
    display: flex;
    flex-wrap: wrap;
`;

const Col6 = styled.div`
    flex: 1 1 50%;
    padding: 20px;
`;

const ContainerButton = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
    & button {
        width: initial;
    }
`

function AdicionarEmail() {

    let { id } = useParams()
    const [classError, setClassError] = useState([])
    const [email, setEmail] = useState('')

    const navigate = useNavigate();

    return (
       <>
            <Titulo>
                <h6>E-mail corporativo</h6>
                <SubTitulo>Digite o e-mail corporativo:</SubTitulo>
            </Titulo>
            <Col12>
                <Col6>
                    <CampoTexto 
                        camposVazios={classError} 
                        name="email" 
                        valor={email} 
                        setValor={setEmail} 
                        type="email" 
                        label="E-mail corporativo" 
                        placeholder="Digite o e-mail" />
                </Col6>
            </Col12>
            <ContainerButton>
                <Botao aoClicar={() => navigate(-1)} estilo="neutro" formMethod="dialog" size="medium" filled>Voltar</Botao>
                <Botao estilo="vermilion" size="medium" filled>Continuar</Botao>
            </ContainerButton>
       </>
    )
}

export default AdicionarEmail
import CampoTexto from "@components/CampoTexto"
import Titulo from "@components/Titulo"
import SubTitulo from "@components/SubTitulo"
import Botao from "@components/Botao"
import { useState } from "react";
import styled from "styled-components"
import { useNavigate, useParams } from "react-router-dom"
        
const Col12 = styled.div`
    display: flex;
    flex-wrap: wrap;
`;

const Col6 = styled.div`
    padding: 20px;
    flex: 1 1 50%;
`;

const ContainerButton = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
    & button {
        width: initial;
    }
`

function AdicionarCelular() {

    let { id } = useParams()
    const [classError, setClassError] = useState([])
    const [celular, setCelular] = useState('')

    const navigate = useNavigate();

    return (
       <>
            <Titulo>
                <h6>Celular</h6>
                <SubTitulo>Digite o número do celular:</SubTitulo>
            </Titulo>
            <Col12>
                <Col6>
                    <CampoTexto 
                        camposVazios={classError} 
                        patternMask={['99 9999-9999', '99 99999-9999']} 
                        name="celular" 
                        valor={celular} 
                        setValor={setCelular} 
                        type="text" 
                        label="Celular" 
                        placeholder="Digite o celular" />
                </Col6>
            </Col12>
            <ContainerButton>
                <Botao aoClicar={() => navigate(-1)} estilo="neutro" formMethod="dialog" size="medium" filled>Voltar</Botao>
                <Botao estilo="vermilion" size="medium" filled>Continuar</Botao>
            </ContainerButton>
       </>
    )
}

export default AdicionarCelular
import Botao from "@components/Botao"
import Frame from "@components/Frame"
import SubTitulo from "@components/SubTitulo"
import Titulo from "@components/Titulo"
import BotaoVoltar from "@components/BotaoVoltar"
import { useState } from "react"
import CamposVerificacao from "@components/CamposVerificacao"
import { Link } from "react-router-dom"

function Seguranca() {
    
    const [codigo, setCodigo] = useState([])

    return (
        <>
            <Frame>
                <BotaoVoltar />
                <Titulo>
                    <h2>Segurança</h2>
                    <SubTitulo>
                        Enviamos um código token para o celular e e-mail cadastrados
                    </SubTitulo>
                </Titulo>
            </Frame>
            <Frame>
                <CamposVerificacao valor={codigo} setValor={setCodigo} label="Código de autenticação" />
            </Frame>
            <Link to="/esqueci-a-senha/redefinir">
                <Botao estilo="vermilion" size="medium" filled>Confirmar</Botao>
            </Link>
        </>
    )
}

export default Seguranca
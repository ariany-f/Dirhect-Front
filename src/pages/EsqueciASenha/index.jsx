import Botao from "@components/Botao"
import CampoTexto from "@components/CampoTexto"
import Frame from "@components/Frame"
import SubTitulo from "@components/SubTitulo"
import Titulo from "@components/Titulo"
import BotaoVoltar from "@components/BotaoVoltar"
import { useState } from "react"
import { Link } from "react-router-dom"

function EsqueciASenha() {
    
    const [Cpf, setCpf] = useState('')

    return (
        <>
            <Frame>
                <BotaoVoltar />
                <Titulo>
                    <h2>Esqueceu sua senha?</h2>
                    <SubTitulo>
                    Para recuperar sua senha, precisamos do CPF do responsável da conta corporativa
                    </SubTitulo>
                </Titulo>
            </Frame>
            <Frame>
                <CampoTexto name="cpf" valor={Cpf} setValor={setCpf} label="CPF do responsável" placeholder="Digite o CPF do responsável" />
            </Frame>
            <Link to="/esqueci-a-senha/seguranca">
                <Botao estilo="vermilion" size="medium" filled>Confirmar</Botao>
            </Link>
        </>
    )
}

export default EsqueciASenha
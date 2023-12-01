import Botao from "@components/Botao"
import Frame from "@components/Frame"
import SubTitulo from "@components/SubTitulo"
import Titulo from "@components/Titulo"
import BotaoVoltar from "@components/BotaoVoltar"
import { Link, useNavigate } from "react-router-dom"

function RedefinirSenhaSucesso() {
    
    const navegar = useNavigate()

    return (
        <>
            <Frame>
                <BotaoVoltar />
                <Titulo>
                    <h2>Segurança</h2>
                    <SubTitulo>
                        Um link de recuperação de senha foi enviado para o seu email!
                    </SubTitulo>
                </Titulo>
            </Frame>
            <Botao aoClicar={() =>navegar('/login')} estilo="vermilion" size="medium" filled>Ir para o Login</Botao>
        </>
    )
}

export default RedefinirSenhaSucesso
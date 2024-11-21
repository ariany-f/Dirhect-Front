import Botao from "@components/Botao"
import Frame from "@components/Frame"
import SubTitulo from "@components/SubTitulo"
import Titulo from "@components/Titulo"
import { Link, useNavigate } from "react-router-dom"
import Inbox from '@assets/Inbox.svg'

function RedefinirSenhaCheckInbox() {
    
    const navegar = useNavigate()

    return (
        <>
            <Frame>
                <Titulo>
                    <img src={Inbox}/>
                    <h2>Verifique seu e-mail</h2>
                    <SubTitulo>
                        Enviamos um link de recuperação para o seu e-mail cadastrado. Verifique sua caixa de entrada para redefinir sua senha.
                    </SubTitulo>
                </Titulo>
            </Frame>
        </>
    )
}

export default RedefinirSenhaCheckInbox
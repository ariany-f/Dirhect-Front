import Botao from "@components/Botao"
import Frame from "@components/Frame"
import SubTitulo from "@components/SubTitulo"
import Titulo from "@components/Titulo"
import BotaoVoltar from "@components/BotaoVoltar"
import CamposVerificacao from "@components/CamposVerificacao"
import { Link, useNavigate } from "react-router-dom"
import { useSessaoUsuarioContext } from "../../contexts/SessaoUsuario"

function Seguranca() {
    
    const {
        usuario,
        setCode,
        submeterRecuperacaoSenha
    } = useSessaoUsuarioContext()
    
    const navegar = useNavigate()

    const sendData = (evento) => {
        evento.preventDefault()
        submeterRecuperacaoSenha()
            .then((response) => {
                if(response !== undefined || response.data !== undefined)
                { 
                    navegar('/esqueci-a-senha/redefinir')
                }
            })
            .catch(erro => {
                console.error(erro)
            })
    }

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
            <form>
                <Frame>
                    <CamposVerificacao valor={usuario.code} setValor={setCode} label="Código de autenticação" />
                </Frame>
            </form>
            <Botao aoClicar={sendData} estilo="vermilion" size="medium" filled>Confirmar</Botao>
        </>
    )
}

export default Seguranca
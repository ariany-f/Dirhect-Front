import Botao from "@components/Botao"
import Frame from "@components/Frame"
import SubTitulo from "@components/SubTitulo"
import Titulo from "@components/Titulo"
import BotaoVoltar from "@components/BotaoVoltar"
import CamposVerificacao from "@components/CamposVerificacao"
import { Link, useNavigate } from "react-router-dom"
import { useSessaoUsuarioContext } from "../../contexts/SessaoUsuario"
import { Toast } from 'primereact/toast'
import { useRef } from "react"

function Seguranca() {
    
    const {
        usuario,
        setCode,
        submeterRecuperacaoSenha
    } = useSessaoUsuarioContext()
    
    const navegar = useNavigate()
    const toast = useRef(null)

    const sendData = (evento) => {
        evento.preventDefault()
        submeterRecuperacaoSenha()
            .then((response) => {
                if(response.success)
                { 
                    navegar('/esqueci-a-senha/check-inbox')
                }
                else{
                    toast.current.show({ severity: 'error', summary: 'Erro', detail: response.data.message })
                    return false
                }
            })
            .catch(erro => {
                toast.current.show({ severity: 'error', summary: 'Erro', detail: erro.data.message })
                return false
            })
    }

    return (
        <>
            <Toast ref={toast} />
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
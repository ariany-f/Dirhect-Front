import Botao from "@components/Botao"
import CampoTexto from "@components/CampoTexto"
import Frame from "@components/Frame"
import SubTitulo from "@components/SubTitulo"
import Titulo from "@components/Titulo"
import RegrasCriacaoSenha from "@components/RegrasCriacaoSenha"
import BotaoVoltar from "@components/BotaoVoltar"
import { usePrimeiroAcessoContext } from "../../contexts/PrimeiroAcesso"
import ModalToken from "../../components/ModalToken"
import { useState } from "react"
import { ArmazenadorToken } from "../../utils"

function SenhaDeAcesso() {

    const [modalOpened, setModalOpened] = useState(false)

    function FecharModal()
    {
        setModalOpened(false);
    }

    const { 
        usuario, 
        setPassword, 
        setPasswordConfirmation, 
        setCode,
        solicitarCodigo,
        validarCodigo
    } = usePrimeiroAcessoContext()

    const sendData = (evento) => {
        evento.preventDefault();
        solicitarCodigo()
        .then(response => {
            if(response.data.status === 'success')
            {
                ArmazenadorToken.definirUsuario(
                    response.data.name,
                    response.data.email,
                    usuario.document
                )
                setModalOpened(true)
            }
            else
            {
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
        <Frame>
            <BotaoVoltar />
            <Titulo>
                <h2>Senha de acesso</h2>
                <SubTitulo>
                    Sua senha é de uso individual e intransferível. Essa informação é importante para o acesso restrito na sua conta. Seus dados pessoais são confidenciais e de sua responsabilidade.
                </SubTitulo>
            </Titulo>
        </Frame>
        <Frame>
            <CampoTexto name="senha" valor={usuario.password} setValor={setPassword} type="password" label="Senha" placeholder="Digite sua senha" />
            <CampoTexto name="confirmar-senha" valor={usuario.password_confirmation} setValor={setPasswordConfirmation} type="password" label="Confirmar Senha" placeholder="Digite sua senha" />
            <RegrasCriacaoSenha />
        </Frame>
        <Botao aoClicar={sendData} estilo="vermilion" size="medium" filled>Confirmar</Botao>
        
        <ModalToken usuario={usuario} aoFechar={FecharModal} aoReenviar={solicitarCodigo} aoClicar={validarCodigo} setCode={setCode} opened={modalOpened} />
    </>
    )
}

export default SenhaDeAcesso
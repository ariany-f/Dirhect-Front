import Botao from "@components/Botao"
import CampoTexto from "@components/CampoTexto"
import Frame from "@components/Frame"
import SubTitulo from "@components/SubTitulo"
import Titulo from "@components/Titulo"
import RegrasCriacaoSenha from "@components/RegrasCriacaoSenha"
import BotaoVoltar from "@components/BotaoVoltar"
import { usePrimeiroAcessoContext } from "../../contexts/PrimeiroAcesso"
import ModalToken from "@components/ModalToken"
import { useEffect, useRef, useState } from "react"
import { Toast } from 'primereact/toast'
import Loading from "@components/Loading"
import { ArmazenadorToken } from "../../utils"

function SenhaDeAcesso() {

    const [modalOpened, setModalOpened] = useState(false)
    const [classError, setClassError] = useState([])
    const [loading, setLoading] = useState(false)
    const toast = useRef(null)

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
        solicitarNovoCodigo,
        validarCodigo
    } = usePrimeiroAcessoContext()

    const sendData = (evento) => {

        evento.preventDefault();


        setLoading(true)
        solicitarCodigo()
        .then((response) => {
            if(response.success)
            {
                ArmazenadorToken.definirToken(
                    response.data.auth.token,
                    response.data.auth.expiration_at
                )
                setModalOpened(true)
                
            }
            else
            {
                if(response.message == "autenticação é necessária. código expirado")
                {
                    solicitarNovoCodigo()
                    .then((response) => {
                        console.log(response)
                    })
                }
                else
                {
                    toast.current.show({ severity: 'error', summary: 'Erro', detail: response.message })
                    setLoading(false)
                    return false
                }
            }
            
        })
        .catch(erro => {
            toast.current.show({ severity: 'error', summary: 'Erro', detail: erro.message })
            setLoading(false)
            return false
        })
    }

    return (
       <>
        <Toast ref={toast} />
        <Loading opened={loading} />
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
        <Botao aoClicar={sendData} estilo="vermilion" size="big" filled>Confirmar</Botao>
        
        <ModalToken usuario={usuario} aoFechar={FecharModal} aoReenviar={solicitarCodigo} aoClicar={validarCodigo} setCode={setCode} opened={modalOpened} />
    </>
    )
}

export default SenhaDeAcesso
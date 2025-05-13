import Botao from "@components/Botao"
import CampoTexto from "@components/CampoTexto"
import Frame from "@components/Frame"
import SubTitulo from "@components/SubTitulo"
import Titulo from "@components/Titulo"
import RegrasCriacaoSenha from "@components/RegrasCriacaoSenha"
import { Link, useNavigate } from "react-router-dom"
import BotaoVoltar from "@components/BotaoVoltar"
import { usePrimeiroAcessoContext } from "@contexts/PrimeiroAcesso"
import ModalToken from "@components/ModalToken"
import { useEffect, useRef, useState } from "react"
import { Toast } from 'primereact/toast'
import Loading from "@components/Loading"
import { ArmazenadorToken } from "@utils"

function SenhaDeAcesso() {

    const [modalOpened, setModalOpened] = useState(false)
    const [classError, setClassError] = useState([])
    const [loading, setLoading] = useState(false)
    const navegar = useNavigate()
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
        solicitarCodigoLogin,
        solicitarNovoCodigo,
        gerarBearer,
        validarCodigo
    } = usePrimeiroAcessoContext()

    useEffect(() =>{
        if(!usuario.email)
        {
            navegar('/primeiro-acesso')
        }
    })

    const sendData = (evento) => {

        evento.preventDefault()
        
        document.querySelectorAll('input').forEach(function(element) {
            if(element.value !== '')
            {
                if(classError.includes(element.name))
                {
                    setClassError(classError.filter(item => item !== element.name))
                }
            }
            else
            {
                if(!classError.includes(element.name))
                {
                    setClassError(estadoAnterior => [...estadoAnterior, element.name])
                }
            }
        })

        if(document.querySelectorAll("form .error").length === 0 && document.querySelectorAll('input:not([value]), input[value=""]').length === 0)
        {
            setLoading(true)
            solicitarCodigo()
            .then((response) => {
                if(response.success)
                {
                    ArmazenadorToken.definirUsuario(
                        response.data.user.name,
                        response.data.user.email,
                        response.data.user.cpf,
                        response.data.user.public_id,
                        response.data.user.company_domain.split('.')[0],
                        response.data.user.company_symbol,
                        response.data.user.company_logo
                    )
                    usuario.cpf = response.data.user.cpf
                    setModalOpened(true)
                    setLoading(false)
                }
                else
                {
                    if(response.message == "autenticação é necessária. código expirado")
                    {
                        solicitarCodigoLogin()
                        .then((response) => {
                            if(response.success)
                            {
                                toast.current.show({ severity: 'error', summary: 'Erro', detail: "Código expirado, enviamos um novo código pra você!" })
                                setLoading(false)
                                setTimeout(() => {
                                    navegar('/primeiro-acesso')
                                }, "1500");
                            }
                            else
                            {
                                toast.current.show({ severity: 'error', summary: 'Erro', detail: "Código expirado, não foi possível gerar um novo código, contate o administrador" })
                                setLoading(false)
                                return false
                            }
                        })
                    }
                    else if( response.message == "código de acesso inválido")
                    {
                        solicitarCodigoLogin()
                        .then((response) => {
                            if(response.success)
                            {
                                toast.current.show({ severity: 'error', summary: 'Erro', detail: "Código inválido, enviamos um novo código pra você!" })
                                setLoading(false)
                                setTimeout(() => {
                                    navegar('/primeiro-acesso')
                                }, "1500");
                            }
                            else
                            {
                                toast.current.show({ severity: 'error', summary: 'Erro', detail: "Código inválido, não foi possível gerar um novo código, contate o administrador" })
                                setLoading(false)
                                return false
                            }
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
    }

    const sendCode = () => {
       
        setLoading(true)

        validarCodigo().then((response) => {
            if(response.data)
            {
                if(response.success)
                {
                        //navegar('/login')
                }
                else
                {
                    toast.current.show({ severity: 'error', summary: 'Erro', detail: response.data.message })
                    setCode([])
                    setLoading(false)
                    return false
                }
            }
            else
            {
                toast.current.show({ severity: 'error', summary: 'Erro', detail: response.message })
                setCode([])
                setLoading(false)
                return false
            }
        })
        .catch(erro => {
            toast.current.show({ severity: 'error', summary: 'Erro', detail: erro.message })
            setCode([])
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
            <CampoTexto camposVazios={classError} name="senha" valor={usuario.password} setValor={setPassword} type="password" label="Senha" placeholder="Digite sua senha" />
            <CampoTexto camposVazios={classError} name="confirmar-senha" valor={usuario.password_confirmation} setValor={setPasswordConfirmation} type="password" label="Confirmar Senha" placeholder="Digite sua senha" />
            <RegrasCriacaoSenha />
        </Frame>
        <Botao aoClicar={sendData} estilo="vermilion" size="big" filled>Confirmar</Botao>
        
        <ModalToken usuario={usuario} aoFechar={FecharModal} aoReenviar={solicitarCodigoLogin} aoClicar={sendCode} setCode={setCode} opened={modalOpened} />
    </>
    )
}

export default SenhaDeAcesso
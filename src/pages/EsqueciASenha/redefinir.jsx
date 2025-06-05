import Botao from "@components/Botao"
import CampoTexto from "@components/CampoTexto"
import Frame from "@components/Frame"
import SubTitulo from "@components/SubTitulo"
import Titulo from "@components/Titulo"
import RegrasCriacaoSenha from "@components/RegrasCriacaoSenha"
import BotaoVoltar from "@components/BotaoVoltar"
import { useNavigate, useParams } from "react-router-dom"
import * as Yup from 'yup'
import { useEffect } from "react"
import http from '@http'
import { toast } from 'react-toastify'
import { useSessaoUsuarioContext } from "@contexts/SessaoUsuario"

function RedefinirSenha() {
    
    const {uuid, token} = useParams()

    const {
        recuperacaoSenha,
        setRecuperacaoToken,
        setRecuperacaoPassword,
        setRecuperacaoConfirmPassword,
        setRecuperacaoUuid,
        redefinirSenha
    } = useSessaoUsuarioContext()
    
    const navegar = useNavigate()

    const validationSchema = Yup.object().shape({
        password: Yup.string().required('Necessário digitar senha'),
        passwordConfirmation: 
        Yup.string()
        .required('Necessário digitar confirmação de senha')
        .oneOf([Yup.ref('password')], 'As senhas devem coincidir'),
    });

    useEffect(() => {
        http.get(`/password/reset/${uuid}/${token}`)
        .then(response => {
            if(response) {
                setRecuperacaoUuid(uuid)
                setRecuperacaoToken(token)
            }
        })
        .catch(erro => {
            console.error(erro)
        })
    }, [])

    const sendData = (evento) => {
        evento.preventDefault()
        if(!recuperacaoSenha.password) {
            toast.error('Necessário digitar senha')
            return
        }
        if(!recuperacaoSenha.confirm_password) {
            toast.error('Necessário digitar confirmação de senha')
            return
        }
        if(recuperacaoSenha.password !== recuperacaoSenha.confirm_password) {
            toast.error('As senhas devem coincidir')
            return
        }
        if(recuperacaoSenha.password.length < 6) {
            toast.error('A senha deve ter pelo menos 6 caracteres')
            return
        }
        if(!/[A-Z]/.test(recuperacaoSenha.password)) {
            toast.error('A senha deve conter pelo menos 1 letra maiúscula')
            return
        }
        if(!/[0-9]/.test(recuperacaoSenha.password)) {
            toast.error('A senha deve conter pelo menos 1 número')
            return
        }
        if(!/[!@#$%^&*]/.test(recuperacaoSenha.password)) {
            toast.error('A senha deve conter pelo menos 1 caractere especial')
            return
        }
        redefinirSenha()
            .then((response) => {
                if(response !== undefined || response.data !== undefined)
                {
                    navegar('/esqueci-minha-senha/sucesso')
                }
            })
            .catch(erro => {
                console.error(erro)
            })
    }

    return (
        <>
            <Frame>
                <Titulo>
                    <h2>Redefinir senha</h2>
                    <SubTitulo>
                        Informe sua nova senha:
                    </SubTitulo>
                </Titulo>
            </Frame>
            <Frame>
                <CampoTexto name="senha" valor={recuperacaoSenha.password} setValor={setRecuperacaoPassword} type="password" label="Senha" placeholder="Digite sua senha" />
                <CampoTexto name="confirmar-senha" valor={recuperacaoSenha.confirm_password} setValor={setRecuperacaoConfirmPassword} type="password" label="Confirmar Senha" placeholder="Digite sua senha" />
                <RegrasCriacaoSenha />
            </Frame>
            <Botao aoClicar={sendData} estilo="vermilion" size="medium" filled>Confirmar</Botao>
        </>
    )
}

export default RedefinirSenha
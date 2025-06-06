import Botao from "@components/Botao"
import Frame from "@components/Frame"
import SubTitulo from "@components/SubTitulo"
import Titulo from "@components/Titulo"
import RegrasCriacaoSenha from "@components/RegrasCriacaoSenha"
import { useNavigate, useParams } from "react-router-dom"
import * as Yup from 'yup'
import { useEffect, useState } from "react"
import http from '@http'
import { toast } from 'react-toastify'
import { useSessaoUsuarioContext } from "@contexts/SessaoUsuario"
import Loading from "@components/Loading"
import Input from "@components/Input"
import { useForm } from "react-hook-form"

function RedefinirSenha() {
    
    const {uid, token} = useParams()
    const [ready, setReady] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    const {
        recuperacaoSenha,
        setRecuperacaoToken,
        setRecuperacaoPassword,
        setRecuperacaoConfirmPassword,
        setRecuperacaoUuid,
        redefinirSenha
    } = useSessaoUsuarioContext()
    
    const navegar = useNavigate()
    const { control } = useForm();

    const validationSchema = Yup.object().shape({
        password: Yup.string().required('Necessário digitar senha'),
        passwordConfirmation: 
        Yup.string()
        .required('Necessário digitar confirmação de senha')
        .oneOf([Yup.ref('password')], 'As senhas devem coincidir'),
    });

    useEffect(() => {
        http.get(`/password/reset/${uid}/${token}/`)
        .then(response => {
            if(response) {
                setRecuperacaoUuid(uid)
                setRecuperacaoToken(token)
                setReady(true)
            }
        })
        .catch(erro => {
            setReady(true)
            setError(true)
            if(erro.detail) {
                toast.error(erro.detail)
            }
            else
            {
                toast.error('Erro ao redefinir senha')
            }
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
        if(recuperacaoSenha.password.length < 8) {
            toast.error('A senha deve ter pelo menos 8 caracteres')
            return
        }
        if(!/[a-z]/.test(recuperacaoSenha.password)) {
            toast.error('A senha deve conter pelo menos 1 letra minúscula')
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
                if(response.detail && response.detail != "Senha redefinida com sucesso")
                {
                    toast.error(response.detail)
                }
                else if(response !== undefined || response.data !== undefined)
                {
                    navegar('/esqueci-a-senha/sucesso')
                }
            })
            .catch(erro => {
                console.error(erro)
            })
    }

    return (
        <>
            {ready ? 
                error ?
                    <>
                    <Frame>
                        <Titulo>
                            <h2>Redefinir senha</h2>
                            <SubTitulo>
                                Não foi possível redefinir a senha.
                            </SubTitulo>
                        </Titulo>
                    </Frame>
                    <Botao aoClicar={() => navegar('/login')} estilo="vermilion" size="medium" filled>Voltar pro Login</Botao>
                    </>
                :
                <>
                    <Frame>
                        <Titulo>
                            <h2>Redefinir senha</h2>
                            <SubTitulo>
                                Informe sua nova senha:
                            </SubTitulo>
                        </Titulo>
                    </Frame>
                    <Frame gap="16px">
                        <Input
                            control={control}
                            type="password"
                            id="password"
                            name="password"
                            label="Senha"
                            icon="pi pi-lock"
                            toggleMask={true}
                            value={recuperacaoSenha.password}
                            onChange={(e) => setRecuperacaoPassword(e.target.value)}
                            showPasswordFeedback={false}
                        />
                        <Input
                            control={control}
                            type="password"
                            id="confirm_password"
                            name="confirm_password"
                            label="Confirmar Senha"
                            icon="pi pi-lock"
                            toggleMask={true}
                            value={recuperacaoSenha.confirm_password}
                            onChange={(e) => setRecuperacaoConfirmPassword(e.target.value)}
                            showPasswordFeedback={false}
                        />
                        <RegrasCriacaoSenha senha={recuperacaoSenha.password || ""} />
                    </Frame>
                    <Botao aoClicar={sendData} estilo="vermilion" size="medium" filled>Confirmar</Botao>
                </>
            :
                <Loading opened={true}/>
            }
        </>
    )
}

export default RedefinirSenha
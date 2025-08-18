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
import styled from "styled-components"




const WrapperOut = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    align-self: stretch;
    width: 100%;
    @media (max-width: 768px) {
        margin-left: 0px;
        margin-right: 0px;
        height: 100vh;
        overflow-y: auto;
        padding: 0 4vw;
    }
`;
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
    const { control, handleSubmit, formState: { errors }, watch } = useForm();
    
    // Observa o valor da senha em tempo real para o componente RegrasCriacaoSenha
    const watchedPassword = watch('password', '');

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

    const onSubmit = async (data) => {
        if(!data.password) {
            toast.error('Necessário digitar senha')
            return
        }
        if(!data.confirm_password) {
            toast.error('Necessário digitar confirmação de senha')
            return
        }
        if(data.password !== data.confirm_password) {
            toast.error('As senhas devem coincidir')
            return
        }
        if(data.password.length < 8) {
            toast.error('A senha deve ter pelo menos 8 caracteres')
            return
        }
        if(!/[a-z]/.test(data.password)) {
            toast.error('A senha deve conter pelo menos 1 letra minúscula')
            return
        }
        if(!/[A-Z]/.test(data.password)) {
            toast.error('A senha deve conter pelo menos 1 letra maiúscula')
            return
        }
        if(!/[0-9]/.test(data.password)) {
            toast.error('A senha deve conter pelo menos 1 número')
            return
        }
        if(!/[!@#$%^&*]/.test(data.password)) {
            toast.error('A senha deve conter pelo menos 1 caractere especial')
            return
        }

        // Atualiza o contexto com os valores do formulário
        setRecuperacaoPassword(data.password)
        setRecuperacaoConfirmPassword(data.confirm_password)

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
        <WrapperOut>
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
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Frame gap="16px">
                            <Input
                                control={control}
                                type="password"
                                id="password"
                                name="password"
                                label="Senha"
                                icon="pi pi-lock"
                                toggleMask={true}
                                showPasswordFeedback={false}
                                required
                                rules={{
                                    required: 'Senha é obrigatória',
                                    minLength: {
                                        value: 8,
                                        message: 'A senha deve ter pelo menos 8 caracteres'
                                    },
                                    pattern: {
                                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
                                        message: 'A senha deve conter pelo menos 1 letra minúscula, 1 maiúscula, 1 número e 1 caractere especial'
                                    }
                                }}
                            />
                            <Input
                                control={control}
                                type="password"
                                id="confirm_password"
                                name="confirm_password"
                                label="Confirmar Senha"
                                icon="pi pi-lock"
                                toggleMask={true}
                                showPasswordFeedback={false}
                                required
                                rules={{
                                    required: 'Confirmação de senha é obrigatória',
                                    validate: (value, formValues) => {
                                        return value === formValues.password || 'As senhas devem coincidir'
                                    }
                                }}
                            />
                            <RegrasCriacaoSenha senha={watchedPassword || ""} />
                        </Frame>
                        <br />
                        <Botao type="submit" estilo="vermilion" size="medium" filled>Confirmar</Botao>
                    </form>
                </>
            :
                <Loading opened={true}/>
            }
        </WrapperOut>
    )
}

export default RedefinirSenha
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
import { useForm } from "react-hook-form"
import styled from "styled-components"
import { FaEye, FaEyeSlash } from 'react-icons/fa'

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

const PasswordInputContainer = styled.div`
    position: relative;
    width: 100%;
    
    input {
        width: 100%;
        padding: 12px;
        padding-right: 45px;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        fontSize: 14px;
        font-family: inherit;
        
        &:focus {
            outline: none;
            border-color: var(--primaria);
        }
    }
    
    button {
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        cursor: pointer;
        color: #6b7280;
        padding: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        
        &:hover {
            color: #374151;
        }
    }
`;

function RedefinirSenha() {
    
    const {uid, token} = useParams()
    const [ready, setReady] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [mostrarSenha, setMostrarSenha] = useState(false)
    const [mostrarConfirmSenha, setMostrarConfirmSenha] = useState(false)

    const {
        recuperacaoSenha,
        setRecuperacaoToken,
        setRecuperacaoPassword,
        setRecuperacaoConfirmPassword,
        setRecuperacaoUuid,
        redefinirSenha
    } = useSessaoUsuarioContext()
    
    const navegar = useNavigate()
    const { control, handleSubmit, formState: { errors }, watch } = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onSubmit',
        defaultValues: {
            password: '',
            confirm_password: ''
        }
    });
    
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

        // Faz a requisição diretamente com os valores do formulário
        const obj = {
            uid: uid,
            token: token,
            new_password: data.password
        }
        
        try {
            const response = await http.post(`password/reset/confirm/`, obj)
            if(response.detail && response.detail != "Senha redefinida com sucesso")
            {
                toast.error(response.detail)
            }
            else if(response !== undefined || response.data !== undefined)
            {
                navegar('/esqueci-a-senha/sucesso')
            }
        } catch (erro) {
            console.error(erro)
            toast.error(erro?.response?.data?.detail || 'Erro ao redefinir senha')
        }
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
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                                <label htmlFor="password" style={{ fontWeight: '500', fontSize: '14px' }}>Senha</label>
                                <PasswordInputContainer>
                                    <input
                                        {...control.register('password', {
                                            required: 'Senha é obrigatória',
                                            minLength: {
                                                value: 8,
                                                message: 'A senha deve ter pelo menos 8 caracteres'
                                            },
                                            pattern: {
                                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
                                                message: 'A senha deve conter pelo menos 1 letra minúscula, 1 maiúscula, 1 número e 1 caractere especial'
                                            }
                                        })}
                                        type={mostrarSenha ? "text" : "password"}
                                        id="password"
                                        placeholder="Digite sua senha"
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setMostrarSenha(!mostrarSenha)}
                                        title={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                                    >
                                        {mostrarSenha ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                    </button>
                                </PasswordInputContainer>
                                {errors.password && (
                                    <span style={{ color: 'red', fontSize: '12px' }}>{errors.password.message}</span>
                                )}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                                <label htmlFor="confirm_password" style={{ fontWeight: '500', fontSize: '14px' }}>Confirmar Senha</label>
                                <PasswordInputContainer>
                                    <input
                                        {...control.register('confirm_password', {
                                            required: 'Confirmação de senha é obrigatória',
                                            validate: (value, formValues) => {
                                                return value === formValues.password || 'As senhas devem coincidir'
                                            }
                                        })}
                                        type={mostrarConfirmSenha ? "text" : "password"}
                                        id="confirm_password"
                                        placeholder="Confirme sua senha"
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setMostrarConfirmSenha(!mostrarConfirmSenha)}
                                        title={mostrarConfirmSenha ? "Ocultar senha" : "Mostrar senha"}
                                    >
                                        {mostrarConfirmSenha ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                    </button>
                                </PasswordInputContainer>
                                {errors.confirm_password && (
                                    <span style={{ color: 'red', fontSize: '12px' }}>{errors.confirm_password.message}</span>
                                )}
                            </div>
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
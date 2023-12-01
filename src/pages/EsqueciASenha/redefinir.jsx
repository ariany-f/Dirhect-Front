import Botao from "@components/Botao"
import CampoTexto from "@components/CampoTexto"
import Frame from "@components/Frame"
import SubTitulo from "@components/SubTitulo"
import Titulo from "@components/Titulo"
import RegrasCriacaoSenha from "@components/RegrasCriacaoSenha"
import BotaoVoltar from "@components/BotaoVoltar"
import { useNavigate } from "react-router-dom"
import * as Yup from 'yup'
import { useEffect } from "react"
import http from '@http'
import { useSessaoUsuarioContext } from "../../contexts/SessaoUsuario"

function RedefinirSenha() {
    
    const searchParams = new URLSearchParams(document.location.search)

    const {
        recuperacaoSenha,
        setRecuperacaoToken,
        setRecuperacaoPassword,
        setRecuperacaoConfirmPassword,
        setRecuperacaoPublicId,
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

        /**
         * Pegar colaboradores
         */
        http.get(`api/user/password/reset?${searchParams}`)
        .then(response => {
            if(response.data)
            {
                if(response.data.status === 'error')
                {
                    alert(response.data.message)
                }
                setRecuperacaoToken(response.data.token)
                setRecuperacaoPublicId(response.data.user_public_id)
            }
        })
        .catch(erro => {
            console.error(erro)
        })
    }, [])

    const sendData = (evento) => {
        evento.preventDefault()
        redefinirSenha()
            .then((response) => {
                if(response !== undefined || response.data !== undefined)
                {
                    navegar('/login')
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
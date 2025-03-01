import Botao from "@components/Botao"
import CampoTexto from "@components/CampoTexto"
import Frame from "@components/Frame"
import SubTitulo from "@components/SubTitulo"
import Texto from "@components/Texto"
import Titulo from "@components/Titulo"
import { Link, useNavigate } from "react-router-dom"
import { usePrimeiroAcessoContext } from "@contexts/PrimeiroAcesso"
import { useState, useRef } from "react"
import http from '@http';
import { Toast } from 'primereact/toast'

function PrimeiroAcesso() {

    const [classError, setClassError] = useState([])
    const navegar = useNavigate()
    const toast = useRef(null)
    
    const { 
        usuario,
        setEmail,
        setCode,
        setDocument,
        setCpf,
        setAccessCode,
        validarAcesso
    } = usePrimeiroAcessoContext()


    const AlreadyAccessed = () => {

        const data = {
            email: usuario.email
        }
        
        http.post('api/auth/already-accessed', data)
            .then((response) => {
                if(response.data)
                {
                    if(response.data.alreadyAccessed)
                    {

                        //navegar('/login')
                    }
                    else
                    {
                       // navegar('/primeiro-acesso/senha-acesso')
                    }
                }
            })
            .catch(erro => {
                console.error(erro)
            })
    }

    return (
        <>
            <Toast ref={toast} />
            <Titulo align="left">
                <h2>Bem-vindo, RH!</h2>
                <SubTitulo>
                    Estamos muito felizes em recebê-lo aqui. Este é o seu primeiro passo, para começar informe seu CNPJ:
                </SubTitulo>
            </Titulo>
            <Frame>
                <CampoTexto camposVazios={classError} name="email" valor={usuario.email} setValor={setEmail} type="text" label="E-mail corporativo" placeholder="E-mail corporativo" />
                <CampoTexto name="codigo" valor={usuario.code} setValor={setCode} label="Código de acesso" placeholder="Digite o código de acesso" />
                <Frame estilo="vermilion" padding="16px">
                    <Texto>O código de acesso foi enviado parao e-mail corporativo cadastrado!</Texto>
                </Frame>
            </Frame>
            <Botao aoClicar={evento => AlreadyAccessed()} estilo="vermilion" size="big" filled>Confirmar</Botao>
        </>
    )
}

export default PrimeiroAcesso
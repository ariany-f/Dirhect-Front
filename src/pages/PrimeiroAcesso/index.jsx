import Botao from "@components/Botao"
import CampoTexto from "@components/CampoTexto"
import Frame from "@components/Frame"
import SubTitulo from "@components/SubTitulo"
import Texto from "@components/Texto"
import Titulo from "@components/Titulo"
import { Link, useNavigate } from "react-router-dom"
import { usePrimeiroAcessoContext } from "../../contexts/PrimeiroAcesso"
import { useState } from "react"

function PrimeiroAcesso() {

    const [classError, setClassError] = useState([])
    const navegar = useNavigate()
    
    const { 
        usuario,
        setEmail,
        setDocument,
        setAccessCode,
        validarAcesso
    } = usePrimeiroAcessoContext()

    const sendData = (evento) => {
        evento.preventDefault();
        validarAcesso()
    }

    return (
        <>
            <Titulo align="left">
                <h2>Bem-vindo, RH!</h2>
                <SubTitulo>
                    Estamos muito felizes em recebê-lo aqui. Este é o seu primeiro passo, para começar informe seu CNPJ:
                </SubTitulo>
            </Titulo>
            <Frame>
                <CampoTexto camposVazios={classError} patternMask={['999.999.999-99', '99.999.999/9999-99']} name="document" valor={usuario.document} setValor={setDocument} type="text" label="CPF/CNPJ" placeholder="Digite seu CPF/CNPJ" />
                <CampoTexto name="codigo" valor={usuario.access_code} setValor={setAccessCode} label="Código de acesso" placeholder="Digite o código de acesso" />
                <Frame estilo="vermilion" padding="16px">
                    <Texto>O código de acesso foi enviado parao e-mail corporativo cadastrado!</Texto>
                </Frame>
            </Frame>
            <Botao aoClicar={evento => navegar('/primeiro-acesso/senha-acesso')} estilo="vermilion" size="big" filled>Confirmar</Botao>
        </>
    )
}

export default PrimeiroAcesso
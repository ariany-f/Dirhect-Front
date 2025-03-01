import Botao from "@components/Botao"
import CampoTexto from "@components/CampoTexto"
import Frame from "@components/Frame"
import SubTitulo from "@components/SubTitulo"
import Titulo from "@components/Titulo"
import BotaoVoltar from "@components/BotaoVoltar"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useSessaoUsuarioContext } from "@contexts/SessaoUsuario"

function EsqueciASenha() {
    
    const [classError, setClassError] = useState([])
    const navegar = useNavigate()

    const {
        usuario,
        setCpf,
        setEmail,
        solicitarCodigoRecuperacaoSenha
    } = useSessaoUsuarioContext()

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
            solicitarCodigoRecuperacaoSenha()
                .then((response) => {
                    if(response.success)
                    {
                        navegar('/esqueci-a-senha/seguranca')
                    }
                })
                .catch(erro => {
                    console.error(erro)
                })
        }
    }

    return (
        <>
            <Frame>
                <BotaoVoltar />
                <Titulo>
                    <h2>Esqueceu sua senha?</h2>
                    <SubTitulo>
                    Para recuperar sua senha, precisamos do CPF do responsável da conta corporativa
                    </SubTitulo>
                </Titulo>
            </Frame>
            <form>
                <Frame>
                    <CampoTexto camposVazios={classError} patternMask={['999.999.999-99']} name="cpf" valor={usuario.cpf} setValor={setCpf} label="CPF do responsável" placeholder="Digite o CPF do responsável" />
                </Frame>
            </form>
            <Botao aoClicar={sendData} estilo="vermilion" size="medium" filled>Confirmar</Botao>
        </>
    )
}

export default EsqueciASenha
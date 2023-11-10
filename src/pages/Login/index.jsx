import Texto from "@components/Texto"
import Botao from "@components/Botao"
import CampoTexto from "@components/CampoTexto"
import Frame from "@components/Frame"
import SubTitulo from "@components/SubTitulo"
import Titulo from "@components/Titulo"
import { Link } from "react-router-dom"
import styles from './Login.module.css'
import CheckboxContainer from "@components/CheckboxContainer"
import { useSessaoUsuarioContext } from "../../contexts/SessaoUsuario"
import ModalToken from '@components/ModalToken'
import { useState } from "react"

function Login() {

    const [modalOpened, setModalOpened] = useState(false)
    const [classError, setClassError] = useState([])

    const { 
        usuario,
        setRemember,
        setEmail,
        setPassword,
        setCode,
        submeterLogin,
        solicitarCodigo
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
            solicitarCodigo()
            setModalOpened(true)
        }
    }

    const sendCode = () => {
        submeterLogin()
    }

    return (
        <>
            <Titulo>
                <h2>Bem-vindo</h2>
                <SubTitulo>
                Acesse a área da sua empresa
                </SubTitulo>
            </Titulo>
            <form>
                <Frame>
                    <CampoTexto camposVazios={classError} name="email" valor={usuario.email} setValor={setEmail} type="email" label="E-mail corporativo" placeholder="Digite seu e-mail corporativo" />
                    <CampoTexto camposVazios={classError} name="password" valor={usuario.password} setValor={setPassword} type="password" label="Senha" placeholder="Digite sua senha" />
                    <div className={styles.containerBottom}>
                        <CheckboxContainer name="remember" valor={usuario.remember} setValor={setRemember} label="Lembrar de mim" />
                        <Link className={styles.link} to="/esqueci-a-senha">
                            <Texto weight="800" color="var(--primaria)">Esqueci minha senha</Texto>
                        </Link>
                    </div>
                </Frame>
            </form>
            <Botao aoClicar={sendData} estilo="vermilion" size="medium" filled>Confirmar</Botao>
            
            <ModalToken usuario={usuario} aoReenviar={solicitarCodigo} aoFechar={() => setModalOpened(false)} aoClicar={sendCode} setCode={setCode} opened={modalOpened} />
        </>
    )
}

export default Login
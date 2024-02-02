import Texto from "@components/Texto"
import Botao from "@components/Botao"
import CampoTexto from "@components/CampoTexto"
import Frame from "@components/Frame"
import SubTitulo from "@components/SubTitulo"
import Titulo from "@components/Titulo"
import { Link, useNavigate } from "react-router-dom"
import styles from './Login.module.css'
import CheckboxContainer from "@components/CheckboxContainer"
import { useSessaoUsuarioContext } from "../../contexts/SessaoUsuario"
import { useRef, useState } from "react"
import { Toast } from 'primereact/toast'
import { ArmazenadorToken } from "../../utils"
import Loading from "@components/Loading"

function Login() {

    const [classError, setClassError] = useState([])
    const [loading, setLoading] = useState(false)
    const navegar = useNavigate()
    const toast = useRef(null)

    const { 
        usuario,
        setRemember,
        setDocument,
        setEmail,
        setCompanies,
        setPassword,
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
            setLoading(true)
            solicitarCodigo()
            .then((response) => {
                if(response.data.status === 'success')
                {
                    ArmazenadorToken.definirUsuario(
                        response.data.name,
                        response.data.email,
                        usuario.document
                    )
                    setEmail(response.data.email)
                    setCompanies(response.data.companies)
                    navegar('/login/selecionar-empresa')
                }
                else
                {
                    toast.current.show({ severity: 'error', summary: 'Erro', detail: response.data.message })
                    setLoading(false)
                    return false
                }
                
            })
            .catch(erro => {
                toast.current.show({ severity: 'error', summary: 'Erro', detail: erro.data.message })
                setLoading(false)
                return false
            })
        }
    }

    return (
        <>
            <Toast ref={toast} />
            <Loading opened={loading} />
            <Titulo>
                <h2>Bem-vindo</h2>
                <SubTitulo>
                Acesse a área da sua empresa
                </SubTitulo>
            </Titulo>
            <form>
                <Frame>
                    <CampoTexto camposVazios={classError} patternMask={['999.999.999-99', '99.999.999/9999-99']} name="document" valor={usuario.document} setValor={setDocument} type="text" label="CPF/CNPJ" placeholder="Digite seu CPF/CNPJ" />
                    <CampoTexto camposVazios={classError} name="password" valor={usuario.password} setValor={setPassword} type="password" label="Senha" placeholder="Digite sua senha" />
                    <div className={styles.containerBottom}>
                        <CheckboxContainer name="remember" valor={usuario.remember} setValor={setRemember} label="Lembrar de mim" />
                        <Link className={styles.link} to="/esqueci-a-senha">
                            <Texto weight="800" color="var(--primaria)">Esqueci minha senha</Texto>
                        </Link>
                    </div>
                </Frame>
            </form>
            <Botao aoClicar={evento => sendData(evento)} estilo="vermilion" size="medium" filled>Confirmar</Botao>
        </>
    )
}

export default Login
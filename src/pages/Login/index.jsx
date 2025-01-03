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
import { useEffect, useRef, useState } from "react"
import { Toast } from 'primereact/toast'
import Loading from "@components/Loading"

function Login() {

    const [classError, setClassError] = useState([])
    const [loading, setLoading] = useState(false)
    const navegar = useNavigate()
    const toast = useRef(null)

    const { 
        usuario,
        setRemember,
        usuarioEstaLogado,
        setUsuarioEstaLogado,
        setCpf,
        setPassword,
    } = useSessaoUsuarioContext()

    useEffect(() =>{
        if(usuarioEstaLogado)
        {
            setUsuarioEstaLogado(false)
        }
    })

    const AlreadyAccessed = () => {

        navegar('/');
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
                    <CampoTexto camposVazios={classError} patternMask={['999.999.999-99', '99.999.999/9999-99']} name="cpf" valor={usuario.cpf} setValor={setCpf} type="text" label="CPF/CNPJ" placeholder="Digite seu CPF/CNPJ" />
                    <CampoTexto camposVazios={classError} name="password" valor={usuario.password} setValor={setPassword} type="password" label="Senha" placeholder="Digite sua senha" />
                    <div className={styles.containerBottom}>
                        <CheckboxContainer name="remember" valor={usuario.remember} setValor={setRemember} label="Lembrar de mim" />
                        <Link className={styles.link} to="/esqueci-a-senha">
                            <Texto weight="800" color="var(--primaria)">Esqueci minha senha</Texto>
                        </Link>
                    </div>
                </Frame>
            </form>
            {/* <Botao aoClicar={evento => sendData(evento)} estilo="vermilion" size="medium" filled>Confirmar</Botao> */}
            <Botao aoClicar={evento => AlreadyAccessed()} estilo="vermilion" size="medium" filled>Confirmar</Botao>
        </>
    )
}

export default Login
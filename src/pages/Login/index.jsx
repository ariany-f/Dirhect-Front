import Texto from "@components/Texto"
import Botao from "@components/Botao"
import CampoTexto from "@components/CampoTexto"
import Frame from "@components/Frame"
import SubTitulo from "@components/SubTitulo"
import Titulo from "@components/Titulo"
import { useState } from "react"
import { Link } from "react-router-dom"
import styles from './Login.module.css'
import CheckboxContainer from "@components/CheckboxContainer"

function Login() {
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')

    return (
        <>
            <Titulo>
                <h2>Bem-vindo</h2>
                <SubTitulo>
                Acesse a área da sua empresa
                </SubTitulo>
            </Titulo>
            <Frame>
                <CampoTexto name="email" valor={email} setValor={setEmail} type="email" label="E-mail corporativo" placeholder="Digite seu e-mail corporativo" />
                <CampoTexto name="senha" valor={senha} setValor={setSenha} type="password" label="Senha" placeholder="Digite sua senha" />
                <div className={styles.containerBottom}>
                    <CheckboxContainer />
                    <Link className={styles.link} to="/esqueci-a-senha">
                        <Texto weight="800" color="var(--primaria)">Esqueci minha senha</Texto>
                    </Link>
                </div>
            </Frame>
            <Link to="/login/selecionar-empresa">
                <Botao estilo="vermilion" size="medium" filled>Confirmar</Botao>
            </Link>
        </>
    )
}

export default Login
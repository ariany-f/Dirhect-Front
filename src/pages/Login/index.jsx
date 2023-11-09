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
import { useState } from "react";

function Login() {

    const [modalOpened, setModalOpened] = useState(false)

    function FecharModal()
    {
        setModalOpened(false);
    }
    
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
        evento.preventDefault();
        solicitarCodigo()
        setModalOpened(true)
    }


    return (
        <>
            <Titulo>
                <h2>Bem-vindo</h2>
                <SubTitulo>
                Acesse a área da sua empresa
                </SubTitulo>
            </Titulo>
            <Frame>
                <CampoTexto name="email" valor={usuario.email} setValor={setEmail} type="email" label="E-mail corporativo" placeholder="Digite seu e-mail corporativo" />
                <CampoTexto name="senha" valor={usuario.password} setValor={setPassword} type="password" label="Senha" placeholder="Digite sua senha" />
                <div className={styles.containerBottom}>
                    <CheckboxContainer valor={usuario.remember} setValor={setRemember} />
                    <Link className={styles.link} to="/esqueci-a-senha">
                        <Texto weight="800" color="var(--primaria)">Esqueci minha senha</Texto>
                    </Link>
                </div>
            </Frame>
            <Botao aoClicar={sendData} estilo="vermilion" size="medium" filled>Confirmar</Botao>
            
            <ModalToken usuario={usuario} aoFechar={FecharModal} aoClicar={submeterLogin} setCode={setCode} opened={modalOpened} />
        </>
    )
}

export default Login
import styles from './Registro.module.css'
import MainContainer from "@components/MainContainer"
import Titulo from "@components/Titulo"
import SubTitulo from "@components/SubTitulo"
import Botao from "@components/Botao"
import { Link, useNavigate } from 'react-router-dom'
import { BsPersonCheck } from 'react-icons/bs'

function ColaboradorRegistroSucesso() {

    const navigate = useNavigate();

    return (
        <>
            <MainContainer align="center" padding="5vw 25vw">
                <BsPersonCheck size={100}/>
                <Titulo>
                    <h6>Colaborador cadastrado</h6>
                    <SubTitulo fontSize="14px" color="var(--black)" weight="400">Seu colaborador recebeu um <b>e-mail para confirmar seu cadastro</b> e assim conseguir acesso a plataforma</SubTitulo>
                </Titulo>
                <div className={styles.ButtonContainer}>
                    <Link onClick={() => navigate(-1)}>
                        <Botao weight='light' estilo="neutro">Voltar</Botao>
                    </Link>
                    <Link to="/colaborador/registro">
                        <Botao weight='light' filled>Cadastrar outro</Botao>
                    </Link>
                </div>
            </MainContainer>
        </>
    )
}

export default ColaboradorRegistroSucesso
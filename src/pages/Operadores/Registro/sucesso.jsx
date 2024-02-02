import styles from './Registro.module.css'
import MainContainer from "@components/MainContainer"
import Titulo from "@components/Titulo"
import SubTitulo from "@components/SubTitulo"
import Botao from "@components/Botao"
import { Link, useNavigate } from 'react-router-dom'
import Support from '@assets/Support.svg'

function OperadorRegistroSucesso() {

    const navigate = useNavigate();

    return (
        <>
            <MainContainer align="center" padding="5vw 25vw">
                <img src={Support} size={100}/>
                <Titulo align="center">
                    <h6>Operador adicionado</h6>
                    <SubTitulo fontSize="14px" color="var(--black)" weight="400">Seu novo operador já pode acessar a plataforma de RH</SubTitulo>
                </Titulo>
                <div className={styles.ButtonContainer}>
                    <Link onClick={() => navigate(-1)}>
                        <Botao weight='light' estilo="neutro">Voltar</Botao>
                    </Link>
                    <Link to="/operador">
                        <Botao weight='light' filled>Ver operadores</Botao>
                    </Link>
                </div>
            </MainContainer>
        </>
    )
}

export default OperadorRegistroSucesso
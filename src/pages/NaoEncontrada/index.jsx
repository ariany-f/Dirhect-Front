import styles from './NaoEncontrada.module.css'
import EstilosGlobais from '@components/GlobalStyles'
import MainSection from "@components/MainSection"
import Botao from "@components/Botao"
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import imagem404 from './imagem404.png'

const ContainerNaoEncontrada = styled.div`
    display: flex;
    padding: 96px 12px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 48px;
    width: 100%;
    text-align: center;
    & p {
        width: 60%;
        margin: 0 auto;
    }

    & h2 {
        font-size: 40px;
    }
`

function NaoEncontrada() {
    const navigate = useNavigate();

    return (
        <>
            <EstilosGlobais />
            <MainSection>
                <ContainerNaoEncontrada>
                        <img width={292} src={imagem404}></img>
                        <section className={styles.container}>
                            <h2>Ops... página não encontrada!</h2>
                            <p>Não se preocupe, estamos aqui para ajudar. Volte para a página inicial ou acesse sua plataforma.</p>
                        </section>
                        <div className={styles.ButtonContainer}>
                            <Link to="/login">
                                <Botao estilo="vermilion" size="medium" filled>Acessar minha conta</Botao>
                            </Link>
                            <Link onClick={() => navigate(-1)}>
                                <Botao estilo="" size="medium" filled>Voltar para o site</Botao>
                            </Link>
                        </div>
                </ContainerNaoEncontrada>
            </MainSection>
        </>
    )
}

export default NaoEncontrada;
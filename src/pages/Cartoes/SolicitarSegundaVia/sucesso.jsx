import styles from './SolicitarSegundaVia.module.css'
import MainContainer from "@components/MainContainer"
import Titulo from "@components/Titulo"
import SubTitulo from "@components/SubTitulo"
import Botao from "@components/Botao"
import { Link, useNavigate, useParams } from 'react-router-dom'
import Success from '@assets/Success.svg'

function CartaoSolicitarSegundaViaSucesso() {

    const { id } = useParams()
    const navigate = useNavigate();

    return (
        <>
            <MainContainer align="center" padding="5vw 18vw">
                <img src={Success} size={100}/>
                <Titulo>
                    <h6>Solicitação de 2ª via do cartão</h6>
                    <SubTitulo fontSize="16px" color="var(--black)" weight="400">Você acabou de fazer uma solicitação de envio de 2ª via do cartão</SubTitulo>
                    <br/>
                    <SubTitulo fontSize="14px" color="var(--black)" weight="400">Assim que sua solicitação for aprovada enviaremos um e-mail para você e para seus colaboradores com mais informações de entrega</SubTitulo>
                </Titulo>
                <div className={styles.ButtonContainer}>
                    <Link onClick={() => navigate(-1)}>
                        <Botao weight='light' estilo="neutro">Voltar</Botao>
                    </Link>
                    <Link to={`/elegibilidade/solicitar-segunda-via/${id}/entrega/acompanhar`}>
                        <Botao weight='light' filled>Acompanhar</Botao>
                    </Link>
                </div>
            </MainContainer>
        </>
    )
}

export default CartaoSolicitarSegundaViaSucesso
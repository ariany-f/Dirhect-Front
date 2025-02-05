import Titulo from '@components/Titulo'
import Botao from '@components/Botao'
import Texto from '@components/Texto'
import Container from '@components/Container'
import Frame from '@components/Frame'
import BadgeBeneficio from '@components/BadgeBeneficio'
import BotaoSemBorda from "@components/BotaoSemBorda"
import { Link } from 'react-router-dom'
import { FaWallet, FaArrowRight, FaUser, FaFileAlt } from 'react-icons/fa'
import { CiCircleCheck, CiCircleRemove } from 'react-icons/ci'
import styles from './DashboardCard.module.css'
import { Skeleton } from 'primereact/skeleton'

let Real = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});

function DashboardCard({ dashboardData, colaboradores = [] }){
    return (
        <Container gap="32px">
            <div className={styles.wrapper_cards}>
                <div className={styles.empilhado}>
                    <div className={styles.card_dashboard}>
                        <Frame estilo="spaced">
                            <Titulo><h6>Colaboradores</h6></Titulo>
                            <Link to="/colaborador"><Texto weight={500} color={'var(--neutro-500)'}>Ver mais&nbsp;<FaArrowRight /></Texto></Link>
                        </Frame>
                        <div className={styles.transacao}>
                            <div className={styles.right}>
                                <Texto weight={500} color={'var(--neutro-500)'}>Total de colaboradores</Texto>
                                <Texto weight={800}><FaUser />&nbsp;&nbsp;{colaboradores.length}</Texto>
                            </div>
                        </div>
                        <div className={styles.buttonContainer}>
                            <Link to="/colaborador/registro">
                                <Botao>Cadastrar novo colaborador</Botao>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Container> 
    )
}

export default DashboardCard
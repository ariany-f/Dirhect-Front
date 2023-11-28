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
            <div className={styles.saldo}>
                <p>Saldo disponível</p>
                {dashboardData?.saldo ?
                    <h2>{Real.format(dashboardData?.saldo)}</h2>
                : <Skeleton variant="rectangular" width={200} height={50} />
                }
                <BotaoSemBorda color="var(--primaria)">
                    <FaWallet/><Link className={styles.link}>Adicionar saldo</Link>
                </BotaoSemBorda>
            </div>
            <div className={styles.wrapper_cards}>
                <div className={styles.card_dashboard}>
                    <Frame estilo="spaced">
                        <Titulo><h6>Última recarga de benefícios</h6></Titulo>
                        <Link><Texto weight={500} color={'var(--neutro-500)'}>Ver mais&nbsp;<FaArrowRight /></Texto></Link>
                    </Frame>
                    <Frame estilo="spaced">
                        <div className={dashboardData.lastTransaction.cancelled_at === null ? styles.badge_success : styles.badge_error}>
                            {dashboardData.lastTransaction.cancelled_at === null ? <CiCircleCheck /> : <CiCircleRemove />}
                            {dashboardData.lastTransaction.cancelled_at === null ? 'Recarga efetuada' : 'Recarga Cancelada'}
                        </div>
                        <div className={styles.rightalign}>
                            <Texto weight={500} color={'var(--neutro-500)'}>Data da recarga</Texto>
                            <Texto>{new Date(dashboardData.lastTransaction.paid_at).toLocaleDateString("pt-BR")}</Texto>
                        </div>
                    </Frame>
                    <div className={styles.transacao}>
                        <div className={styles.right}>
                            <Texto weight={500} color={'var(--neutro-500)'}>Valor da recarga</Texto>
                            <Texto weight={800} size="24px">{Real.format(dashboardData.lastTransaction.total_amount)}</Texto>
                            <BotaoSemBorda color="var(--info)">
                                <FaFileAlt /><Link className={styles.link}>Ver Detalhes</Link>
                            </BotaoSemBorda>
                        </div>
                    </div>
                    <div className={styles.transacao}>
                        <div className={styles.right}>
                            <Texto size="14px" weight={500} color={'var(--neutro-500)'}>Colaboradores que receberam</Texto>
                            <div className={styles.transacao}><FaUser />&nbsp;&nbsp;<Texto weight={800} size="16px">{100}</Texto></div>
                        </div>
                    </div>
                    <div className={styles.transacao}>
                        <div className={styles.right}>
                            <Texto weight={500} color={'var(--neutro-500)'}>Benefícios disponibilizados</Texto>
                            <div className={styles.beneficios}>
                                {dashboardData.lastTransaction?.benefits.map((benefit, index) => {
                                    return (
                                        <BadgeBeneficio key={index} nomeBeneficio={benefit.name}/>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                    <div className={styles.buttonContainer}>
                        <Botao>Fazer uma nova recarga</Botao>
                    </div>
                </div>
                <div className={styles.empilhado}>
                    <div className={styles.card_dashboard}>
                        <Frame estilo="spaced">
                            <Titulo><h6>Últimos depósitos</h6></Titulo>
                            <Link><Texto weight={500} color={'var(--neutro-500)'}>Ver mais&nbsp;<FaArrowRight /></Texto></Link>
                        </Frame>
                    </div>
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
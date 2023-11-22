import Titulo from '@components/Titulo'
import Botao from '@components/Botao'
import Texto from '@components/Texto'
import Frame from '@components/Frame'
import BadgeBeneficio from '@components/BadgeBeneficio'
import { Link } from 'react-router-dom'
import { FaWallet, FaArrowRight, FaUser } from 'react-icons/fa'
import { CiCircleCheck, CiCircleRemove } from 'react-icons/ci'
import styles from './DashboardCard.module.css'
import styled from 'styled-components'

const AddSaldo = styled.div`
    display: flex;
    color: var(--primaria);
    font-family: var(--secundaria);
    font-size: 14px;
    font-weight: 700;
    gap: 8px;
    & svg * {
        fill: var(--primaria);
    }
`

let Real = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});

function DashboardCard({ dashboardData, colaboradores = [] }){
    return (
        <div>
            <div className={styles.saldo}>
                <p>Saldo disponível</p>
                <h2>{Real.format(dashboardData?.saldo)}</h2>
                <AddSaldo>
                    <FaWallet/>
                    <Link className={styles.link}>Adicionar saldo</Link>
                </AddSaldo>
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
                            {new Date(dashboardData.lastTransaction.paid_at).toLocaleDateString("pt-BR")}
                            </div>
                    </Frame>
                    <div className={styles.transacao}>
                        <div className={styles.right}>
                            <Texto weight={500} color={'var(--neutro-500)'}>Valor da recarga</Texto>
                            <Texto weight={800}>{Real.format(dashboardData.lastTransaction.total_amount)}</Texto>
                        </div>
                    </div>
                    <div className={styles.transacao}>
                        <div className={styles.right}>
                            <Texto weight={500} color={'var(--neutro-500)'}>Colaboradores que receberam</Texto>
                            <div className={styles.transacao}><FaUser />&nbsp;&nbsp;<Texto weight={800}>{100}</Texto></div>
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
                    <Botao>Fazer uma nova recarga</Botao>
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
                            <Link><Texto weight={500} color={'var(--neutro-500)'}>Ver mais&nbsp;<FaArrowRight /></Texto></Link>
                        </Frame>
                        <div className={styles.transacao}>
                            <div className={styles.right}>
                                <Texto weight={500} color={'var(--neutro-500)'}>Total de colaboradores</Texto>
                                <Texto weight={800}><FaUser />&nbsp;&nbsp;{colaboradores.length}</Texto>
                            </div>
                        </div>
                        <Botao>Cadastrar novo colaborador</Botao>
                    </div>
                </div>
            </div>
        </div> 
    )
}

export default DashboardCard
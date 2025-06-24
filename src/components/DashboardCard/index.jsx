import Titulo from '@components/Titulo'
import Botao from '@components/Botao'
import Texto from '@components/Texto'
import BadgeGeral from '@components/BadgeGeral'
import SubTitulo from '@components/SubTitulo'
import Container from '@components/Container'
import Frame from '@components/Frame'
import { Link } from 'react-router-dom'
import { FaWallet, FaArrowRight, FaUser, FaFileAlt, FaUserPlus, FaUserMinus, FaCalculator, FaLayerGroup, FaUmbrellaBeach, FaCheckCircle, FaCircle, FaHourglass } from 'react-icons/fa'
import styles from './DashboardCard.module.css'
import { Skeleton } from 'primereact/skeleton'
import { GrAddCircle } from 'react-icons/gr'
import { MdFilter9Plus, MdMan2, MdOutlineTimer, MdWoman, MdWoman2, MdWork } from 'react-icons/md'
import { IoMdTimer } from "react-icons/io";
import { AiOutlinePieChart } from 'react-icons/ai'
import { BsHourglassSplit } from 'react-icons/bs'
import { Timeline } from 'primereact/timeline'
import { Tag } from 'primereact/tag'
import { useEffect, useState } from 'react'
import { Real } from '@utils/formats'
import { useTranslation } from 'react-i18next';

function DashboardCard({ dashboardData, colaboradores = [] }){
    const [isVisible, setIsVisible] = useState(false);
    const { t } = useTranslation('common');

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const pedidos = [
        { titulo: 'Vale Alimentação', dataPedido: '25/02/2025', referencia:"03/2025", statusAtual: 'Em validação', total_colaboradores: 5, valor: 15630.00 },
        { titulo: 'Vale Refeição', dataPedido: '26/02/2025', referencia:"03/2025", statusAtual: 'Em preparação', total_colaboradores: 2, valor: 9870.00 },
    ];

    const statuses = ['Em preparação', 'Em validação', 'Em aprovação', 'Pedido Realizado'];

    const customMarker = (item, statusAtual) => {
        const statusIndex = statuses.indexOf(item);
        const atualIndex = statuses.indexOf(statusAtual);
        const isCompleted = statusIndex <= atualIndex;

        return (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderColor: getSeverityColor(getSeverity(item)), borderStyle:'solid', borderWidth: '1px', width: '24px', height: '24px', borderRadius: '50%' }}>
                {isCompleted ? <FaCheckCircle size={22} fill={getSeverityColor(getSeverity(item))} /> : <MdOutlineTimer size={18} fill="grey" />}
            </span>
        );
    };

    function getSeverityColor(status) {
        let color = 'grey';
        switch(status)
        {
            case 'warning':
                color = "orange";
                break;
            case 'info':
                color = "rgb(61, 142, 220)";
                break;
            case 'success':
                color = "green";
                break;
            case 'danger':
                color = "red";
                break;
            case 'neutral':
                color = "rgb(84, 114, 212)";
                break;
        }
        return color
    }

    function getSeverity(status) {
        switch(status)
        {
            case 'Em preparação':
                return "neutral";
            case 'Em validação':
                return "warning";
            case 'Em aprovação':
                return "info";
            case 'Pedido Realizado':
                return "success";
            case 'Cancelado':
                return "danger";
            case 'Aguardando':
            case 'pendente':
                return "warning";
            case 'Em andamento':
            case 'em_andamento':
                return "info";
            case 'Concluída':
            case 'concluida':
                return "success";
            default:
                return "info";
        }
    }

    function representativSituacaoTemplate(status) {
        return <Tag style={{fontWeight: '700'}} severity={getSeverity(status)} value={status}></Tag>;
    }

    const customContent = (item, statusAtual) => {
        const statusIndex = statuses.indexOf(item);
        const atualIndex = statuses.indexOf(statusAtual);
        const isCompleted = statusIndex <= atualIndex;

        return (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: isCompleted ? 'var(--primaria)' : 'gray' }}>
                 {isCompleted ? representativSituacaoTemplate(item) : <Tag severity={getSeverity(item)} value={item} style={{fontWeight: '500'}} />}
            </span>
        );
    };

    return (
        <>
            <div className={styles.wrapper_cards}>
                <div className={styles.empilhado}>
                    <div className={`${styles.card_dashboard} ${styles.fadeIn} ${isVisible ? styles.visible : ''}`}>
                        <Frame estilo="spaced">
                            <Titulo><h6>{t('actual_month')}</h6></Titulo>
                        <Link to="/beneficio"><Texto weight={500} color={'var(--neutro-500)'}>{t('see_more')}&nbsp;<FaArrowRight /></Texto></Link>
                    </Frame>
                    <Frame estilo="spaced">
                        <div className={styles.right}>
                            <Texto size="14px" weight={500} color={'var(--neutro-500)'}>{t('hirings')}</Texto>
                            <BadgeGeral severity="success" nomeBeneficio={dashboardData.totalAdmissoes} iconeBeneficio={<FaUserPlus />}></BadgeGeral>
                        </div>
                        <div className={styles.right}>
                            <Texto size="14px" weight={500} color={'var(--neutro-500)'}>{t('terminations')}</Texto>
                            <BadgeGeral severity="error" nomeBeneficio={dashboardData.totalDemissoes} iconeBeneficio={<FaUserMinus />}></BadgeGeral>
                        </div>
                    </Frame>
                    <Frame estilo="spaced">
                        <Titulo><h6>{t('payment_entries')}</h6></Titulo>
                    </Frame>
                    <div className={styles.transacao}>
                        <div className={styles.empilhado} style={{gap: '4px'}}>
                            <Frame estilo="spaced">
                                <div className={styles.badge_1}>
                                    <div>{'Adiantamento'}</div>
                                </div>
                                <Texto weight={800}>18</Texto>
                            </Frame>
                            <Frame estilo="spaced">
                                <div className={styles.badge_2}>
                                    {'Folha de Pagamento'}
                                </div>
                                <Texto weight={800}>54</Texto>
                            </Frame>
                        </div>
                    </div>
                    </div>
                </div> 
                <div className={`${styles.empilhado} ${styles.full_height}`}>
                    <div className={`${styles.card_dashboard} ${styles.fadeIn} ${isVisible ? styles.visible : ''}`}>
                        <Frame estilo="spaced">
                            <Titulo><h6>{t('colaborators')}</h6></Titulo>
                            <Link to="/colaborador"><Texto weight={500} color={'var(--neutro-500)'}>{t('see_more')}&nbsp;<FaArrowRight /></Texto></Link>
                        </Frame>
                        <div className={styles.transacao}>
                            <div className={styles.center}>
                                <Texto color={'var(--primaria)'} weight={800} size={'32px'}><FaUser/>&nbsp;&nbsp;{colaboradores.length}</Texto>
                            </div>
                        </div>
                        <Frame estilo="spaced">
                            <Titulo><h6>{t('dependents')}</h6></Titulo>
                        </Frame>
                        <Frame estilo="spaced">
                            <div className={styles.right}>
                                <Texto weight={800}><MdWoman2 size={26}/>{Math.round((colaboradores.length * 2.3)/2)}</Texto>
                            </div>
                            <div className={styles.right}>
                                <Texto weight={800}><MdMan2 size={26}/>{Math.round((colaboradores.length * 2.3)/2)}</Texto>
                            </div>
                            <div className={styles.right}>
                                <Texto color={'var(--primaria)'} weight={800}><FaLayerGroup size={24}/>&nbsp;&nbsp;{Math.round(colaboradores.length * 2.3)}</Texto>
                            </div>
                        </Frame>
                    </div>
                </div>

                <div className={styles.empilhado}>
                    <div className={`${styles.card_dashboard} ${styles.fadeIn} ${isVisible ? styles.visible : ''}`}>
                        <Frame estilo="spaced">
                            <Titulo><h6>{t('positions')}</h6></Titulo>
                            <Link to="/colaborador"><Texto weight={500} color={'var(--neutro-500)'}>{t('see_more')}&nbsp;<FaArrowRight /></Texto></Link>
                        </Frame>
                        <div className={styles.transacao}>
                            <div className={styles.right}>
                                <Texto size={'35px'} color={"var(--primaria)"} weight={800}><MdWork />&nbsp;&nbsp;{dashboardData.totalVagas}</Texto>
                            </div>
                        </div>
                    </div>
                    <div className={styles.wrapper_cards} style={{flexFlow: 'initial'}}>
                        <div style={{flex: '1 1 50%'}}>
                            <div className={`${styles.card_dashboard} ${styles.fadeIn} ${isVisible ? styles.visible : ''}`}>
                                <Frame estilo="spaced">
                                    <Titulo><h6>{t('vacations')}</h6></Titulo>
                                </Frame>
                                <div className={styles.transacao}>
                                    <div className={styles.right}>
                                        <Texto size={'35px'} color={"var(--primaria)"} weight={800}><FaUmbrellaBeach />&nbsp;&nbsp;{dashboardData.totalFerias}</Texto>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{flex: '1 1 50%'}}>
                            <div className={`${styles.card_dashboard} ${styles.fadeIn} ${isVisible ? styles.visible : ''}`}>
                                <Frame estilo="spaced">
                                    <Titulo><h6>{t('absences')}</h6></Titulo>
                                </Frame>
                                <div className={styles.transacao}>
                                    <div className={styles.right}>
                                        <Texto size={'35px'} color={"var(--primaria)"} weight={800}><BsHourglassSplit />&nbsp;&nbsp;{3}</Texto>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                   
                </div>
            </div>
            <div className={styles.wrapper_cards}>
                <div className={`${styles.card_dashboard} ${styles.fadeIn} ${isVisible ? styles.visible : ''}`}>
                    <Frame estilo="spaced">
                        <Titulo><h6>{t('last_orders')}</h6></Titulo>
                        <Link to="/pedidos"><Texto weight={500} color={'var(--neutro-500)'}>{t('see_more')}&nbsp;<FaArrowRight /></Texto></Link>
                    </Frame>
                    <div className={styles.transacao}>
                        <div className={styles.empilhado}>
                            {pedidos.map((pedido, index) => (
                                <div key={index} style={{ width: '100%', padding: '14px', gap: '5px'}}>
                                    <div style={{display: 'flex', justifyContent: 'space-between', gap: '10px'}}>
                                        <div>
                                            <div style={{display: 'flex', gap: '2px'}}>
                                            <Texto weight={800}>{pedido.titulo}</Texto> - <Texto weight={400}>{pedido.referencia}</Texto>
                                            </div>
                                            <div style={{marginTop: '5px', width: '100%', fontWeight: '500', fontSize:'13px', display: 'flex', color: 'var(--neutro-500)'}}>
                                                {t('colaborators_to_receive')}:&nbsp;<p style={{fontWeight: '600', color: 'var(--neutro-500)'}}>{pedido.total_colaboradores}</p>
                                            </div>
                                        </div>
                                        <div style={{textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'end'}}>
                                            <div style={{display: 'flex', gap: '5px'}}><Texto size={"12px"}>{t('order_total_value')}: </Texto><Texto weight={800}>{Real.format(pedido.valor)}</Texto></div>
                                            <Texto size={"12px"}>{t('order_date')}: {pedido.dataPedido}</Texto>
                                        </div>
                                    </div>
                                    <Timeline 
                                        value={statuses} 
                                        layout="horizontal" 
                                        align="top" 
                                        marker={(item) => customMarker(item, pedido.statusAtual)}
                                        content={(item) => customContent(item, pedido.statusAtual)} 
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </> 
    )
}

export default DashboardCard
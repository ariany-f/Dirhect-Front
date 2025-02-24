import Titulo from '@components/Titulo'
import Botao from '@components/Botao'
import Texto from '@components/Texto'
import BadgeGeral from '@components/BadgeGeral'
import Container from '@components/Container'
import Frame from '@components/Frame'
import { Link } from 'react-router-dom'
import { FaWallet, FaArrowRight, FaUser, FaFileAlt, FaUserPlus, FaUserMinus, FaCalculator, FaLayerGroup, FaUmbrellaBeach, FaCheckCircle, FaCircle } from 'react-icons/fa'
import styles from './DashboardCard.module.css'
import { Skeleton } from 'primereact/skeleton'
import { GrAddCircle } from 'react-icons/gr'
import { MdFilter9Plus, MdMan2, MdWoman, MdWoman2, MdWork } from 'react-icons/md'
import { AiOutlinePieChart } from 'react-icons/ai'
import { BsHourglassSplit } from 'react-icons/bs'
import { Timeline } from 'primereact/timeline'

let Real = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});

function DashboardCard({ dashboardData, colaboradores = [] }){
    const pedidos = [
        { titulo: 'Vale Alimentação - 03/2025', statusAtual: 'Em Validação' },
        { titulo: 'Vale Refeição - 03/2025', statusAtual: 'Em aprovação' }
    ];

    const statuses = ['Em preparação', 'Em Validação', 'Em aprovação', 'Pedido Realizado'];

    const customMarker = (item, statusAtual) => {
        const statusIndex = statuses.indexOf(item);
        const atualIndex = statuses.indexOf(statusAtual);
        const isCompleted = statusIndex <= atualIndex;

        return (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', borderRadius: '50%', color: 'white' }}>
                {isCompleted ? <FaCheckCircle size={18} fill="var(--primaria)" /> : <FaCircle fill="grey" />}
            </span>
        );
    };

    const customContent = (item, statusAtual) => {
        const statusIndex = statuses.indexOf(item);
        const atualIndex = statuses.indexOf(statusAtual);
        const isCompleted = statusIndex <= atualIndex;

        return (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: isCompleted ? 'var(--primaria)' : 'gray' }}>
                {item}
            </span>
        );
    };

    return (
        <Container gap="32px">
            <div className={styles.wrapper_cards}>
                <div className={styles.empilhado}>
                    <div className={styles.card_dashboard}>
                        <Frame estilo="spaced">
                            <Titulo><h6>Mês Atual</h6></Titulo>
                            <Link to="/beneficio"><Texto weight={500} color={'var(--neutro-500)'}>Ver mais&nbsp;<FaArrowRight /></Texto></Link>
                        </Frame>
                        <Frame estilo="spaced">
                            <div className={styles.right}>
                                <Texto size="14px" weight={500} color={'var(--neutro-500)'}>Admissões</Texto>
                                <BadgeGeral severity="success" nomeBeneficio={10} iconeBeneficio={<FaUserPlus />}></BadgeGeral>
                            </div>
                            <div className={styles.right}>
                                <Texto size="14px" weight={500} color={'var(--neutro-500)'}>Demissões</Texto>
                                <BadgeGeral severity="error" nomeBeneficio={2} iconeBeneficio={<FaUserMinus />}></BadgeGeral>
                            </div>
                        </Frame>
                        <Frame estilo="spaced">
                            <Titulo><h6>Lançamentos de Folha</h6></Titulo>
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
                <div className={styles.empilhado}>
                    <div className={styles.card_dashboard}>
                        <Frame estilo="spaced">
                            <Titulo><h6>Colaboradores</h6></Titulo>
                            <Link to="/colaborador"><Texto weight={500} color={'var(--neutro-500)'}>Ver mais&nbsp;<FaArrowRight /></Texto></Link>
                        </Frame>
                        <div className={styles.transacao}>
                            <div className={styles.center}>
                                <Texto color={'var(--primaria)'} weight={800} size={'32px'}><FaUser/>&nbsp;&nbsp;{colaboradores.length}</Texto>
                            </div>
                        </div>
                        {/* <div className={styles.buttonContainer}>
                            <Link to="/colaborador/registro">
                                <Botao size="small"><GrAddCircle fill="white" className={styles.icon} size={16}/>Cadastrar novo colaborador</Botao>
                            </Link>
                        </div> */}
                        <Frame estilo="spaced">
                            <Titulo><h6>Dependentes</h6></Titulo>
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
                    <div className={styles.card_dashboard}>
                        <Frame estilo="spaced">
                            <Titulo><h6>Vagas</h6></Titulo>
                            <Link to="/colaborador"><Texto weight={500} color={'var(--neutro-500)'}>Ver mais&nbsp;<FaArrowRight /></Texto></Link>
                        </Frame>
                        <div className={styles.transacao}>
                            <div className={styles.right}>
                                <Texto size={'35px'} color={"var(--primaria)"} weight={800}><MdWork />&nbsp;&nbsp;{10}</Texto>
                            </div>
                        </div>
                    </div>
                    <div className={styles.wrapper_cards} style={{flexFlow: 'initial'}}>
                        <div style={{flex: '1 1 50%'}}>
                            <div className={styles.card_dashboard}>
                                <Frame estilo="spaced">
                                    <Titulo><h6>Férias</h6></Titulo>
                                </Frame>
                                <div className={styles.transacao}>
                                    <div className={styles.right}>
                                        <Texto size={'35px'} color={"var(--primaria)"} weight={800}><FaUmbrellaBeach />&nbsp;&nbsp;{12}</Texto>
                                    </div>
                                </div>
                            </div>
                            </div>
                            <div style={{flex: '1 1 50%'}}>
                            <div className={styles.card_dashboard}>
                                <Frame estilo="spaced">
                                    <Titulo><h6>Afastamentos</h6></Titulo>
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
                <div className={styles.card_dashboard}>
                    <Frame estilo="spaced">
                        <Titulo><h6>Últimos Pedidos</h6></Titulo>
                        <Link to="/colaborador"><Texto weight={500} color={'var(--neutro-500)'}>Ver mais&nbsp;<FaArrowRight /></Texto></Link>
                    </Frame>
                    <div className={styles.transacao}>
                        <div className={styles.empilhado}>
                            {pedidos.map((pedido, index) => (
                                <div key={index} style={{ width: '100%', padding: '14px', gap: '5px'}}>
                                    <Texto weight={800}>{pedido.titulo}</Texto>
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
        </Container> 
    )
}

export default DashboardCard
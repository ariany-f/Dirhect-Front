import Titulo from '@components/Titulo'
import Botao from '@components/Botao'
import Texto from '@components/Texto'
import Container from '@components/Container'
import Frame from '@components/Frame'
import { Link } from 'react-router-dom'
import { FaWallet, FaArrowRight, FaUser, FaFileAlt, FaUserPlus, FaUserMinus, FaCalculator, FaLayerGroup, FaUmbrellaBeach } from 'react-icons/fa'
import styles from './DashboardCard.module.css'
import { Skeleton } from 'primereact/skeleton'
import { GrAddCircle } from 'react-icons/gr'
import { MdFilter9Plus, MdMan2, MdWoman, MdWoman2, MdWork } from 'react-icons/md'
import { AiOutlinePieChart } from 'react-icons/ai'
import { BsHourglassSplit } from 'react-icons/bs'

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
                            <Titulo><h6>Mês Atual</h6></Titulo>
                            <Link to="/beneficio"><Texto weight={500} color={'var(--neutro-500)'}>Ver mais&nbsp;<FaArrowRight /></Texto></Link>
                        </Frame>
                        <Frame estilo="spaced">
                            <div className={styles.right}>
                                <Texto size="14px" weight={500} color={'var(--neutro-500)'}>Admissões</Texto>
                                <div className={styles.transacao}><FaUserPlus />&nbsp;&nbsp;<Texto weight={800} size="16px">{10}</Texto></div>
                            </div>
                            <div className={styles.right}>
                                <Texto size="14px" weight={500} color={'var(--neutro-500)'}>Demissões</Texto>
                                <div className={styles.transacao}><FaUserMinus />&nbsp;&nbsp;<Texto weight={800} size="16px">{2}</Texto></div>
                            </div>
                        </Frame>
                        <Frame estilo="spaced">
                            <Titulo><h6>Lançamentos de Folha</h6></Titulo>
                        </Frame>
                        <div className={styles.transacao}>
                            <div className={styles.empilhado}>
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
                            <div className={styles.right}>
                                <Texto weight={500} color={'var(--neutro-500)'}>Total de colaboradores</Texto>
                                <Texto weight={800}><FaUser />&nbsp;&nbsp;{colaboradores.length}</Texto>
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
                                <Texto weight={800}><MdWoman2 size={26}/>{colaboradores.length/2}</Texto>
                            </div>
                            <div className={styles.right}>
                                <Texto weight={800}><MdMan2 size={26}/>{colaboradores.length/2}</Texto>
                            </div>
                            <div className={styles.right}>
                                <Texto weight={800}><FaLayerGroup size={24}/>&nbsp;&nbsp;{colaboradores.length}</Texto>
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
                                <Texto size={'35px'} weight={800}><MdWork />&nbsp;&nbsp;{10}</Texto>
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
                                        <Texto size={'35px'} weight={800}><FaUmbrellaBeach />&nbsp;&nbsp;{12}</Texto>
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
                                        <Texto size={'35px'} weight={800}><BsHourglassSplit />&nbsp;&nbsp;{3}</Texto>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Container> 
    )
}

export default DashboardCard
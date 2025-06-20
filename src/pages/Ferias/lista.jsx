import http from '@http'
import { useEffect, useState } from "react"
import Botao from '@components/Botao'
import BotaoGrupo from '@components/BotaoGrupo'
import { GrAddCircle } from 'react-icons/gr'
import styles from './Contratos.module.css'
import styled from "styled-components"
import { Link, useOutletContext } from "react-router-dom"
import Management from '@assets/Management.svg'
import DataTableFerias from '@components/DataTableFerias'
import ModalFerias from '@components/ModalFerias'
import ModalDetalhesFerias from '@components/ModalDetalhesFerias'
import { Calendar, Views, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useSessaoUsuarioContext } from '@contexts/SessaoUsuario';
import CalendarFerias from './calendar_ferias'
import { FaListUl, FaRegCalendarAlt } from 'react-icons/fa';
import Texto from '@components/Texto';
import { ArmazenadorToken } from '@utils';

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`

const ContainerSemRegistro = styled.div`
    display: flex;
    padding: 96px 12px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 48px;
    width: 100%;
    text-align: center;
    & p {
        margin: 0 auto;
    }

    & h6 {
        width: 60%;
    }
`

const HeaderRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
`;

const TabPanel = styled.div`
    display: flex;
    align-items: center;
    gap: 0;
`

const TabButton = styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
    background: ${({ active }) => active ? 'linear-gradient(to left, #0c004c, #5d0b62)' : '#f5f5f5'};
    color: ${({ active }) => active ? '#fff' : '#333'};
    border: none;
    border-radius: 8px 8px 0 0;
    font-size: 16px;
    font-weight: 500;
    padding: 10px 22px;
    cursor: pointer;
    margin-right: 2px;
    box-shadow: ${({ active }) => active ? '0 2px 8px #5d0b6240' : 'none'};
    transition: background 0.2s, color 0.2s;
    outline: none;
    border-bottom: ${({ active }) => active ? '2px solid #5d0b62' : '2px solid transparent'};
    &:hover {
        background: ${({ active }) => active ? 'linear-gradient(to left, #0c004c, #5d0b62)' : '#ececec'};
    }
`

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    overflow-y: auto;
    max-height: 73vh;
    
    &::-webkit-scrollbar {
        height: 8px;
        width: 8px;
        background: #f5f5f5;
        border-radius: 8px;
    }
    &::-webkit-scrollbar-thumb {
        background: #d1d5db;
        border-radius: 8px;
    }
    &::-webkit-scrollbar-thumb:hover {
        background: #b0b7c3;
    }
    &::-webkit-scrollbar-button {
        display: none;
        width: 0;
        height: 0;
    }
`

// Configurar o localizador com Moment.js
const localizer = momentLocalizer(moment);

function FeriasListagem() {

    const [ferias, setFerias] = useState(null)
    const context = useOutletContext()
    const [modalSelecaoColaboradorOpened, setModalSelecaoColaboradorOpened] = useState(false)
    const [eventoSelecionado, setEventoSelecionado] = useState(null)
    const { usuario } = useSessaoUsuarioContext()
    const [tab, setTab] = useState('calendario') // 'lista' ou 'calendario'

    useEffect(() => {
        if(!ferias)
        {
             http.get('ferias/?format=json')
             .then(response => {
                setFerias(response)
             })
             .catch(erro => {
 
             })
             .finally(function() {
             })
        }
        
     }, [ferias, context])

    const handleColaboradorSelecionado = (colaborador) => {
        setModalSelecaoColaboradorOpened(false);

        const evento = {
            colab: {
                id: colaborador.id,
                nome: colaborador.funcionario_pessoa_fisica?.nome,
                gestor: colaborador.gestor,
            },
            evento: {
                periodo_aquisitivo_inicio: '2024-01-01',
                periodo_aquisitivo_fim: '2024-12-31',
                saldo_dias: 30,
                limite: '2025-11-30',
            },
            tipo: 'aSolicitar'
        };
        setEventoSelecionado(evento);
    }

    return (
        <ConteudoFrame>
            <HeaderRow>
                <TabPanel>
                    <TabButton active={tab === 'calendario'} onClick={() => setTab('calendario')}>
                        <FaRegCalendarAlt fill={tab === 'calendario' ? 'white' : '#000'} />
                        <Texto color={tab === 'calendario' ? 'white' : '#000'}>Calendário</Texto>
                    </TabButton>
                    <TabButton active={tab === 'lista'} onClick={() => setTab('lista')}>
                        <FaListUl fill={tab === 'lista' ? 'white' : '#000'} />
                        <Texto color={tab === 'lista' ? 'white' : '#000'}>Lista</Texto>
                    </TabButton>
                </TabPanel>
                {(ArmazenadorToken.hasPermission('view_ferias') || usuario.tipo === 'colaborador') && (
                    <BotaoGrupo>
                        <Botao aoClicar={() => setModalSelecaoColaboradorOpened(true)} estilo="vermilion" size="small" tab><GrAddCircle className={styles.icon}/> Criar solicitação de Férias</Botao>
                    </BotaoGrupo>
                )}
            </HeaderRow>
            <Wrapper>
                {ferias ?
                    <>
                        {tab === 'calendario' && <CalendarFerias colaboradores={ferias} />}
                        {tab === 'lista' && <DataTableFerias ferias={ferias} />}
                    </>
                :
                <ContainerSemRegistro>
                <section className={styles.container}>
                        <img src={Management} />
                        <h6>Não há férias registrados</h6>
                        <p>Aqui você verá todas as ausências registradas.</p>
                    </section>
                </ContainerSemRegistro>}
            </Wrapper>
            <ModalFerias 
                opened={modalSelecaoColaboradorOpened} 
                aoFechar={() => setModalSelecaoColaboradorOpened(false)} 
                aoSelecionar={handleColaboradorSelecionado}
            />
            <ModalDetalhesFerias 
                opened={!!eventoSelecionado} 
                evento={eventoSelecionado} 
                aoFechar={() => setEventoSelecionado(null)} 
            />
        </ConteudoFrame>
    )
}

export default FeriasListagem
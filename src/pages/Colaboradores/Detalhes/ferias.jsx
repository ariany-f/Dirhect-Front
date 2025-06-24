import Titulo from '@components/Titulo'
import QuestionCard from '@components/QuestionCard'
import BotaoGrupo from '@components/BotaoGrupo'
import Botao from '@components/Botao'
import { AiFillQuestionCircle } from 'react-icons/ai'
import styled from 'styled-components'
import { useParams, useOutletContext } from 'react-router-dom'
import { useEffect, useState } from 'react'
import http from '@http'
import Loading from '@components/Loading'
import styles from './Detalhes.module.css'
import DataTableDependentes from '@components/DataTableDependentes'
import DataTableFerias from '@components/DataTableFerias'
import { useSessaoUsuarioContext } from '../../../contexts/SessaoUsuario'
import { GrAddCircle } from 'react-icons/gr'
import ModalDetalhesFerias from '@components/ModalDetalhesFerias'
import { ArmazenadorToken } from '@utils'
import { FaUmbrellaBeach } from 'react-icons/fa'

const DivPrincipal = styled.div`
    width: 65vw;
`

function ColabroadorFerias() {

    let { id } = useParams()
    const colaboradorDoContexto = useOutletContext();
    const [loading, setLoading] = useState(false)
    const [eventoSelecionado, setEventoSelecionado] = useState(null)
    const [ferias, setFerias] = useState(null)
    const {usuario} = useSessaoUsuarioContext()

    const colaborador = colaboradorDoContexto ? {
        ...colaboradorDoContexto,
        feriasARequisitar: [
            {
                periodo_aquisitivo_inicio: '2024-01-01',
                periodo_aquisitivo_fim: '2024-12-31',
                saldo_dias: 30,
                limite: '2025-11-30',
            }
        ]
    } : null;

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
    }, [ferias])

    const criarSolicitacao = () => {
        if (colaborador && colaborador.feriasARequisitar && colaborador.feriasARequisitar.length > 0) {
            const periodo = colaborador.feriasARequisitar[0];
            const evento = {
                colab: {
                    id: colaborador.id,
                    nome: colaborador.funcionario_pessoa_fisica?.nome,
                    gestor: colaborador.gestor,
                },
                evento: { ...periodo },
                tipo: 'aSolicitar'
            };
            setEventoSelecionado(evento);
        } else {
            alert("Não há períodos de férias disponíveis para solicitação no momento.");
        }
    }

    return (
        <>
            <Loading opened={loading} />
            <BotaoGrupo align="space-between">
                <Titulo>
                    <QuestionCard alinhamento="start" element={<h6>Férias</h6>}>
                        <AiFillQuestionCircle className="question-icon" size={20} />
                    </QuestionCard>
                </Titulo>
                {(ArmazenadorToken.hasPermission('view_ferias') || usuario.tipo === 'colaborador') && 
                    <BotaoGrupo align="end">
                        <BotaoGrupo align="center">
                            <Botao aoClicar={criarSolicitacao} estilo="vermilion" size="small" tab><FaUmbrellaBeach className={styles.icon} fill="white" color="white"/> Solicitar Férias</Botao>
                        </BotaoGrupo>
                    </BotaoGrupo>
                }
            </BotaoGrupo>
            <DataTableFerias colaborador={id} ferias={ferias}/>
            <ModalDetalhesFerias opened={!!eventoSelecionado} evento={eventoSelecionado} aoFechar={() => setEventoSelecionado(null)} />
        </>
    )
}

export default ColabroadorFerias
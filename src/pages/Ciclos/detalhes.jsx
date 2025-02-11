import styles from './Ciclos.module.css'
import styled from "styled-components"
import { Link, Outlet, useLocation, useParams } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import Texto from '@components/Texto'
import Frame from '@components/Frame'
import Titulo from '@components/Titulo'
import Botao from '@components/Botao'
import { Skeleton } from 'primereact/skeleton'
import Container from "@components/Container"
import { FaArrowAltCircleRight, FaTrash } from 'react-icons/fa'
import BotaoVoltar from "@components/BotaoVoltar"
import Loading from '@components/Loading'
import BotaoGrupo from "@components/BotaoGrupo"
import BotaoSemBorda from "@components/BotaoSemBorda"
import { Toast } from 'primereact/toast'
import { useVagasContext } from '@contexts/VagasContext'; // Importando o contexto
import DataTableEventosCiclos from '../../components/DataTableEventosCiclos'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { addLocale } from 'primereact/api'
import events from '@json/ciclos.json'
import FrameVertical from '../../components/FrameVertical'
import { Tag } from 'primereact/tag'

let Real = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`

function DetalhesCiclos() {

    let { id } = useParams()
    const location = useLocation();
    const [ciclo, setCiclo] = useState([])
    const toast = useRef(null)
    const [loading, setLoading] = useState(false)
   
    useEffect(() => {
        if(ciclo.length == 0)
        {
            let cc = events.filter(evento => evento.id == id);
            setCiclo(cc)
        }
    }, [ciclo])


    function representativSituacaoTemplate() {
        let status = ciclo[0]?.status;
        
        switch(ciclo[0]?.status)
        {
            case 'Aberta':
                status = <Tag severity="success" value="Aberto"></Tag>;
                break;
            case 'Fechada':
                status = <Tag severity="primary" value="Fechado"></Tag>;
                break;
        }
        return status
    }
    
    return (
        <>
        <Frame>
            <Toast ref={toast} />
            <Loading opened={loading} />
            <ConfirmDialog />
            <Container gap="32px">
                <BotaoVoltar linkFixo="/ciclos" />
                {ciclo && ciclo[0]?.tipo ?
                    <>
                    <BotaoGrupo align="space-betweeen">
                        <FrameVertical gap="10px">
                            <h3>{ciclo[0].tipo} - {ciclo[0].data}</h3>
                            {representativSituacaoTemplate()}
                        </FrameVertical>
                    </BotaoGrupo>
                    <div className={styles.card_dashboard}>
                    <Texto>Pagamento</Texto>
                    {ciclo[0]?.data_referencia ?
                        <Texto weight="800">{ciclo[0]?.data_referencia}</Texto>
                        : <Skeleton variant="rectangular" width={200} height={25} />
                    }
                </div>
                    </>
                    : <></>
                }
                <DataTableEventosCiclos eventos={ciclo[0]?.detalhes} />
            </Container>
        </Frame>
        {/* <Frame>
            <Toast ref={toast} />
            <Loading opened={loading} />
            <ConfirmDialog />
            <Container gap="32px">
                <BotaoVoltar linkFixo="/admissao/validar" />
                    {candidate?.nome ? 
                        <BotaoGrupo align="space-between">
                            <Titulo>
                                <h3>{candidate?.nome}</h3>
                            </Titulo>
                            <BotaoGrupo align="space-between">
                                <Botao aoClicar={() => validar()} estilo="vermilion" size="medium" filled><FaArrowAltCircleRight fill="white" />Validar</Botao>
                            </BotaoGrupo>
                     </BotaoGrupo>
                    : <Skeleton variant="rectangular" width={300} height={40} />
                    }
                <div className={styles.card_dashboard}>
                    <Texto>Titulo</Texto>
                    {vaga?.titulo ?
                        <Texto weight="800">{vaga?.titulo}</Texto>
                        : <Skeleton variant="rectangular" width={200} height={25} />
                    }
                    <Texto>Descrição</Texto>
                    {vaga ?
                        (vaga?.descricao ?
                            <Texto weight="800">{vaga?.descricao}</Texto>
                            : '--')
                        : <Skeleton variant="rectangular" width={200} height={25} />
                    }
                    <Texto>Salário</Texto>
                    {vaga?.salario ?
                        <Texto weight="800">{Real.format(vaga?.salario)}</Texto>
                        : <Skeleton variant="rectangular" width={200} height={25} />
                    }
                </div>
                <div className={styles.card_dashboard}>
                    <Texto>Candidato</Texto>
                    {candidate?.nome ?
                        <Texto weight="800">{candidate?.nome}</Texto>
                        : <Skeleton variant="rectangular" width={200} height={25} />
                    }
                    <Texto>E-mail</Texto>
                    {candidate?.email ?
                        <Texto weight="800">{candidate?.email}</Texto>
                        : <Skeleton variant="rectangular" width={200} height={25} />
                    }
                </div>
            </Container>
        </Frame> */}
        </>
    )
}

export default DetalhesCiclos
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
import { FaArrowAltCircleRight, FaDownload, FaTrash } from 'react-icons/fa'
import BotaoVoltar from "@components/BotaoVoltar"
import Loading from '@components/Loading'
import BotaoGrupo from "@components/BotaoGrupo"
import BotaoSemBorda from "@components/BotaoSemBorda"
import { Toast } from 'primereact/toast'
import { useVagasContext } from '@contexts/VagasContext'; // Importando o contexto
import DataTableEventosCiclos from '../../components/DataTableEventosCiclos'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { addLocale } from 'primereact/api'
import ciclos from '@json/ciclos.json'
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
            let cc = ciclos.filter(evento => evento.id == id);
            if(cc.length > 0)
            {
                setCiclo(cc[0])
            }
        }
    }, [ciclo])


    function representativSituacaoTemplate() {
        let status = ciclo?.status;
        
        switch(ciclo?.status)
        {
            case 'Aberta':
                status = <Tag severity="success" value="Aberto"></Tag>;
                break;
            case 'Fechada':
                status = <Tag severity="danger" value="Fechado"></Tag>;
                break;
        }
        return status
    }

    
    function representativeMonthTemplate() {
        const mes = ciclo.data_referencia.month;
        const nomeMes = new Date(2000, mes - 1, 1).toLocaleString('pt-BR', { month: 'long' });

        return nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1);
    };
    
    return (
        <>
        <Frame>
            <Toast ref={toast} />
            <Loading opened={loading} />
            <ConfirmDialog />
            <Container gap="32px">
                <BotaoVoltar linkFixo="/ciclos" />
                {ciclo && ciclo?.tipo ?
                    <>
                    <BotaoGrupo align="space-between">
                        <FrameVertical gap="10px">
                            <h3>{ciclo.tipo} - {representativeMonthTemplate()} {ciclo.data_referencia.year}</h3>
                            {representativSituacaoTemplate()}
                        </FrameVertical>
                        <BotaoGrupo align="center">
                            <BotaoSemBorda color="var(--primaria)">
                                <FaDownload/><Link onClick={() => setModalOpened(true)} className={styles.link}>Importar planilha</Link>
                            </BotaoSemBorda>
                        </BotaoGrupo>
                    </BotaoGrupo>
                    <div className={styles.card_dashboard}>
                        <Texto>Data de Pagamento</Texto>
                        {ciclo?.data ?
                            <Texto weight="800">{ciclo?.data}</Texto>
                            : <Skeleton variant="rectangular" width={200} height={25} />
                        }
                    </div>
                    </>
                    : <></>
                }
                <DataTableEventosCiclos eventos={ciclo?.detalhes} />
            </Container>
        </Frame>
        </>
    )
}

export default DetalhesCiclos
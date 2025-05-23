import styles from './Vagas.module.css'
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
import BotaoGrupo from "@components/BotaoGrupo"
import BotaoSemBorda from "@components/BotaoSemBorda"
import { Toast } from 'primereact/toast'
import { useVagasContext } from '@contexts/VagasContext'; // Importando o contexto
import DataTableCandidatos from '@components/DataTableCandidatos'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { addLocale } from 'primereact/api'
import ModalEncaminharVaga from '@components/ModalEncaminharVaga'
import { Real } from '@utils/formats'
import { Tag } from 'primereact/tag'

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`

function DetalhesVaga() {

    let { id } = useParams()
    const location = useLocation();
    const [vaga, setVaga] = useState(null)
    const [modalOpened, setModalOpened] = useState(false)
    const toast = useRef(null)

    const { 
        vagas,
        setVagas
    } = useVagasContext()

    const cancelarVaga = () => {
        console.log(vaga)
        confirmDialog({
            message: 'Você quer cancelar essa vaga?',
            header: 'Desativar',
            icon: 'pi pi-info-circle',
            accept: () => {
               
            },
            reject: () => {

            },
        });
    }

    const abrirModal = () => {
        setModalOpened(true)
    }

    useEffect(() => {
        if(!vaga)
        {
            const obj = vagas.vagas;
            const vg = [...obj.abertas, ...obj.canceladas].find(item => item.id == id);

            if(vg) {
                setVaga(vg)
            }
          
        }
    }, [])
    
    return (
        <>
        <Frame>
            <Toast ref={toast} />
            <ConfirmDialog />
            <Container gap="32px">
                <BotaoVoltar linkFixo="/vagas" />
                    {vaga?.titulo ? 
                        <BotaoGrupo align="space-between">
                            <Titulo>
                                <h3 style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    {vaga?.titulo}
                                    {vaga?.status && (
                                        <Tag
                                            value={vaga.status}
                                            style={{
                                                backgroundColor: vaga.status === 'Ativa' ? 'var(--green-500)' : 'var(--error)',
                                                color: 'white',
                                                fontWeight: 600,
                                                fontSize: 13,
                                                borderRadius: 8,
                                                padding: '4px 12px',
                                                textTransform: 'capitalize'
                                            }}
                                        />
                                    )}
                                </h3>
                            </Titulo>
                            <BotaoGrupo align="space-between">
                                <Botao aoClicar={abrirModal} size="small">
                                    <FaArrowAltCircleRight fill="white" />
                                    Encaminhar vaga para novo candidato
                                </Botao>
                                <BotaoSemBorda $color="var(--primaria)">
                                    <FaTrash /><Link onClick={cancelarVaga}>Cancelar vaga</Link>
                                </BotaoSemBorda>
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
                <Titulo>
                    <h5>Candidatos</h5>
                </Titulo>
                <DataTableCandidatos candidatos={vaga?.candidatos} />
            </Container>
            <ModalEncaminharVaga opened={modalOpened} aoFechar={() => setModalOpened(false)} />
        </Frame>
        </>
    )
}

export default DetalhesVaga
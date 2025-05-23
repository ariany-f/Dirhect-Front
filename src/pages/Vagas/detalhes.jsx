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
import DataTableDocumentos from '@components/DataTableDocumentos'
import ModalDocumentoRequerido from '@components/ModalDocumentoRequerido'
import { GrAdd, GrAddCircle } from 'react-icons/gr'

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`

const Col12 = styled.div`
    display: flex;
    flex-direction: row;
    gap: 10px;
`

const Col6 = styled.div`
    flex: 1 1 calc(50% - 10px);
`

function DetalhesVaga() {

    let { id } = useParams()
    const location = useLocation();
    const [vaga, setVaga] = useState(null)
    const [modalOpened, setModalOpened] = useState(false)
    const toast = useRef(null)
    const [documentos, setDocumentos] = useState([]);
    const [modalDocumentoAberto, setModalDocumentoAberto] = useState(false);
    const [documentoEditando, setDocumentoEditando] = useState(null);

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
                    <Col12>
                        <Col6>
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
                            <Texto>Deficiência</Texto>
                            <Texto weight="800">{vaga?.deficiencia ? 'Sim' : 'Não'}</Texto>
                            <Texto>Quantidade de Vagas</Texto>
                            <Texto weight="800">{vaga?.qtd_vagas ?? '--'}</Texto>
                            <Texto>Inclusiva</Texto>
                            <Texto weight="800">{vaga?.inclusao ? 'Sim' : 'Não'}</Texto>
                            {vaga?.inclusao && (
                                <>
                                    <Texto>Inclusiva para quem?</Texto>
                                    <Texto weight="800">{vaga?.inclusao_para || '--'}</Texto>
                                </>
                            )}
                        </Col6>
                        <Col6>
                            <Texto>Filial</Texto>
                            {vaga?.filial ?
                                <Texto weight="800">{vaga?.filial}</Texto>
                                : <Skeleton variant="rectangular" width={200} height={25} />
                            }   
                            <Texto>Secao</Texto>
                            {vaga?.secao ?
                                <Texto weight="800">{vaga?.secao}</Texto>
                                : <Skeleton variant="rectangular" width={200} height={25} />
                            }   
                            <Texto>Cargo</Texto>
                            {vaga?.cargo ?
                                <Texto weight="800">{vaga?.cargo}</Texto>
                                : <Skeleton variant="rectangular" width={200} height={25} />
                            }
                            <Texto>Horario</Texto>
                            {vaga?.horario ?
                                <Texto weight="800">{vaga?.horario}</Texto>
                                : <Skeleton variant="rectangular" width={200} height={25} />
                            }
                            <Texto>Funcao</Texto>
                            {vaga?.funcao ?
                                <Texto weight="800">{vaga?.funcao}</Texto>
                                : <Skeleton variant="rectangular" width={200} height={25} />
                            }
                            <Texto>Sindicato</Texto>
                            {vaga?.sindicato ?  
                                <Texto weight="800">{vaga?.sindicato}</Texto>   
                                : <Skeleton variant="rectangular" width={200} height={25} />
                            }  
                        </Col6>
                    </Col12>
                    
                </div>
                <Titulo>
                    <h5>Candidatos</h5>
                </Titulo>
                <DataTableCandidatos candidatos={vaga?.candidatos} />
                <Titulo>
                    <h5>Documentos Requeridos</h5>
                </Titulo>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
                    <Botao size="small" aoClicar={() => { setDocumentoEditando(null); setModalDocumentoAberto(true); }}>
                        <GrAddCircle stroke="white" /> Adicionar documento requerido
                    </Botao>
                </div>
                <DataTableDocumentos
                    documentos={documentos}
                    onEdit={doc => { setDocumentoEditando(doc); setModalDocumentoAberto(true); }}
                    onDelete={doc => setDocumentos(documentos.filter(d => d !== doc))}
                />
                <ModalDocumentoRequerido
                    opened={modalDocumentoAberto}
                    documento={documentoEditando}
                    aoFechar={() => setModalDocumentoAberto(false)}
                    aoSalvar={doc => {
                        if (documentoEditando) {
                            setDocumentos(documentos.map(d => d === documentoEditando ? doc : d));
                        } else {
                            setDocumentos([...documentos, doc]);
                        }
                        setModalDocumentoAberto(false);
                    }}
                />
            </Container>
            <ModalEncaminharVaga opened={modalOpened} aoFechar={() => setModalOpened(false)} />
        </Frame>
        </>
    )
}

export default DetalhesVaga
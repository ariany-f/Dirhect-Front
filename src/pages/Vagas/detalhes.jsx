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
import { FaArrowAltCircleRight, FaDoorOpen, FaEdit, FaPen, FaTrash, FaExchangeAlt } from 'react-icons/fa'
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
import DataTableDocumentosVaga from '@components/DataTableDocumentosVaga'
import ModalDocumentoVaga from '@components/ModalDocumentoVaga'
import { GrAdd, GrAddCircle } from 'react-icons/gr'
import http from '@http'
import ModalVaga from '@components/ModalVaga'
import ModalTransferirVaga from '@components/ModalTransferirVaga'
// import documentos from '@json/documentos_requeridos.json'
import { unformatCurrency } from '@utils/formats'

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
    const [modalEditarAberto, setModalEditarAberto] = useState(false);
    const [modalTransferirAberto, setModalTransferirAberto] = useState(false);

    const listaPericulosidades = [
        { code: 'QC', name: 'Trabalho com Substâncias Químicas Perigosas' },
        { code: 'MP', name: 'Atividades com Máquinas e Equipamentos Pesados' },
        { code: 'HA', name: 'Trabalho em Altura' },
        { code: 'RA', name: 'Exposição a Radiação' },
        { code: 'TE', name: 'Trabalho com Energia Elétrica' },
        { code: 'CE', name: 'Exposição ao Calor Excessivo' },
        { code: 'PE', name: 'Atividades com Produtos Explosivos' },
        { code: 'CA', name: 'Trabalho em Ambientes Confinados' },
        { code: 'SA', name: 'Atividades Subaquáticas' },
        { code: 'RAU', name: 'Exposição a Ruídos Altos' },
        { code: 'PB', name: 'Perigos Biológicos' },
        { code: 'TE', name: 'Exposição a Temperaturas Extremas' },
        { code: 'DA', name: 'Trabalho em Áreas de Desastres ou Emergências' },
        { code: 'MC', name: 'Manipulação de Materiais Cortantes' },
        { code: 'SC', name: 'Exposição a Substâncias Cancerígenas' }
    ];

    function getPericulosidadeName(code) {
        const item = listaPericulosidades.find(p => p.code === code);
        return item ? item.name : '--';
    }

    function getStatusVaga(status, dt_encerramento) {
        const hoje = new Date();
        const encerramento = new Date(dt_encerramento);
        const inicio = new Date(vaga?.dt_inicio);
        
        if (status === 'T') {
            return 'Transferida';
        }
        if (hoje > encerramento) {
            return 'Encerrada';
        }
        if (inicio && hoje < inicio) {
            return 'Aguardando';
        }
        return status === 'A' ? 'Aberta' : 'Fechada';
    }

    function getStatusColor(status, dt_encerramento) {
        const hoje = new Date();
        const encerramento = new Date(dt_encerramento);
        const inicio = new Date(vaga?.dt_inicio);
        
        if (status === 'T') {
            return 'var(--blue-500)';
        }
        if (hoje > encerramento) {
            return 'var(--error)';
        }
        if (inicio && hoje < inicio) {
            return 'var(--yellow-500)';
        }
        return status === 'A' ? 'var(--green-500)' : 'var(--error)';
    }

    // Função para verificar se a vaga está aguardando
    const vagaAguardando = () => {
        const hoje = new Date();
        const inicio = new Date(vaga?.dt_inicio);
        return inicio && hoje < inicio;
    }

    // Função para verificar se a vaga está encerrada
    const vagaEncerrada = () => {
        const hoje = new Date();
        const encerramento = new Date(vaga?.dt_encerramento);
        return hoje > encerramento;
    }

    // Função para buscar documentos da vaga
    const fetchDocumentosVaga = () => {
        http.get(`vagas_documentos/?format=json&vaga=${id}`)
            .then(response => {
                setDocumentos(response)
            })
            .catch(error => {
                console.error('Erro ao carregar documentos da vaga:', error)
            })
    }

    useEffect(() => {
        http.get(`vagas/${id}/?format=json`)
            .then(response => {
                setVaga(response)
            })
            .catch(error => {
                console.error('Erro ao carregar vaga:', error)
            })

        fetchDocumentosVaga();
    }, [])

    const { 
        vagas,
        setVagas
    } = useVagasContext()

    const reabrirVaga = () => {
        confirmDialog({
            message: 'Você quer reabrir essa vaga?',
            header: 'Reabrir',
            icon: 'pi pi-info-circle',
            accept: () => {
                http.put(`vagas/${id}/`, {
                    ...vaga,
                    status: 'A'
                })
                .then(response => {
                    toast.current.show({ 
                        severity: 'success', 
                        summary: 'Sucesso', 
                        detail: 'Vaga reaberta com sucesso!', 
                        life: 3000 
                    });
                    // Atualiza o estado local da vaga
                    setVaga(response);
                })
                .catch(error => {
                    console.error('Erro ao reabrir vaga:', error);
                    toast.current.show({ 
                        severity: 'error', 
                        summary: 'Erro', 
                        detail: 'Erro ao reabrir vaga', 
                        life: 3000 
                    });
                });
            },
            reject: () => {
                // Não faz nada se o usuário rejeitar
            },
        });
    }

    const cancelarVaga = () => {
        confirmDialog({
            message: 'Você quer cancelar essa vaga?',
            header: 'Desativar',
            icon: 'pi pi-info-circle',
            accept: () => {
                http.put(`vagas/${id}/`, {
                    ...vaga,
                    status: 'F'
                })
                .then(response => {
                    toast.current.show({ 
                        severity: 'success', 
                        summary: 'Sucesso', 
                        detail: 'Vaga cancelada com sucesso!', 
                        life: 3000 
                    });
                    // Atualiza o estado local da vaga
                    setVaga(response);
                })
                .catch(error => {
                    console.error('Erro ao cancelar vaga:', error);
                    toast.current.show({ 
                        severity: 'error', 
                        summary: 'Erro', 
                        detail: 'Erro ao cancelar vaga', 
                        life: 3000 
                    });
                });
            },
            reject: () => {
                // Não faz nada se o usuário rejeitar
            },
        });
    }

    const abrirModal = () => {
        setModalOpened(true)
    }

    const handleSalvarCandidato = (
        candidatoId = null,
        nome,
        email,
        mensagem,
        content,
        cpf,
        nascimento,
        telefone,
        filial,
        dataInicio,
        centroCusto,
        salario,
        periculosidade,
        dataExameMedico
    ) => {
        // Remove caracteres não numéricos do CPF e salário
        const cpfNumerico = cpf.replace(/\D/g, '');
        const salarioNumerico = salario ? 
            Math.floor(Number(unformatCurrency(salario)) / 100)
            : null;

        const dadosCandidato = {
            nome,
            email,
            observacao: mensagem,
            content,
            cpf: cpfNumerico,
            dt_nascimento: nascimento,
            telefone,
            filial,
            dt_inicio: dataInicio,
            centroCusto,
            salario: salarioNumerico,
            periculosidade: periculosidade?.code,
            dt_exame_medico: dataExameMedico,
            vaga_id: id
        };

        // Se tiver candidatoId, faz PUT, senão faz POST
        const method = candidatoId ? 'put' : 'post';
        const url = candidatoId ? `candidato/${candidatoId}/` : 'candidato/';
        const successMessage = candidatoId ? 'Candidato atualizado com sucesso!' : 'Candidato encaminhado com sucesso!';
        const errorMessage = candidatoId ? 'Erro ao atualizar candidato' : 'Erro ao encaminhar candidato';

        // Ao adicionar candidato precisa configurar a vaga_candidato para "S"
        http[method](url, dadosCandidato)
        .then(response => {
            toast.current.show({ severity: 'success', summary: 'Sucesso', detail: successMessage, life: 3000 });
            setModalOpened(false);
            // Recarrega os dados da vaga
            http.get(`vagas/${id}/?format=json`)
                .then(response => {
                    setVaga(response);
                })
                .catch(error => {
                    console.error('Erro ao recarregar vaga:', error);
                });
        })
        .catch(error => {
            console.error('Erro ao salvar candidato:', error);
            toast.current.show({ severity: 'error', summary: 'Erro', detail: errorMessage, life: 3000 });
        });
    };

    const handleSalvarDocumentoVaga = (documento_nome, obrigatorio, documento) => {
        // Verifica se a vaga foi transferida
        if (vaga?.status === 'T') {
            toast.current.show({ 
                severity: 'warn', 
                summary: 'Ação não permitida', 
                detail: 'Não é possível adicionar documentos a vagas transferidas.', 
                life: 3000 
            });
            return;
        }

        http.post('/vagas_documentos/', {
            documento_nome: documento_nome,
            obrigatorio: obrigatorio,
            documento: documento?.id,
            vaga: id
        })
        .then(response => {
            fetchDocumentosVaga();
            setModalDocumentoAberto(false);
            toast.current.show({ 
                severity: 'success', 
                summary: 'Sucesso', 
                detail: 'Documento adicionado à vaga com sucesso!', 
                life: 3000 
            });
        })
        .catch(error => {   
            console.error('Erro ao salvar documento da vaga:', error);
            toast.current.show({ 
                severity: 'error', 
                summary: 'Erro', 
                detail: 'Erro ao adicionar documento à vaga.', 
                life: 3000 
            });
        });
    }

    const handleEditarVaga = (vagaAtualizada) => {
        http.put(`vagas/${id}/`, vagaAtualizada)
            .then(response => {
                setVaga(response);
                toast.current.show({
                    severity: 'success',
                    summary: 'Vaga atualizada com sucesso!',
                    life: 3000
                });
                setModalEditarAberto(false);
            })
            .catch(error => {
                console.error('Erro ao atualizar vaga:', error);
                toast.current.show({
                    severity: 'error',
                    summary: 'Erro ao atualizar vaga',
                    life: 3000
                });
            });
    };

    const handleTransferirVaga = (vagaAtualizada, clienteId) => {
        http.post(`vagas/${id}/transferir/`, {
            ...vagaAtualizada,
            tenant_destino: clienteId
        })
            .then(response => {
                toast.current.show({
                    severity: 'success',
                    summary: 'Vaga transferida com sucesso!',
                    life: 3000
                });
                setModalTransferirAberto(false);
                
                // Recarregar os dados completos da vaga após a transferência
                http.get(`vagas/${id}/?format=json`)
                    .then(response => {
                        setVaga(response);
                    })
                    .catch(error => {
                        console.error('Erro ao recarregar vaga após transferência:', error);
                    });
            })
            .catch(error => {
                console.error('Erro ao transferir vaga:', error);
                toast.current.show({
                    severity: 'error',
                    summary: 'Erro ao transferir vaga',
                    life: 3000
                });
            });
    };

    return (
        <>
        <Frame>
            <Toast ref={toast} />
            <ConfirmDialog />
            <Container gap="32px">
                <BotaoVoltar linkFixo="/vagas" />
                <ConteudoFrame>
                    {vaga?.titulo ? 
                        <BotaoGrupo align="space-between">
                            <Titulo>
                                <h3 style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    {vaga?.titulo}
                                    {vaga?.status && (
                                        <Tag
                                            value={getStatusVaga(vaga.status, vaga.dt_encerramento)}
                                            style={{
                                                backgroundColor: getStatusColor(vaga.status, vaga.dt_encerramento),
                                                color: 'white',
                                                fontWeight: 600,
                                                fontSize: 13,
                                                borderRadius: 8,
                                                padding: '4px 12px',
                                                textTransform: 'capitalize'
                                            }}
                                        />
                                    )}
                                    {vaga.status == 'A' && (
                                        <>
                                            <FaPen style={{ cursor: 'pointer' }} size={16} onClick={() => setModalEditarAberto(true)} fill="var(--primaria)" />
                                            <FaExchangeAlt style={{ cursor: 'pointer' }} size={16} onClick={() => setModalTransferirAberto(true)} fill="var(--primaria)" title="Transferir vaga" />
                                        </>
                                    )}

                                </h3>
                            </Titulo>
                            <BotaoGrupo align="space-between">
                                {vaga.status == 'A' && 
                                    <>
                                        <BotaoSemBorda $color="var(--primaria)">
                                            <FaTrash /><Link onClick={cancelarVaga}>Cancelar vaga</Link>
                                        </BotaoSemBorda>
                                        <Botao 
                                            aoClicar={abrirModal} 
                                            size="small"
                                            disabled={vagaAguardando() || vagaEncerrada()}
                                            title={
                                                vagaAguardando() ? "Não é possível encaminhar candidatos enquanto a vaga estiver aguardando" :
                                                vagaEncerrada() ? "Não é possível encaminhar candidatos para uma vaga encerrada" : ""
                                            }
                                        >
                                            <FaArrowAltCircleRight fill="white" />
                                            Encaminhar para novo candidato
                                        </Botao>
                                    </>
                                }
                                {vaga.status == 'F' && 
                                    <>
                                        <BotaoSemBorda $color="var(--primaria)">
                                            <FaDoorOpen /><Link onClick={reabrirVaga}>Reabrir vaga</Link>
                                        </BotaoSemBorda>
                                    </>
                                }
                                {vaga.status == 'T' && 
                                    <div style={{ color: 'var(--blue-500)', fontStyle: 'italic' }}>
                                        Esta vaga foi transferida para outra empresa
                                    </div>
                                }
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
                        </Col6>
                        <Col6>
                            <Texto>Filial</Texto>
                            {vaga?.filial_id ?
                                <Texto weight="800">{vaga?.filial_nome}</Texto>
                                : <Skeleton variant="rectangular" width={200} height={25} />
                            }   
                            <Texto>Secao</Texto>
                            {vaga?.secao_id ?
                                <Texto weight="800">{vaga?.secao_nome}</Texto>
                                : <Skeleton variant="rectangular" width={200} height={25} />
                            }   
                            <Texto>Cargo</Texto>
                            {vaga?.cargo_id ?
                                <Texto weight="800">{vaga?.cargo_nome}</Texto>
                                : <Skeleton variant="rectangular" width={200} height={25} />
                            }
                        </Col6>
                        <Col6>
                            <Texto>Horario</Texto>
                            {vaga?.horario_id ?
                                <Texto weight="800">{vaga?.horario_nome}</Texto>
                                : <Skeleton variant="rectangular" width={200} height={25} />
                            }
                            <Texto>Funcao</Texto>
                            {vaga?.funcao_id ?
                                <Texto weight="800">{vaga?.funcao_nome}</Texto>
                                : <Skeleton variant="rectangular" width={200} height={25} />
                            }
                            <Texto>Sindicato</Texto>
                            {vaga?.sindicato_id ?  
                                <Texto weight="800">{vaga?.sindicato_nome}</Texto>   
                                : <Skeleton variant="rectangular" width={200} height={25} />
                            }  
                        </Col6>
                    </Col12>
                    
                    <Col12>
                        <Col6>
                            <br/>
                            <Texto>Quantidade de Vagas</Texto>
                            <Texto weight="800">{vaga?.qtd_vaga ?? '--'}</Texto>
                            <Texto>Vaga para pessoas com deficiência</Texto>
                            <Texto weight="800">{vaga?.deficiencia ? 'Sim' : 'Não'}</Texto>
                        </Col6>
                        <Col6>
                            <br/>
                            <Texto>Vaga Inclusiva</Texto>
                            <Texto weight="800">{vaga?.inclusao ? 'Sim' : 'Não'}</Texto>
                            {vaga?.inclusao && (
                                <>
                                    <Texto>Inclusiva para quem?</Texto>
                                    <Texto weight="800">{vaga?.inclusao_para || '--'}</Texto>
                                </>
                            )}
                        </Col6>
                        <Col6>
                            <br/>
                            <Texto>Periculosidade</Texto>
                            <Texto weight="800">{getPericulosidadeName(vaga?.periculosidade)}</Texto>
                            <Texto>Insalubridade</Texto>
                            <Texto weight="800">{vaga?.insalubridade ? `${vaga.insalubridade}%` : '--'}</Texto>
                        </Col6>
                    </Col12>
                    
                </div>
                <Titulo>
                    <h5>Candidatos</h5>
                </Titulo>
                <DataTableCandidatos documentos={documentos} vagaId={vaga?.id} candidatos={vaga?.candidatos?.map(candidato => ({
                    ...candidato,
                    vaga: vaga
                }))} />
                <Titulo>
                    <h5>Documentos Requeridos da Vaga</h5>
                </Titulo>
                
                <BotaoGrupo align="space-between">
                    <div></div>
                    <BotaoGrupo align="space-between">
                        <Botao 
                            size="small" 
                            aoClicar={() => { setDocumentoEditando(null); setModalDocumentoAberto(true); }}
                            disabled={vaga?.status === 'T'}
                            title={vaga?.status === 'T' ? "Não é possível adicionar documentos em vagas transferidas" : ""}
                        >
                            <GrAddCircle stroke="white" /> Adicionar documento requerido
                        </Botao>
                    </BotaoGrupo>
                </BotaoGrupo>
                <DataTableDocumentosVaga
                    documentos={documentos}
                    vaga={vaga}
                    onEdit={doc => { setDocumentoEditando(doc); setModalDocumentoAberto(true); }}
                    onDelete={doc => setDocumentos(documentos.filter(d => d !== doc))}
                    toastRef={toast}
                />
                <ModalDocumentoVaga
                    opened={modalDocumentoAberto}
                    vaga={vaga}
                    documento={documentoEditando}
                    aoFechar={() => setModalDocumentoAberto(false)}
                    aoSalvar={handleSalvarDocumentoVaga}
                />
            </ConteudoFrame>
            <ModalEncaminharVaga 
                aoSalvar={handleSalvarCandidato} 
                opened={modalOpened} 
                aoFechar={() => setModalOpened(false)}
                periculosidadeInicial={vaga?.periculosidade ? listaPericulosidades.find(p => p.code === vaga.periculosidade) : null}
            />
            <ModalVaga 
                opened={modalEditarAberto}
                aoFechar={() => setModalEditarAberto(false)}
                vaga={vaga}
                aoSalvar={handleEditarVaga}
            />
            <ModalTransferirVaga 
                opened={modalTransferirAberto}
                aoFechar={() => setModalTransferirAberto(false)}
                vaga={vaga}
                aoSalvar={handleTransferirVaga}
            />
        </Container>
        </Frame>
        </>
    )
}

export default DetalhesVaga
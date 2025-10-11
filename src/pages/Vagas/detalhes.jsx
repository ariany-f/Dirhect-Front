import styles from './Vagas.module.css'
import styled from "styled-components"
import { Link, useLocation, useParams } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import Texto from '@components/Texto'
import Frame from '@components/Frame'
import Titulo from '@components/Titulo'
import Botao from '@components/Botao'
import { Skeleton } from 'primereact/skeleton'
import Container from "@components/Container"
import { FaArrowAltCircleRight, FaDoorOpen, FaPen, FaTrash, FaExchangeAlt } from 'react-icons/fa'
import BotaoVoltar from "@components/BotaoVoltar"
import BotaoGrupo from "@components/BotaoGrupo"
import BotaoSemBorda from "@components/BotaoSemBorda"
import { Toast } from 'primereact/toast'
import { useVagasContext } from '@contexts/VagasContext'; // Importando o contexto
import DataTableCandidatos from '@components/DataTableCandidatos'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { Real } from '@utils/formats'
import { Tag } from 'primereact/tag'
import DataTableDocumentosVaga from '@components/DataTableDocumentosVaga'
import ModalDocumentoVaga from '@components/ModalDocumentoVaga'
import { GrAddCircle } from 'react-icons/gr'
import http from '@http'
import ModalVaga from '@components/ModalVaga'
import ModalTransferirVaga from '@components/ModalTransferirVaga'
import ModalAdicionarCandidato from '@components/ModalAdicionarCandidato';
import ModalEditarCandidato from '@components/ModalEditarCandidato';
import ModalTags from '@components/ModalTags';
import ModalTemplateVaga from '@components/ModalTemplateVaga';
import { useTranslation } from 'react-i18next';
import { FaInfoCircle } from 'react-icons/fa';

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

const DescricaoComVerMais = ({ descricao }) => {
    const [showFullDescription, setShowFullDescription] = useState(false);
    const { t } = useTranslation('common');
    
    if (!descricao) {
        return <Texto weight="800">----</Texto>;
    }
    
    const maxLength = 145;
    const isLongText = descricao.length > maxLength;
    
    const displayText = showFullDescription || !isLongText 
        ? descricao 
        : descricao.substring(0, maxLength) + "...";

    return (
        <div style={{
            width: '100%',
            wordWrap: 'break-word',
            overflow: 'hidden'
        }}>
            <Texto weight="800" style={{
                margin: 0,
                marginBottom: isLongText ? '8px' : 0,
                lineHeight: '1.4'
            }}>
                {displayText}
            </Texto>
            {isLongText && (
                <div style={{ textAlign: 'right' }}>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowFullDescription(!showFullDescription);
                        }}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--primaria)',
                            cursor: 'pointer',
                            fontSize: '12px',
                            padding: '2px 0',
                            textDecoration: 'underline'
                        }}
                    >
                        {showFullDescription ? t('see_less') : t('see_more')}
                    </button>
                </div>
            )}
        </div>
    );
};

function DetalhesVaga() {

    let { id } = useParams()
    const location = useLocation();
    const [vaga, setVaga] = useState(null)
    const toast = useRef(null)
    const [documentos, setDocumentos] = useState([]);
    const [modalDocumentoAberto, setModalDocumentoAberto] = useState(false);
    const [documentoEditando, setDocumentoEditando] = useState(null);
    const [modalEditarAberto, setModalEditarAberto] = useState(false);
    const [modalTransferirAberto, setModalTransferirAberto] = useState(false);
    const [modalAdicionarCandidatoAberto, setModalAdicionarCandidatoAberto] = useState(false);
    const [modalEditarCandidatoAberto, setModalEditarCandidatoAberto] = useState(false);
    const [candidatoEditando, setCandidatoEditando] = useState(null);
    const [modalTagsAberto, setModalTagsAberto] = useState(false);
    const [modalTemplateVagaAberto, setModalTemplateVagaAberto] = useState(false);
    const [mostrarInfoTemplate, setMostrarInfoTemplate] = useState(false);
    const [tagsNomes, setTagsNomes] = useState([]);
    const { t } = useTranslation('common');

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
        const inicio = new Date(vaga?.dt_abertura);
        
        if (status === 'T') {
            return 'Transferida';
        }
        if (inicio && hoje < inicio) {
            return 'Aguardando';
        }
        if (encerramento && hoje > encerramento) {
            return 'Fora do Prazo';
        }
        
        switch (status) {
            case 'A':
                return 'Aberta';
            case 'F':
                return 'Fechada';
            case 'T':
                return 'Transferida';
            default:
                return 'Desconhecido';
        }
    }

    function getStatusColor(status, dt_encerramento) {
        const hoje = new Date();
        const encerramento = new Date(dt_encerramento);
        const inicio = new Date(vaga?.dt_abertura);
        
        if (status === 'T') {
            return 'var(--warning)';
        }
        if (inicio && hoje < inicio) {
            return 'var(--neutro-400)';
        }
        if (encerramento && hoje > encerramento) {
            return 'var(--warning)';
        }
        
        switch (status) {
            case 'A':
                return 'var(--green-500)';
            case 'F':
                return 'var(--error)';
            case 'T':
                return 'var(--warning)';
            default:
                return 'var(--neutro-400)';
        }
    }

    // Função para verificar se a vaga está aguardando
    const vagaAguardando = () => {
        const hoje = new Date();
        const inicio = new Date(vaga?.dt_abertura);
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
                
                // Buscar nomes das tags se existirem
                if (response.tags_nomes && Array.isArray(response.tags_nomes)) {
                    setTagsNomes(response.tags_nomes);
                } else if (response.tags && Array.isArray(response.tags) && response.tags.length > 0) {
                    // Se não vier tags_nomes, buscar da API
                    http.get(`/documento_requerido_tag/`)
                        .then(tagsResponse => {
                            const nomesEncontrados = response.tags.map(tagId => {
                                const tag = tagsResponse.find(t => t.id === tagId);
                                return tag ? tag.nome : null;
                            }).filter(nome => nome !== null);
                            setTagsNomes(nomesEncontrados);
                        })
                        .catch(error => {
                            console.error('Erro ao buscar tags:', error);
                        });
                } else {
                    setTagsNomes([]);
                }
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

    // Função para atualizar os candidatos quando necessário
    const handleCandidatosUpdate = () => {
        // Recarrega os dados da vaga (incluindo candidatos)
        http.get(`vagas/${id}/?format=json`)
            .then(response => {
                setVaga(response);
            })
            .catch(error => {
                console.error('Erro ao recarregar vaga:', error);
            });
    };

    const handleSalvarDocumentoVaga = (documento_nome, obrigatorio, documento) => {
        if (vaga?.status === 'T') {
            toast.current.show({ 
                severity: 'warn', 
                summary: 'Ação não permitida', 
                detail: 'Não é possível adicionar ou editar documentos em vagas transferidas.', 
                life: 3000 
            });
            return;
        }
    
        const payload = {
            documento_nome: documento_nome,
            obrigatorio: obrigatorio,
            documento: documento?.id,
            vaga: id
        };
    
        const isEditing = !!documentoEditando;
    
        const request = isEditing
            ? http.put(`/vagas_documentos/${documentoEditando.id}/`, payload)
            : http.post('/vagas_documentos/', payload);
    
        request.then(response => {
            fetchDocumentosVaga();
            setModalDocumentoAberto(false);
            setDocumentoEditando(null); // Limpa o estado de edição
            toast.current.show({ 
                severity: 'success', 
                summary: 'Sucesso', 
                detail: `Documento ${isEditing ? 'atualizado' : 'adicionado'} com sucesso!`, 
                life: 3000 
            });
        })
        .catch(error => {   
            console.error('Erro ao salvar documento da vaga:', error);
            toast.current.show({ 
                severity: 'error', 
                summary: 'Erro', 
                detail: `Erro ao ${isEditing ? 'atualizar' : 'adicionar'} documento à vaga.`, 
                life: 3000 
            });
        });
    }

    const handleEditarVaga = (vagaAtualizada) => {
        http.put(`vagas/${id}/`, vagaAtualizada)
            .then(response => {
                // Preserva os candidatos existentes ao atualizar a vaga
                const vagaComCandidatos = {
                    ...response,
                    candidatos: vaga?.candidatos || response.candidatos || []
                };
                setVaga(vagaComCandidatos);
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

    const handleAdicionarCandidato = async (dados) => {
        const {
            nome,
            email,
            cpf,
            nascimento,
            ddi,
            ddd,
            telefone
        } = dados;

        const cpfNumerico = (cpf || '').replace(/\D/g, '');

        const dadosCandidato = {
            nome: nome || '',
            email: email || '',
            content: '',
            cpf: cpfNumerico,
            dt_nascimento: (nascimento || '2000-01-01'),
            ddi: ddi || '',
            ddd: ddd || '',
            telefone: telefone || '',
            dt_inicio: '2023-01-01',
            salario: null,
            periculosidade: undefined,
            dt_exame_medico: '2023-01-01',
            vaga_id: id
        };

        try {
            const response = await http.post(`candidato/`, dadosCandidato);
            toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Candidato encaminhado com sucesso!', life: 3000 });
            setModalAdicionarCandidatoAberto(false);
            
            // Recarrega os dados da vaga
            const vagaResponse = await http.get(`vagas/${id}/?format=json`);
            setVaga(vagaResponse);
            
        } catch (error) {
            console.error('Erro ao adicionar candidato:', error);
            toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao encaminhar candidato', life: 3000 });
            throw error; // Re-throw o erro para que o modal saiba que falhou
        }
    };

    const handleEditarCandidato = (candidato) => {
        setCandidatoEditando(candidato);
        setModalEditarCandidatoAberto(true);
    };

    const handleSalvarEdicaoCandidato = (dados) => {
        const {
            id: candidatoId,
            nome,
            email,
            cpf,
            nascimento,
            telefone
        } = dados;

        const cpfNumerico = (cpf || '').replace(/\D/g, '');

        const dadosCandidato = {
            nome: nome || '',
            email: email || '',
            cpf: cpfNumerico,
            dt_nascimento: (nascimento || '2000-01-01'),
            telefone: telefone || '',
        };

        http.put(`candidato/${candidatoId}/`, dadosCandidato)
            .then(response => {
                toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Candidato atualizado com sucesso!', life: 3000 });
                setModalEditarCandidatoAberto(false);
                setCandidatoEditando(null);
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
                console.error('Erro ao atualizar candidato:', error);
                toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao atualizar candidato', life: 3000 });
            });
    };

    const handleSalvarTag = (tagsIds) => {
        http.put(`vagas/${id}/`, {
            tags: tagsIds
        })
            .then(response => {
                toast.current.show({ 
                    severity: 'success', 
                    summary: 'Sucesso', 
                    detail: tagsIds && tagsIds.length > 0 ? 'Tags atualizadas com sucesso!' : 'Tags removidas com sucesso!', 
                    life: 3000 
                });
                setModalTagsAberto(false);
                
                // Atualizar nomes das tags
                if (tagsIds && tagsIds.length > 0) {
                    http.get(`/documento_requerido_tag/`)
                        .then(tagsResponse => {
                            const nomesEncontrados = tagsIds.map(tagId => {
                                const tag = tagsResponse.find(t => t.id === tagId);
                                return tag ? tag.nome : null;
                            }).filter(nome => nome !== null);
                            setTagsNomes(nomesEncontrados);
                        })
                        .catch(error => {
                            console.error('Erro ao buscar tags:', error);
                        });
                } else {
                    setTagsNomes([]);
                }
                
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
                console.error('Erro ao salvar tags:', error);
                toast.current.show({ 
                    severity: 'error', 
                    summary: 'Erro', 
                    detail: 'Erro ao salvar tags', 
                    life: 3000 
                });
            });
    };

    const handleSalvarTemplate = (templateId) => {
        console.log('handleSalvarTemplate recebeu:', templateId);
        console.log('Tipo:', typeof templateId);
        
        const payload = {
            template_admissao: templateId
        };
        
        console.log('Payload do PUT:', payload);
        
        http.put(`vagas/${id}/`, payload)
            .then(response => {
                console.log('Resposta do PUT:', response);
                toast.current.show({ 
                    severity: 'success', 
                    summary: 'Sucesso', 
                    detail: templateId ? 'Template de admissão vinculado com sucesso!' : 'Template de admissão removido com sucesso!', 
                    life: 3000 
                });
                setModalTemplateVagaAberto(false);
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
                console.error('Erro ao salvar template:', error);
                console.error('Detalhes do erro:', error.response?.data);
                toast.current.show({ 
                    severity: 'error', 
                    summary: 'Erro', 
                    detail: 'Erro ao vincular template de admissão', 
                    life: 3000 
                });
            });
    };

    // Verifica se há candidato aprovado
    const temCandidatoAprovado = vaga?.candidatos_aprovados?.length > 0;
    
    // Verifica se ainda há vagas disponíveis para vincular template
    const temVagasDisponiveis = () => {
        if (!vaga || vaga.status !== 'A') return false;
        const candidatosAprovados = vaga?.candidatos_aprovados?.length || 0;
        const qtdVagas = vaga?.qtd_vaga || 0;
        return candidatosAprovados < qtdVagas;
    };

    // Verifica se deve mostrar aviso sobre candidatos já aprovados
    const deveAvisarCandidatosAprovados = () => {
        return temCandidatoAprovado && temVagasDisponiveis();
    };

    // Função para mostrar aviso e abrir modal de documento
    const abrirModalDocumento = () => {
        if (deveAvisarCandidatosAprovados()) {
            toast.current.show({
                severity: 'warn',
                summary: 'Atenção',
                detail: 'Os candidatos já aprovados não terão este novo documento vinculado à sua admissão. Apenas novos candidatos aprovados terão este documento solicitado.',
                life: 5000
            });
        }
        setDocumentoEditando(null);
        setModalDocumentoAberto(true);
    };

    // Função para mostrar aviso e abrir modal de tag
    const abrirModalTag = () => {
        if (deveAvisarCandidatosAprovados()) {
            toast.current.show({
                severity: 'warn',
                summary: 'Atenção',
                detail: 'Os candidatos já aprovados não terão os documentos desta nova tag vinculados à sua admissão. Apenas novos candidatos aprovados terão esses documentos solicitados.',
                life: 5000
            });
        }
        setModalTagsAberto(true);
    };
    
    return (
        <>
        <Frame>
            <Toast ref={toast} />
            <ConfirmDialog  />
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
                                    {vaga.status == 'A' && vaga.origem != 'E' && (
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
                                        <div style={{ flexShrink: 0 }}>
                                        <BotaoSemBorda $color="var(--primaria)">
                                            <FaTrash /><Link onClick={cancelarVaga}>Cancelar vaga</Link>
                                        </BotaoSemBorda>
                                        </div>
                                        <Botao 
                                            aoClicar={() => setModalAdicionarCandidatoAberto(true)} 
                                            size="small"
                                            disabled={vagaAguardando() || vagaEncerrada()}
                                            title={
                                                vagaAguardando() ? "Não é possível adicionar candidatos enquanto a vaga estiver aguardando" :
                                                vagaEncerrada() ? "Não é possível adicionar candidatos para uma vaga encerrada" : ""
                                            }
                                        >
                                            <FaArrowAltCircleRight fill="var(--secundaria)" />
                                            Adicionar Candidato
                                        </Botao>
                                    </>
                                }
                                {vaga.status == 'F' && 
                                    <>
                                        <div style={{ flexShrink: 0 }}>
                                        <BotaoSemBorda $color="var(--primaria)">
                                            <FaDoorOpen /><Link onClick={reabrirVaga}>Reabrir vaga</Link>
                                        </BotaoSemBorda>
                                        </div>
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
                                : vaga ? '----' : <Skeleton variant="rectangular" width={200} height={25} />
                            }
                            <Texto>Descrição</Texto>
                            {vaga ? (
                                <DescricaoComVerMais descricao={vaga?.descricao} />
                            ) : (
                                <Skeleton variant="rectangular" width={200} height={25} />
                            )}
                            <Texto>Salário</Texto>
                            {vaga?.salario ?
                                <Texto weight="800">{Real.format(vaga?.salario)}</Texto>
                                : vaga ? '----' : <Skeleton variant="rectangular" width={200} height={25} />
                            }
                        </Col6>
                        <Col6>
                            <Texto>Filial</Texto>
                            {vaga?.filial_id ?
                                <Texto weight="800">{vaga?.filial_nome}</Texto>
                                : vaga ? '----' : <Skeleton variant="rectangular" width={200} height={25} />
                            }   
                            <Texto>Secao</Texto>
                            {vaga?.secao_id ?
                                <Texto weight="800">{vaga?.secao_nome}</Texto>
                                : vaga ? '----' : <Skeleton variant="rectangular" width={200} height={25} />
                            }
                            <Texto>Centro de Custo</Texto>
                            {vaga?.centro_custo_id ?
                                <Texto weight="800">{vaga?.centro_custo_nome}</Texto>
                                : vaga ? '----' : <Skeleton variant="rectangular" width={200} height={25} />
                            }
                        </Col6>
                        <Col6>
                            <Texto>Horario</Texto>
                            {vaga?.horario_id ?
                                <Texto weight="800">{vaga?.horario_nome}</Texto>
                                : vaga ? '----' : <Skeleton variant="rectangular" width={200} height={25} />
                            }
                            <Texto>Letra</Texto>
                            {vaga?.letra ?
                                <Texto weight="800">{vaga?.letra_nome || vaga?.letra}</Texto>
                                : vaga ? '----' : <Skeleton variant="rectangular" width={200} height={25} />
                            }
                            <Texto>Funcao</Texto>
                            {vaga?.funcao_id ?
                                <Texto weight="800">{vaga?.funcao_nome}</Texto>
                                : vaga ? '----' : <Skeleton variant="rectangular" width={200} height={25} />
                            }
                            <Texto>Sindicato</Texto>
                            {vaga?.sindicato_id ?  
                                <Texto weight="800">{vaga?.sindicato_nome}</Texto>   
                                : vaga ? '----' : <Skeleton variant="rectangular" width={200} height={25} />
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
                <BotaoGrupo align="space-between">
                <Titulo>
                    <h5>Candidatos</h5>
                </Titulo>
                    <BotaoGrupo align="center">
                        <Botao 
                            size="small" 
                            aoClicar={() => setModalTemplateVagaAberto(true)}
                            estilo="neutro"
                            disabled={!temVagasDisponiveis()}
                            title={
                                vaga?.status !== 'A' ? "A vaga precisa estar aberta para vincular template" :
                                !temVagasDisponiveis() ? "Não há vagas disponíveis. Todas as posições já têm candidatos aprovados." : 
                                vaga?.template_admissao ? "Alterar template de admissão vinculado" : "Vincular template de admissão para candidatos desta vaga"
                            }
                        >
                            <GrAddCircle stroke="var(--secundaria)" /> {vaga?.template_admissao ? 'Alterar Template' : 'Vincular Template'}
                        </Botao>
                        <FaInfoCircle 
                            size={16}
                            style={{ 
                                color: 'var(--primaria)', 
                                cursor: 'pointer',
                                marginLeft: '12px',
                                flexShrink: 0
                            }}
                            onClick={() => {
                                toast.current.show({
                                    severity: 'info',
                                    summary: 'Vincular Template de Admissão',
                                    detail: 'Este recurso permite vincular um template de admissão que será aplicado automaticamente aos candidatos aprovados desta vaga. O template define configurações contratuais como tipo de admissão, regime trabalhista, FGTS, entre outros.',
                                    life: 6000,
                                    sticky: false
                                });
                            }}
                            title="Clique para mais informações"
                        />
                    </BotaoGrupo>
                </BotaoGrupo>
                <DataTableCandidatos 
                    documentos={documentos} 
                    vagaId={vaga?.id} 
                    candidatos={vaga?.candidatos?.map(candidato => ({
                        ...candidato,
                        vaga: vaga
                    }))} 
                    onCandidatosUpdate={handleCandidatosUpdate}
                    onEditarCandidato={handleEditarCandidato}
                />
                <BotaoGrupo align="space-between">
                <Titulo>
                    <h5>Documentos Requeridos da Vaga</h5>
                </Titulo>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '400px' }}>
                        <div style={{ flexShrink: 0 }}>
                        <Botao 
                            size="small" 
                                aoClicar={abrirModalTag}
                                estilo="vermilion"
                                disabled={vaga?.status === 'T' || (temCandidatoAprovado && !temVagasDisponiveis())}
                                title={
                                    vaga?.status === 'T' ? "Não é possível editar tags em vagas transferidas" :
                                    (temCandidatoAprovado && !temVagasDisponiveis()) ? "Não é possível editar tags pois todas as vagas já têm candidatos aprovados" : 
                                    tagsNomes.length > 0 ? "Alterar tags da vaga" : "Selecionar tags para preencher documentos automaticamente"
                                }
                            >
                                {tagsNomes.length > 0 ? (
                                    <>
                                        <FaPen size={12} fill="var(--secundaria)" /> {tagsNomes.join(', ')}
                                    </>
                                ) : (
                                    <>
                                        <GrAddCircle stroke="var(--secundaria)" /> Adicionar por Tag
                                    </>
                                )}
                            </Botao>
                        </div>
                        <FaInfoCircle 
                            size={16}
                            style={{ 
                                color: 'var(--primaria)', 
                                cursor: 'pointer',
                                marginLeft: '12px',
                                flexShrink: 0
                            }}
                            onClick={() => {
                                toast.current.show({
                                    severity: 'info',
                                    summary: tagsNomes.length > 0 ? 'Alterar Tags da Vaga' : 'Tags de Documentos',
                                    detail: tagsNomes.length > 0 
                                        ? 'Ao alterar as tags, os documentos das novas tags serão adicionados. Documentos anteriores não serão removidos automaticamente.'
                                        : 'Selecione tags para preencher automaticamente os documentos requeridos dessa vaga com documentos que tenham as mesmas tags.',
                                    life: 5000,
                                    sticky: false
                                });
                            }}
                            title="Clique para mais informações"
                        />
                        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                            <Botao 
                                size="small" 
                                aoClicar={abrirModalDocumento}
                                estilo="neutro"
                                disabled={vaga?.status === 'T' || (temCandidatoAprovado && !temVagasDisponiveis())}
                            title={
                                vaga?.status === 'T' ? "Não é possível adicionar documentos em vagas transferidas" :
                                    (temCandidatoAprovado && !temVagasDisponiveis()) ? "Não é possível adicionar documentos pois todas as vagas já têm candidatos aprovados" : 
                                    "Adicionar documento requerido à vaga"
                            }
                        >
                                <GrAddCircle stroke="var(--secundaria)" /> Adicionar personalizado
                        </Botao>
                        </div>
                    </div>
                </BotaoGrupo>
                <DataTableDocumentosVaga
                    documentos={documentos}
                    vaga={vaga}
                    onEdit={doc => { setDocumentoEditando(doc); setModalDocumentoAberto(true); }}
                    onDelete={fetchDocumentosVaga}
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
            <ModalAdicionarCandidato
                opened={modalAdicionarCandidatoAberto}
                aoFechar={() => setModalAdicionarCandidatoAberto(false)}
                aoSalvar={handleAdicionarCandidato}
            />
            <ModalEditarCandidato
                opened={modalEditarCandidatoAberto}
                aoFechar={() => {
                    setModalEditarCandidatoAberto(false);
                    setCandidatoEditando(null);
                }}
                aoSalvar={handleSalvarEdicaoCandidato}
                candidato={candidatoEditando}
            />
            <ModalTags
                opened={modalTagsAberto}
                aoFechar={() => setModalTagsAberto(false)}
                aoSalvar={handleSalvarTag}
                tagsSelecionadas={vaga?.tags || []}
            />
            <ModalTemplateVaga
                opened={modalTemplateVagaAberto}
                aoFechar={() => setModalTemplateVagaAberto(false)}
                aoSalvar={handleSalvarTemplate}
                templateSelecionado={vaga?.template_admissao || null}
            />
        </Container>
        </Frame>
        </>
    )
}

export default DetalhesVaga
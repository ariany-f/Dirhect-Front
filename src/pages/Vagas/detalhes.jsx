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
import http from '@http'

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

    function getStatusVaga(status) {
        return status === 'A' ? 'ABERTA' : 'FECHADA';
    }

    function getStatusColor(status) {
        return status === 'A' ? 'var(--green-500)' : 'var(--error)';
    }

    useEffect(() => {
      
        http.get(`vagas/${id}/?format=json`)
            .then(response => {
                console.log(response)
                setVaga(response)
                // setVaga(response.data)
            })
            .catch(error => {
                console.error('Erro ao carregar vaga:', error)
            })
    }, [])

    const { 
        vagas,
        setVagas
    } = useVagasContext()

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
        const salarioNumerico = salario.replace(/\D/g, '');

        http.post(`candidato/`, {
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
        })
        .then(response => {
            toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Candidato encaminhado com sucesso!', life: 3000 });
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
            toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao encaminhar candidato', life: 3000 });
        });
    };

    // useEffect(() => {
    //     if(!vaga)
    //     {
    //         const obj = vagas.vagas;
    //         const vg = [...obj.abertas, ...obj.canceladas].find(item => item.id == id);

    //         if(vg) {
    //             setVaga(vg)
    //         }
          
    //     }
    // }, [])
    
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
                                            value={getStatusVaga(vaga.status)}
                                            style={{
                                                backgroundColor: getStatusColor(vaga.status),
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
                                    Encaminhar para novo candidato
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
                        </Col6>
                        <Col6>
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
                <DataTableCandidatos candidatos={vaga?.candidatos} />
                <Titulo>
                    <h5>Documentos Requeridos</h5>
                </Titulo>
                
                <BotaoGrupo align="space-between">
                    <div></div>
                    <BotaoGrupo align="space-between">
                        <Botao size="small" aoClicar={() => { setDocumentoEditando(null); setModalDocumentoAberto(true); }}>
                            <GrAddCircle stroke="white" /> Adicionar documento requerido
                        </Botao>
                    </BotaoGrupo>
                </BotaoGrupo>
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
            <ModalEncaminharVaga 
                aoSalvar={handleSalvarCandidato} 
                opened={modalOpened} 
                aoFechar={() => setModalOpened(false)}
                periculosidadeInicial={vaga?.periculosidade ? listaPericulosidades.find(p => p.code === vaga.periculosidade) : null}
            />
        </Frame>
        </>
    )
}

export default DetalhesVaga
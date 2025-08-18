import Botao from "@components/Botao"
import CampoTexto from "@components/CampoTexto"
import Titulo from "@components/Titulo"
import SubTitulo from "@components/SubTitulo"
import { RiCloseFill } from 'react-icons/ri'
import { FaExclamationCircle } from 'react-icons/fa'
import { useState, useEffect, useRef } from "react"
import styled from "styled-components"
import DropdownItens from "@components/DropdownItens"; 
import { OverlayRight, DialogEstilizadoRight } from '@components/Modal/styles';
import http from "@http"
import BotaoGrupo from "@components/BotaoGrupo"
import Frame from "@components/Frame"
import { ArmazenadorToken } from "@utils"
import { Toast } from 'primereact/toast'
import SwitchInput from "@components/SwitchInput"
import { FaUpload } from 'react-icons/fa'
import { HiX } from 'react-icons/hi'
import CampoDataPeriodo from '@components/CampoDataPeriodo';
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';

const Cabecalho = styled.div`
    padding: 24px 32px;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
`;

const ConteudoContainer = styled.div`
    display: flex;
    gap: 24px;
    padding: 32px;
    width: 100%;
    flex: 1;
    overflow-y: auto;
`;

const DetalhesContainer = styled.div`
    flex: 1 1 30%;
    max-width: calc(30% - 24px);
`;

const AcoesContainer = styled.div`
    flex: 1 1 calc(70% - 12px);
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 24px;
`;

const DetalhesTitulo = styled.h4`
    font-size: 16px;
    font-weight: 700;
    color: #343a40;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #e9ecef;
    width: 100%;
`;

const DetalhesCard = styled.div`
    display: flex;
    flex-direction: column;
    gap: 14px;
`;

const Linha = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: ${props => props.$margin ? props.$margin : '10px'};
`;

const Label = styled.span`
    font-size: 12px;
    font-weight: 500;
    color: #6c757d;
    text-transform: uppercase;
`;

const Valor = styled.span`
    font-size: 15px;
    font-weight: 600;
    color: #343a40;
`;

const BotaoFechar = styled.button`
    background: none;
    border: none;
    color: #757575;
    font-size: 1.2rem;
    cursor: pointer;
    transition: color 0.2s;
    &:hover {
        color: #f44336;
    }
`;

const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 16px 0;
`;

const FormRow = styled.div`
    display: flex;
    gap: 24px;
    
    > * {
        flex: 1;
        min-width: 0;
    }
`;

const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    ${props => props.$fullWidth && `
        width: 100%;
    `}
    ${props => props.$flex3 && `
        flex: 3;
    `}
    ${props => props.$flex2 && `
        flex: 2;
    `}
    ${props => props.$flex1 && `
        flex: 1;
    `}
`;

const FormLabel = styled.label`
    font-size: 14px;
    font-weight: 500;
    color: #333;
`;

const AlertaAviso = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 16px;
    background-color: #fff3cd;
    border: 1px solid #ffeeba;
    border-radius: 4px;
    margin-bottom: 24px;

    span {
        font-size: 14px;
        color: #856404;
        line-height: 1.5;
    }
`;

const AlertaCipa = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 16px;
    background-color: #f8d7da;
    border: 1px solid #f5c6cb;
    border-radius: 4px;
    margin-bottom: 24px;

    span {
        font-size: 14px;
        color: #721c24;
        line-height: 1.5;
    }
`;

const TextArea = styled.textarea`
    width: 100%;
    min-height: 100px;
    padding: 12px;
    border: 1px solid #ced4da;
    border-radius: 4px;
    font-size: 14px;
    resize: vertical;

    &::placeholder {
        color: #6c757d;
    }

    &:focus {
        outline: none;
        border-color: #80bdff;
        box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
    }
`;

function ModalDemissao({ opened = false, colaborador, aoFechar, aoSalvar, mostrarColaborador = true, estabilidadeBloqueada = false, estabilidadeBloqueadaMessage = '' }) {
    const [dataDemissao, setDataDemissao] = useState('');
    const [tipoDemissao, setTipoDemissao] = useState(null);
    const [motivoDemissao, setMotivoDemissao] = useState(null);
    const [observacao, setObservacao] = useState('');
    const [anexo, setAnexo] = useState(null);
    const [dataInicioAviso, setDataInicioAviso] = useState('');
    const [avisoIndenizado, setAvisoIndenizado] = useState(false);
    const [dataPagamento, setDataPagamento] = useState('');

    const [tiposDemissaoOptions, setTiposDemissaoOptions] = useState([]);
    const [motivosDemissaoOptions, setMotivosDemissaoOptions] = useState([]);
    
    const toast = useRef(null);

    const userPerfil = ArmazenadorToken.UserProfile;
    const hoje = new Date();
    const diaDoMes = hoje.getDate();

    const foraDoPrazo = diaDoMes > 20;
    const perfisEspeciais = ['analista', 'supervisor', 'gestor'];
    
    const isAnalistaTenant = userPerfil === 'analista_tenant';
    const isPerfilEspecial = perfisEspeciais.includes(userPerfil);

    const mostrarAviso = foraDoPrazo && (isAnalistaTenant || isPerfilEspecial);
    const bloquearFormulario = foraDoPrazo && isAnalistaTenant;

    useEffect(() => {
        if (opened) {
            http.get('tabela_dominio/tipo_demissao/')
                .then(response => {
                    const options = response.registros.map(item => ({ name: item.descricao, code: item.id }));
                    setTiposDemissaoOptions(options);
                })
                .catch(error => console.error("Erro ao buscar tipos de demissão:", error));

            http.get('tabela_dominio/motivo_demissao/')
                .then(response => {
                    const options = response.registros.map(item => ({ name: item.descricao, code: item.id }));
                    setMotivosDemissaoOptions(options);
                })
                .catch(error => console.error("Erro ao buscar motivos de demissão:", error));
        } else {
            setDataDemissao('');
            setTipoDemissao(null);
            setMotivoDemissao(null);
            setObservacao('');
            setAnexo(null);
            setDataInicioAviso('');
            setAvisoIndenizado(false);
            setDataPagamento('');
        }
    }, [opened]);

    const handleSalvar = () => {
        if (bloquearFormulario) {
            return;
        }
        if (!dataDemissao || !tipoDemissao || !motivoDemissao) {
            toast.current.show({ severity: 'warn', summary: 'Aviso', detail: 'Por favor, preencha todos os campos obrigatórios.' });
            return;
        }


        if(estabilidadeBloqueada) {
            confirmDialog({
                message: (estabilidadeBloqueadaMessage ? (estabilidadeBloqueadaMessage + ' Deseja Continuar?') :  'Este colaborador tem estabilidade registrada. Deseja continuar com a demissão?'),
                header: 'Demissão',
                icon: 'pi pi-info-circle',
                accept: () => {
                    aoSalvar({
                        dt_demissao: dataDemissao,
                        tipo_demissao: tipoDemissao.code,
                        motivo_demissao: motivoDemissao.code,
                        observacao: observacao,
                        anexo: anexo,
                        data_inicio_aviso: dataInicioAviso,
                        aviso_indenizado: Boolean(avisoIndenizado),
                        data_pagamento: dataPagamento,
                    });
                }
            });
        } else {
            aoSalvar({
                dt_demissao: dataDemissao,
                tipo_demissao: tipoDemissao.code,
                motivo_demissao: motivoDemissao.code,
                observacao: observacao,
                anexo: anexo,
                data_inicio_aviso: dataInicioAviso,
                aviso_indenizado: Boolean(avisoIndenizado),
                data_pagamento: dataPagamento,
            });
        }
    }

    const calcularDataInicioAviso = (dataDemissao) => {
        if (!dataDemissao) return '';
        
        const data = new Date(dataDemissao);
        data.setDate(data.getDate() + 2);
        
        // Formatar para YYYY-MM-DD
        const ano = data.getFullYear();
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const dia = String(data.getDate()).padStart(2, '0');
        
        return `${ano}-${mes}-${dia}`;
    };

    const calcularDataPagamento = (dataDemissao) => {
        if (!dataDemissao) return '';
        
        const data = new Date(dataDemissao);
        data.setDate(data.getDate() + 10);
        
        // Formatar para YYYY-MM-DD
        const ano = data.getFullYear();
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const dia = String(data.getDate()).padStart(2, '0');
        
        return `${ano}-${mes}-${dia}`;
    };

    const handleDataDemissaoChange = (novaData) => {
        setDataDemissao(novaData);
        
        // Se não houver data de início do aviso preenchida, sugerir automaticamente
        if (!dataInicioAviso) {
            const dataSugerida = calcularDataInicioAviso(novaData);
            setDataInicioAviso(dataSugerida);
        }
        
        // Se não houver data de pagamento preenchida, sugerir automaticamente
        if (!dataPagamento) {
            const dataPagamentoSugerida = calcularDataPagamento(novaData);
            setDataPagamento(dataPagamentoSugerida);
        }
    };

    function formatarCPF(cpf) {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }

    // Gera lista de todas as datas bloqueadas (para o Calendar) a partir de colaborador.periodos_bloqueados_demissao
    function gerarDatasBloqueadas() {
        const datas = [];
        const periodos = colaborador?.periodos_bloqueados_demissao || [];
        periodos.forEach(periodo => {
            if (!periodo.data_inicio || !periodo.data_fim) return;
            let atual = new Date(periodo.data_inicio);
            atual.setHours(0,0,0,0);
            const fim = new Date(periodo.data_fim);
            fim.setHours(0,0,0,0);
            while (atual <= fim) {
                const d = new Date(atual);
                d.setHours(0,0,0,0);
                datas.push(d);
                atual.setDate(atual.getDate() + 1);
            }
        });
        return datas;
    }
    const datasBloqueadas = gerarDatasBloqueadas();

    // Antes do return, converta a data mínima:
    const minDateDemissao = colaborador?.data_minima_solicitacao_demissao ? new Date(colaborador.data_minima_solicitacao_demissao + 'T00:00:00') : null;

    return(
        <>
            <Toast ref={toast} />
            <ConfirmDialog locale="pt" />
            {opened &&
            <>
                <OverlayRight $opened={opened} onClick={aoFechar}>
                    <DialogEstilizadoRight
                        open={opened}
                        $opened={opened}
                        $width="60vw"
                        onClick={e => e.stopPropagation()}
                    >
                        <Cabecalho>
                            <div>
                                <h6 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
                                    Solicitação de Demissão {colaborador?.chapa} - {colaborador?.funcionario_pessoa_fisica?.nome}
                                    {colaborador?.membro_cipa && (
                                        <span style={{
                                            background: '#721c24',
                                            color: '#fff',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '12px',
                                            marginLeft: '12px',
                                            fontWeight: '600'
                                        }}>
                                            MEMBRO CIPA
                                        </span>
                                    )}
                                </h6>
                            </div>
                            <BotaoFechar onClick={aoFechar}>
                                <RiCloseFill size={22} />
                            </BotaoFechar>
                        </Cabecalho>

                        <ConteudoContainer>
                            {mostrarColaborador &&
                            <DetalhesContainer>
                                {colaborador && (
                                    <DetalhesCard>
                                        <Linha>
                                            <Label>Matrícula</Label>
                                            <Valor>{colaborador.chapa}</Valor>
                                        </Linha>
                                        <Linha>
                                            <Label>Função</Label>
                                            <Valor>{colaborador.funcao_nome || 'N/A'}</Valor>
                                        </Linha>
                                        <Linha>
                                            <Label>CPF</Label>
                                            <Valor>{formatarCPF(colaborador.funcionario_pessoa_fisica.cpf)}</Valor>
                                        </Linha>
                                    </DetalhesCard>
                                )}
                            </DetalhesContainer>
                            }
                            <AcoesContainer>
                                {mostrarAviso && (
                                    <AlertaAviso>
                                        <FaExclamationCircle size={24} style={{ color: '#856404', flexShrink: 0 }}/>
                                        <span>
                                            {isAnalistaTenant 
                                                ? "Como analista tenant, você só pode solicitar demissões entre o dia 1 e o dia 20 de cada mês. Para solicitações fora deste período, por favor, entre em contato com o responsável pelo processo."
                                                : "A solicitação de demissão está sendo feita fora do período recomendado (do dia 1 ao dia 20). Por favor, prossiga com atenção."
                                            }
                                        </span>
                                    </AlertaAviso>
                                )}
                                {colaborador?.membro_cipa && (
                                    <AlertaCipa>
                                        <FaExclamationCircle size={24} style={{ color: '#721c24', flexShrink: 0 }}/>
                                        <span>
                                            <strong>Atenção:</strong> Este colaborador é membro da CIPA (Comissão Interna de Prevenção de Acidentes). 
                                            A demissão de membros da CIPA pode ter implicações legais e operacionais. 
                                            Verifique se há necessidade de substituição antes de prosseguir com a demissão.
                                        </span>
                                    </AlertaCipa>
                                )}
                                {!bloquearFormulario && (
                                    <FormContainer>
                                        <FormRow>
                                            <FormGroup $fullWidth>
                                                <DropdownItens
                                                    valor={tipoDemissao}
                                                    required={true}
                                                    setValor={setTipoDemissao}
                                                    options={tiposDemissaoOptions}
                                                    label="Tipo de Demissão"
                                                    name="tipo_demissao"
                                                    placeholder="Selecione o tipo"
                                                    filter
                                                />
                                            </FormGroup>
                                        </FormRow>

                                        <FormRow>
                                            <FormGroup $flex1>
                                                <CampoDataPeriodo
                                                    label="Data da Demissão"
                                                    name="data_demissao"
                                                    value={dataDemissao ? new Date(dataDemissao + 'T00:00:00') : null}
                                                    onChange={e => {
                                                        const novaData = e.value;
                                                        if (datasBloqueadas.some(bloq => bloq.getTime() === novaData?.setHours(0,0,0,0))) {
                                                            toast.current.show({
                                                                severity: 'warn',
                                                                summary: 'Data inválida',
                                                                detail: 'Não é permitido selecionar uma data de demissão dentro de um período bloqueado.',
                                                                life: 4000
                                                            });
                                                            return;
                                                        }
                                                        // Salvar sempre como yyyy-MM-dd
                                                        if (novaData instanceof Date && !isNaN(novaData)) {
                                                            handleDataDemissaoChange(novaData.toISOString().split('T')[0]);
                                                        } else {
                                                            handleDataDemissaoChange('');
                                                        }
                                                    }}
                                                    minDate={minDateDemissao}
                                                    disabledDates={datasBloqueadas}
                                                    placeholder="Selecione a data"
                                                    required
                                                />
                                            </FormGroup>
                                            <FormGroup $flex1>
                                                <CampoTexto
                                                    name="data_pagamento"
                                                    valor={dataPagamento}
                                                    setValor={setDataPagamento}
                                                    type="date"
                                                    label="Data de Pagamentos"
                                                    placeholder="Selecione a data"
                                                />
                                            </FormGroup>
                                        </FormRow>

                                        <FormRow>
                                            <FormGroup $flex2>
                                                <CampoTexto
                                                    name="data_inicio_aviso"
                                                    valor={dataInicioAviso}
                                                    setValor={setDataInicioAviso}
                                                    type="date"
                                                    label="Início do Aviso Prévio"
                                                    placeholder="Selecione a data"
                                                />
                                            </FormGroup>
                                            <FormGroup $flex1>
                                                <FormLabel>Aviso Indenizado</FormLabel>
                                                <SwitchInput
                                                    checked={avisoIndenizado}
                                                    onChange={setAvisoIndenizado}
                                                />
                                            </FormGroup>
                                            <FormGroup $flex2>
                                                <DropdownItens
                                                    valor={motivoDemissao}
                                                    required={true}
                                                    setValor={setMotivoDemissao}
                                                    options={motivosDemissaoOptions}
                                                    label="Motivo da Demissão"
                                                    name="motivo_demissao"
                                                    placeholder="Selecione o motivo"
                                                    filter
                                                />
                                            </FormGroup>
                                        </FormRow>

                                        <FormGroup $fullWidth>
                                            <FormLabel>Anexo</FormLabel>
                                            <div style={{
                                                border: '2px dashed #aaa',
                                                borderRadius: '15px',
                                                padding: '12px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                minHeight: '60px',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease',
                                                background: 'var(--neutro-50)'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.borderColor = 'var(--primaria)';
                                                e.target.style.backgroundColor = 'var(--neutro-100)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.borderColor = '#aaa';
                                                e.target.style.backgroundColor = 'var(--neutro-50)';
                                            }}
                                            onClick={() => document.getElementById('anexo-input').click()}
                                            >
                                                <input
                                                    id="anexo-input"
                                                    type="file"
                                                    accept=".pdf,.jpg,.jpeg,.png"
                                                    onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        console.log('Arquivo selecionado:', file); // Debug
                                                        setAnexo(file);
                                                    }}
                                                    style={{ display: 'none' }}
                                                />
                                                <div style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    gap: '8px'
                                                }}>
                                                    <div style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '8px',
                                                        color: 'var(--primaria)'
                                                    }}>
                                                        <FaUpload size={16} />
                                                        <span style={{
                                                            fontSize: '14px',
                                                            fontWeight: '600',
                                                            color: 'var(--neutro-600)'
                                                        }}>
                                                            Selecionar arquivo
                                                        </span>
                                                    </div>
                                                    {anexo && (
                                                        <div style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '8px'
                                                        }}>
                                                            <span style={{
                                                                fontSize: '12px',
                                                                color: 'var(--primaria)',
                                                                fontWeight: '500'
                                                            }}>
                                                                Arquivo selecionado: {anexo.name}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setAnexo(null);
                                                                    document.getElementById('anexo-input').value = '';
                                                                }}
                                                                style={{
                                                                    background: 'transparent',
                                                                    border: 'none',
                                                                    color: '#ef4444',
                                                                    cursor: 'pointer',
                                                                    padding: '4px',
                                                                    borderRadius: '4px',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    transition: 'all 0.2s ease'
                                                                }}
                                                                onMouseEnter={(e) => {
                                                                    e.target.style.background = '#fef2f2';
                                                                }}
                                                                onMouseLeave={(e) => {
                                                                    e.target.style.background = 'transparent';
                                                                }}
                                                                title="Remover arquivo"
                                                            >
                                                                <HiX size={14} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </FormGroup>

                                        <FormGroup $fullWidth>
                                            <FormLabel>Observação</FormLabel>
                                            <TextArea
                                                value={observacao}
                                                onChange={(e) => setObservacao(e.target.value)}
                                                placeholder="Digite uma observação (opcional)"
                                            />
                                        </FormGroup>
                                    </FormContainer>
                                )}
                            </AcoesContainer>
                        </ConteudoContainer>
                        <Frame estilo="spaced">
                            <BotaoGrupo align="space-between" wrap>
                                <Botao aoClicar={aoFechar} estilo="neutro" size="small">
                                    Cancelar
                                </Botao>
                            </BotaoGrupo>
                            <BotaoGrupo align="space-between" wrap>
                                <Botao aoClicar={handleSalvar} estilo="vermilion" size="small" disabled={bloquearFormulario}>
                                    Confirmar
                                </Botao>
                            </BotaoGrupo>
                        </Frame>
                    </DialogEstilizadoRight>
                </OverlayRight>
            </>
            }
        </>
    )
}

export default ModalDemissao;

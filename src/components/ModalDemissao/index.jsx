import Botao from "@components/Botao"
import CampoTexto from "@components/CampoTexto"
import Titulo from "@components/Titulo"
import SubTitulo from "@components/SubTitulo"
import { RiCloseFill } from 'react-icons/ri'
import { FaExclamationCircle } from 'react-icons/fa'
import { useState, useEffect } from "react"
import styled from "styled-components"
import DropdownItens from "@components/DropdownItens"; 
import { OverlayRight, DialogEstilizadoRight } from '@components/Modal/styles';
import http from "@http"
import BotaoGrupo from "@components/BotaoGrupo"
import Frame from "@components/Frame"
import { ArmazenadorToken } from "@utils"

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
    flex: 1 1 50%;
    max-width: calc(50% - 24px);
`;

const AcoesContainer = styled.div`
    flex: 1 1 calc(50% - 24px);
    width: 100%;
    & > ${Frame} {
        background-color: #fff;
        border: 1px solid #dee2e6;
        box-shadow: 0 8px 16px rgba(0,0,0,0.05);
        border-radius: 12px;
        padding: 32px;
        display: flex;
        flex-direction: column;
        gap: 24px;
    }
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

const AlertaAviso = styled.div`
    background: #fffbeb;
    color: #664d03;
    border-left: 4px solid #ffc107;
    border-radius: 4px;
    padding: 16px;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 12px;
`;

function ModalDemissao({ opened = false, colaborador, aoFechar, aoSalvar, mostrarColaborador = true }) {
    const [dataDemissao, setDataDemissao] = useState('');
    const [tipoDemissao, setTipoDemissao] = useState(null);
    const [motivoDemissao, setMotivoDemissao] = useState(null);
    const [observacao, setObservacao] = useState('');

    const [tiposDemissaoOptions, setTiposDemissaoOptions] = useState([]);
    const [motivosDemissaoOptions, setMotivosDemissaoOptions] = useState([]);

    const userPerfil = ArmazenadorToken.UserProfile;
    const hoje = new Date();
    const diaDoMes = hoje.getDate();
    
    const bloquearSolicitacao = userPerfil === 'analista_tenant' && diaDoMes > 20;

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
        }
    }, [opened]);

    const handleSalvar = () => {
        if (bloquearSolicitacao) {
            return;
        }
        if (!dataDemissao || !tipoDemissao || !motivoDemissao) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
        aoSalvar({
            dt_demissao: dataDemissao,
            tipo_demissao: tipoDemissao.code,
            motivo_demissao: motivoDemissao.code,
            observacao: observacao,
        });
    }

    function formatarCPF(cpf) {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }

    return(
        <>
            {opened &&
            <>
                <OverlayRight $opened={opened} onClick={aoFechar}>
                    <DialogEstilizadoRight
                        open={opened}
                        $opened={opened}
                        $width="50vw"
                        onClick={e => e.stopPropagation()}
                    >
                        <Cabecalho>
                            <div>
                                <h6 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
                                    Solicitação de Demissão {colaborador?.chapa} - {colaborador?.funcionario_pessoa_fisica?.nome}
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
                                {bloquearSolicitacao ? (
                                    <AlertaAviso>
                                        <FaExclamationCircle size={24} style={{ color: '#ffc107', flexShrink: 0 }}/>
                                        <span>
                                            Como <b>analista tenant</b>, você só pode solicitar demissões entre o dia 1 e o dia 20 de cada mês. Para solicitações fora deste período, por favor, entre em contato com o responsável pelo processo.
                                        </span>
                                    </AlertaAviso>
                                ) : (
                                    <Frame>
                                        <CampoTexto
                                            name="data_demissao"
                                            valor={dataDemissao}
                                            setValor={setDataDemissao}
                                            type="date"
                                            label="Data da Demissão"
                                            placeholder="Selecione a data"
                                        />
                                        <DropdownItens
                                            valor={tipoDemissao}
                                            setValor={setTipoDemissao}
                                            options={tiposDemissaoOptions}
                                            label="Tipo de Demissão"
                                            name="tipo_demissao"
                                            placeholder="Selecione o tipo"
                                            $margin="20px"
                                        />
                                        <DropdownItens
                                            valor={motivoDemissao}
                                            setValor={setMotivoDemissao}
                                            options={motivosDemissaoOptions}
                                            label="Motivo da Demissão"
                                            name="motivo_demissao"
                                            placeholder="Selecione o motivo"
                                            $margin="15px"
                                        />
                                        <CampoTexto
                                            name="observacao"
                                            valor={observacao}
                                            setValor={setObservacao}
                                            label="Observação"
                                            placeholder="Digite uma observação (opcional)"
                                            type="textarea"
                                            rows={4}
                                        />
                                    </Frame>
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
                                <Botao aoClicar={handleSalvar} estilo="vermilion" size="small" disabled={bloquearSolicitacao}>
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
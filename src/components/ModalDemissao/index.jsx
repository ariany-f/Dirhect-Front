import Botao from "@components/Botao"
import CampoTexto from "@components/CampoTexto"
import Titulo from "@components/Titulo"
import SubTitulo from "@components/SubTitulo"
import { RiCloseFill } from 'react-icons/ri'
import { useState, useEffect } from "react"
import styled from "styled-components"
import DropdownItens from "@components/DropdownItens"; 
import { OverlayRight, DialogEstilizadoRight } from '@components/Modal/styles';
import http from "@http"
import BotaoGrupo from "@components/BotaoGrupo"
import Frame from "@components/Frame"

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
    flex: 1 1 50%;
    max-width: calc(50% - 24px);
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
    gap: 20px;
`;

const Linha = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
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

function ModalDemissao({ opened = false, colaborador, aoFechar, aoSalvar }) {
    const [dataDemissao, setDataDemissao] = useState('');
    const [tipoDemissao, setTipoDemissao] = useState(null);
    const [motivoDemissao, setMotivoDemissao] = useState(null);
    const [observacao, setObservacao] = useState('');

    const [tiposDemissaoOptions, setTiposDemissaoOptions] = useState([]);
    const [motivosDemissaoOptions, setMotivosDemissaoOptions] = useState([]);

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

    return(
        <>
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
                                    Solicitação de Demissão
                                </h6>
                            </div>
                            <BotaoFechar onClick={aoFechar}>
                                <RiCloseFill size={22} />
                            </BotaoFechar>
                        </Cabecalho>

                        <ConteudoContainer>
                            <DetalhesContainer>
                                {colaborador && (
                                    <DetalhesCard>
                                        <Linha>
                                            <Label>Nome</Label>
                                            <Valor>{colaborador.funcionario_pessoa_fisica.nome}</Valor>
                                        </Linha>
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
                                            <Valor>{colaborador.funcionario_pessoa_fisica.cpf}</Valor>
                                        </Linha>
                                    </DetalhesCard>
                                )}
                            </DetalhesContainer>
                            <AcoesContainer>
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
                                    />
                                    <DropdownItens
                                        valor={motivoDemissao}
                                        setValor={setMotivoDemissao}
                                        options={motivosDemissaoOptions}
                                        label="Motivo da Demissão"
                                        name="motivo_demissao"
                                        placeholder="Selecione o motivo"
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
                                    <BotaoGrupo align="end" gap="12px" style={{marginTop: '16px'}}>
                                        <Botao aoClicar={aoFechar} estilo="neutro" size="small">
                                            Cancelar
                                        </Botao>
                                        <Botao aoClicar={handleSalvar} estilo="vermilion" size="small">
                                            Confirmar
                                        </Botao>
                                    </BotaoGrupo>
                                </Frame>
                            </AcoesContainer>
                        </ConteudoContainer>
                    </DialogEstilizadoRight>
                </OverlayRight>
            </>
            }
        </>
    )
}

export default ModalDemissao;
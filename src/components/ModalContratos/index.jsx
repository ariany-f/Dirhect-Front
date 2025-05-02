import Botao from "@components/Botao"
import Frame from "@components/Frame"
import CampoTexto from "@components/CampoTexto"
import Titulo from "@components/Titulo"
import Texto from "@components/Texto"
import CustomImage from "@components/CustomImage"
import DropdownItens from "@components/DropdownItens"
import { RiCloseFill } from 'react-icons/ri'
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import http from "@http"
import styled from "styled-components"
import styles from './ModalAdicionarDepartamento.module.css'
import { Overlay, DialogEstilizado } from '@components/Modal/styles'

const Col12 = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 16px;
    padding: 16px;
    width: 100%;
`

const Col6 = styled.div`
    flex: 1 1 calc(50% - 8px);
`

const Col6Centered = styled.div`
    display: flex;
    flex: 1 1 calc(50% - 8px);
    justify-content: start;
    padding-top: 14px;
    align-items: center;
`

function ModalContratos({ opened = false, aoClicar, aoFechar, aoSucesso, aoSalvar, contrato = null }) {
    const [classError, setClassError] = useState([]);
    const [observacao, setObservacao] = useState('');
    const [operadoras, setOperadoras] = useState([]);
    const [dropdownOperadoras, setDropdownOperadoras] = useState([]);
    const [operadora, setOperadora] = useState(null);
    const [data_inicio, setDataInicio] = useState('');
    const [data_fim, setDataFim] = useState('');
    const [numContrato, setNumContrato] = useState('');

    const navegar = useNavigate();

    useEffect(() => {
        if(opened && operadoras.length === 0) {
            http.get('/operadora/?format=json')
                .then(response => {
                    setOperadoras(response);
                    const novasOperadoras = response.map(item => ({
                        name: item.nome,
                        code: item.id,
                        operadora: {
                            nome: item.nome,
                            imagem_url: item.imagem_url
                        }
                    }));
                    setDropdownOperadoras(novasOperadoras);
                });
        }
    }, [opened]);

    // Efeito para preencher os campos quando estiver editando
    useEffect(() => {
        if (contrato && opened) {
            setObservacao(contrato.observacao || '');
            setDataInicio(contrato.dt_inicio || '');
            setDataFim(contrato.dt_fim || '');
            setNumContrato(contrato.num_contrato_origem || '');
            
            // Encontra e seleciona a operadora correta no dropdown
            if (contrato.dados_operadora) {
                const operadoraEncontrada = dropdownOperadoras.find(
                    op => op.code === contrato.dados_operadora.id
                );
                setOperadora(operadoraEncontrada || null);
            }
        } else if (!opened) {
            // Limpa os campos quando fecha o modal
            setObservacao('');
            setDataInicio('');
            setDataFim('');
            setOperadora(null);
            setNumContrato('');
            setClassError([]);
        }
    }, [contrato, opened, dropdownOperadoras]);

    // Template para os itens do dropdown de operadoras
    const operadoraOptionTemplate = (option) => {
        if (!option) return <div>Selecione uma operadora</div>;
        
        return (
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px',
                padding: '0 12px'
            }}>
                {option.operadora?.imagem_url && (
                    <CustomImage 
                        alt={option.operadora.nome} 
                        src={option.operadora.imagem_url} 
                        width={'30px'}
                        height={20}
                        title={option.operadora.nome}
                    />
                )}
                <Texto weight={600} size="12px">{option.name}</Texto>
            </div>
        );
    };

    // Template para o valor selecionado
    const operadoraValueTemplate = (option) => {
        if (!option) return <span>Selecione uma operadora</span>;
        
        return (
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px'
            }}>
                {option.operadora?.imagem_url && (
                    <CustomImage 
                        alt={option.operadora.nome} 
                        src={option.operadora.imagem_url} 
                        width={'24px'}
                        height={16}
                        title={option.operadora.nome}
                    />
                )}
                <span>{option.name}</span>
            </div>
        );
    };

    const validarESalvar = () => {
        let errors = [];
        if (!operadora?.code) errors.push('operadora');
        if (!data_inicio) errors.push('data_inicio');
        if (!numContrato) errors.push('num_contrato');
        if (!observacao) errors.push('observacao');
        if (!data_fim) errors.push('data_fim');
        
        if (errors.length > 0) {
            setClassError(errors);
            return;
        }

        aoSalvar(operadora.code, observacao, data_inicio, data_fim, numContrato);
    };

    return (
        <>
            {opened && (
                <Overlay>
                    <DialogEstilizado open={opened}>
                        <Frame>
                            <Titulo>
                                <button className="close" onClick={aoFechar}>
                                    <RiCloseFill size={20} className="fechar" />  
                                </button>
                                <h6>{contrato ? 'Editar Contrato' : 'Novo Contrato'}</h6>
                            </Titulo>
                        </Frame>
                        
                        <Frame padding="12px 0px">
                            <Col12>
                                <Col12>
                                    <Col6 style={{ marginTop: '-12px' }}>
                                        <DropdownItens 
                                            camposVazios={classError.includes('operadora') ? ['operadora'] : []}
                                            valor={operadora} 
                                            setValor={setOperadora} 
                                            options={dropdownOperadoras} 
                                            label="Operadora*" 
                                            name="operadora" 
                                            placeholder="Selecione a operadora"
                                            optionTemplate={operadoraOptionTemplate}
                                            valueTemplate={operadoraValueTemplate}
                                            disabled={!!contrato}
                                        /> 
                                    </Col6>
                                    <Col6>
                                        <CampoTexto
                                            camposVazios={classError.includes('num_contrato') ? ['num_contrato'] : []}
                                            name="num_contrato"
                                            valor={numContrato}
                                            setValor={setNumContrato}
                                            type="text"
                                            label="Número do Contrato*"
                                            placeholder="Digite o número do contrato"
                                        />
                                    </Col6>
                                </Col12>
                                <Col12>
                                    <Col6>
                                        <CampoTexto
                                            camposVazios={classError.includes('data_inicio') ? ['data_inicio'] : []}
                                            name="data_inicio"
                                            valor={data_inicio}
                                            setValor={setDataInicio}
                                            type="date"
                                            label="Data Início*"
                                            placeholder="Digite a Data Início"
                                        />
                                    </Col6>
                                    <Col6>
                                        <CampoTexto
                                            camposVazios={classError.includes('data_fim') ? ['data_fim'] : []}
                                            name="data_fim"
                                            valor={data_fim}
                                            setValor={setDataFim}
                                            type="date"
                                            label="Data Fim*"
                                            placeholder="Digite a Data Fim"
                                        />
                                    </Col6>
                                </Col12>
                                <Col12>
                                    <Col6>
                                        <CampoTexto
                                            camposVazios={classError.includes('observacao') ? ['observacao'] : []}
                                            name="observacao"
                                            valor={observacao}
                                            setValor={setObservacao}
                                            type="text"
                                            label="Observação*"
                                            placeholder="Digite a observação"
                                        />
                                    </Col6>
                                </Col12>
                            </Col12>
                        </Frame>
                        
                        <div className={styles.containerBottom}>
                            <Botao 
                                aoClicar={aoFechar} 
                                estilo="neutro" 
                                size="medium" 
                                filled
                            >
                                Voltar
                            </Botao>
                            <Botao 
                                aoClicar={validarESalvar} 
                                estilo="vermilion" 
                                size="medium" 
                                filled
                            >
                                {contrato ? 'Atualizar' : 'Confirmar'}
                            </Botao>
                        </div>
                    </DialogEstilizado>
                </Overlay>
            )}
        </>
    );
}

export default ModalContratos;
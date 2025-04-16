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

const Overlay = styled.div`
    background-color: rgba(0,0,0,0.80);
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
`

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

const Col4 = styled.div`
    flex: 1 1 25%;
`

const Col4Centered = styled.div`
    display: flex;
    flex: 1 1 25%;
    justify-content: center;
    align-items: center;
`

const DialogEstilizado = styled.dialog`
    display: flex;
    width: 60vw;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 16px;
    border: none;
    margin: 0 auto;
    top: 2.5vh;
    padding: 24px;
    & button.close {
        & .fechar {
            box-sizing: initial;
            fill: var(--primaria);
            stroke: var(--primaria);
            color: var(--primaria);
        }
        position: absolute;
        right: 20px;
        top: 20px;
        cursor: pointer;
        border: none;
        background-color: initial;
    }
    & .icon {
        margin-right: 5px;
        box-sizing: initial;
        fill: var(--primaria);
        stroke: var(--primaria);
        color: var(--primaria);
    }
    & .frame:nth-of-type(1) {
        gap: 24px;
        & .frame {
            margin-bottom: 24px;
            & p{
                display: flex;
                flex-direction: column;
                gap: 5px;
            }
            & b {
                font-weight: 800;
                font-size: 14px;
            }
        }
    }
`

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    align-self: stretch;
`;

const Item = styled.div`
    cursor: pointer;
    border-width: 1px;
    border-style: solid;
    border-radius: 16px;
    display: flex;
    padding: 20px;
    justify-content: space-between;
    align-items: center;
    width: 94%;
    border-color: ${ props => props.$active ? 'var(--primaria)' : 'var(--neutro-200)' };
`;


function ModalContratos({ opened = false, aoClicar, aoFechar, aoSucesso, aoSalvar }) {
    const [classError, setClassError] = useState([]);
    const [observacao, setObservacao] = useState('');
    const [operadoras, setOperadoras] = useState([]);
    const [dropdownOperadoras, setDropdownOperadoras] = useState([]);
    const [operadora, setOperadora] = useState(null);
    const [data_inicio, setDataInicio] = useState('');
    const [data_fim, setDataFim] = useState('');

    const navegar = useNavigate();

    useEffect(() => {
        if(opened && operadoras.length === 0) {
            http.get('/operadora/?format=json')
                .then(response => {
                    setOperadoras(response);
                    // Formatando as operadoras para o dropdown com imagens
                    const novasOperadoras = response.map(item => ({
                        name: item.nome,
                        code: item.id,
                        operadora: {
                            nome: item.nome,
                            imagem: item.imagem // Assumindo que a API retorna uma URL de imagem
                        }
                    }));
                    setDropdownOperadoras(novasOperadoras);
                });
        }
    }, [opened]);

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
        
        if (errors.length > 0) {
            setClassError(errors);
            return;
        }

        aoSalvar(operadora.code, observacao, data_inicio, data_fim);
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
                                <h6>Novo Contrato</h6>
                            </Titulo>
                        </Frame>
                        
                        <Frame padding="12px 0px">
                            <Col12>
                                <Col12>
                                    <Col6>
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
                                        /> 
                                    </Col6>
                                    <Col6Centered>
                                        <CampoTexto
                                            name="observacao"
                                            valor={observacao}
                                            setValor={setObservacao}
                                            type="text"
                                            label="Observação"
                                            placeholder="Digite a observação"
                                        />
                                    </Col6Centered>
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
                                            name="data_fim"
                                            valor={data_fim}
                                            setValor={setDataFim}
                                            type="date"
                                            label="Data Fim"
                                            placeholder="Digite a Data Fim"
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
                                Confirmar
                            </Botao>
                        </div>
                    </DialogEstilizado>
                </Overlay>
            )}
        </>
    );
}

export default ModalContratos;
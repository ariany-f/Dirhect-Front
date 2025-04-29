import { useState, useEffect } from "react";
import { RiCloseFill } from 'react-icons/ri';
import styled from "styled-components";
import Botao from "@components/Botao";
import Frame from "@components/Frame";
import CampoTexto from "@components/CampoTexto";
import Titulo from "@components/Titulo";
import DropdownItens from "@components/DropdownItens";
import IconeBeneficio from '@components/IconeBeneficio';
import icones_beneficios from '@json/icones_beneficio.json';
import tiposBeneficio from '@json/tipos_beneficio.json';
import styles from './ModalAdicionarDepartamento.module.css';
import { Overlay, DialogEstilizado } from '@components/Modal/styles';

// Estilos
const Col12 = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 16px;
    padding: 16px;
    width: 100%;
`;

const Col6 = styled.div`
    flex: 1 1 calc(50% - 8px);
    min-width: 250px;
`;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    width: 100%;
`;

function ModalBeneficios({ opened = false, aoFechar, aoSalvar }) {
    const [classError, setClassError] = useState([]);
    const [iconeSelecionado, setIconeSelecionado] = useState(null);
    const [dropdownTipos, setDropdownTipos] = useState([]);
    const [tipoSelecionado, setTipoSelecionado] = useState(null);
    const [descricao, setDescricao] = useState('');
    const [opcoesIcones, setOpcoesIcones] = useState([]);

    useEffect(() => {
        // Configura os tipos para o dropdown a partir do JSON importado
        setDropdownTipos(tiposBeneficio.map(item => ({
            name: item.nome,
            code: item.code
        })));

        // Configura as opções de ícones baseado no JSON
        const iconesFormatados = Object.keys(icones_beneficios)
            .filter(key => key !== 'default')
            .map(key => ({
                name: key,
                code: key,
                icon: key
            }));
        
        setOpcoesIcones(iconesFormatados);
    }, []);

    const validarESalvar = () => {
        let errors = [];
        if (!tipoSelecionado) errors.push('tipo');
        if (!iconeSelecionado) errors.push('icone');
        if (!descricao.trim()) errors.push('descricao');
        
        if (errors.length > 0) {
            setClassError(errors);
            return;
        }

        const dadosParaAPI = {
            tipo: tipoSelecionado.code,
            descricao: descricao.trim(),
            icone: iconeSelecionado.code
        };
        
        aoSalvar(dadosParaAPI);
    };

    // Template para os itens do dropdown de ícones
    const iconeOptionTemplate = (option) => {
        if (!option) {
            return ( 
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px',
                    padding: '0'
                }}>
                    <span>Selecione um ícone</span>
                </div>
            );
        }

        return (
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px',
                padding: '0'
            }}>
                <IconeBeneficio nomeIcone={option.code} size={18} />
                <span>{option.code}</span>
            </div>
        );
    };

    // Template para o valor selecionado no dropdown
    const iconeValueTemplate = (option) => {
        if (!option) {
            return (
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px',
                    padding: '0'
                }}>
                    <span>Selecione um ícone</span>
                </div>
            );
        }

        return (
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px',
                padding: '0'
            }}>
                <IconeBeneficio nomeIcone={option.code} size={18} />
                <span>{option.code}</span>
            </div>
        );
    };

    // Template para os tipos de benefício
    const tipoOptionTemplate = (option) => {
        if (option) {
            return (
                <div style={{ padding: '2px 0' }}>
                    {option.name}
                </div>
            );
        }

        return <span>Selecione um tipo</span>;
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
                                <h6>Novo Benefício</h6>
                            </Titulo>
                        </Frame>
                        
                        <Wrapper>
                            <Col12>
                                <Col6>
                                    <DropdownItens 
                                        camposVazios={classError.includes('tipo') ? ['tipo'] : []}
                                        valor={tipoSelecionado} 
                                        setValor={setTipoSelecionado} 
                                        options={dropdownTipos} 
                                        label="Tipo de Benefício*" 
                                        name="tipo"
                                        placeholder="Selecione o tipo"
                                        optionTemplate={tipoOptionTemplate}
                                    />
                                </Col6>
                                
                                <Col6>
                                    <DropdownItens 
                                        camposVazios={classError.includes('icone') ? ['icone'] : []}
                                        valor={iconeSelecionado} 
                                        setValor={setIconeSelecionado} 
                                        options={opcoesIcones} 
                                        label="Ícone*" 
                                        name="icone" 
                                        placeholder="Selecione um ícone"
                                        optionTemplate={iconeOptionTemplate}
                                        valueTemplate={iconeValueTemplate}
                                    />
                                </Col6>
                                
                                <Col6>
                                    <CampoTexto 
                                        camposVazios={classError.includes('descricao') ? ['descricao'] : []}
                                        name="descricao" 
                                        valor={descricao} 
                                        setValor={setDescricao} 
                                        type="text" 
                                        label="Descrição*" 
                                        placeholder="Digite a descrição" 
                                    />
                                </Col6>
                            </Col12>

                            <div className={styles.containerBottom}>
                                <Botao
                                    aoClicar={aoFechar} 
                                    estilo="neutro" 
                                    size="medium" 
                                    filled
                                >
                                    Cancelar
                                </Botao>
                                <Botao
                                    aoClicar={validarESalvar} 
                                    estilo="vermilion" 
                                    size="medium" 
                                    filled
                                >
                                    Salvar Benefício
                                </Botao>
                            </div>
                        </Wrapper>
                    </DialogEstilizado>
                </Overlay>
            )}
        </>
    );
}

export default ModalBeneficios;
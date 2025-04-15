import Botao from "@components/Botao"
import Frame from "@components/Frame"
import CampoTexto from "@components/CampoTexto"
import CheckboxContainer from '@components/CheckboxContainer'
import Titulo from "@components/Titulo"
import SubTitulo from "@components/SubTitulo"
import DropdownItens from "@components/DropdownItens"
import { RiCloseFill } from 'react-icons/ri'
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import http from "@http"
import styled from "styled-components"
import styles from './ModalAdicionarDepartamento.module.css'
import IconeBeneficio from '@components/IconeBeneficio';

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
    width: 40vw;
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

function ModalContratoBeneficios({ opened = false, aoClicar, aoFechar, aoSucesso, aoSalvar, operadora = [] }) {

    const [classError, setClassError] = useState([])
    const [observacao, setObservacao] = useState('');
    const [beneficios, setBeneficios] = useState([]);
    const [dropdownBeneficios, setDropdownBeneficios] = useState([]);
    const [beneficio, setBeneficio] = useState('');
    const [data_inicio, setDataInicio] = useState('');
    const [data_fim, setDataFim] = useState('');

    const navegar = useNavigate()

    
    useEffect(() => {
        if(opened && beneficios.length === 0) {
            http.get('/beneficio/?format=json')
                .then(response => {
                    setBeneficios(response);
                    
                    // Formatando os benefícios para o dropdown com ícones
                    const novosBeneficios = response.map(item => ({
                        name: item.descricao,
                        code: item.id,
                        descricao: item.descricao,
                        tipo: item.tipo,
                        icone: item.icone || item.descricao, // Usa o ícone ou o nome como fallback
                        icon: item.icone || item.descricao // Usa o ícone ou o nome como fallback
                    }));
                    
                    setDropdownBeneficios(novosBeneficios);
                });
        }
    }, [opened]);

    
    // useEffect(() => {
    //     if (beneficios.length > 0 && dropdownBeneficios.length === 0) {
    //         const novosDropdownItens = beneficios.map(item => ({
    //             name: item.descricao,
    //             code: item.id
    //         }));
    
    //         setDropdownBeneficios(novosDropdownItens);
    //     }
    // }, [beneficios]);



      // Template para os itens do dropdown
      const beneficioOptionTemplate = (option) => {
        if (!option) return <div>Selecione um benefício</div>;
        
        return (
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px',
                padding: '0 12px'
            }}>
                <IconeBeneficio nomeIcone={option.icon} size={18} />
                <span>{option.name}</span>
            </div>
        );
    };

    // Template para o valor selecionado
    const beneficioValueTemplate = (option) => {
        if (!option) return <span>Selecione um benefício</span>;
        
        return (
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px'
            }}>
                <IconeBeneficio nomeIcone={option.icon} size={18} />
                <span>{option.name}</span>
            </div>
        );
    };

    const validarESalvar = () => {
        if (!beneficio?.code) {
            setClassError(['beneficio']);
            return;
        }
        aoSalvar(beneficio);
    };

    return(
        <>
            {opened &&
            <>
                <Overlay>
                    <DialogEstilizado id="modal-add-departamento" open={opened}>
                        <Frame>
                            <Titulo>
                                <form method="dialog">
                                    <button className="close" onClick={aoFechar} formMethod="dialog">
                                        <RiCloseFill size={20} className="fechar" />  
                                    </button>
                                </form>
                                <h6>Adicionar Benefício ao Contrato</h6>
                            </Titulo>
                        </Frame>
                        
                        <Frame padding="24px 0px">
                            <DropdownItens 
                                    camposVazios={classError.includes('beneficio') ? ['beneficio'] : []}
                                    valor={beneficio} 
                                    setValor={setBeneficio} 
                                    options={dropdownBeneficios} 
                                    label="Benefício*" 
                                    name="beneficio" 
                                    placeholder="Selecione um benefício"
                                    optionTemplate={beneficioOptionTemplate}
                                    valueTemplate={beneficioValueTemplate}
                                />
                        </Frame>
                        <form method="dialog">
                            <div className={styles.containerBottom}>
                                <Botao aoClicar={aoFechar} estilo="neutro" formMethod="dialog" size="medium" filled>Voltar</Botao>
                                <Botao aoClicar={validarESalvar} estilo="vermilion" size="medium" filled>Confirmar</Botao>
                            </div>
                        </form>
                    </DialogEstilizado>
                </Overlay>
            </>
            }
        </>
    )
}

export default ModalContratoBeneficios
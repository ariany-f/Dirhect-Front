import Botao from "@components/Botao"
import Frame from "@components/Frame"
import CampoTexto from "@components/CampoTexto"
import CheckboxContainer from '@components/CheckboxContainer'
import Titulo from "@components/Titulo"
import SubTitulo from "@components/SubTitulo"
import DropdownItens from "@components/DropdownItens"
import { RiCloseFill } from 'react-icons/ri'
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import http from "@http"
import styled from "styled-components"
import styles from './ModalAdicionarDepartamento.module.css'
import IconeBeneficio from '@components/IconeBeneficio'
import { Overlay, DialogEstilizado } from '@components/Modal/styles'
import { useTranslation } from "react-i18next"

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

function ModalContratoBeneficios({ opened = false, aoClicar, aoFechar, aoSucesso, aoSalvar, operadora = [], beneficiosContrato = [] }) {
    
    const [classError, setClassError] = useState([])
    const [observacao, setObservacao] = useState('');
    const [beneficios, setBeneficios] = useState([]);
    const [dropdownBeneficios, setDropdownBeneficios] = useState([]);
    const [beneficio, setBeneficio] = useState('');
    const [data_inicio, setDataInicio] = useState('');
    const [data_fim, setDataFim] = useState('');
    const { t } = useTranslation('common');

    const navegar = useNavigate()

    useEffect(() => {
        if(opened && beneficios.length === 0) {
            http.get('/beneficio/?format=json')
                .then(response => {
                    setBeneficios(response);

                    // Extrai os IDs dos benefícios vinculados à operadora
                    const idsVinculadosOperadora = operadora.beneficios_vinculados?.map(v => v.beneficio.id) || [];
                    
                    // Extrai os IDs dos benefícios já no contrato
                    const idsBeneficiosContrato = beneficiosContrato.map(b => b.beneficio.id);

                    // Filtra os benefícios que:
                    // 1. Estão vinculados à operadora
                    // 2. Ainda não estão no contrato
                    const disponiveis = response.filter(item =>
                        idsVinculadosOperadora.includes(item.id) && 
                        !idsBeneficiosContrato.includes(item.id)
                    );

                    // Mapeia para o formato do dropdown
                    const novosBeneficios = disponiveis.map(item => ({
                        name: item.descricao,
                        code: item.id,
                        descricao: item.descricao,
                        tipo: item.tipo,
                        icone: item.icone || item.descricao,
                        icon: item.icone || item.descricao
                    }));

                    
                    setDropdownBeneficios(novosBeneficios);
                });
        }
    }, [opened, operadora, beneficiosContrato]);

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
                                <h6>{t('add')} Benefício ao Contrato</h6>
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
                                 {dropdownBeneficios.length === 0 && (
                                    <p style={{ color: 'var(--warning-700)', marginTop: '8px', fontSize: '14px' }}>
                                        {operadora.beneficios_vinculados?.length > 0 
                                            ? "Todos os benefícios disponíveis já foram adicionados ao contrato."
                                            : "Nenhum benefício disponível para essa operadora. Você pode vincular benefícios à esta operadora clicando "}
                                        {operadora.beneficios_vinculados?.length === 0 && (
                                            <Link to={`/operadoras/detalhes/${operadora.id}`}>aqui</Link>
                                        )}.
                                    </p>
                                )}
                        </Frame>
                        <form method="dialog">
                            <div className={styles.containerBottom}>
                                <Botao aoClicar={aoFechar} estilo="neutro" formMethod="dialog" size="medium" filled>{t('back')}</Botao>
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
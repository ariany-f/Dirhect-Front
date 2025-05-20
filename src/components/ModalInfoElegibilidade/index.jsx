import { useRef } from "react";
import Texto from '@components/Texto';
import CustomImage from '@components/CustomImage';
import { Real } from '@utils/formats';
import IconeBeneficio from "@components/IconeBeneficio";
import { Link } from "react-router-dom";
import { FaChevronDown, FaCheck, FaTimes, FaClock } from 'react-icons/fa';
import { Tree } from 'primereact/tree';
import styled from "styled-components";
import { OverlayRight, DialogEstilizadoRight } from '@components/Modal/styles';
import { RiCloseFill } from 'react-icons/ri';

const StatusIcon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    gap: 4px;
`;

function getTipoCalculo(tipo) {
    const tipoMap = {
        'F': 'Valor Fixo',
        'M': 'Valor Mensal',
        'D': 'Valor Diário',
        'T': 'Tabela Interna'
    };
    return tipoMap[tipo] || tipo;
}

function getTipoDesconto(tipo) {
    const tipoMap = {
        'F': 'Valor Fixo',
        'C': '% sobre o valor da compra',
        'S': '% do Valor do Salário',
        'D': 'Valor Diário'
    };
    return tipoMap[tipo] || tipo;
}

function getStatusContrato(status) {
    switch (status) {
        case 'A': return 'Disponível';
        case 'I': return 'Indisponível';
        default: return status;
    }
}

const statusTemplate = (option, context, showChevron = false, showText = false, forceAdicionar = false) => {
    if (!option) return null;
    let obrigatorio = false;
    if (context && context.value && context.value.obrigatoriedade) obrigatorio = true;
    if (context && context.option && context.option.obrigatoriedade) obrigatorio = true;
    let color = '';
    if (option.value === 'sim') color = 'var(--success)';
    else if (option.value === 'nao') color = 'var(--error)';
    else if (option.value === 'pendente' && obrigatorio) color = 'var(--error)';
    else color = 'var(--warning)';
    let icon = null;
    if (option.value === 'sim') icon = <FaCheck size={14} style={{ color, fontSize: 20 }} />;
    else if (option.value === 'nao') icon = <FaTimes size={14} style={{ color, fontSize: 20 }} />;
    else icon = <FaClock size={14} style={{ color, fontSize: 20 }} />;
    return (
        <StatusIcon style={{gap: 8, justifyContent: 'flex-end'}}>
            {forceAdicionar && option.value === 'pendente' ? (
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--primaria)' }}>Adicionar</span>
            ) : (
                <>
                    {icon}
                    {showText && (option.value === 'sim' || option.value === 'nao') && (
                        <span style={{ fontSize: 14, fontWeight: 500, color: '#222' }}>{option.label}</span>
                    )}
                </>
            )}
            {showChevron && <FaChevronDown style={{ color: 'var(--neutro-400)', fontSize: 16, marginLeft: 2 }} />}
        </StatusIcon>
    );
};

const ModalInfoElegibilidade = ({ open, item, onClose }) => {
   
    if (!open || !item) return null;
    const contrato = item.contratoInfo;
    const beneficio = item.item?.beneficio;
    const operadora = item?.operadora;
    const regras = item?.regra_elegibilidade || [];
    // Monta os nodes para o Tree
    const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);
    const regrasTreeNodes = regras.flatMap((regra, idx) =>
        Object.entries(regra).map(([key, value]) => ({
            key: `regra-${idx}-${key}`,
            label: capitalize(key),
            children: Object.entries(value)
                .filter(([k, _]) => k !== 'index')
                .map(([k, v]) => ({
                    key: `regra-${idx}-${key}-${k}`,
                    label: `${k}: ${Array.isArray(v) ? v.join(', ') : v}`
                }))
        }))
    );
    return (
        <OverlayRight $opened={open}>
            <DialogEstilizadoRight $width="40vw" open={open} $opened={open}>
                <button className="close" onClick={onClose} formMethod="dialog">
                    <RiCloseFill size={20} className="fechar" />
                </button>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 16,
                    width: '100%',
                    height: '100%',
                    padding: 0
                }}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                            {operadora?.image_operadora && (
                                <CustomImage src={operadora.image_operadora} alt={operadora.nome_operadora} title={operadora.nome_operadora} width={50} height={40} />
                            )}
                            <span>{operadora?.nome_operadora || '---'}</span>
                             {/* Badge de status do vínculo do colaborador */}
                             {item.status === 'sim' && (
                                <span style={{
                                    background: 'rgba(0, 200, 83, 0.1)',
                                    color: 'var(--success)',
                                    fontWeight: 600,
                                    fontSize: 12,
                                    borderRadius: 8,
                                    padding: '2px 10px',
                                    marginLeft: 8
                                }}>ATIVO PARA O COLABORADOR</span>
                            )}
                            {item.status === 'nao' && (
                                <span style={{
                                    background: 'rgba(229, 115, 115, 0.1)',
                                    color: 'var(--error)',
                                    fontWeight: 600,
                                    fontSize: 12,
                                    borderRadius: 8,
                                    padding: '2px 10px',
                                    marginLeft: 8
                                }}>INATIVO PARA O COLABORADOR</span>
                            )}
                        </div>
                    </div>
                    {/* Contrato */}
                    <div style={{marginTop: 16}}>
                        <div weight={700} size={15} style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8}}>
                            <Texto weight={700} size={15}>Número do Contrato: </Texto>
                            <Link to={`/contratos/detalhes/${contrato.id}`} style={{ textDecoration: 'underline', fontSize: 16 }}>{`#${contrato?.num_contrato_origem}` || '---'}</Link>
                        </div>
                    </div>
                    {/* Benefício */}
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8}}>
                        <Texto weight={700} size={15}>Benefício:</Texto>
                        <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                            {item.icone && (
                                <IconeBeneficio nomeIcone={item.icone} size={16} />
                            )}
                            <span style={{fontWeight: 600, fontSize: 14}}>{item.descricao || beneficio?.descricao || '---'}</span>
                        </div>
                    </div>
                    {/* Item do Contrato */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                        <Texto weight={700} size={15}>Item do Contrato:</Texto>
                        <span style={{fontWeight: 600, fontSize: 14, marginLeft: 8}}>{item.plano || '---'}</span>
                    </div>
                    {/* Regras de Elegibilidade */}
                    <div>
                        <Texto weight={700} size={15}>Regras de Elegibilidade:</Texto>
                        <div style={{marginTop: 8}}>
                            {regrasTreeNodes.length > 0 ? (
                                <Tree value={regrasTreeNodes} />
                            ) : (
                                <span>Nenhuma regra cadastrada</span>
                            )}
                        </div>
                    </div>
                    {/* Card de Informações de Valores */}
                    <div style={{
                        background: 'var(--neutro-50)',
                        borderRadius: 12,
                        marginTop: 16,
                        padding: '8px 12px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8
                    }}>
                        <Texto size="18px" weight={600} style={{marginBottom: 4}}>Outras Informações:</Texto>
                        <Texto size="14px">Valor:&nbsp;<b style={{color: 'var(--green-700)'}}>{Real.format(item.item?.valor)}</b></Texto>
                        <Texto size="14px">Valor Colaborador:&nbsp;<b style={{color: 'var(--error)'}}>{Real.format(item.item?.valor_desconto)}</b></Texto>
                        <Texto size="14px">Valor Empresa:&nbsp;<b style={{color: 'var(--error)'}}>{Real.format(item.item?.valor_empresa)}</b></Texto>
                        <Texto size="14px">Tipo de Cálculo:&nbsp;<b>{getTipoCalculo(item.item?.tipo_calculo) || '---'}</b></Texto>
                        <Texto size="14px">Tipo de Desconto:&nbsp;<b>{getTipoDesconto(item.item?.tipo_desconto) || '---'}</b></Texto>
                    </div>
                </div>
            </DialogEstilizadoRight>
        </OverlayRight>
    );
};

export default ModalInfoElegibilidade;

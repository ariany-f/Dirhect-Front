import React from 'react';
import { useCandidatoContext } from '@contexts/Candidato';
import CampoTexto from '@components/CampoTexto';
import DropdownItens from '@components/DropdownItens';
import styled from 'styled-components';

const GridContainer = styled.div`
    padding: 0 10px 10px 10px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0 16px;
    
    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 0;
    }
`;

const SectionTitle = styled.div`
    grid-column: 1 / -1;
    font-size: 18px;
    font-weight: 600;
    color: #374151;
    margin: 20px 0 10px 0;
    padding-bottom: 8px;
    border-bottom: 1px solid #e2e8f0;
`;

const InfoBox = styled.div`
    grid-column: 1 / -1;
    background: linear-gradient(45deg, #f8fafc, #f1f5f9);
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 16px;
    margin: 16px 0;
    color: #64748b;
    font-size: 14px;
    line-height: 1.5;
    
    .icon {
        color: #3b82f6;
        margin-right: 8px;
    }
`;

const StepDadosBancarios = () => {
    const { candidato, setCampo } = useCandidatoContext();

    // Lista de bancos mais comuns
    const bancos = [
        { code: '001', name: '001 - Banco do Brasil' },
        { code: '104', name: '104 - Caixa Econômica Federal' },
        { code: '341', name: '341 - Itaú Unibanco' },
        { code: '033', name: '033 - Santander' },
        { code: '237', name: '237 - Bradesco' },
        { code: '260', name: '260 - Nubank' },
        { code: '290', name: '290 - PagSeguro' },
        { code: '336', name: '336 - C6 Bank' },
        { code: '077', name: '077 - Inter' },
        { code: '212', name: '212 - Original' },
        { code: '756', name: '756 - Sicoob' },
        { code: '748', name: '748 - Sicredi' },
        { code: '070', name: '070 - BRB' },
        { code: '085', name: '085 - Via Credi' },
        { code: '364', name: '364 - Gerencianet' }
    ];

    // Tipos de conta
    const tiposConta = [
        { code: 'corrente', name: 'Conta Corrente' },
        { code: 'poupanca', name: 'Conta Poupança' },
        { code: 'salario', name: 'Conta Salário' }
    ];

    // Tipos de PIX
    const tiposPix = [
        { code: 'cpf', name: 'CPF' },
        { code: 'telefone', name: 'Telefone' },
        { code: 'email', name: 'E-mail' },
        { code: 'chave_aleatoria', name: 'Chave Aleatória' }
    ];

    return (
        <GridContainer>
            <InfoBox>
                <strong>Informações importantes:</strong><br />
                • Os dados bancários são utilizados para crédito de salário e benefícios<br />
                • Certifique-se de que os dados estão corretos para evitar problemas no pagamento<br />
                • A conta preferencialmente deve estar no nome do colaborador
            </InfoBox>

            <DropdownItens
                $margin={'10px'}
                valor={candidato?.banco_codigo ? bancos.find(b => b.code === candidato.banco_codigo) || '' : ''}
                setValor={valor => {
                    setCampo('banco_codigo', valor.code);
                    setCampo('banco', valor.name);
                }}
                options={bancos}
                name="banco"
                label="Banco"
                placeholder="Selecione o banco"
            />

            <CampoTexto
                name="agencia"
                valor={candidato?.agencia ?? ''}
                setValor={valor => setCampo('agencia', valor)}
                label="Agência"
                placeholder="Digite a agência (sem dígito)"
                patternMask="9999"
            />

            <CampoTexto
                name="conta_corrente"
                valor={candidato?.conta_corrente ?? ''}
                setValor={valor => setCampo('conta_corrente', valor)}
                label="Número da Conta"
                placeholder="Digite o número da conta (com dígito)"
            />

            <DropdownItens
                $margin={'10px'}
                valor={candidato?.tipo_conta ? tiposConta.find(t => t.code === candidato.tipo_conta) || '' : ''}
                setValor={valor => setCampo('tipo_conta', valor.code)}
                options={tiposConta}
                name="tipo_conta"
                label="Tipo de Conta"
                placeholder="Selecione o tipo de conta"
            />

            <CampoTexto
                name="operacao"
                valor={candidato?.operacao ?? ''}
                setValor={valor => setCampo('operacao', valor)}
                label="Operação (se houver)"
                placeholder="Digite a operação"
            />

            <SectionTitle>PIX (Opcional)</SectionTitle>

            <DropdownItens
                $margin={'10px'}
                valor={candidato?.pix_tipo ? tiposPix.find(t => t.code === candidato.pix_tipo) || '' : ''}
                setValor={valor => setCampo('pix_tipo', valor.code)}
                options={tiposPix}
                name="pix_tipo"
                label="Tipo de Chave PIX"
                placeholder="Selecione o tipo de chave PIX"
            />

            <CampoTexto
                name="pix"
                valor={candidato?.pix ?? ''}
                setValor={valor => setCampo('pix', valor)}
                label="Chave PIX"
                placeholder="Digite a chave PIX"
            />

            <InfoBox>
                <strong>Sobre o PIX:</strong><br />
                • O PIX é opcional, mas facilita transferências e antecipações<br />
                • Certifique-se de que a chave PIX está vinculada à conta informada acima<br />
                • CPF: utilizar apenas números (sem pontos ou traços)<br />
                • Telefone: incluir DDD (exemplo: 11999999999)
            </InfoBox>
        </GridContainer>
    );
};

export default StepDadosBancarios; 
import React, { useRef } from 'react';
import { useCandidatoContext } from '@contexts/Candidato';
import CampoTexto from '@components/CampoTexto';
import DropdownItens from '@components/DropdownItens';
import axios from 'axios';
import styled from 'styled-components';

const GridContainer = styled.div`
    padding: 0 24px 24px 24px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px 24px;
    box-sizing: border-box;
    width: 100%;
    
    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 12px 0;
    }
`;

const Separator = styled.hr`
    grid-column: 1 / -1;
    border: none;
    border-top: 1px solid #e2e8f0;
    margin: 20px 0;
    width: 100%;
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

const StepDadosPessoais = ({ classError, estados }) => {
    const { candidato, setCampo } = useCandidatoContext();
    const lastCepRef = useRef('');

    console.log(candidato)

    // Função para buscar endereço pelo CEP
    const handleCepChange = async (valor) => {
        // Atualiza o campo CEP normalmente
        setCampo('cep', valor);
        const cepLimpo = valor.replace(/\D/g, '');
        // Só busca se for 8 dígitos e diferente do último buscado
        if (cepLimpo.length === 8 && lastCepRef.current !== cepLimpo) {
            lastCepRef.current = cepLimpo;
            try {
                const response = await axios.get(`https://viacep.com.br/ws/${cepLimpo}/json`);
                if (response.data) {
                    setCampo('rua', response.data.logradouro || '');
                    setCampo('bairro', response.data.bairro || '');
                    setCampo('cidade', response.data.localidade || '');
                    setCampo('estado', response.data.uf || '');
                }
            } catch (e) {
                // Silencia erro de CEP inválido
            }
        }
        // Se o usuário apagar o CEP, reseta o lastCepRef
        if (cepLimpo.length < 8) {
            lastCepRef.current = '';
        }
    };

    // Função para obter o estado formatado
    const getEstadoFormatado = () => {
        if (!candidato?.estado) return '';
        const estadoEncontrado = estados.find(e => e.code === candidato.estado);
        return estadoEncontrado || '';
    };

    return (
        <GridContainer>
            <CampoTexto
                camposVazios={classError}
                name="nome"
                valor={candidato?.dados_candidato?.nome ?? ''}
                setValor={valor => setCampo('dados_candidato', { ...candidato.dados_candidato, nome: valor })}
                type="text"
                label="Nome"
                placeholder="Digite o nome"
            />
            <CampoTexto
                camposVazios={classError}
                name="cpf"
                valor={candidato?.dados_candidato?.cpf ?? ''}
                setValor={valor => setCampo('dados_candidato', { ...candidato.dados_candidato, cpf: valor })}
                patternMask="999.999.999-99"
                label="CPF"
                placeholder="Digite o CPF"
                disabled={candidato?.dados_candidato?.cpf && candidato.dados_candidato.cpf.trim() !== ''}
            />
            <CampoTexto
                camposVazios={classError}
                name="email"
                valor={candidato?.dados_candidato?.email ?? ''}
                setValor={valor => setCampo('dados_candidato', { ...candidato.dados_candidato, email: valor })}
                type="text"
                label="E-mail"
                placeholder="Digite o email"
            />
            <CampoTexto
                name="telefone"
                valor={candidato?.dados_candidato?.telefone ?? ''}
                setValor={valor => setCampo('dados_candidato', { ...candidato.dados_candidato, telefone: valor })}
                label="Telefone"
            />
            <CampoTexto
                name="dt_nascimento"
                valor={candidato?.dados_candidato?.dt_nascimento ?? ''}
                setValor={valor => setCampo('dados_candidato', { ...candidato.dados_candidato, dt_nascimento: valor })}
                label="Data de Nascimento"
                type="date"
            />
            
            <SectionTitle>Endereço</SectionTitle>
            
            <CampoTexto
                name="cep"
                patternMask="99999-999"
                valor={candidato?.cep ?? ''}
                setValor={handleCepChange}
                label="CEP"
            />
            <CampoTexto
                name="rua"
                valor={candidato?.rua ?? ''}
                setValor={valor => setCampo('rua', valor)}
                label="Logradouro"
            />
            <CampoTexto
                name="bairro"
                valor={candidato?.bairro ?? ''}
                setValor={valor => setCampo('bairro', valor)}
                label="Bairro"
            />
            <CampoTexto
                name="numero"
                valor={candidato?.numero ?? ''}
                setValor={valor => setCampo('numero', valor)}
                label="Número"
            />
            <CampoTexto
                name="complemento"
                valor={candidato?.complemento ?? ''}
                setValor={valor => setCampo('complemento', valor)}
                label="Complemento"
            />
            <CampoTexto
                name="cidade"
                valor={candidato?.cidade ?? ''}
                setValor={valor => setCampo('cidade', valor)}
                label="Cidade"
            />
            <DropdownItens
                $margin={'10px'}
                valor={getEstadoFormatado()}
                setValor={valor => setCampo('estado', valor.code)}
                options={estados}
                name="state"
                label="Estado"
                placeholder="Selecione o estado"
            />
        </GridContainer>
    );
};

export default StepDadosPessoais; 
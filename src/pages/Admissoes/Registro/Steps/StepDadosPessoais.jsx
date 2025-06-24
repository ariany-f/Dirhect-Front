import React, { useRef } from 'react';
import { useCandidatoContext } from '@contexts/Candidato';
import CampoTexto from '@components/CampoTexto';
import DropdownItens from '@components/DropdownItens';
import axios from 'axios';

const StepDadosPessoais = ({ classError, estados }) => {
    const { candidato, setCampo } = useCandidatoContext();
    const lastCepRef = useRef('');

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
        <div style={{paddingLeft: 10, paddingRight: 10, paddingBottom: 10}}>
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
        </div>
    );
};

export default StepDadosPessoais; 
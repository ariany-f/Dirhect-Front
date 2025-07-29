import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Botao from '@components/Botao';
import BotaoGrupo from '@components/BotaoGrupo';
import styled from 'styled-components';
import { Dropdown } from 'primereact/dropdown';

const NavigationContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    flex: 1;
    justify-content: start;
`;

const DropdownContainer = styled.div`
    min-width: 300px;
    max-width: 500px;
    width: 100%;
`;

const CurrentPathDisplay = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: var(--primaria);
    color: white;
    border-radius: 6px;
    font-weight: 600;
    font-size: 14px;
    min-width: 200px;
    justify-content: center;
`;

function TabelasSistemaNavigation({ currentPath }) {
    const navigate = useNavigate();

    const tabelas = [
        { path: '/tabelas-de-sistema', label: 'De Para', value: '/tabelas-de-sistema' },
        { path: '/tabelas-de-sistema/estado-civil', label: 'Estado Civil', value: '/tabelas-de-sistema/estado-civil' },
        { path: '/tabelas-de-sistema/genero', label: 'Gênero', value: '/tabelas-de-sistema/genero' },
        { path: '/tabelas-de-sistema/nacionalidade', label: 'Nacionalidade', value: '/tabelas-de-sistema/nacionalidade' },
        { path: '/tabelas-de-sistema/cor-raca', label: 'Cor/Raça', value: '/tabelas-de-sistema/cor-raca' },
        { path: '/tabelas-de-sistema/tipo-sanguineo', label: 'Tipo Sanguíneo', value: '/tabelas-de-sistema/tipo-sanguineo' },
        { path: '/tabelas-de-sistema/grau-instrucao', label: 'Grau Instrução', value: '/tabelas-de-sistema/grau-instrucao' },
        { path: '/tabelas-de-sistema/grau-parentesco', label: 'Grau Parentesco', value: '/tabelas-de-sistema/grau-parentesco' },
        { path: '/tabelas-de-sistema/tipo-rua', label: 'Tipo Rua', value: '/tabelas-de-sistema/tipo-rua' },
        { path: '/tabelas-de-sistema/tipo-bairro', label: 'Tipo Bairro', value: '/tabelas-de-sistema/tipo-bairro' },
        { path: '/tabelas-de-sistema/tipo-funcionario', label: 'Tipo Funcionário', value: '/tabelas-de-sistema/tipo-funcionario' },
        { path: '/tabelas-de-sistema/codigo-categoria-esocial', label: 'Cat. eSocial', value: '/tabelas-de-sistema/codigo-categoria-esocial' },
        { path: '/tabelas-de-sistema/tipo-recebimento', label: 'Tipo Recebimento', value: '/tabelas-de-sistema/tipo-recebimento' },
        { path: '/tabelas-de-sistema/tipo-situacao', label: 'Tipo Situação', value: '/tabelas-de-sistema/tipo-situacao' },
        { path: '/tabelas-de-sistema/motivo-admissao', label: 'Motivo Admissão', value: '/tabelas-de-sistema/motivo-admissao' },
        { path: '/tabelas-de-sistema/tipo-admissao', label: 'Tipo Admissão', value: '/tabelas-de-sistema/tipo-admissao' },
        { path: '/tabelas-de-sistema/motivo-demissao', label: 'Motivo Demissão', value: '/tabelas-de-sistema/motivo-demissao' },
        { path: '/tabelas-de-sistema/tipo-demissao', label: 'Tipo Demissão', value: '/tabelas-de-sistema/tipo-demissao' },
        { path: '/tabelas-de-sistema/codigo-ocorrencia-sefip', label: 'Ocor. SEFIP', value: '/tabelas-de-sistema/codigo-ocorrencia-sefip' },
        { path: '/tabelas-de-sistema/codigo-categoria-sefip', label: 'Cat. SEFIP', value: '/tabelas-de-sistema/codigo-categoria-sefip' },
        { path: '/tabelas-de-sistema/codigo-situacao-fgts', label: 'Sit. FGTS', value: '/tabelas-de-sistema/codigo-situacao-fgts' },
        { path: '/tabelas-de-sistema/codigo-vinculo-rais', label: 'Vínc. RAIS', value: '/tabelas-de-sistema/codigo-vinculo-rais' },
        { path: '/tabelas-de-sistema/codigo-situacao-rais', label: 'Sit. RAIS', value: '/tabelas-de-sistema/codigo-situacao-rais' }
    ];

    // Encontra a tabela atual
    const tabelaAtual = tabelas.find(tab => tab.path === currentPath) || tabelas[0];

    // Log para debug
    useEffect(() => {
        console.log('TabelasSistemaNavigation - currentPath:', currentPath);
        console.log('TabelasSistemaNavigation - tabelaAtual:', tabelaAtual);
    }, [currentPath, tabelaAtual]);

    const handleTabelaChange = (event) => {
        const selectedPath = event.value;
        console.log('Tabela selecionada:', selectedPath);
        if (selectedPath && selectedPath !== currentPath) {
            navigate(selectedPath);
        }
    };

    return (
        <BotaoGrupo align="center">
            <NavigationContainer>
                <DropdownContainer>
                    <Dropdown
                        value={currentPath}
                        options={tabelas}
                        onChange={handleTabelaChange}
                        optionLabel="label"
                        optionValue="path"
                        placeholder="Selecione uma tabela"
                        className="w-full"
                        showClear={false}
                        filter
                        filterPlaceholder="Buscar tabela..."
                        panelClassName="tabelas-dropdown-panel"
                    />
                </DropdownContainer>
            </NavigationContainer>
        </BotaoGrupo>
    );
}

export default TabelasSistemaNavigation; 
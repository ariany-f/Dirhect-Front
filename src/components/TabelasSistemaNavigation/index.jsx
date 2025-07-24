import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Botao from '@components/Botao';
import BotaoGrupo from '@components/BotaoGrupo';
import styled from 'styled-components';

const NavigationContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    overflow: hidden;
    width: 100%;
    flex: 1;
`;

const TabsContainer = styled.div`
    display: flex;
    overflow: hidden;
    flex: 1;
    transition: transform 0.3s ease;
    min-width: 0;
    justify-content: space-between;
`;

const NavButton = styled.button`
    background: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 4px;
    padding: 8px 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 40px;
    flex-shrink: 0;
    
    &:hover {
        background: #e9ecef;
    }
    
    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

function TabelasSistemaNavigation({ currentPath }) {
    const [visibleTabsStart, setVisibleTabsStart] = useState(0);

    const tabs = [
        { path: '/tabelas-de-sistema', label: 'De Para' },
        { path: '/tabelas-de-sistema/estado-civil', label: 'Estado Civil' },
        { path: '/tabelas-de-sistema/genero', label: 'Gênero' },
        { path: '/tabelas-de-sistema/nacionalidade', label: 'Nacionalidade' },
        { path: '/tabelas-de-sistema/cor-raca', label: 'Cor/Raça' },
        { path: '/tabelas-de-sistema/tipo-sanguineo', label: 'Tipo Sanguíneo' },
        { path: '/tabelas-de-sistema/grau-instrucao', label: 'Grau Instrução' },
        { path: '/tabelas-de-sistema/grau-parentesco', label: 'Grau Parentesco' },
        { path: '/tabelas-de-sistema/tipo-rua', label: 'Tipo Rua' },
        { path: '/tabelas-de-sistema/tipo-bairro', label: 'Tipo Bairro' },
        { path: '/tabelas-de-sistema/tipo-funcionario', label: 'Tipo Funcionário' },
        { path: '/tabelas-de-sistema/codigo-categoria-esocial', label: 'Cat. eSocial' },
        { path: '/tabelas-de-sistema/tipo-recebimento', label: 'Tipo Recebimento' },
        { path: '/tabelas-de-sistema/tipo-situacao', label: 'Tipo Situação' },
        { path: '/tabelas-de-sistema/motivo-admissao', label: 'Motivo Admissão' },
        { path: '/tabelas-de-sistema/tipo-admissao', label: 'Tipo Admissão' },
        { path: '/tabelas-de-sistema/motivo-demissao', label: 'Motivo Demissão' },
        { path: '/tabelas-de-sistema/tipo-demissao', label: 'Tipo Demissão' },
        { path: '/tabelas-de-sistema/codigo-ocorrencia-sefip', label: 'Ocor. SEFIP' },
        { path: '/tabelas-de-sistema/codigo-categoria-sefip', label: 'Cat. SEFIP' },
        { path: '/tabelas-de-sistema/codigo-situacao-fgts', label: 'Sit. FGTS' },
        { path: '/tabelas-de-sistema/codigo-vinculo-rais', label: 'Vínc. RAIS' },
        { path: '/tabelas-de-sistema/codigo-situacao-rais', label: 'Sit. RAIS' }
    ];

    const maxVisibleTabs = 9; // Aumentado significativamente para aproveitar melhor o espaço
    // Encontra o índice da aba atual
    const currentTabIndex = tabs.findIndex(tab => tab.path === currentPath);
    
    // Ajusta automaticamente a visualização para mostrar a aba ativa
    React.useEffect(() => {
        if (currentTabIndex !== -1) {
            // Calcula a posição ideal para centralizar a aba ativa
            const idealStart = Math.max(0, currentTabIndex - Math.floor(maxVisibleTabs / 2));
            const maxStart = Math.max(0, tabs.length - maxVisibleTabs);
            const newStart = Math.min(idealStart, maxStart);
            setVisibleTabsStart(newStart);
        }
    }, [currentTabIndex]);

    const navigateLeft = () => {
        if (visibleTabsStart > 0) {
            // Navegação inteligente: move para mostrar mais abas à esquerda
            const moveSteps = Math.min(maxVisibleTabs - 2, visibleTabsStart);
            setVisibleTabsStart(Math.max(0, visibleTabsStart - moveSteps));
        }
    };

    const navigateRight = () => {
        if (visibleTabsStart + maxVisibleTabs < tabs.length) {
            // Navegação inteligente: move para mostrar mais abas à direita
            const remainingTabs = tabs.length - (visibleTabsStart + maxVisibleTabs);
            const moveSteps = Math.min(maxVisibleTabs - 2, remainingTabs);
            const newStart = Math.min(
                tabs.length - maxVisibleTabs,
                visibleTabsStart + moveSteps
            );
            setVisibleTabsStart(newStart);
        }
    };

    const visibleTabs = tabs.slice(visibleTabsStart, visibleTabsStart + maxVisibleTabs);
    const showLeftArrow = visibleTabsStart > 0;
    const showRightArrow = visibleTabsStart + maxVisibleTabs < tabs.length;

    return (
        <BotaoGrupo align="space-between">
            <NavigationContainer>
                {showLeftArrow && (
                    <NavButton onClick={navigateLeft} title="Mostrar abas anteriores">
                        <i className="pi pi-chevron-left"></i>
                    </NavButton>
                )}
                
                <TabsContainer>
                    {visibleTabs.map((tab) => (
                        <Link key={tab.path} to={tab.path}>
                            <Botao 
                                estilo={tab.path === currentPath ? 'black' : ''} 
                                size="small" 
                                tab
                            >
                                {tab.label}
                            </Botao>
                        </Link>
                    ))}
                </TabsContainer>
                
                {showRightArrow && (
                    <NavButton onClick={navigateRight} title="Mostrar próximas abas">
                        <i className="pi pi-chevron-right"></i>
                    </NavButton>
                )}
            </NavigationContainer>
        </BotaoGrupo>
    );
}

export default TabelasSistemaNavigation; 
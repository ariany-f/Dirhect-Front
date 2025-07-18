import React from 'react';
import { useCandidatoContext } from '@contexts/Candidato';
import styled from 'styled-components';

const CheckboxContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 24px;

    input[type="checkbox"] {
        width: 20px;
        height: 20px;
        cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
    }

    label {
        cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
        user-select: none;
        color: ${props => props.$disabled ? 'var(--text-color-secondary)' : 'var(--text-color)'};
    }
`;

const StepLGPD = ({ onAceiteChange }) => {
    const { candidato, setCampo } = useCandidatoContext();

    const handleChange = (e) => {
        setCampo('aceite_lgpd', e.target.checked);
        if (onAceiteChange) {
            onAceiteChange(e.target.checked);
        }
    };

    return (
        <div data-tour="panel-step-6">
            <h3>Termo de Consentimento LGPD</h3>
            <div style={{ marginBottom: 16, fontSize: 15, color: '#444', lineHeight: 1.6, marginTop: 16 }}>
                Declaro, para os devidos fins, que li e estou ciente de que, ao me candidatar a uma vaga nesta empresa, meus dados pessoais, incluindo, mas não se limitando a nome, CPF, endereço, telefone, e-mail, dados profissionais, acadêmicos, documentos, exames médicos e demais informações fornecidas, serão coletados, tratados e armazenados pela empresa exclusivamente para fins de recrutamento, seleção, análise de perfil, eventual contratação e cumprimento de obrigações legais e regulatórias.<br/><br/>
                Estou ciente de que meus dados poderão ser compartilhados com prestadores de serviço, parceiros e órgãos públicos, sempre observando a finalidade descrita acima e em conformidade com a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 – LGPD).<br/><br/>
                Tenho ciência de que poderei, a qualquer momento, solicitar informações sobre o tratamento dos meus dados, bem como requerer a atualização, correção ou exclusão destes, conforme previsto na legislação vigente, por meio dos canais de contato disponibilizados pela empresa.<br/><br/>
                Ao prosseguir, declaro que li, compreendi e concordo com o tratamento dos meus dados pessoais para os fins acima descritos.
            </div>
            <CheckboxContainer $disabled={candidato.aceite_lgpd}>
                <input
                    type="checkbox"
                    checked={!!candidato.aceite_lgpd}
                    onChange={handleChange}
                    disabled={candidato.aceite_lgpd}
                    id="lgpd-checkbox"
                />
                <label htmlFor="lgpd-checkbox">
                    {candidato.aceite_lgpd ? 'Termo aceito' : 'Aceito os termos da LGPD'}
                </label>
            </CheckboxContainer>
        </div>
    );
};

export default StepLGPD; 
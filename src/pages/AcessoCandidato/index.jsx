import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message } from 'primereact/message';
import AcessoCandidatoRegistro from './Registro';
import { HiArrowLeft } from 'react-icons/hi';
import http from '@http';
import { CandidatoProvider } from '@contexts/Candidato';
import { ArmazenadorToken } from '@utils';

const Logo = styled.img`
  height: 38px;
  margin: 24px 0 8px 32px;
`;

const Wrapper = styled.div`
  min-height: 100vh;
  width: 100vw;
  background-color: #f5f5f5;
`;

const HeaderBar = styled.div`
  width: 100vw;
  display: flex;
  align-items: center;
  background: #fff;
  padding: 0;
  box-sizing: border-box;
`;

const BotaoVoltar = styled.button`
  background: none;
  border: none;
  color: #2d197c;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: 16px;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s;
  &:hover {
    color: var(--gradient-secundaria);
  }
`;

const Content = styled.div`
  width: 100vw;
  min-height: calc(100vh - 5px);
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 0;
  box-sizing: border-box;
`;

const LoadingContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 20px;
  background: #f5f5f5;
`;

const ErrorContainer = styled.div`
  width: 100vw;
  min-height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function AcessoCandidato() {
  const { token, uuid } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [candidatoData, setCandidatoData] = useState(null);
  const [tenant, setTenant] = useState(null);

  useEffect(() => {
    ArmazenadorToken.removerToken();
    ArmazenadorToken.removerCompany();
    ArmazenadorToken.removerAdmissaoToken();
    ArmazenadorToken.removerAdmissaoSecurityToken();
    validarToken();
  }, [token]);

  const validarToken = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Busca dados do endpoint real
      const response = await http.get(`admissao/documentacao/validar/${token}/${uuid}/`);
      
      if (response) {
        setCandidatoData(response.admissao);
        setTenant(response.tenant_info);

        ArmazenadorToken.definirCompany(
          null, 
          response.tenant_info.schema, 
          null, 
          null
        );

        ArmazenadorToken.definirAdmissaoToken(token);
        ArmazenadorToken.definirAdmissaoSecurityToken(uuid);

      } else {
        throw new Error('Token inválido ou expirado');
      }
    } catch (error) {
      console.error('Erro ao validar token:', error);
      setError(error.message || 'Erro ao validar token');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <LoadingContainer>
        <ProgressSpinner />
        <p>Validando acesso...</p>
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <Wrapper>
        <ErrorContainer>
          <Message 
            severity="error" 
            text={error}
            style={{ width: '100%', maxWidth: '500px' }}
          />
        </ErrorContainer>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      {/* <HeaderBar>
        <Logo src="/imagens/logo.png" alt="Dirhect" />
      </HeaderBar> */}
      <Content>
        <CandidatoProvider>
          <AcessoCandidatoRegistro candidatoData={candidatoData} token={token} />
        </CandidatoProvider>
      </Content>
    </Wrapper>
  );
}

export default AcessoCandidato; 
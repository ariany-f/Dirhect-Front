import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message } from 'primereact/message';
import AcessoCandidatoRegistro from './Registro';
import { HiArrowLeft } from 'react-icons/hi';

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
    color: #5d0b62;
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

  useEffect(() => {
    validarToken();
  }, [token]);

  const validarToken = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (token === 'invalid') {
        throw new Error('Token inválido ou expirado');
      }
      const dadosFake = {
        id: 31,
        tarefas: [],
        log_tarefas: [],
        documentos_status: { total: 0, enviados: 0 },
        documentos: [],
        dados_vaga: {
          id: 19,
          titulo: "Analista Contábil"
        },
        dados_candidato: {
          id: 42,
          nome: "JOÃO SILVA",
          cpf: "12345678901",
          email: "joao.silva@email.com",
          telefone: "(11) 99999-9999",
          dt_nascimento: "1990-01-15",
          dt_exame_medico: "2024-01-01",
          dt_inicio: "2024-01-01",
          salario: null,
          observacao: null
        },
        created_at: "2024-01-15T10:00:00.000000-03:00",
        updated_at: "2024-01-15T10:00:00.000000-03:00",
        chapa: null,
        codigo_ficha_registro: null,
        tipo_admissao: null,
        dt_admissao: "2024-01-15",
        status: "D",
        aceite_lgpd: false,
        documentos_completos: false,
        salario: "0.00",
        codigo_jornada: null,
        agencia: null,
        conta_corrente: null,
        tipo_conta: null,
        pix: null,
        estado_natal: null,
        naturalidade: null,
        apelido: null,
        sexo: null,
        nacionalidade: null,
        rua: null,
        numero: null,
        complemento: null,
        bairro: null,
        estado: null,
        cidade: null,
        cep: null,
        pais: null,
        registro_profissional: null,
        imagem_id: null,
        telefone1: null,
        telefone2: null,
        identidade: null,
        uf_identidade: null,
        orgao_emissor_ident: null,
        data_emissao_ident: null,
        titulo_eleitor: null,
        zona_titulo_eleitor: null,
        secao_titulo_eleitor: null,
        carteira_trabalho: null,
        serie_carteira_trab: null,
        uf_carteira_trab: null,
        data_emissao_ctps: null,
        nit: null,
        carteira_motorista: null,
        tipo_carteira_habilit: null,
        data_venc_habilit: null,
        certificado_reservista: null,
        naturalizado: false,
        data_venc_ctps: null,
        tipo_visto: null,
        email_pessoal: null,
        cor_raca: null,
        deficiente_fisico: false,
        numero_passaporte: null,
        pais_origem: null,
        data_emissao_passaporte: null,
        data_validade_passaporte: null,
        observacoes_pessoa: null,
        codigo_municipio: null,
        circunscricao_militar: null,
        orgao_expedicao: null,
        regiao_militar: null,
        situacao_militar: null,
        data_titulo_eleitor: null,
        estado_emissor_tit_eleitor: null,
        tipo_sanguineo: null,
        id_biometria: null,
        imagem: null,
        primeiro_nome: null,
        sobrenome_pai: null,
        sobrenome_mae: null,
        uf_registro_profissional: null,
        data_emissao_cnh: null,
        data_naturalizacao: null,
        id_pais: null,
        nome_social: null,
        candidato: 42,
        vaga: 19,
        processo: 52,
        funcionario: null,
        centro_custo: null,
        filial: null,
        departamento: null,
        id_secao: null,
        id_funcao: null,
        tipo_funcionario: null,
        tipo_situacao: null,
        banco: null,
        estado_civil: null,
        genero: null
      };
      setCandidatoData(dadosFake);
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
        <AcessoCandidatoRegistro candidatoData={candidatoData} token={token} />
      </Content>
    </Wrapper>
  );
}

export default AcessoCandidato; 
import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { Checkbox } from 'primereact/checkbox';
import { FaPlus, FaSave, FaTrash, FaPlusCircle, FaSearch, FaEdit, FaKey, FaUser, FaGlobe, FaCog, FaInfo, FaShieldAlt } from 'react-icons/fa';
import { GrAddCircle } from 'react-icons/gr';
import http from '@http';
import styled from 'styled-components';
import Botao from '@components/Botao';
import BotaoGrupo from '@components/BotaoGrupo';
import DropdownItens from '@components/DropdownItens';
import CampoTexto from '@components/CampoTexto';

const MetadadosContainer = styled.div`
  padding: 32px;
  max-width: 1600px;
  margin: 0 auto;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  min-height: 100vh;
  width: 100%;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  padding: 24px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e9ecef;
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: var(--neutro-900);
  margin: 0;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #6c757d;
  margin: 0;
  font-weight: 500;
`;

const DropdownContainer = styled.div`
  padding: 24px 0px 0px 0px;
`;

const DropdownLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 14px;
  color: #495057;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TableContainer = styled.div`
  border: 1px solid #e9ecef;
  border-radius: 16px;
  overflow: hidden;
  background: white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
  width: 100%;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  background: var(--primaria);
  border-bottom: 1px solid #e9ecef;
`;

const SectionHeader = styled.div`
  padding: 20px 24px;
  width: 100%;
  font-weight: 700;
  color: white;
  text-align: center;
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  &:last-child {
    border-right: none;
  }
`;

const TableBody = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
`;

const SectionBody = styled.div`
  border-right: 1px solid #dee2e6;
  width: 100%;
  &:last-child {
    border-right: none;
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: ${props => props.columns};
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid #f8f9fa;
  align-items: center;
  transition: all 0.2s ease;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
  
  &:nth-child(even) {
    background: #fafbfc;
  }
`;

const Input = styled(InputText)`
  width: 100%;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 14px;
  transition: all 0.2s ease;
  background: white;
  
  &:focus {
    border-color: #2e7d32;
    box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.1);
    outline: none;
  }
  
  &:hover {
    border-color: #2e7d32;
  }
`;



function Credenciais() {
  const [credenciais, setCredenciais] = useState([]);
  const [selectedCredencial, setSelectedCredencial] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [credencialToDelete, setCredencialToDelete] = useState(null);

  // Estados para o modal de criação de credenciais
  const [showCreateCredentialModal, setShowCreateCredentialModal] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [newCredential, setNewCredential] = useState({
    nome_sistema: '',
    descricao: '',
    logo: null,
    url_endpoint: '',
    tipo_autenticacao: 'api_key',
    usuario: '',
    senha: '',
    api_key: '',
    bearer_token: '',
    client_id: '',
    client_secret: '',
    timeout: 30,
    headers_adicionais: '{}',
    ativo: true,
    observacoes: ''
  });
  const [additionalFields, setAdditionalFields] = useState([]);
  const [savingCredential, setSavingCredential] = useState(false);

  const toast = React.useRef();

  // Carregar lista de credenciais
  useEffect(() => {
    const carregarCredenciais = async () => {
      try {
        setLoading(true);
        
        // Buscar credenciais externas
        const responseCredenciais = await http.get('/integracao-tenant/credenciais-externas/');
        console.log('Resposta do endpoint credenciais-externas:', responseCredenciais);
        
        // Se temos credenciais, buscar os campos de cada uma
        if (responseCredenciais && Array.isArray(responseCredenciais)) {
          const credenciaisComCampos = [];
          
          for (const credencial of responseCredenciais) {
            try {
              // Buscar campos para cada credencial usando o ID
              const responseCampos = await http.get(`/integracao-tenant/credenciais-externas-campos/?credencial=${credencial.id}`);
              console.log(`Campos para credencial ${credencial.id}:`, responseCampos);
              
              // Adicionar campos_adicionais à credencial
              const credencialComCampos = {
                ...credencial,
                campos_adicionais: responseCampos || []
              };
              
              credenciaisComCampos.push(credencialComCampos);
            } catch (camposError) {
              console.warn(`Erro ao buscar campos para credencial ${credencial.id}:`, camposError);
              // Adicionar credencial sem campos se der erro
              credenciaisComCampos.push({
                ...credencial,
                campos_adicionais: []
              });
            }
          }
          
          console.log('Credenciais com campos:', credenciaisComCampos);
          setCredenciais(credenciaisComCampos);
          
          // Selecionar automaticamente a primeira credencial se houver
          if (credenciaisComCampos.length > 0 && !selectedCredencial) {
            setSelectedCredencial(credenciaisComCampos[0]);
          }
        } else {
          setCredenciais([]);
        }
      } catch (error) {
        console.error('Erro ao carregar credenciais:', error);
        toast.current.show({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar lista de credenciais',
          life: 3000
        });
      } finally {
        setLoading(false);
      }
    };

    carregarCredenciais();
  }, []);































  // Iniciar criação de nova credencial
  const iniciarCriacaoCredencial = () => {
    setShowCreateCredentialModal(true);
    setActiveTab(0);
    setNewCredential({
      nome_sistema: '',
      descricao: '',
      logo: null,
      url_endpoint: '',
      tipo_autenticacao: 'api_key',
      usuario: '',
      senha: '',
      api_key: '',
      bearer_token: '',
      client_id: '',
      client_secret: '',
      timeout: 30,
      headers_adicionais: '{}',
      ativo: true,
      observacoes: ''
    });
    setAdditionalFields([]);
  };

  // Opções de tipo de autenticação
  const authenticationTypes = [
    { label: 'API Key', value: 'api_key' },
    { label: 'Basic Authentication', value: 'basic' },
    { label: 'Bearer Token', value: 'bearer' },
    { label: 'OAuth 2.0', value: 'oauth' }
  ];

  // Tipos de campos adicionais
  const fieldTypes = [
    { label: 'Texto', value: 'texto' },
    { label: 'Número', value: 'numero' },
    { label: 'Verdadeiro/Falso', value: 'boolean' },
    { label: 'URL', value: 'url' },
    { label: 'E-mail', value: 'email' },
    { label: 'JSON', value: 'json' },
    { label: 'Senha', value: 'password' }
  ];

  // Adicionar campo adicional
  const addAdditionalField = () => {
    setAdditionalFields(prev => [...prev, {
      id: Date.now(),
      chave: '',
      valor: '',
      tipo_campo: 'texto',
      obrigatório: false,
      sensivel: false
    }]);
  };

  // Remover campo adicional
  const removeAdditionalField = (index) => {
    setAdditionalFields(prev => prev.filter((_, i) => i !== index));
  };

  // Atualizar campo adicional
  const updateAdditionalField = (index, field, value) => {
    setAdditionalFields(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  // Validar credencial antes de salvar
  const validateCredential = () => {
    const errors = [];

    // Validações básicas
    if (!newCredential.nome_sistema.trim()) {
      errors.push('Nome do sistema é obrigatório');
    }
    if (!newCredential.url_endpoint.trim()) {
      errors.push('URL do endpoint é obrigatória');
    }

    // Validações específicas por tipo de autenticação
    switch (newCredential.tipo_autenticacao) {
      case 'basic':
        if (!newCredential.usuario.trim()) {
          errors.push('Usuário é obrigatório para Basic Authentication');
        }
        if (!newCredential.senha.trim()) {
          errors.push('Senha é obrigatória para Basic Authentication');
        }
        break;
      case 'api_key':
        if (!newCredential.api_key.trim()) {
          errors.push('API Key é obrigatória');
        }
        break;
      case 'bearer':
        if (!newCredential.bearer_token.trim()) {
          errors.push('Bearer Token é obrigatório');
        }
        break;
      case 'oauth':
        if (!newCredential.client_id.trim()) {
          errors.push('Client ID é obrigatório para OAuth 2.0');
        }
        if (!newCredential.client_secret.trim()) {
          errors.push('Client Secret é obrigatório para OAuth 2.0');
        }
        break;
    }

    // Validar campos adicionais
    additionalFields.forEach((field, index) => {
      if (!field.chave.trim()) {
        errors.push(`Chave do campo adicional ${index + 1} é obrigatória`);
      }
    });

    return errors;
  };

  // Salvar nova credencial
  const saveNewCredential = async () => {
    const errors = validateCredential();
    
    if (errors.length > 0) {
      toast.current.show({
        severity: 'error',
        summary: 'Erro de Validação',
        detail: errors.join('\n'),
        life: 5000
      });
      return;
    }

    try {
      setSavingCredential(true);

      // Preparar dados da credencial
      const credentialData = {
        nome_sistema: newCredential.nome_sistema,
        descricao: newCredential.descricao,
        url_endpoint: newCredential.url_endpoint,
        tipo_autenticacao: newCredential.tipo_autenticacao,
        timeout: newCredential.timeout,
        ativo: newCredential.ativo,
        observacoes: newCredential.observacoes
      };

      // Adicionar campos específicos por tipo de autenticação
      switch (newCredential.tipo_autenticacao) {
        case 'basic':
          credentialData.usuario = newCredential.usuario;
          credentialData.senha = newCredential.senha;
          break;
        case 'api_key':
          credentialData.api_key = newCredential.api_key;
          break;
        case 'bearer':
          credentialData.bearer_token = newCredential.bearer_token;
          break;
        case 'oauth':
          credentialData.client_id = newCredential.client_id;
          credentialData.client_secret = newCredential.client_secret;
          break;
      }

      // Adicionar headers adicionais se não estiver vazio
      try {
        const headers = JSON.parse(newCredential.headers_adicionais);
        if (Object.keys(headers).length > 0) {
          credentialData.headers_adicionais = headers;
        }
      } catch (e) {
        // Se não for JSON válido, ignorar
      }

      // Criar credencial
      const response = await http.post('/integracao-tenant/credenciais-externas/', credentialData);
      
      // Se há campos adicionais, criá-los
      if (additionalFields.length > 0) {
        for (const field of additionalFields) {
          await http.post('/integracao-tenant/credenciais-externas-campos/', {
            credencial: response.id,
            chave: field.chave,
            valor: field.valor,
            tipo_campo: field.tipo_campo,
            obrigatório: field.obrigatório,
            sensivel: field.sensivel
          });
        }
      }

      toast.current.show({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Credencial criada com sucesso!',
        life: 3000
      });

      // Fechar modal e recarregar lista
      setShowCreateCredentialModal(false);
      
      // Recarregar credenciais
      const carregarCredenciais = async () => {
        try {
          const responseCredenciais = await http.get('/integracao-tenant/credenciais-externas/');
          
          if (responseCredenciais && Array.isArray(responseCredenciais)) {
            const credenciaisComCampos = [];
            
            for (const credencial of responseCredenciais) {
              try {
                const responseCampos = await http.get(`/integracao-tenant/credenciais-externas-campos/?credencial=${credencial.id}`);
                
                const credencialComCampos = {
                  ...credencial,
                  campos_adicionais: responseCampos || []
                };
                
                credenciaisComCampos.push(credencialComCampos);
              } catch (camposError) {
                credenciaisComCampos.push({
                  ...credencial,
                  campos_adicionais: []
                });
              }
            }
            
            const credenciaisFormatadas = credenciaisComCampos.map(credencial => ({
              label: credencial.nome_sistema,
              value: credencial.id,
              dados: credencial
            }));
            
            setRegras(credenciaisFormatadas);
          }
        } catch (error) {
          console.error('Erro ao recarregar credenciais:', error);
        }
      };

      carregarCredenciais();

    } catch (error) {
      console.error('Erro ao criar credencial:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao criar credencial',
        life: 3000
      });
    } finally {
      setSavingCredential(false);
    }
  };

  // Abrir dialog de confirmação de exclusão
  const abrirConfirmacaoExclusao = () => {
    if (!selectedCredencial) {
      toast.current.show({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Selecione uma credencial para excluir',
        life: 3000
      });
      return;
    }
    
    setCredencialToDelete(selectedCredencial);
    setShowDeleteConfirmModal(true);
  };

  // Confirmar exclusão da credencial
  const confirmarExclusaoCredencial = async () => {
    if (!credencialToDelete) return;

    try {
      // Excluir campos adicionais primeiro
      if (credencialToDelete.campos_adicionais && credencialToDelete.campos_adicionais.length > 0) {
        for (const campo of credencialToDelete.campos_adicionais) {
          await http.delete(`/integracao-tenant/credenciais-externas-campos/${campo.id}/`);
        }
      }

      // Excluir a credencial
      await http.delete(`/integracao-tenant/credenciais-externas/${credencialToDelete.id}/`);
      
      toast.current.show({
        severity: 'success',
        summary: 'Sucesso',
        detail: `Credencial "${credencialToDelete.nome_sistema}" foi excluída com sucesso`,
        life: 3000
      });

      // Recarregar lista de credenciais
      const responseCredenciais = await http.get('/integracao-tenant/credenciais-externas/');
      if (responseCredenciais && Array.isArray(responseCredenciais)) {
        const credenciaisComCampos = [];
        
        for (const credencial of responseCredenciais) {
          try {
            const responseCampos = await http.get(`/integracao-tenant/credenciais-externas-campos/?credencial=${credencial.id}`);
            credenciaisComCampos.push({
              ...credencial,
              campos_adicionais: responseCampos || []
            });
          } catch (camposError) {
            credenciaisComCampos.push({
              ...credencial,
              campos_adicionais: []
            });
          }
        }
        
        setCredenciais(credenciaisComCampos);
      }

      // Limpar seleção
      setSelectedCredencial(null);

      // Fechar dialog
      setShowDeleteConfirmModal(false);
      setCredencialToDelete(null);

    } catch (error) {
      console.error('Erro ao excluir credencial:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao excluir credencial',
        life: 3000
      });
    }
  };









  return (
    <MetadadosContainer>
      <Toast ref={toast} />
      
      <Header>
        <HeaderLeft>
          <Title>Credenciais</Title>
          <Subtitle>Gerencie as credenciais externas do sistema</Subtitle>
        </HeaderLeft>
        
        <BotaoGrupo>
          <Botao 
            size="medium" 
            aoClicar={iniciarCriacaoCredencial}
            style={{
              background: 'linear-gradient(135deg, #fd7e14 0%, #e55a00 100%)',
              border: 'none',
              color: 'white',
              boxShadow: '0 2px 8px rgba(253, 126, 20, 0.3)'
            }}
          >
            <GrAddCircle size={14} /> Nova Credencial
          </Botao>
        </BotaoGrupo>
      </Header>

      {/* Lista de Credenciais */}
      <div style={{ display: 'grid', gap: '24px' }}>
        {loading ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '60px 20px',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e9ecef'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '48px',
                height: '48px',
                border: '4px solid #f3f3f3',
                borderTop: '4px solid var(--primaria)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 16px'
              }}></div>
              <p style={{ color: '#6c757d', margin: 0 }}>Carregando credenciais...</p>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {credenciais.map((credencial) => (
              <div
                key={credencial.id}
                onClick={() => setSelectedCredencial(credencial)}
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #e9ecef',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  ...(selectedCredencial?.id === credencial.id && {
                    borderColor: 'var(--primaria)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)'
                  })
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = selectedCredencial?.id === credencial.id 
                    ? '0 8px 32px rgba(0, 0, 0, 0.15)' 
                    : '0 4px 20px rgba(0, 0, 0, 0.08)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <h3 style={{ 
                        fontSize: '20px', 
                        fontWeight: '700', 
                        color: '#495057',
                        margin: 0
                      }}>
                        {credencial.nome_sistema}
                      </h3>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: credencial.ativo ? '#d4edda' : '#f8d7da',
                        color: credencial.ativo ? '#155724' : '#721c24'
                      }}>
                        {credencial.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: '#e3f2fd',
                        color: '#1976d2'
                      }}>
                        {credencial.tipo_autenticacao_display}
                      </span>
                    </div>
                    
                    {credencial.descricao && (
                      <p style={{
                        fontSize: '14px',
                        color: '#6c757d',
                        margin: '0 0 12px 0',
                        lineHeight: '1.5'
                      }}>
                        {credencial.descricao}
                      </p>
                    )}
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ 
                          fontSize: '11px', 
                          fontWeight: '600', 
                          color: '#6c757d',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          marginBottom: '4px',
                          display: 'block'
                        }}>
                          URL do Endpoint
                        </label>
                        <div style={{
                          fontSize: '13px',
                          color: '#495057',
                          fontFamily: 'monospace',
                          wordBreak: 'break-all'
                        }}>
                          {credencial.url_endpoint}
                        </div>
                      </div>
                      
                      <div>
                        <label style={{ 
                          fontSize: '11px', 
                          fontWeight: '600', 
                          color: '#6c757d',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          marginBottom: '4px',
                          display: 'block'
                        }}>
                          Status da Conexão
                        </label>
                        <div style={{
                          fontSize: '13px',
                          color: '#856404',
                          fontWeight: '500'
                        }}>
                          {credencial.status_conexao}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
                    <Botao 
                      size="small" 
                      aoClicar={(e) => {
                        e.stopPropagation();
                        // TODO: Implementar edição
                      }}
                    >
                      <FaEdit size={12} /> Editar
                    </Botao>
                    <Botao 
                      size="small" 
                      estilo="danger"
                      aoClicar={(e) => {
                        e.stopPropagation();
                        setCredencialToDelete(credencial);
                        setShowDeleteConfirmModal(true);
                      }}
                    >
                      <FaTrash size={12} fill="#fff"/> Excluir
                    </Botao>
                  </div>
                </div>
                
                {credencial.campos_adicionais && credencial.campos_adicionais.length > 0 && (
                  <div style={{ 
                    marginTop: '16px', 
                    paddingTop: '16px', 
                    borderTop: '1px solid #f1f3f4' 
                  }}>
                    <label style={{ 
                      fontSize: '11px', 
                      fontWeight: '600', 
                      color: '#6c757d',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: '8px',
                      display: 'block'
                    }}>
                      Campos Adicionais ({credencial.campos_adicionais.length})
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {credencial.campos_adicionais.slice(0, 3).map((campo) => (
                        <span key={campo.id} style={{
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: '500',
                          background: '#f8f9fa',
                          color: '#495057',
                          border: '1px solid #e9ecef'
                        }}>
                          {campo.chave}
                        </span>
                      ))}
                      {credencial.campos_adicionais.length > 3 && (
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: '500',
                          background: '#e3f2fd',
                          color: '#1976d2'
                        }}>
                          +{credencial.campos_adicionais.length - 3} mais
                        </span>
                      )}
                    </div>
                  </div>
                                 )}
               </div>
             ))}
           </div>
         )}
       </div>







      {/* Modal de Confirmação de Exclusão */}
      <Dialog
        header="Confirmar Exclusão"
        visible={showDeleteConfirmModal}
        onHide={() => {
          setShowDeleteConfirmModal(false);
          setRegraToDelete(null);
        }}
        style={{ width: '500px' }}
        modal
        closeOnEscape
        closable
      >
        <div style={{ padding: '20px 0' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px',
            marginBottom: '24px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FaTrash size={20} color="white" />
            </div>
            <div>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                color: '#495057',
                margin: '0 0 8px 0'
              }}>
                Excluir Credencial
              </h3>
              <p style={{ 
                fontSize: '14px', 
                color: '#6c757d',
                margin: 0,
                lineHeight: '1.5'
              }}>
                Tem certeza que deseja excluir a credencial <strong>"{credencialToDelete?.nome_sistema}"</strong>?
              </p>
            </div>
          </div>
          
          <div style={{
            background: '#fff3cd',
            border: '1px solid #ffeaa7',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              gap: '12px'
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: '#ffc107',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: '2px'
              }}>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#856404' }}>!</span>
              </div>
              <div>
                <p style={{ 
                  fontSize: '14px', 
                  color: '#856404',
                  margin: '0 0 8px 0',
                  fontWeight: '600'
                }}>
                  Atenção
                </p>
                <p style={{ 
                  fontSize: '13px', 
                  color: '#856404',
                  margin: 0,
                  lineHeight: '1.4'
                }}>
                  Esta ação irá excluir permanentemente a credencial e todos os seus campos adicionais. 
                  Esta operação não pode ser desfeita.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          gap: '12px', 
          paddingTop: '20px', 
          borderTop: '1px solid #dee2e6' 
        }}>
          <Botao
            size="small"
            aoClicar={() => {
              setShowDeleteConfirmModal(false);
              setRegraToDelete(null);
            }}
            style={{
              background: 'linear-gradient(135deg, #6c757d 0%, #5a6268 100%)',
              border: 'none',
              color: 'white'
            }}
          >
            Cancelar
          </Botao>
          <Botao
            size="small"
            aoClicar={confirmarExclusaoCredencial}
            style={{
              background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
              border: 'none',
              color: 'white'
            }}
          >
            <FaTrash /> Excluir Credencial
          </Botao>
        </div>
      </Dialog>

      {/* Modal de Criação de Credenciais */}
      <Dialog
        header={
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            fontSize: '20px',
            fontWeight: '600',
            color: '#495057'
          }}>
            <FaShieldAlt size={24} color="var(--primaria)" />
            Adicionar Credencial Externa
          </div>
        }
        visible={showCreateCredentialModal}
        onHide={() => setShowCreateCredentialModal(false)}
        style={{ width: '90vw', maxWidth: '1200px' }}
        modal
        closeOnEscape
        closable
        footer={
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '16px 0'
          }}>
            <div style={{ fontSize: '14px', color: '#6c757d' }}>
              {activeTab === 0 && 'Informações Básicas'}
              {activeTab === 1 && 'Configuração de Conexão'}
              {activeTab === 2 && 'Credenciais'}
              {activeTab === 3 && 'OAuth 2.0'}
              {activeTab === 4 && 'Configurações Avançadas'}
              {activeTab === 5 && 'Campos Adicionais'}
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Botao
                size="small"
                aoClicar={() => setShowCreateCredentialModal(false)}
                style={{
                  background: 'linear-gradient(135deg, #6c757d 0%, #5a6268 100%)',
                  border: 'none',
                  color: 'white'
                }}
              >
                Cancelar
              </Botao>
              {activeTab < 5 ? (
                <Botao
                  size="small"
                  aoClicar={() => setActiveTab(activeTab + 1)}
                  style={{
                    background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                    border: 'none',
                    color: 'white'
                  }}
                >
                  Próximo
                </Botao>
              ) : (
                <Botao
                  size="small"
                  aoClicar={saveNewCredential}
                  loading={savingCredential}
                  style={{
                    background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                    border: 'none',
                    color: 'white'
                  }}
                >
                  <FaSave /> Salvar Credencial
                </Botao>
              )}
            </div>
          </div>
        }
      >
        <div style={{ padding: '0' }}>
          {/* Abas */}
          <div style={{ 
            display: 'flex', 
            borderBottom: '2px solid #e9ecef',
            marginBottom: '24px',
            background: '#f8f9fa',
            borderRadius: '8px 8px 0 0'
          }}>
            {[
              { icon: FaInfo, label: 'Informações Básicas', color: '#17a2b8' },
              { icon: FaGlobe, label: 'Configuração de Conexão', color: '#28a745' },
              { icon: FaKey, label: 'Credenciais', color: '#ffc107' },
              { icon: FaShieldAlt, label: 'OAuth 2.0', color: '#6f42c1' },
              { icon: FaCog, label: 'Configurações Avançadas', color: '#6c757d' },
              { icon: FaPlus, label: 'Campos Adicionais', color: '#fd7e14' }
            ].map((tab, index) => (
              <div
                key={index}
                onClick={() => setActiveTab(index)}
                style={{
                  flex: 1,
                  padding: '16px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  borderBottom: `3px solid ${activeTab === index ? tab.color : 'transparent'}`,
                  background: activeTab === index ? 'white' : 'transparent',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <tab.icon size={20} color={activeTab === index ? tab.color : '#6c757d'} />
                <span style={{
                  fontSize: '12px',
                  fontWeight: activeTab === index ? '600' : '500',
                  color: activeTab === index ? tab.color : '#6c757d'
                }}>
                  {tab.label}
                </span>
              </div>
            ))}
          </div>

          {/* Conteúdo das Abas */}
          <div style={{ minHeight: '500px', padding: '0 20px' }}>
            
            {/* Aba 1: Informações Básicas */}
            {activeTab === 0 && (
              <div style={{ display: 'grid', gap: '24px' }}>
                <CampoTexto
                  label="Nome do Sistema Externo"
                  valor={newCredential.nome_sistema}
                  setValor={(valor) => setNewCredential(prev => ({ ...prev, nome_sistema: valor }))}
                  name="nome_sistema"
                  placeholder="Nome único do sistema externo (ex: SAP, TOTVS, RM)"
                  required={true}
                  width="100%"
                />

                <CampoTexto
                  label="Descrição"
                  valor={newCredential.descricao}
                  setValor={(valor) => setNewCredential(prev => ({ ...prev, descricao: valor }))}
                  name="descricao"
                  placeholder="Descrição do sistema e sua finalidade"
                  rows={4}
                  width="100%"
                />

                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontWeight: '600',
                    color: '#495057',
                    fontSize: '14px'
                  }}>
                    Logo/Imagem do Sistema
                  </label>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    padding: '12px',
                    border: '2px dashed #dee2e6',
                    borderRadius: '8px',
                    background: '#f8f9fa'
                  }}>
                    <Button
                      label="Escolher Arquivo"
                      icon="pi pi-upload"
                      className="p-button-outlined"
                      style={{ fontSize: '14px' }}
                    />
                    <span style={{ color: '#6c757d', fontSize: '14px' }}>
                      Nenhum arquivo escolhido
                    </span>
                  </div>
                  <small style={{ color: '#6c757d', fontSize: '12px' }}>
                    Logo ou imagem representativa do sistema
                  </small>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Checkbox
                    checked={newCredential.ativo}
                    onChange={(e) => setNewCredential(prev => ({ ...prev, ativo: e.checked }))}
                  />
                  <label style={{ 
                    fontWeight: '600',
                    color: '#495057',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}>
                    Ativo
                  </label>
                </div>
                <small style={{ color: '#6c757d', fontSize: '12px', marginLeft: '28px' }}>
                  Indica se as credenciais estão ativas para uso
                </small>
              </div>
            )}

            {/* Aba 2: Configuração de Conexão */}
            {activeTab === 1 && (
              <div style={{ display: 'grid', gap: '24px' }}>
                <CampoTexto
                  label="URL do Endpoint"
                  valor={newCredential.url_endpoint}
                  setValor={(valor) => setNewCredential(prev => ({ ...prev, url_endpoint: valor }))}
                  name="url_endpoint"
                  placeholder="https://api.exemplo.com.br"
                  required={true}
                  width="100%"
                />

                <DropdownItens
                  label="Tipo de Autenticação"
                  valor={newCredential.tipo_autenticacao}
                  setValor={(valor) => setNewCredential(prev => ({ ...prev, tipo_autenticacao: valor }))}
                  options={authenticationTypes}
                  name="tipo_autenticacao"
                  placeholder="Selecione o tipo de autenticação"
                  required={true}
                  $width="100%"
                  optionLabel="label"
                />

                <CampoTexto
                  label="Timeout (segundos)"
                  valor={newCredential.timeout}
                  setValor={(valor) => setNewCredential(prev => ({ ...prev, timeout: parseInt(valor) || 30 }))}
                  name="timeout"
                  type="number"
                  width="100%"
                />
              </div>
            )}

            {/* Aba 3: Credenciais */}
            {activeTab === 2 && (
              <div style={{ display: 'grid', gap: '24px' }}>
                <div style={{
                  background: '#e3f2fd',
                  border: '1px solid #bbdefb',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '16px'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    marginBottom: '8px'
                  }}>
                    <FaInfo color="#1976d2" size={16} />
                    <span style={{ 
                      fontWeight: '600', 
                      color: '#1976d2',
                      fontSize: '14px'
                    }}>
                      Preencha apenas os campos necessários para o tipo de autenticação selecionado
                    </span>
                  </div>
                </div>

                {newCredential.tipo_autenticacao === 'basic' && (
                  <>
                    <CampoTexto
                      label="Usuário"
                      valor={newCredential.usuario}
                      setValor={(valor) => setNewCredential(prev => ({ ...prev, usuario: valor }))}
                      name="usuario"
                      placeholder="Usuário para autenticação"
                      required={true}
                      width="100%"
                    />

                    <CampoTexto
                      label="Senha"
                      valor={newCredential.senha}
                      setValor={(valor) => setNewCredential(prev => ({ ...prev, senha: valor }))}
                      name="senha"
                      type="password"
                      placeholder="Senha para autenticação"
                      required={true}
                      width="100%"
                    />
                  </>
                )}

                {newCredential.tipo_autenticacao === 'api_key' && (
                  <CampoTexto
                    label="API Key"
                    valor={newCredential.api_key}
                    setValor={(valor) => setNewCredential(prev => ({ ...prev, api_key: valor }))}
                    name="api_key"
                    placeholder="Chave de API para autenticação"
                    rows={3}
                    required={true}
                    width="100%"
                  />
                )}

                {newCredential.tipo_autenticacao === 'bearer' && (
                  <CampoTexto
                    label="Bearer Token"
                    valor={newCredential.bearer_token}
                    setValor={(valor) => setNewCredential(prev => ({ ...prev, bearer_token: valor }))}
                    name="bearer_token"
                    placeholder="Token Bearer para autenticação"
                    rows={3}
                    required={true}
                    width="100%"
                  />
                )}
              </div>
            )}

            {/* Aba 4: OAuth 2.0 */}
            {activeTab === 3 && newCredential.tipo_autenticacao === 'oauth' && (
              <div style={{ display: 'grid', gap: '24px' }}>
                <div style={{
                  background: '#f3e5f5',
                  border: '1px solid #e1bee7',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '16px'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    marginBottom: '8px'
                  }}>
                    <FaShieldAlt color="#6f42c1" size={16} />
                    <span style={{ 
                      fontWeight: '600', 
                      color: '#6f42c1',
                      fontSize: '14px'
                    }}>
                      Campos específicos para autenticação OAuth 2.0
                    </span>
                  </div>
                </div>

                <CampoTexto
                  label="Client ID"
                  valor={newCredential.client_id}
                  setValor={(valor) => setNewCredential(prev => ({ ...prev, client_id: valor }))}
                  name="client_id"
                  placeholder="Client ID para OAuth 2.0"
                  required={true}
                  width="100%"
                />

                <CampoTexto
                  label="Client Secret"
                  valor={newCredential.client_secret}
                  setValor={(valor) => setNewCredential(prev => ({ ...prev, client_secret: valor }))}
                  name="client_secret"
                  type="password"
                  placeholder="Client Secret para OAuth 2.0"
                  required={true}
                  width="100%"
                />
              </div>
            )}

            {activeTab === 3 && newCredential.tipo_autenticacao !== 'oauth' && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '60px 20px',
                textAlign: 'center'
              }}>
                <FaShieldAlt size={48} color="#6c757d" style={{ marginBottom: '16px' }} />
                <h3 style={{ color: '#495057', marginBottom: '8px' }}>
                  OAuth 2.0 não selecionado
                </h3>
                <p style={{ color: '#6c757d' }}>
                  Esta aba só é necessária quando o tipo de autenticação é OAuth 2.0
                </p>
              </div>
            )}

            {/* Aba 5: Configurações Avançadas */}
            {activeTab === 4 && (
              <div style={{ display: 'grid', gap: '24px' }}>
                <CampoTexto
                  label="Headers Adicionais"
                  valor={newCredential.headers_adicionais}
                  setValor={(valor) => setNewCredential(prev => ({ ...prev, headers_adicionais: valor }))}
                  name="headers_adicionais"
                  placeholder='{"X-Custom-Header": "value"}'
                  rows={4}
                  width="100%"
                />

                <CampoTexto
                  label="Observações"
                  valor={newCredential.observacoes}
                  setValor={(valor) => setNewCredential(prev => ({ ...prev, observacoes: valor }))}
                  name="observacoes"
                  placeholder="Observações sobre a integração ou configuração"
                  rows={4}
                  width="100%"
                />
              </div>
            )}

            {/* Aba 6: Campos Adicionais */}
            {activeTab === 5 && (
              <div style={{ display: 'grid', gap: '24px' }}>
                <div style={{
                  background: '#fff3cd',
                  border: '1px solid #ffeaa7',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '16px'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    marginBottom: '8px'
                  }}>
                    <FaPlus color="#856404" size={16} />
                    <span style={{ 
                      fontWeight: '600', 
                      color: '#856404',
                      fontSize: '14px'
                    }}>
                      CAMPOS ADICIONAIS DE CREDENCIAIS
                    </span>
                  </div>
                </div>

                {additionalFields.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                    border: '2px dashed #dee2e6',
                    borderRadius: '8px',
                    background: '#f8f9fa'
                  }}>
                    <FaPlus size={32} color="#6c757d" style={{ marginBottom: '16px' }} />
                    <p style={{ color: '#6c757d', marginBottom: '16px' }}>
                      Nenhum campo adicional configurado
                    </p>
                    <Botao
                      size="small"
                      aoClicar={addAdditionalField}
                      style={{
                        background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                        border: 'none',
                        color: 'white'
                      }}
                    >
                      <FaPlus /> Adicionar Campo
                    </Botao>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: '16px' }}>
                    {/* Header da tabela */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 1fr auto auto',
                      gap: '16px',
                      padding: '12px 16px',
                      background: '#f8f9fa',
                      borderRadius: '8px',
                      fontWeight: '600',
                      fontSize: '12px',
                      color: '#495057',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      <div>CHAVE</div>
                      <div>VALOR</div>
                      <div>TIPO DO CAMPO</div>
                      <div>OBRIGATÓRIO</div>
                      <div>AÇÕES</div>
                    </div>

                    {/* Campos */}
                    {additionalFields.map((field, index) => (
                      <div key={field.id} style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr auto auto',
                        gap: '16px',
                        padding: '16px',
                        background: 'white',
                        borderRadius: '8px',
                        border: '1px solid #e9ecef',
                        alignItems: 'center'
                      }}>
                        <CampoTexto
                          valor={field.chave}
                          setValor={(valor) => updateAdditionalField(index, 'chave', valor)}
                          name={`chave_${index}`}
                          placeholder="Nome da chave"
                          width="100%"
                        />
                        
                        <CampoTexto
                          valor={field.valor}
                          setValor={(valor) => updateAdditionalField(index, 'valor', valor)}
                          name={`valor_${index}`}
                          placeholder="Valor do campo"
                          rows={2}
                          width="100%"
                        />
                        
                        <DropdownItens
                          valor={field.tipo_campo}
                          setValor={(valor) => updateAdditionalField(index, 'tipo_campo', valor)}
                          options={fieldTypes}
                          name={`tipo_${index}`}
                          placeholder="Selecione o tipo"
                          $width="100%"
                          optionLabel="label"
                        />
                        
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <Checkbox
                            checked={field.obrigatório}
                            onChange={(e) => updateAdditionalField(index, 'obrigatório', e.checked)}
                          />
                          <Checkbox
                            checked={field.sensivel}
                            onChange={(e) => updateAdditionalField(index, 'sensivel', e.checked)}
                          />
                        </div>
                        
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <Button
                            icon="pi pi-trash"
                            className="p-button-danger p-button-text"
                            onClick={() => removeAdditionalField(index)}
                            style={{ padding: '8px' }}
                          />
                        </div>
                      </div>
                    ))}

                    {/* Botão adicionar */}
                    <div style={{ textAlign: 'center', padding: '16px' }}>
                      <Botao
                        size="small"
                        aoClicar={addAdditionalField}
                        style={{
                          background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                          border: 'none',
                          color: 'white'
                        }}
                      >
                        <FaPlus /> Adicionar outro(a) Campo Adicional de Credencial
                      </Botao>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Dialog>
    </MetadadosContainer>
  );
}

export default Credenciais;

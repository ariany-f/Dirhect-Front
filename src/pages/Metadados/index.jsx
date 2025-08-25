import React, { useState, useEffect } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { FaPlus, FaSave, FaTrash, FaPlusCircle, FaSearch, FaEdit } from 'react-icons/fa';
import { GrAddCircle } from 'react-icons/gr';
import http from '@http';
import styled from 'styled-components';
import Botao from '@components/Botao';
import BotaoGrupo from '@components/BotaoGrupo';

const MetadadosContainer = styled.div`
  padding: 32px;
  max-width: 1600px;
  margin: 0 auto;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  min-height: 100vh;
  width: 100%;
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
  min-width: 300px;
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
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
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
  padding: 16px 24px;
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



function Metadados() {
  const [regras, setRegras] = useState([]);
  const [selectedRegra, setSelectedRegra] = useState(null);
  const [parametros, setParametros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newRows, setNewRows] = useState([]);
  const [removedRows, setRemovedRows] = useState([]);

  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState({
    assunto: '',
    chave_parcial: ''
  });
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [editingParametro, setEditingParametro] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [creatingNewRegra, setCreatingNewRegra] = useState(false);
  const [newParametroName, setNewParametroName] = useState('');
  const [showNewParametroInput, setShowNewParametroInput] = useState(false);

  // Estilo do botão + para adicionar parâmetro
  const botaoAdicionarParametroStyle = {
    width: '40px',
    height: '40px',
    padding: '0',
    minWidth: '40px',
    background: '#17a2b8',
    border: 'none',
    color: 'white',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };
  const [newRegraInline, setNewRegraInline] = useState({
    nome: '',
    colunas: [],
    linhas: []
  });

  const toast = React.useRef();

  // Carregar lista de regras
  useEffect(() => {
    const carregarRegras = async () => {
      try {
        setLoading(true);
        const response = await http.get('parametros/assuntos/?modulo=integracao');
        // Converter para formato esperado pelo Dropdown
        const regrasArray = response?.assuntos || [];
        const regrasFormatadas = Array.isArray(regrasArray) 
          ? regrasArray.map(regra => ({
              label: regra,
              value: regra
            }))
          : [];
        setRegras(regrasFormatadas);
        
        // Selecionar automaticamente a primeira regra se houver
        if (regrasFormatadas.length > 0 && !selectedRegra) {
          setSelectedRegra(regrasFormatadas[0].value);
        }
      } catch (error) {
        console.error('Erro ao carregar regras:', error);
        toast.current.show({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar lista de regras',
          life: 3000
        });
      } finally {
        setLoading(false);
      }
    };

    carregarRegras();
  }, []);

  // Carregar parâmetros quando regra é selecionada
  useEffect(() => {
    if (selectedRegra) {
      carregarParametros(selectedRegra);
    } else {
      setParametros([]);
      setNewRows([]);
      setRemovedRows([]);
    }
  }, [selectedRegra]);

  const carregarParametros = async (regra) => {
    try {
      setLoading(true);
      const response = await http.get(`parametros/desserializar-por-assunto/?assunto=${regra}`);
      setParametros(response?.parametros || []);
      setNewRows([]);
      setRemovedRows([]);
      setHasChanges(false);
      setNewParametroName('');
      setShowNewParametroInput(false);
    } catch (error) {
      console.error('Erro ao carregar parâmetros:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao carregar parâmetros da regra selecionada',
        life: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  // Obter chaves únicas de todos os parâmetros
  const getChavesUnicas = () => {
    const chaves = new Set();
    
    // Adicionar chaves dos parâmetros existentes
    parametros.forEach(param => {
      if (param.chave_desserializada) {
        Object.keys(param.chave_desserializada).forEach(chave => chaves.add(chave));
      }
    });
    
    // Adicionar chaves das novas linhas
    newRows.forEach(row => {
      Object.keys(row.chave_desserializada || {}).forEach(chave => chaves.add(chave));
    });
    
    return Array.from(chaves);
  };

  const chavesUnicas = getChavesUnicas();

        // Adicionar nova linha
      const adicionarLinha = async () => {
        try {
          // Preparar dados para criar nova linha
          const novaChave = {};
          chavesUnicas.forEach(chave => {
            novaChave[chave] = '';
          });

          const dadosParaEnviar = {
            assunto: selectedRegra,
            chave: novaChave,
            valor: '',
            descricao: '',
            modulo: 'integracao'
          };

          // Chamar o endpoint para criar nova linha
          const response = await http.put('parametros/criar-com-chave-serializada/', dadosParaEnviar);
      
      toast.current.show({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Nova linha criada com sucesso',
        life: 3000
      });

                      // Atualizar estado local
      const novaChaveLocal = {};
      chavesUnicas.forEach(chave => {
        novaChaveLocal[chave] = '';
      });
      
      const novoParametro = {
        id: Date.now(), // ID temporário
        chave_desserializada: novaChaveLocal,
        valor: '',
        descricao: ''
      };
      
      setParametros([...parametros, novoParametro]);
      setHasChanges(true);
      
    } catch (error) {
      console.error('Erro ao criar nova linha:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao criar nova linha',
        life: 3000
      });
    }
  };

  // Lidar com mudança no input de novo parâmetro
  const handleNovoParametroChange = (e) => {
    const valor = e.target.value;
    setNewParametroName(valor);
    
    // Se o usuário pressionou Enter, adiciona o parâmetro
    if (e.key === 'Enter' && valor.trim()) {
      adicionarNovoParametro();
    }
  };

  // Adicionar novo parâmetro
  const adicionarNovoParametro = (nome = null) => {
    const novoNome = nome || newParametroName.trim();
    
    if (!novoNome) {
      return; // Se estiver vazio, não faz nada
    }

    if (creatingNewRegra) {
      // Se estiver criando nova regra, adicionar à novaRegraInline
      setNewRegraInline(prev => ({
        ...prev,
        colunas: [...prev.colunas, novoNome],
        linhas: prev.linhas.map(linha => ({
          ...linha,
          [novoNome]: '',
          valor: linha.valor || '' // Garantir que a propriedade valor seja mantida
        }))
      }));
    } else {
      // Se estiver editando regra existente, adicionar aos parâmetros
      const parametrosAtualizados = parametros.map(parametro => ({
        ...parametro,
        chave_desserializada: {
          ...parametro.chave_desserializada,
          [novoNome]: ''
        }
      }));

      setParametros(parametrosAtualizados);
      setHasChanges(true);
    }

    setNewParametroName('');
    setShowNewParametroInput(false);
  };

  // Adicionar novo parâmetro automaticamente
  const adicionarNovoParametroAuto = () => {
    if (newParametroName.trim()) {
      adicionarNovoParametro();
    }
  };





  // Excluir parâmetro
  const excluirParametro = async (parametroId) => {
    try {
      // Se é um parâmetro novo (ID temporário), apenas remove do estado local
      if (parametroId > 1000000000) { // IDs temporários são baseados em Date.now()
        setParametros(parametros.filter(param => param.id !== parametroId));
        setHasChanges(true);
        return;
      }
      
      await http.delete(`parametros/${parametroId}/`);
      
      // Recarregar parâmetros
      await carregarParametros(selectedRegra);
      
      toast.current.show({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Combinação da regra excluída com sucesso',
        life: 3000
      });
    } catch (error) {
      console.error('Erro ao excluir parâmetro:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao excluir combinação da regra',
        life: 3000
      });
    }
  };



  // Atualizar valor de uma chave
  const atualizarChave = async (rowId, chave, valor) => {
    try {
      // Encontrar o parâmetro
      const parametro = parametros.find(param => param.id === rowId);
      if (!parametro) return;

      // Preparar dados atualizados
      const chaveAtualizada = {
        ...parametro.chave_desserializada,
        [chave]: valor
      };

      const dadosParaEnviar = {
        assunto: selectedRegra,
        chave: chaveAtualizada,
        modulo: 'integracao',
        valor: parametro.valor,
        descricao: parametro.descricao || ''
      };

      // Atualizar via API
      await http.put('parametros/criar-com-chave-serializada/', dadosParaEnviar);
      
      // Atualizar estado local
      setParametros(parametros.map(param => {
        if (param.id === rowId) {
          return {
            ...param,
            chave_desserializada: chaveAtualizada
          };
        }
        return param;
      }));
      
      setHasChanges(true);
      
    } catch (error) {
      console.error('Erro ao atualizar chave:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao atualizar chave',
        life: 3000
      });
    }
  };

  // Atualizar valor
  const atualizarValor = async (rowId, valor) => {
    try {
      // Encontrar o parâmetro
      const parametro = parametros.find(param => param.id === rowId);
      if (!parametro) return;

      const dadosParaEnviar = {
        assunto: selectedRegra,
        modulo: 'integracao',
        chave: parametro.chave_desserializada,
        valor: valor,
        descricao: parametro.descricao || ''
      };

      // Atualizar via API
      await http.put('parametros/criar-com-chave-serializada/', dadosParaEnviar);
      
      // Atualizar estado local
      setParametros(parametros.map(param => {
        if (param.id === rowId) {
          return { ...param, valor };
        }
        return param;
      }));
      
      setHasChanges(true);
      
    } catch (error) {
      console.error('Erro ao atualizar valor:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao atualizar valor',
        life: 3000
      });
    }
  };

        // Salvar alterações
      const salvarAlteracoes = async () => {
        try {
          setSaving(true);
          
          // Verificar se há um novo parâmetro sendo adicionado
          if (showNewParametroInput && newParametroName.trim()) {
            toast.current.show({
              severity: 'warn',
              summary: 'Atenção',
              detail: 'Complete a adição do novo parâmetro antes de salvar',
              life: 3000
            });
            return;
          }

          // Verificar se todos os parâmetros estão preenchidos
          const parametrosParaSalvar = parametros.filter(param => !removedRows.includes(param.id));
          const parametrosVazios = parametrosParaSalvar.filter(param => {
            const chavesVazias = Object.entries(param.chave_desserializada || {}).filter(([key, value]) => !value || value.trim() === '');
            return chavesVazias.length > 0;
          });

          if (parametrosVazios.length > 0) {
            toast.current.show({
              severity: 'warn',
              summary: 'Atenção',
              detail: 'Todos os parâmetros devem estar preenchidos antes de salvar',
              life: 3000
            });
            return;
          }
          
          // Salvar cada parâmetro individualmente
          
          for (const parametro of parametrosParaSalvar) {
            const dadosParaEnviar = {
              assunto: selectedRegra,
              modulo: 'integracao',
              chave: parametro.chave_desserializada,
              valor: parametro.valor,
              descricao: parametro.descricao || ''
            };

            await http.put(`parametros/criar-com-chave-serializada/`, dadosParaEnviar);
          }
      
      toast.current.show({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Parâmetros salvos com sucesso',
        life: 3000
      });

                // Recarregar dados
          await carregarParametros(selectedRegra);
          setHasChanges(false);
    } catch (error) {
      console.error('Erro ao salvar parâmetros:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao salvar parâmetros',
        life: 3000
      });
    } finally {
      setSaving(false);
    }
  };

  // Obter todas as linhas (existentes - removidas)
  const getAllRows = () => {
    return parametros.filter(param => !removedRows.includes(param.id));
  };

  const allRows = getAllRows();



  // Buscar parâmetros com chaves desserializadas
  const buscarParametros = async () => {
    try {
      setSearching(true);
      
      let url = 'parametros/buscar-com-chave-desserializada/';
      const params = new URLSearchParams();
      
      if (searchQuery.assunto) {
        params.append('assunto', searchQuery.assunto);
      }
      if (searchQuery.chave_parcial) {
        params.append('chave_parcial', searchQuery.chave_parcial);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await http.get(url);
      setSearchResults(response?.parametros || []);
      
      if (response?.parametros?.length === 0) {
        toast.current.show({
          severity: 'info',
          summary: 'Informação',
          detail: 'Nenhum parâmetro encontrado com os critérios informados',
          life: 3000
        });
      }
      
    } catch (error) {
      console.error('Erro ao buscar parâmetros:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao buscar parâmetros',
        life: 3000
      });
    } finally {
      setSearching(false);
    }
  };

  // Buscar parâmetro específico por objeto JSON
  const buscarPorChaveObjeto = async (chaveObjeto) => {
    try {
      setSearching(true);
      
      const response = await http.post('parametros/buscar-por-chave-objeto/', {
        chave: chaveObjeto
      });
      
      if (response) {
        toast.current.show({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Parâmetro encontrado!',
          life: 3000
        });
        
        // Aqui você pode implementar a lógica para exibir o resultado
        console.log('Parâmetro encontrado:', response);
      } else {
        toast.current.show({
          severity: 'info',
          summary: 'Informação',
          detail: 'Nenhum parâmetro encontrado com essa chave',
          life: 3000
        });
      }
      
    } catch (error) {
      console.error('Erro ao buscar por chave objeto:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao buscar parâmetro',
        life: 3000
      });
    } finally {
      setSearching(false);
    }
  };

  // Abrir modal de edição
  const abrirEdicao = (parametro) => {
    setEditingParametro({
      id: parametro.id,
      assunto: parametro.assunto,
      chave: parametro.chave_desserializada || {},
      valor: parametro.valor,
      descricao: parametro.descricao || ''
    });
    setShowEditModal(true);
  };

  // Salvar edição
  const salvarEdicao = async () => {
    try {
      setSavingEdit(true);
      
      if (!editingParametro.assunto || !editingParametro.valor) {
        toast.current.show({
          severity: 'warn',
          summary: 'Atenção',
          detail: 'Assunto e valor são obrigatórios',
          life: 3000
        });
        return;
      }

      const dadosParaEnviar = {
        assunto: editingParametro.assunto,
        modulo: 'integracao',
        chave: editingParametro.chave,
        valor: editingParametro.valor,
        descricao: editingParametro.descricao || ''
      };

      await http.put('parametros/criar-com-chave-serializada/', dadosParaEnviar);
      
      toast.current.show({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Parâmetro atualizado com sucesso',
        life: 3000
      });

      // Fechar modal e limpar dados
      setShowEditModal(false);
      setEditingParametro(null);

      // Recarregar dados se estiver no mesmo assunto
      if (selectedRegra === editingParametro.assunto) {
        await carregarParametros(selectedRegra);
      }

    } catch (error) {
      console.error('Erro ao atualizar parâmetro:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao atualizar parâmetro',
        life: 3000
      });
    } finally {
      setSavingEdit(false);
    }
  };

  // Adicionar nova chave ao objeto chave (para edição)
  const adicionarChaveEdicao = () => {
    const chaveNome = prompt('Nome da chave:');
    if (chaveNome && chaveNome.trim()) {
      setEditingParametro(prev => ({
        ...prev,
        chave: {
          ...prev.chave,
          [chaveNome.trim()]: ''
        }
      }));
    }
  };

  // Atualizar valor de uma chave (para edição)
  const atualizarChaveValorEdicao = (chaveNome, valor) => {
    setEditingParametro(prev => ({
      ...prev,
      chave: {
        ...prev.chave,
        [chaveNome]: valor
      }
    }));
  };

  // Remover chave (para edição)
  const removerChaveEdicao = (chaveNome) => {
    setEditingParametro(prev => {
      const novaChave = { ...prev.chave };
      delete novaChave[chaveNome];
      return {
        ...prev,
        chave: novaChave
      };
    });
  };

  // Iniciar criação de nova regra
  const iniciarCriacaoRegra = () => {
    setCreatingNewRegra(true);
    setNewRegraInline({
      nome: '',
      colunas: [''], // Começa com um parâmetro vazio para ser editado
      linhas: [{ '': '', valor: '' }] // Linha inicial com o primeiro parâmetro e valor
    });
    setNewParametroName('');
    setShowNewParametroInput(false);
  };

  // Cancelar criação de nova regra
  const cancelarCriacaoRegra = () => {
    setCreatingNewRegra(false);
    setNewRegraInline({
      nome: '',
      colunas: [''],
      linhas: [{ '': '', valor: '' }]
    });
    setNewParametroName('');
    setShowNewParametroInput(false);
  };







  // Adicionar nova linha à regra sendo criada
  const adicionarLinhaNovaRegra = () => {
    const novaLinha = {};
    newRegraInline.colunas.forEach(coluna => {
      novaLinha[coluna] = '';
    });
    novaLinha.valor = ''; // Adicionar propriedade valor

    setNewRegraInline(prev => ({
      ...prev,
      linhas: [...prev.linhas, novaLinha]
    }));
  };

  // Atualizar valor de uma linha da nova regra
  const atualizarLinhaNovaRegra = (linhaIndex, coluna, valor) => {
    setNewRegraInline(prev => {
      const novasLinhas = [...prev.linhas];
      novasLinhas[linhaIndex] = {
        ...novasLinhas[linhaIndex],
        [coluna]: valor
      };
      return {
        ...prev,
        linhas: novasLinhas
      };
    });
  };

  // Salvar nova regra com suas linhas
  const salvarNovaRegra = async () => {
    try {
      // Limpar variáveis de novo parâmetro para garantir
      setShowNewParametroInput(false);
      setNewParametroName('');
      
      // Validação 1: Nome da regra
      if (!newRegraInline.nome.trim()) {
        toast.current.show({
          severity: 'warn',
          summary: 'Atenção',
          detail: 'Nome da regra é obrigatório',
          life: 3000
        });
        return;
      }

      // Validação 2: Verificar se há pelo menos um parâmetro
      if (newRegraInline.colunas.length === 0) {
        toast.current.show({
          severity: 'warn',
          summary: 'Atenção',
          detail: 'Adicione pelo menos um parâmetro',
          life: 3000
        });
        return;
      }

      // Validação 2.1: Verificar se todos os nomes dos parâmetros estão preenchidos
      const parametrosVazios = newRegraInline.colunas.filter(coluna => !coluna || coluna.trim() === '');
      if (parametrosVazios.length > 0) {
        toast.current.show({
          severity: 'warn',
          summary: 'Atenção',
          detail: 'Todos os nomes dos parâmetros devem estar preenchidos',
          life: 3000
        });
        return;
      }

      // Validação 3: Verificar se há pelo menos uma linha
      if (newRegraInline.linhas.length === 0) {
        toast.current.show({
          severity: 'warn',
          summary: 'Atenção',
          detail: 'Adicione pelo menos uma combinação',
          life: 3000
        });
        return;
      }

      // Validação 4: Verificar se todos os campos estão preenchidos
      const linhasComErros = [];
      
      for (let i = 0; i < newRegraInline.linhas.length; i++) {
        const linha = newRegraInline.linhas[i];
        const erros = [];
        
        // Verificar valores dos parâmetros
        for (const coluna of newRegraInline.colunas) {
          if (!linha[coluna] || linha[coluna].trim() === '') {
            erros.push(`Parâmetro ${coluna} não preenchido`);
          }
        }
        
        // Verificar valor da combinação
        if (!linha.valor || linha.valor.trim() === '') {
          erros.push('Valor da combinação não preenchido');
        }
        
        if (erros.length > 0) {
          linhasComErros.push({
            linha: i + 1,
            erros: erros
          });
        }
      }

      // Se há erros, mostrar mensagem detalhada
      if (linhasComErros.length > 0) {
        const mensagemErro = linhasComErros.map(item => 
          `Linha ${item.linha}: ${item.erros.join(', ')}`
        ).join('\n');
        
        toast.current.show({
          severity: 'warn',
          summary: 'Atenção',
          detail: `Preencha todos os campos obrigatórios:\n${mensagemErro}`,
          life: 5000
        });
        return;
      }

      // Validação 5: Verificar se há um novo parâmetro sendo adicionado
      // Se há um novo parâmetro sendo adicionado, adicionar automaticamente
      if (showNewParametroInput && newParametroName && newParametroName.trim()) {
        adicionarNovoParametro();
      }

      // Se passou por todas as validações, prosseguir com o salvamento
      toast.current.show({
        severity: 'info',
        summary: 'Salvando',
        detail: 'Salvando nova regra...',
        life: 2000
      });

      // Criar as linhas da regra
      for (const linha of newRegraInline.linhas) {
        // Filtrar apenas as colunas que têm dados
        const chaveFiltrada = {};
        Object.keys(linha).forEach(coluna => {
          if (coluna !== 'valor' && linha[coluna] && linha[coluna].trim() !== '') {
            chaveFiltrada[coluna] = linha[coluna];
          }
        });

        const dadosLinha = {
          assunto: newRegraInline.nome,
          chave: chaveFiltrada,
          modulo: 'integracao',
          valor: linha.valor || '',
          descricao: ''
        };

        await http.post('parametros/criar-com-chave-serializada/', dadosLinha);
      }

      toast.current.show({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Nova regra criada com sucesso',
        life: 3000
      });

      // Recarregar lista de regras
      const response = await http.get('parametros/assuntos/?modulo=integracao');
      const regrasArray = response?.assuntos || [];
      const regrasFormatadas = Array.isArray(regrasArray) 
        ? regrasArray.map(regra => ({
            label: regra,
            value: regra
          }))
        : [];
      setRegras(regrasFormatadas);

      // Selecionar a nova regra
      setSelectedRegra(newRegraInline.nome);

      // Limpar e sair do modo de criação
      cancelarCriacaoRegra();

    } catch (error) {
      console.error('Erro ao criar nova regra:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao criar nova regra',
        life: 3000
      });
    }
  };

  return (
    <MetadadosContainer>
      <Toast ref={toast} />
      
      <Header>
                <HeaderLeft>
          <Title>Metadados</Title>
          <Subtitle>Gerencie os parâmetros e configurações do sistema</Subtitle>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
            <DropdownContainer>
                {!creatingNewRegra && 
                    <Dropdown
                        value={selectedRegra}
                        options={regras}
                        onChange={(e) => setSelectedRegra(e.value)}
                        placeholder="Escolha uma regra para gerenciar"
                        loading={loading}
                        disabled={creatingNewRegra || newRegraInline.nome.trim() !== ''}
                        style={{ 
                        width: '300px',
                        border: '2px solid #e9ecef',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        opacity: (creatingNewRegra || newRegraInline.nome.trim() !== '') ? 0.6 : 1
                        }}
                    />
                }
                {creatingNewRegra && (
                                        <InputText
                      value={newRegraInline.nome}
                      onChange={(e) => setNewRegraInline(prev => ({ ...prev, nome: e.target.value }))}
                      placeholder="Digite o nome da regra"
                      style={{ 
                        width: '300px',
                        border: `2px solid ${(!newRegraInline.nome || newRegraInline.nome.trim() === '') ? '#dc3545' : '#2e7d32'}`,
                        borderRadius: '8px',
                        padding: '12px 16px',
                        background: (!newRegraInline.nome || newRegraInline.nome.trim() === '') ? '#fff5f5' : 'white'
                      }}
                    />
                )}
            </DropdownContainer>
          </div>
        </HeaderLeft>
        
        <BotaoGrupo>
          <Botao 
            size="small" 
            aoClicar={() => setShowSearchModal(true)}
            disabled={creatingNewRegra}
            style={{
              background: 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)',
              border: 'none',
              color: 'white',
              boxShadow: '0 2px 8px rgba(23, 162, 184, 0.3)',
              opacity: creatingNewRegra ? 0.6 : 1
            }}
          >
            <FaSearch /> Buscar
          </Botao>
          
          {hasChanges && selectedRegra && !creatingNewRegra && (
            <Botao 
              size="small" 
              aoClicar={salvarAlteracoes}
              disabled={saving}
              style={{
                background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                border: 'none',
                color: 'white',
                boxShadow: '0 2px 8px rgba(40, 167, 69, 0.3)',
                opacity: saving ? 0.6 : 1
              }}
            >
              <FaSave /> Salvar Alterações
            </Botao>
          )}
          
          {!creatingNewRegra ? (
            <Botao 
              size="small" 
              aoClicar={iniciarCriacaoRegra}
              style={{
                background: 'linear-gradient(135deg, #fd7e14 0%, #e55a00 100%)',
                border: 'none',
                color: 'white',
                boxShadow: '0 2px 8px rgba(253, 126, 20, 0.3)'
              }}
            >
              <GrAddCircle /> Regra
            </Botao>
          ) : (
            <>
              <Botao 
                size="small" 
                aoClicar={cancelarCriacaoRegra}
                style={{
                  background: 'linear-gradient(135deg, #6c757d 0%, #5a6268 100%)',
                  border: 'none',
                  color: 'white',
                  boxShadow: '0 2px 8px rgba(108, 117, 125, 0.3)'
                }}
              >
                Cancelar
              </Botao>
              <Botao 
                size="small" 
                aoClicar={salvarNovaRegra}
                style={{
                  background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                  border: 'none',
                  color: 'white',
                  boxShadow: '0 2px 8px rgba(40, 167, 69, 0.3)'
                }}
              >
                <FaSave /> Salvar
              </Botao>
            </>
          )}
        </BotaoGrupo>
      </Header>

      {creatingNewRegra ? (
        <>
          <TableContainer style={{ width: '100%', minHeight: '400px' }}>
            <TableHeader>
              <SectionHeader style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'space-between' }}>
                <span style={{ fontSize: '16px', fontWeight: '600', color: '#fff' }}>Parâmetros</span>
                <FaPlus fill="#fff" size={20} style={{ cursor: 'pointer'}} onClick={() => setShowNewParametroInput(true)} />
              </SectionHeader>
              <SectionHeader>Valor da Combinação</SectionHeader>
            </TableHeader>
            
            <TableBody>
              <SectionBody style={{ flex: 1 }}>
                {/* Header das colunas */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  padding: '16px',
                  borderBottom: '1px solid #e9ecef',
                  background: '#f8f9fa'
                }}>
                  {newRegraInline.colunas.map((coluna, index) => (
                    <div key={coluna} style={{ 
                      flex: 1,
                      padding: '8px 12px',
                      background: 'white',
                      borderRadius: '6px',
                      border: '1px solid #e9ecef',
                      textAlign: 'center'
                    }}>
                      <InputText
                        value={coluna}
                        onChange={(e) => {
                          const novoNome = e.target.value;
                          // Atualizar o nome da coluna
                          setNewRegraInline(prev => ({
                            ...prev,
                            colunas: prev.colunas.map((col, idx) => 
                              idx === index ? novoNome : col
                            ),
                            // Atualizar todas as linhas para usar o novo nome
                            linhas: prev.linhas.map(linha => {
                              const novaLinha = { ...linha };
                              if (linha[coluna] !== undefined) {
                                novaLinha[novoNome] = linha[coluna];
                                delete novaLinha[coluna];
                              }
                              return novaLinha;
                            })
                          }));
                        }}
                        placeholder={`Nome do parâmetro ${index + 1}`}
                        style={{
                          width: '100%',
                          fontSize: '14px',
                          fontWeight: '600',
                          border: 'none',
                          background: 'transparent',
                          outline: 'none',
                          textAlign: 'center',
                          color: '#495057'
                        }}
                      />
                    </div>
                  ))}
                  
                  {/* Campo para novo parâmetro */}
                  {showNewParametroInput && (
                    <div style={{ 
                      flex: 1,
                      padding: '8px 12px',
                      background: 'white',
                      borderRadius: '6px',
                      border: '1px solid #e9ecef'
                    }}>
                      <InputText
                        value={newParametroName}
                        onChange={(e) => setNewParametroName(e.target.value)}
                        placeholder="Nome do novo parâmetro"
                        style={{
                          width: '100%',
                          fontSize: '14px',
                          border: 'none',
                          background: 'transparent',
                          outline: 'none'
                        }}
                        onKeyPress={(e) => e.key === 'Enter' && adicionarNovoParametroAuto()}
                        autoFocus
                      />
                    </div>
                  )}
                </div>

                {/* Linhas de dados */}
                {newRegraInline.linhas.map((linha, linhaIndex) => (
                  <div key={linhaIndex} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    padding: '16px',
                    borderBottom: '1px solid #f1f3f4'
                  }}>
                    {newRegraInline.colunas.map((coluna, index) => (
                      <Input
                        key={`${linhaIndex}-${coluna}`}
                        value={linha[coluna] || ''}
                        onChange={(e) => atualizarLinhaNovaRegra(linhaIndex, coluna, e.target.value)}
                        placeholder={`Digite o valor do ${coluna}`}
                        style={{
                          flex: 1,
                          border: `2px solid ${(!linha[coluna] || linha[coluna].trim() === '') ? '#dc3545' : '#e9ecef'}`,
                          borderRadius: '8px',
                          padding: '12px 16px',
                          fontSize: '14px',
                          transition: 'all 0.2s ease',
                          background: (!linha[coluna] || linha[coluna].trim() === '') ? '#fff5f5' : 'white'
                        }}
                      />
                    ))}
                    
                    {/* Campo para o novo parâmetro sendo adicionado */}
                    {showNewParametroInput && (
                      <Input
                        value={linha[newParametroName] || ''}
                        placeholder="Digite o valor do parâmetro"
                        onChange={(e) => {
                          // Atualizar apenas a linha atual
                          atualizarLinhaNovaRegra(linhaIndex, newParametroName || 'novo_parametro', e.target.value);
                        }}
                        onKeyPress={(e) => e.key === 'Enter' && adicionarNovoParametroAuto()}
                        style={{
                          flex: 1,
                          border: '2px solid #17a2b8',
                          borderRadius: '8px',
                          padding: '12px 16px',
                          fontSize: '14px',
                          transition: 'all 0.2s ease',
                          background: 'white'
                        }}
                        autoFocus
                      />
                    )}
                  </div>
                ))}
              </SectionBody>
              
              <SectionBody>
                {/* Header do valor da combinação */}
                <div style={{ 
                  padding: '16px',
                  borderBottom: '1px solid #e9ecef',
                  background: '#f8f9fa'
                }}>
                  <div style={{ 
                    padding: '8px 12px',
                    background: 'white',
                    borderRadius: '6px',
                    border: '1px solid #e9ecef',
                    textAlign: 'center'
                  }}>
                    <span style={{ 
                      fontSize: '14px', 
                      fontWeight: '600',
                      color: '#495057'
                    }}>
                      Valor da Combinação
                    </span>
                  </div>
                </div>

                {/* Campos de resultado */}
                {newRegraInline.linhas.map((linha, linhaIndex) => (
                  <div key={linhaIndex} style={{ 
                    padding: '16px',
                    borderBottom: '1px solid #f1f3f4'
                  }}>
                    <Input
                      value={linha.valor || ''}
                      onChange={(e) => atualizarLinhaNovaRegra(linhaIndex, 'valor', e.target.value)}
                      placeholder="Valor da Combinação"
                      style={{
                        width: '100%',
                        border: `2px solid ${(!linha.valor || linha.valor.trim() === '') ? '#dc3545' : '#1976d2'}`,
                        borderRadius: '8px',
                        padding: '12px 16px',
                        fontSize: '14px',
                        transition: 'all 0.2s ease',
                        background: (!linha.valor || linha.valor.trim() === '') ? '#fff5f5' : 'white'
                      }}
                    />
                  </div>
                ))}
              </SectionBody>
            </TableBody>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              padding: '24px',
              borderTop: '1px solid #e9ecef',
              background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
              borderRadius: '0 0 16px 16px'
            }}>
              <Botao 
                size="small" 
                aoClicar={adicionarLinhaNovaRegra}
                style={{
                  background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                  transition: 'all 0.2s ease',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                <GrAddCircle /> Adicionar Combinação
              </Botao>
            </div>
          </TableContainer>
        </>
      ) : selectedRegra ? (
        <>
          <TableContainer>
            <TableHeader>
              <SectionHeader>Parâmetros</SectionHeader>
              <SectionHeader>Valor da Combinação</SectionHeader>
            </TableHeader>
            
            <TableBody>
              <SectionBody>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', borderBottom: '1px solid #dee2e6' }}>
                  {chavesUnicas.map(chave => (
                    <div key={chave} style={{ 
                      flex: 1,
                      padding: '8px 12px', 
                      fontWeight: '600',
                      background: 'white',
                      borderRadius: '6px',
                      border: '1px solid #e9ecef',
                      textAlign: 'center'
                    }}>
                      {chave}
                    </div>
                  ))}
                  
                  {/* Campo para novo parâmetro */}
                  {showNewParametroInput && (
                    <div style={{ 
                      flex: 1,
                      padding: '8px 12px',
                      background: 'white',
                      borderRadius: '6px',
                      border: '1px solid #e9ecef'
                    }}>
                      <InputText
                        value={newParametroName}
                        onChange={(e) => setNewParametroName(e.target.value)}
                        placeholder="Nome do novo parâmetro"
                        style={{
                          width: '100%',
                          fontSize: '14px',
                          border: 'none',
                          background: 'transparent',
                          outline: 'none'
                        }}
                        onKeyPress={(e) => e.key === 'Enter' && adicionarNovoParametroAuto()}
                        autoFocus
                      />
                    </div>
                  )}
                </div>

              </SectionBody>
              
              <SectionBody>
                <div style={{ padding: '12px 16px', fontWeight: '600', borderBottom: '1px solid #dee2e6' }}>
                  Valor
                </div>
              </SectionBody>
            </TableBody>

            <TableBody>
              <SectionBody>
                {allRows.map(row => (
                  <div key={row.id} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    padding: '12px 16px', 
                    borderBottom: '1px solid #f1f3f4'
                  }}>
                    {chavesUnicas.map(chave => (
                      <Input
                        key={chave}
                        value={row.chave_desserializada?.[chave] || ''}
                        onChange={(e) => atualizarChave(row.id, chave, e.target.value)}
                        placeholder={chave}
                        style={{
                          flex: 1,
                          border: '2px solid #e9ecef',
                          borderRadius: '8px',
                          padding: '12px 16px',
                          fontSize: '14px',
                          transition: 'all 0.2s ease',
                          background: 'white'
                        }}
                      />
                    ))}
                    
                    {/* Campo para o novo parâmetro sendo adicionado */}
                    {showNewParametroInput && (
                      <Input
                        value={linha[newParametroName] || ''}
                        placeholder="Digite o valor do parâmetro"
                        onChange={(e) => {
                          // Atualizar apenas a linha atual
                          atualizarLinhaNovaRegra(linhaIndex, newParametroName || 'novo_parametro', e.target.value);
                        }}
                        onKeyPress={(e) => e.key === 'Enter' && adicionarNovoParametroAuto()}
                        style={{
                          flex: 1,
                          border: '2px solid #17a2b8',
                          borderRadius: '8px',
                          padding: '12px 16px',
                          fontSize: '14px',
                          transition: 'all 0.2s ease',
                          background: 'white'
                        }}
                        autoFocus
                      />
                    )}
                  </div>
                ))}
              </SectionBody>
              
              <SectionBody>
                {allRows.map(row => (
                  <Row key={row.id} columns="1fr auto">
                    <Input
                      value={row.valor || ''}
                      onChange={(e) => atualizarValor(row.id, e.target.value)}
                      placeholder="Valor"
                      style={{
                        width: '100%',
                        border: '2px solid #e9ecef',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        fontSize: '14px',
                        transition: 'all 0.2s ease',
                        background: 'white'
                      }}
                    />
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <Botao 
                        size="small" 
                        aoClicar={() => excluirParametro(row.id)}
                        style={{ 
                          padding: '8px 10px', 
                          minWidth: 'auto', 
                          background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
                          border: 'none',
                          color: 'white',
                          borderRadius: '8px',
                          boxShadow: '0 2px 6px rgba(220, 53, 69, 0.3)',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <FaTrash />
                      </Botao>
                    </div>
                  </Row>
                ))}
              </SectionBody>
            </TableBody>
            
            {/* Botão de adicionar linha embaixo da tabela */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              padding: '24px',
              borderTop: '1px solid #e9ecef',
              background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
              borderRadius: '0 0 16px 16px'
            }}>
              <Botao 
                size="small" 
                aoClicar={adicionarLinha}
                disabled={loading}
                style={{
                  background: 'linear-gradient(135deg, #2e7d32 0%, #388e3c 100%)',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(46, 125, 50, 0.3)',
                  transition: 'all 0.2s ease',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                <GrAddCircle /> Adicionar Combinação na Regra
              </Botao>
            </div>
          </TableContainer>
        </>
      ) : (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 20px',
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e9ecef',
          textAlign: 'center'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px'
          }}>
            <FaSearch size={32} color="#6c757d" />
          </div>
          <h3 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#495057',
            margin: '0 0 12px 0'
          }}>
            Selecione uma Regra
          </h3>
          <p style={{
            fontSize: '16px',
            color: '#6c757d',
            margin: '0 0 24px 0',
            maxWidth: '400px',
            lineHeight: '1.5'
          }}>
            Escolha uma regra no dropdown acima para começar a gerenciar os parâmetros e configurações do sistema.
          </p>
          <Botao 
            size="small" 
            aoClicar={iniciarCriacaoRegra}
            style={{
              background: 'linear-gradient(135deg, #fd7e14 0%, #e55a00 100%)',
              border: 'none',
              color: 'white',
              boxShadow: '0 4px 12px rgba(253, 126, 20, 0.3)',
              padding: '12px 24px',
              borderRadius: '12px'
            }}
          >
            <GrAddCircle stroke="white" /> Criar Primeira Regra
          </Botao>
        </div>
      )}



      {/* Modal de Busca */}
      <Dialog
        header="Buscar Parâmetros"
        visible={showSearchModal}
        onHide={() => setShowSearchModal(false)}
        style={{ width: '800px' }}
        modal
        closeOnEscape
        closable
      >
        <div style={{ padding: '20px 0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                Assunto
              </label>
              <InputText
                value={searchQuery.assunto}
                onChange={(e) => setSearchQuery(prev => ({ ...prev, assunto: e.target.value }))}
                placeholder="Ex: CLOSECARE"
                style={{ width: '100%' }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                Chave Parcial
              </label>
              <InputText
                value={searchQuery.chave_parcial}
                onChange={(e) => setSearchQuery(prev => ({ ...prev, chave_parcial: e.target.value }))}
                placeholder="Ex: tipo=1"
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <Botao
            size="small"
            aoClicar={buscarParametros}
            loading={searching}
            style={{ marginBottom: '20px' }}
          >
            <FaSearch /> Buscar
          </Botao>

          {searchResults.length > 0 && (
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <h4 style={{ marginBottom: '12px' }}>Resultados ({searchResults.length})</h4>
              {searchResults.map((parametro, index) => (
                <div key={index} style={{
                  border: '1px solid #dee2e6',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '12px',
                  background: 'white'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <strong>ID:</strong> {parametro.id} | <strong>Assunto:</strong> {parametro.assunto}
                    </div>
                    <Botao
                      size="small"
                      aoClicar={() => abrirEdicao(parametro)}
                      style={{ padding: '4px 8px', minWidth: 'auto' }}
                    >
                      <FaEdit />
                    </Botao>
                  </div>
                  
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Chave Original:</strong> {parametro.chave_original}
                  </div>
                  
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Chave Desserializada:</strong>
                    <pre style={{
                      background: '#f8f9fa',
                      padding: '8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      margin: '4px 0'
                    }}>
                      {JSON.stringify(parametro.chave_desserializada, null, 2)}
                    </pre>
                  </div>
                  
                  <div>
                    <strong>Valor:</strong> {parametro.valor}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>


      </Dialog>

      {/* Modal de Edição */}
      <Dialog
        header="Editar Parâmetro"
        visible={showEditModal}
        onHide={() => setShowEditModal(false)}
        style={{ width: '600px' }}
        modal
        closeOnEscape
        closable
      >
        {editingParametro && (
          <div style={{ padding: '20px 0' }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                Nome do Assunto *
              </label>
              <InputText
                value={editingParametro.assunto}
                onChange={(e) => setEditingParametro(prev => ({ ...prev, assunto: e.target.value }))}
                placeholder="Ex: CLOSECARE"
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                Valor *
              </label>
              <InputText
                value={editingParametro.valor}
                onChange={(e) => setEditingParametro(prev => ({ ...prev, valor: e.target.value }))}
                placeholder="Ex: 33"
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                Descrição (Opcional)
              </label>
              <InputText
                value={editingParametro.descricao}
                onChange={(e) => setEditingParametro(prev => ({ ...prev, descricao: e.target.value }))}
                placeholder="Descrição do parâmetro"
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <label style={{ fontWeight: '600' }}>
                  Chaves
                </label>
                <Botao
                  size="small"
                  aoClicar={adicionarChaveEdicao}
                >
                  <FaPlus /> Adicionar Chave
                </Botao>
              </div>
              
              {Object.keys(editingParametro.chave).length > 0 ? (
                <div style={{ border: '1px solid #dee2e6', borderRadius: '4px', padding: '12px' }}>
                  {Object.entries(editingParametro.chave).map(([chaveNome, valor]) => (
                    <div key={chaveNome} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                      <div style={{ minWidth: '120px', fontWeight: '500' }}>{chaveNome}:</div>
                      <InputText
                        value={valor}
                        onChange={(e) => atualizarChaveValorEdicao(chaveNome, e.target.value)}
                        placeholder="Valor da chave"
                        style={{ flex: 1 }}
                      />
                      <Botao
                        size="small"
                        aoClicar={() => removerChaveEdicao(chaveNome)}
                        style={{ padding: '4px 8px', minWidth: 'auto', background: '#d32f2f', borderColor: '#d32f2f' }}
                      >
                        <FaTrash />
                      </Botao>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ 
                  border: '1px dashed #dee2e6', 
                  borderRadius: '4px', 
                  padding: '20px', 
                  textAlign: 'center', 
                  color: '#6c757d',
                  fontStyle: 'italic'
                }}>
                  Nenhuma chave adicionada. Clique em "Adicionar Chave" para incluir chaves.
                </div>
              )}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '20px', borderTop: '1px solid #dee2e6' }}>
          <Botao
            size="small"
            aoClicar={() => setShowEditModal(false)}
          >
            Cancelar
          </Botao>
          <Botao
            size="small"
            aoClicar={salvarEdicao}
            loading={savingEdit}
          >
            <FaSave /> Salvar Alterações
          </Botao>
        </div>
      </Dialog>
    </MetadadosContainer>
  );
}

export default Metadados;

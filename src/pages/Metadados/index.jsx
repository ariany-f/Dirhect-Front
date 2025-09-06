import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { FaPlus, FaSave, FaTrash, FaPlusCircle, FaSearch, FaPen } from 'react-icons/fa';
import { GrAddCircle } from 'react-icons/gr';
import http from '@http';
import styled from 'styled-components';
import Botao from '@components/Botao';
import BotaoGrupo from '@components/BotaoGrupo';
import DropdownItens from '@components/DropdownItens';

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



function Metadados() {
  const [regras, setRegras] = useState([]);
  const [selectedRegra, setSelectedRegra] = useState(null);
  const [parametros, setParametros] = useState([]);
  const [loading, setLoading] = useState(false);


  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [regraToDelete, setRegraToDelete] = useState(null);
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
  const [editingExistingRegra, setEditingExistingRegra] = useState(false);




  const [newRegraInline, setNewRegraInline] = useState({
    nome: '',
    colunas: [],
    linhas: []
  });
  const [descricaoRegra, setDescricaoRegra] = useState('');
  const [idAssunto, setIdAssunto] = useState(null);

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
      const carregarParametros = async () => {
        try {
          setLoading(true);
          const response = await http.get(`parametros/desserializar-por-assunto/?assunto=${selectedRegra}`);
          setParametros(response?.parametros || []);
          
                                  // Carregar descrição da regra
            try {
              const descricaoResponse = await http.get(`assunto_parametro/?nome=${encodeURIComponent(selectedRegra)}`);
              console.log(descricaoResponse);
              // A resposta é um array, pegamos o primeiro item
              const regraInfo = Array.isArray(descricaoResponse) && descricaoResponse.length > 0 ? descricaoResponse[0] : null;
              setDescricaoRegra(regraInfo?.descricao || '');
              setIdAssunto(regraInfo?.id || null);
            } catch (descricaoError) {
              console.warn('Erro ao carregar descrição da regra:', descricaoError);
              setDescricaoRegra('');
              setIdAssunto(null);
            }
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
      carregarParametros();
    } else {
      setParametros([]);
      setDescricaoRegra('');
      setIdAssunto(null);
    }
  }, [selectedRegra]);



























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
      
      const response = await http.post('parametros/buscar-por-chave-objeto/?assunto=' + encodeURIComponent(selectedRegra), {
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
        id: editingParametro.id,
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
      colunas: ['Parâmetro 1'], // Começa com um nome padrão para o primeiro parâmetro
      linhas: [{ 'Parâmetro 1': '', valor: '' }] // Linha inicial com o primeiro parâmetro e valor
    });
  };

  // Abrir dialog de confirmação de exclusão
  const abrirConfirmacaoExclusao = () => {
    if (!selectedRegra) {
      toast.current.show({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Selecione uma regra para excluir',
        life: 3000
      });
      return;
    }
    
    setRegraToDelete(selectedRegra);
    setShowDeleteConfirmModal(true);
  };

  // Confirmar exclusão da regra
  const confirmarExclusaoRegra = async () => {
    if (!regraToDelete) return;

    try {
      // Carregar parâmetros da regra para verificar se existem
      const response = await http.get(`parametros/por-assunto/?assunto=${regraToDelete}`);
      const parametrosExistentes = response?.parametros || [];
      console.log(parametrosExistentes);
      
      // Se a regra tem parâmetros, excluir todos
      if (parametrosExistentes.length > 0) {
        for (const parametro of parametrosExistentes) {
          await http.delete(`parametros/${parametro.id}/`);
        }
      }

      // Excluir o assunto da regra usando ID
      try {
        if (idAssunto) {
          await http.delete(`assunto_parametro/${idAssunto}/`);
        } else {
          // Fallback para o método antigo se não tiver ID
          await http.delete(`parametros/assuntos/${encodeURIComponent(regraToDelete)}/?modulo=integracao`);
        }
      } catch (assuntoError) {
        console.warn('Erro ao excluir assunto:', assuntoError);
        toast.current.show({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao excluir assunto da regra',
          life: 3000
        });
        return;
      }
      
      // Mensagem de sucesso baseada na existência de parâmetros
      const mensagemSucesso = parametrosExistentes.length > 0 
        ? `Regra "${regraToDelete}" e todos os seus parâmetros foram excluídos com sucesso`
        : `Regra "${regraToDelete}" foi excluída com sucesso`;
      
      toast.current.show({
        severity: 'success',
        summary: 'Sucesso',
        detail: mensagemSucesso,
        life: 3000
      });

      // Recarregar lista de regras
      const regrasResponse = await http.get('parametros/assuntos/?modulo=integracao');
      const regrasArray = regrasResponse?.assuntos || [];
      const regrasFormatadas = Array.isArray(regrasArray) 
        ? regrasArray.map(regra => ({
            label: regra,
            value: regra
          }))
        : [];
      setRegras(regrasFormatadas);

      // Limpar seleção
      setSelectedRegra(null);
      setParametros([]);

      // Fechar dialog
      setShowDeleteConfirmModal(false);
      setRegraToDelete(null);

    } catch (error) {
      console.error('Erro ao excluir regra:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao excluir regra',
        life: 3000
      });
    }
  };

  // Iniciar edição de regra existente (criar cópia)
  const iniciarEdicaoRegra = async () => {
    if (!selectedRegra) {
      toast.current.show({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Selecione uma regra para editar',
        life: 3000
      });
      return;
    }

    try {
      // Carregar parâmetros da regra selecionada
      const response = await http.get(`parametros/desserializar-por-assunto/?assunto=${selectedRegra}`);
      const parametrosExistentes = response?.parametros || [];
      
      if (parametrosExistentes.length === 0) {
        toast.current.show({
          severity: 'warn',
          summary: 'Atenção',
          detail: 'Regra selecionada não possui parâmetros',
          life: 3000
        });
        return;
      }

      // Obter chaves únicas dos parâmetros existentes
      const chavesUnicas = new Set();
      parametrosExistentes.forEach(param => {
        if (param.chave_desserializada) {
          Object.keys(param.chave_desserializada).forEach(chave => {
            if (!chave.includes('novo_parametro_temp') && 
                !chave.includes('temp_') && 
                chave.trim() !== '' && 
                chave !== 'novo_parametro_temp') {
              chavesUnicas.add(chave);
            }
          });
        }
      });
      
      // Criar cópia da regra existente
      setNewRegraInline({
        nome: selectedRegra,
        colunas: Array.from(chavesUnicas),
        linhas: parametrosExistentes.map(param => {
          const linha = {};
          Array.from(chavesUnicas).forEach(chave => {
            linha[chave] = param.chave_desserializada?.[chave] || '';
          });
          linha.valor = param.valor || '';
          return linha;
        })
      });

      // Carregar descrição da regra (se existir)
      try {
        const descricaoResponse = await http.get(`assunto_parametro/?nome=${encodeURIComponent(selectedRegra)}`);
        // A resposta é um array, pegamos o primeiro item
        const regraInfo = Array.isArray(descricaoResponse) && descricaoResponse.length > 0 ? descricaoResponse[0] : null;
        setDescricaoRegra(regraInfo?.descricao || '');
        setIdAssunto(regraInfo?.id || null);
      } catch (descricaoError) {
        console.warn('Erro ao carregar descrição da regra:', descricaoError);
        setDescricaoRegra('');
        setIdAssunto(null);
      }

      setEditingExistingRegra(true);
    } catch (error) {
      console.error('Erro ao carregar parâmetros para edição:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao carregar parâmetros da regra',
        life: 3000
      });
    }
  };

  // Cancelar criação/edição de regra
  const cancelarCriacaoRegra = () => {
    setCreatingNewRegra(false);
    setEditingExistingRegra(false);
    setNewRegraInline({
      nome: '',
      colunas: ['Parâmetro 1'],
      linhas: [{ 'Parâmetro 1': '', valor: '' }]
    });
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

  // Remover linha da regra sendo criada/editada
  const removerLinhaNovaRegra = (linhaIndex) => {
    if (newRegraInline.linhas.length <= 1) {
      toast.current.show({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'A regra deve ter pelo menos uma combinação',
        life: 3000
      });
      return;
    }

    setNewRegraInline(prev => ({
      ...prev,
      linhas: prev.linhas.filter((_, index) => index !== linhaIndex)
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

  // Salvar nova regra ou atualizar regra existente
  const salvarNovaRegra = async () => {
    try {

      
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



      // Se passou por todas as validações, prosseguir com o salvamento
      toast.current.show({
        severity: 'info',
        summary: 'Salvando',
        detail: 'Salvando nova regra...',
        life: 2000
      });

      // Se estiver editando uma regra existente, excluir a original primeiro
      if (editingExistingRegra) {
        try {
          // Excluir todos os parâmetros da regra original
          const response = await http.get(`parametros/desserializar-por-assunto/?assunto=${selectedRegra}`);
          const parametrosExistentes = response?.parametros || [];
          
          for (const parametro of parametrosExistentes) {
            await http.delete(`parametros/${parametro.id}/`);
          }
          
          toast.current.show({
            severity: 'info',
            summary: 'Atualizando',
            detail: 'Regra original excluída, criando nova versão...',
            life: 2000
          });
        } catch (error) {
          console.error('Erro ao excluir regra original:', error);
          toast.current.show({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao excluir regra original',
            life: 3000
          });
          return;
        }
      }

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
          descricao: descricaoRegra || ''
        };

        await http.post('parametros/criar-com-chave-serializada/', dadosLinha);
      }

      // Atualizar descrição do assunto se estiver editando
      if (editingExistingRegra && idAssunto) {
        try {
          await http.put(`assunto_parametro/${idAssunto}/`, {
            nome: newRegraInline.nome,
            modulo: 'integracao',
            descricao: descricaoRegra || ''
          });
        } catch (updateError) {
          console.warn('Erro ao atualizar descrição do assunto:', updateError);
        }
      }

      toast.current.show({
        severity: 'success',
        summary: 'Sucesso',
        detail: editingExistingRegra ? 'Regra atualizada com sucesso' : 'Nova regra criada com sucesso',
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

      // Recarregar parâmetros da regra (seja nova ou editada)
      try {
        const parametrosResponse = await http.get(`parametros/buscar-com-chave-desserializada/?assunto=${newRegraInline.nome}`);
        setParametros(parametrosResponse?.parametros || []);
      } catch (error) {
        console.error('Erro ao recarregar parâmetros:', error);
      }

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
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <DropdownContainer>
                {!creatingNewRegra && 
                    <DropdownItens
                        valor={selectedRegra}
                        setValor={setSelectedRegra}
                        options={regras}
                        placeholder="Escolha uma regra para gerenciar"
                        name="regra"
                        $width="250px"
                        disabled={creatingNewRegra || newRegraInline.nome.trim() !== ''}
                        optionLabel="label"
                    />
                }
                {creatingNewRegra && (
                    <InputText
                    value={newRegraInline.nome}
                    onChange={(e) => setNewRegraInline(prev => ({ ...prev, nome: e.target.value }))}
                    placeholder="Digite o nome da regra"
                    style={{ 
                        width: '250px',
                        border: `2px solid ${(!newRegraInline.nome || newRegraInline.nome.trim() !== '') ? '#dc3545' : '#2e7d32'}`,
                        borderRadius: '8px',
                        padding: '10px 14px',
                        background: (!newRegraInline.nome || newRegraInline.nome.trim() === '') ? '#fff5f5' : 'white'
                    }}
                    />
                )}
            </DropdownContainer>
            
            {/* Campo de Descrição */}
            {selectedRegra && !creatingNewRegra && (
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '4px',
                minWidth: '300px',
                maxWidth: '400px'
              }}>
                <label style={{ 
                  fontSize: '12px', 
                  fontWeight: '600', 
                  color: '#495057',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Descrição
                </label>
                {editingExistingRegra ? (
                  <textarea
                    value={descricaoRegra}
                    onChange={(e) => setDescricaoRegra(e.target.value)}
                    placeholder="Digite a descrição da regra..."
                    style={{
                      width: '100%',
                      minHeight: '60px',
                      maxHeight: '120px',
                      border: '2px solid #e9ecef',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontSize: '13px',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                      outline: 'none',
                      transition: 'border-color 0.2s ease'
                    }}
                  />
                ) : (
                  <div style={{
                    width: '100%',
                    minHeight: '60px',
                    maxHeight: '120px',
                    border: '2px solid #e9ecef',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '13px',
                    background: '#f8f9fa',
                    color: '#495057',
                    overflowY: 'auto',
                    wordBreak: 'break-word'
                  }}>
                    {descricaoRegra || 'Nenhuma descrição disponível'}
                  </div>
                )}
              </div>
            )}
            
            {selectedRegra && !creatingNewRegra && !editingExistingRegra && (
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' , alignItems: 'center'}}>
                <Botao 
                  size="medium" 
                  aoClicar={iniciarEdicaoRegra}
                >
                  <FaPen size={14} /> Editar
                </Botao>
                <Botao 
                  size="medium" 
                  estilo="danger"
                  aoClicar={abrirConfirmacaoExclusao}
                >
                  <FaTrash size={14} fill="#fff"/> Excluir
                </Botao>
              </div>
            )}
          </div>
        </HeaderLeft>
        
                <BotaoGrupo>
          <Botao 
            size="medium" 
            aoClicar={() => setShowSearchModal(true)}
            disabled={creatingNewRegra || editingExistingRegra}
          >
            <FaSearch size={14} /> Buscar
          </Botao>
          
          {!creatingNewRegra && !editingExistingRegra ? (
            <Botao 
              size="medium" 
              aoClicar={iniciarCriacaoRegra}
              style={{
                background: 'linear-gradient(135deg, #fd7e14 0%, #e55a00 100%)',
                border: 'none',
                color: 'white',
                boxShadow: '0 2px 8px rgba(253, 126, 20, 0.3)'
              }}
            >
              <GrAddCircle size={14} /> Regra
            </Botao>
          ) : creatingNewRegra ? (
            <>
              <Botao 
                size="medium" 
                aoClicar={cancelarCriacaoRegra}
                estilo="danger"
              >
                Cancelar
              </Botao>
              <Botao 
                size="medium" 
                aoClicar={salvarNovaRegra}
              >
                <FaSave size={14} /> Salvar
              </Botao>
            </>
          ) : editingExistingRegra ? (
            <>
              <Botao 
                size="medium" 
                estilo="danger"
                aoClicar={cancelarCriacaoRegra}
              >
                Cancelar
              </Botao>
              <Botao 
                size="medium" 
                aoClicar={salvarNovaRegra}
              >
                <FaSave size={30} /> Atualizar
              </Botao>
            </>
          ) : null}
        </BotaoGrupo>
      </Header>

      {creatingNewRegra || editingExistingRegra ? (
        <>
          <TableContainer style={{ width: '100%', minHeight: '400px' }}>
            <TableHeader>
              <SectionHeader style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'space-between' }}>
                <span style={{ fontSize: '16px', fontWeight: '600', color: '#fff' }}>
                  Parâmetros
                </span>
                <FaPlus fill="#fff" size={20} style={{ cursor: 'pointer'}} onClick={() => {
                  // Adicionar nova coluna
                  const novoNome = `Parâmetro ${newRegraInline.colunas.length + 1}`;
                  setNewRegraInline(prev => ({
                    ...prev,
                    colunas: [...prev.colunas, novoNome],
                    linhas: prev.linhas.map(linha => ({
                      ...linha,
                      [novoNome]: ''
                    }))
                  }));
                }} />
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
                    <div key={`coluna-${index}`} style={{ 
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
                  

                </div>

                {/* Linhas de dados */}
                {newRegraInline.linhas.map((linha, linhaIndex) => (
                  <div key={`linha-parametros-${linhaIndex}`} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    padding: '8px 16px',
                    borderBottom: '1px solid #f1f3f4'
                  }}>
                    {newRegraInline.colunas.map((coluna, index) => (
                      <Input
                        key={`${linhaIndex}-${index}`}
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
                  </div>
                ))}
              </SectionBody>
              
              <SectionBody>
                {/* Header do valor da combinação */}
                <div style={{ 
                  padding: '14px 16px',
                  borderBottom: '1px solid #e9ecef',
                  background: '#f8f9fa'
                }}>
                  <div style={{ 
                    padding: '20px 12px',
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
                  <div key={`linha-valor-${linhaIndex}`} style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '16px',
                    borderBottom: '1px solid #f1f3f4'
                  }}>
                    <Input
                      key={`input-valor-${linhaIndex}`}
                      value={linha.valor || ''}
                      onChange={(e) => atualizarLinhaNovaRegra(linhaIndex, 'valor', e.target.value)}
                      placeholder="Valor da Combinação"
                      style={{
                        flex: 1,
                        border: `2px solid ${(!linha.valor || linha.valor.trim() === '') ? '#dc3545' : '#1976d2'}`,
                        borderRadius: '8px',
                        padding: '12px 16px',
                        fontSize: '14px',
                        transition: 'all 0.2s ease',
                        background: (!linha.valor || linha.valor.trim() === '') ? '#fff5f5' : 'white'
                      }}
                    />
                    
                    {/* Botão de remover linha */}
                    <div
                      onClick={() => removerLinhaNovaRegra(linhaIndex)}
                      style={{
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#dc3545',
                        color: 'white',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        fontSize: '12px'
                      }}
                      title="Remover linha"
                    >
                      <FaTrash fill="#fff" size={12} />
                    </div>
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
      ) : selectedRegra && !editingExistingRegra ? (
        <>
          <TableContainer>
            <TableHeader>
              <SectionHeader style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'space-between' }}>
                <span style={{ fontSize: '16px', fontWeight: '600', color: '#fff' }}>Parâmetros</span>
              </SectionHeader>
              <SectionHeader>Valor da Combinação</SectionHeader>
            </TableHeader>
            
            <TableBody>
              <SectionBody>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', borderBottom: '1px solid #dee2e6' }}>
                  {(() => {
                    const chaves = new Set();
                    if (Array.isArray(parametros)) {
                      parametros.forEach(param => {
                        if (param.chave_desserializada) {
                          Object.keys(param.chave_desserializada).forEach(chave => {
                            if (!chave.includes('novo_parametro_temp') && 
                                !chave.includes('temp_') && 
                                chave.trim() !== '' && 
                                chave !== 'novo_parametro_temp') {
                              chaves.add(chave);
                            }
                          });
                        }
                      });
                    }
                    return Array.from(chaves);
                  })().map(chave => (
                    <div key={chave} style={{ 
                      flex: 1,
                      padding: '8px 12px', 
                      fontWeight: '600',
                      background: 'white',
                      borderRadius: '6px',
                      border: '1px solid #e9ecef',
                      textAlign: 'center'
                    }}>
                      <span style={{ fontWeight: '600', color: '#495057' }}>
                        {chave}
                      </span>
                    </div>
                  ))}
                  

                  

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
                {Array.isArray(parametros) ? parametros.map(row => (
                  <div key={row.id} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    padding: '16px', 
                    borderBottom: '1px solid #f1f3f4'
                  }}>
                    {(() => {
                      const chaves = new Set();
                      if (Array.isArray(parametros)) {
                        parametros.forEach(param => {
                          if (param.chave_desserializada) {
                            Object.keys(param.chave_desserializada).forEach(chave => {
                              if (!chave.includes('novo_parametro_temp') && 
                                  !chave.includes('temp_') && 
                                  chave.trim() !== '' && 
                                  chave !== 'novo_parametro_temp') {
                                chaves.add(chave);
                              }
                            });
                          }
                        });
                      }
                      return Array.from(chaves);
                    })().map(chave => (
                      <div
                        key={`${row.id}-${chave}`}
                        style={{
                          flex: 1,
                          border: '2px solid #e9ecef',
                          borderRadius: '8px',
                          padding: '12px 16px',
                          fontSize: '14px',
                          background: '#f8f9fa',
                          color: '#495057',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        {row.chave_desserializada?.[chave] || ''}
                      </div>
                    ))}
                    

                  </div>
                )) : null}
              </SectionBody>
              
              <SectionBody>
                {Array.isArray(parametros) ? parametros.map(row => (
                  <Row key={row.id} columns="1fr">
                    <div
                      style={{
                        width: '100%',
                        border: '2px solid #e9ecef',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        fontSize: '14px',
                        background: '#f8f9fa',
                        color: '#495057',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      {row.valor || ''}
                    </div>
                  </Row>
                )) : null}
              </SectionBody>
            </TableBody>
            

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
            <GrAddCircle /> Criar Regra
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
            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                marginBottom: '20px',
                padding: '16px',
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                borderRadius: '12px',
                border: '1px solid #dee2e6'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FaSearch size={16} color="white" />
                </div>
                <div>
                  <h4 style={{ 
                    margin: '0 0 4px 0', 
                    fontSize: '18px', 
                    fontWeight: '600',
                    color: '#495057'
                  }}>
                    Resultados Encontrados
                  </h4>
                  <p style={{ 
                    margin: 0, 
                    fontSize: '14px', 
                    color: '#6c757d',
                    fontWeight: '500'
                  }}>
                    {searchResults.length} parâmetro{searchResults.length !== 1 ? 's' : ''} encontrado{searchResults.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              
              <div style={{ display: 'grid', gap: '16px' }}>
                {searchResults.map((parametro, index) => (
                  <div key={index} style={{
                    border: '1px solid #e9ecef',
                    borderRadius: '16px',
                    padding: '20px',
                    background: 'white',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {/* Header do resultado */}
                    <div style={{ 
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '16px',
                      paddingBottom: '16px',
                      borderBottom: '1px solid #f1f3f4'
                    }}>
                      <div>
                        <div style={{ 
                          fontSize: '18px', 
                          fontWeight: '800',
                          color: 'var(--primaria)',
                          marginBottom: '4px'
                        }}>
                          {parametro.valor}
                        </div>
                      </div>
                      <div style={{ 
                        textAlign: 'right'
                      }}>
                        <div style={{ 
                          fontSize: '14px', 
                          fontWeight: '600',
                          color: '#495057',
                          marginBottom: '2px'
                        }}>
                          {parametro.assunto}
                        </div>
                        <div style={{ 
                          fontSize: '12px', 
                          color: '#6c757d',
                          fontWeight: '500'
                        }}>
                          ID: {parametro.id}
                        </div>
                      </div>
                    </div>
                    
                                        {/* Chave Desserializada */}
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ 
                        fontSize: '14px', 
                        fontWeight: '600',
                        color: '#495057',
                        marginBottom: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <div style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: '#28a745'
                        }}></div>
                        Chave Desserializada
                      </div>
                      <div style={{
                        background: 'white',
                        border: '1px solid #e9ecef',
                        borderRadius: '8px',
                        overflow: 'hidden'
                      }}>
                        <table style={{
                          width: '100%',
                          borderCollapse: 'collapse',
                          fontSize: '13px'
                        }}>
                          <thead>
                            <tr style={{
                              background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                              borderBottom: '1px solid #dee2e6'
                            }}>
                              <th style={{
                                padding: '10px 12px',
                                textAlign: 'left',
                                fontWeight: '600',
                                color: '#495057',
                                fontSize: '12px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                              }}>
                                Chave
                              </th>
                              <th style={{
                                padding: '10px 12px',
                                textAlign: 'left',
                                fontWeight: '600',
                                color: '#495057',
                                fontSize: '12px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                              }}>
                                Valor
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(parametro.chave_desserializada || {}).map(([chave, valor], index) => (
                              <tr key={chave} style={{
                                borderBottom: index < Object.keys(parametro.chave_desserializada || {}).length - 1 ? '1px solid #f1f3f4' : 'none',
                                background: index % 2 === 0 ? 'white' : '#fafbfc'
                              }}>
                                <td style={{
                                  padding: '10px 12px',
                                  fontWeight: '600',
                                  color: '#495057',
                                  fontSize: '13px',
                                  borderRight: '1px solid #f1f3f4'
                                }}>
                                  {chave}
                                </td>
                                <td style={{
                                  padding: '10px 12px',
                                  color: '#6c757d',
                                  fontSize: '13px',
                                  fontFamily: 'monospace'
                                }}>
                                  {valor}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    {/* Chave Original */}
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ 
                        fontSize: '14px', 
                        fontWeight: '600',
                        color: '#495057',
                        marginBottom: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <div style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: '#6c757d'
                        }}></div>
                        Chave Original
                      </div>
                      <div style={{
                        background: '#f8f9fa',
                        border: '1px solid #e9ecef',
                        borderRadius: '8px',
                        padding: '12px',
                        fontSize: '13px',
                        fontFamily: 'monospace',
                        color: '#495057',
                        wordBreak: 'break-all'
                      }}>
                        {parametro.chave_original}
                      </div>
                    </div>
                    
                    
                  </div>
                ))}
              </div>
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
            size="medium"
            aoClicar={() => setShowEditModal(false)}
          >
            Cancelar
          </Botao>
          <Botao
            size="medium"
            aoClicar={salvarEdicao}
            loading={savingEdit}
          >
            <FaSave /> Salvar Alterações
          </Botao>
        </div>
      </Dialog>

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
                Excluir Regra
              </h3>
              <p style={{ 
                fontSize: '14px', 
                color: '#6c757d',
                margin: 0,
                lineHeight: '1.5'
              }}>
                Tem certeza que deseja excluir a regra <strong>"{regraToDelete}"</strong>?
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
                  Esta ação irá excluir permanentemente a regra e todos os seus parâmetros. 
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
            aoClicar={confirmarExclusaoRegra}
            style={{
              background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
              border: 'none',
              color: 'white'
            }}
          >
            <FaTrash /> Excluir Regra
          </Botao>
        </div>
      </Dialog>
    </MetadadosContainer>
  );
}

export default Metadados;

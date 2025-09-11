import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { Checkbox } from 'primereact/checkbox';
import { FaPlus, FaSave, FaTrash, FaPlusCircle, FaSearch, FaPen, FaKey, FaUser, FaGlobe, FaCog, FaInfo, FaShieldAlt } from 'react-icons/fa';
import { RiUpload2Fill } from 'react-icons/ri';
import { HiX } from 'react-icons/hi';
import { GrAddCircle } from 'react-icons/gr';
import http from '@http';
import styled from 'styled-components';
import Management from '@assets/Management.svg'
import Botao from '@components/Botao';
import BotaoGrupo from '@components/BotaoGrupo';
import DropdownItens from '@components/DropdownItens';
import CampoTexto from '@components/CampoTexto';
import DataTableCredenciais from '@components/DataTableCredenciais';
import Loading from '@components/Loading';
import ModalDetalhesCredencial from '@components/ModalDetalhesCredencial';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import imageCompression from 'browser-image-compression';

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`;

const ContainerSemRegistro = styled.div`
    display: flex;
    padding: 96px 12px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 48px;
    width: 100%;
    text-align: center;
    & p {
        margin: 0 auto;
    }

    & h6 {
        width: 60%;
    }
`;

const AlertaAviso = styled.div`
    background: #fffbeb;
    color: #664d03;
    border-left: 4px solid #ffc107;
    border-radius: 4px;
    padding: 16px;
    font-size: 14px;
    margin-top: 24px;
    display: flex;
    align-items: center;
    gap: 12px;
`;

const AlertaInfo = styled.div`
    background: #e8f0fe;
    color: #1a73e8;
    border-left: 4px solid #1a73e8;
    border-radius: 4px;
    padding: 16px;
    font-size: 14px;
    margin-top: 24px;
    display: flex;
    align-items: center;
    gap: 12px;
`;

const AlertaOAuth = styled.div`
    background: #fff5f5;
    color: #dc3545;
    border-left: 4px solid #dc3545;
    border-radius: 4px;
    padding: 16px;
    font-size: 14px;
    margin-top: 24px;
    display: flex;
    align-items: center;
    gap: 12px;
`;

const ImageUploadContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    margin: 0;
    padding-top: 20px;
    padding-bottom: 20px;
`;

const UploadArea = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: ${props => props.$width || '120px'};
    height: ${props => props.$height || '120px'};
    border: 2px dashed var(--primaria);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    background-color: ${props => props.$hasImage ? 'transparent' : 'var(--neutro-50)'};
    overflow: hidden;
    &:hover {
        border-color: var(--primaria-escuro);
        background-color: var(--neutro-100);
    }
`;

const UploadPreview = styled.img`
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
`;

const UploadIcon = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    color: var(--primaria);
    & svg {
        font-size: 32px;
        margin-bottom: 8px;
    }
`;

const UploadText = styled.span`
    text-align: center;
    color: var(--neutro-600);
    padding: 0 8px;
    font-size: 12px;
`;

const ImageContainer = styled.div`
    position: relative;
    width: ${props => props.$width || '120px'};
    height: ${props => props.$height || '120px'};
    background-color: var(--neutro-200);
    border: 1px dashed var(--primaria);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .hover-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        opacity: 0;
        transition: opacity 0.3s ease;
        border-radius: 8px;
    }
    
    &:hover .hover-overlay {
        opacity: 1;
    }
`;

const HoverIconButton = styled.button`
    background: rgba(0, 0, 0, 0.7);
    color: white;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(4px);

    svg {
        font-size: 20px;
    }

    svg * {
        fill: #e2e8f0;
        transition: fill 0.2s ease-in-out;
    }

    &:hover {
        transform: scale(1.1);
        background: rgba(0, 0, 0, 0.9);
    }

    &:hover svg * {
        fill: white;
    }
`;

const RemoveButton = styled.button`
    background: transparent;
    border: none;
    color: var(--neutro-500);
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    border-radius: 4px;
    margin-top: 8px;
    transition: all 0.2s ease;

    &:hover {
        color: #ef4444;
        background: #fef2f2;
    }
`;


function Credenciais() {
  const [credenciais, setCredenciais] = useState(null);
  const [selectedCredencial, setSelectedCredencial] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [credencialToDelete, setCredencialToDelete] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCredencialForDetails, setSelectedCredencialForDetails] = useState(null);
  
  // Estados para o DataTable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [first, setFirst] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [filters, setFilters] = useState({});

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
  const [editingCredential, setEditingCredential] = useState(null);
  const [tiposAuthLoaded, setTiposAuthLoaded] = useState(false);

  // Estados para upload de imagem (seguindo padrão do sistema.jsx)
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageSrc, setImageSrc] = useState('');
  const [imageRef, setImageRef] = useState(null);
  
  // Estados para modal de logo
  const [showLogoModal, setShowLogoModal] = useState(false);
  const [showLogoPreview, setShowLogoPreview] = useState(false);
  const [croppedLogoSrc, setCroppedLogoSrc] = useState('');
  const [isLogoCropped, setIsLogoCropped] = useState(false);
  const [hasLogoCropChanged, setHasLogoCropChanged] = useState(false);
  const [showLogoCropSelection, setShowLogoCropSelection] = useState(false);
  const [logoCrop, setLogoCrop] = useState({
    unit: '%',
    width: 50,
    height: 50,
    x: 25,
    y: 25,
  });

  // Estados para configuração de logo
  const [logoConfig, setLogoConfig] = useState({
    format: 'png',
    quality: 0.9,
    maxSize: 1024,
    preserveTransparency: true
  });

  const toast = React.useRef();

  // Carregar lista de credenciais
  const loadData = async (currentPage = 1, currentPageSize = 10, search = '', sort = '', currentFilters = {}) => {
    try {
      setLoading(true);
      
      // Buscar tipos de autenticação apenas na primeira carga
      if (!tiposAuthLoaded) {
        try {
          const responseTiposAuth = await http.get('/integracao-tenant/credenciais-externas/tipos-autenticacao/');
          console.log('Resposta do endpoint tipos-autenticacao:', responseTiposAuth);
          setTiposAuthLoaded(true);
        } catch (error) {
          console.warn('Erro ao buscar tipos de autenticação:', error);
        }
      }
      
      // Construir URL com parâmetros
      let url = `/integracao-tenant/credenciais-externas/?page=${currentPage}&page_size=${currentPageSize}`;
      
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }
      
      if (sort) {
        url += `&ordering=${sort}`;
      }
      
      // Buscar credenciais externas
      const responseCredenciais = await http.get(url);
      
      // Se temos credenciais, buscar os campos de cada uma
      if (responseCredenciais && responseCredenciais.results && Array.isArray(responseCredenciais.results)) {
        const credenciaisComCampos = [];
        
        // Buscar campos para todas as credenciais de uma vez
        const camposPromises = responseCredenciais.results.map(async (credencial) => {
          try {
            const responseCampos = await http.get(`/integracao-tenant/credenciais-externas-campos/?credencial=${credencial.id}`);
            return {
              credencialId: credencial.id,
              campos: responseCampos || []
            };
          } catch (camposError) {
            console.warn(`Erro ao buscar campos para credencial ${credencial.id}:`, camposError);
            return {
              credencialId: credencial.id,
              campos: []
            };
          }
        });
        
        const camposResults = await Promise.all(camposPromises);
        
        // Mapear credenciais com seus campos
        responseCredenciais.results.forEach(credencial => {
          const camposResult = camposResults.find(cr => cr.credencialId === credencial.id);
          credenciaisComCampos.push({
            ...credencial,
            campos_adicionais: camposResult ? camposResult.campos : []
          });
        });
        
        setCredenciais(credenciaisComCampos);
        setTotalRecords(responseCredenciais.count || 0);
        setTotalPages(responseCredenciais.total_pages || 0);
        
        // Selecionar automaticamente a primeira credencial se houver
        if (credenciaisComCampos.length > 0 && !selectedCredencial) {
          setSelectedCredencial(credenciaisComCampos[0]);
        }
      } else {
        setCredenciais([]);
        setTotalRecords(0);
        setTotalPages(0);
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

  useEffect(() => {
    loadData(page, pageSize, searchTerm, getSortParam(), filters);
  }, []);

  // Funções para o DataTable
  const onPage = (event) => {
    const newPage = event.page + 1;
    const newPageSize = event.rows;
    
    setFirst(event.first);
    setPage(newPage);
    setPageSize(newPageSize);
    
    loadData(newPage, newPageSize, searchTerm, getSortParam(), filters);
  };

  const onSearch = (search) => {
    setSearchTerm(search);
    setPage(1);
    setFirst(0);
    loadData(1, pageSize, search, getSortParam(), filters);
  };

  const getSortParam = () => {
    if (!sortField) return '';
    return `${sortOrder === 'desc' ? '-' : ''}${sortField}`;
  };

  const onSort = ({ field, order }) => {
    setSortField(field);
    setSortOrder(order);
    loadData(page, pageSize, searchTerm, `${order === 'desc' ? '-' : ''}${field}`, filters);
  };
  
  const onFilter = (event) => {
    console.log("Filtro aplicado:", event.filters);
    const newFilters = { ...event.filters };
    setFilters(newFilters);
    setPage(1);
    setFirst(0);
    loadData(1, pageSize, searchTerm, getSortParam(), newFilters);
  };

  const handleEdit = (credencial) => {
    // Definir que estamos editando
    setEditingCredential(credencial);
    
    console.log('🔍 Debug - Editando credencial:', {
      nome: credencial.nome_sistema,
      logo: credencial.logo ? `Logo presente com ${credencial.logo.length} caracteres` : 'Logo não encontrada'
    });
    
    // Preencher o modal com os dados da credencial selecionada
    setNewCredential({
      nome_sistema: credencial.nome_sistema || '',
      descricao: credencial.descricao || '',
      logo: credencial.logo || null,
      url_endpoint: credencial.url_endpoint || '',
      tipo_autenticacao: credencial.tipo_autenticacao || 'api_key',
      usuario: credencial.usuario || '',
      senha: credencial.senha || '',
      api_key: credencial.api_key || '',
      bearer_token: credencial.bearer_token || '',
      client_id: credencial.client_id || '',
      client_secret: credencial.client_secret || '',
      timeout: credencial.timeout || 30,
      headers_adicionais: credencial.headers_adicionais ? JSON.stringify(credencial.headers_adicionais, null, 2) : '{}',
      ativo: credencial.ativo !== undefined ? credencial.ativo : true,
      observacoes: credencial.observacoes || ''
    });

    // Preencher campos adicionais se existirem
    if (credencial.campos_adicionais && credencial.campos_adicionais.length > 0) {
      setAdditionalFields(credencial.campos_adicionais.map(campo => ({
        id: campo.id || Date.now(),
        chave: campo.chave || '',
        valor: campo.valor || '',
        tipo_campo: campo.tipo_campo || 'texto',
        obrigatório: campo.obrigatório || false,
        sensivel: campo.sensivel || false
      })));
    } else {
      setAdditionalFields([]);
    }

    // Abrir modal na primeira aba
    setActiveTab(0);
    setShowCreateCredentialModal(true);
  };

  const handleDelete = (credencial) => {
    setCredencialToDelete(credencial);
    setShowDeleteConfirmModal(true);
  };

  const handleViewDetails = (credencial) => {
    setSelectedCredencialForDetails(credencial);
    setShowDetailsModal(true);
  };

  const handleCloseDetails = () => {
    setShowDetailsModal(false);
    setSelectedCredencialForDetails(null);
  };

  // Funções para manipulação de imagem (seguindo padrão do sistema.jsx)
  const compressImage = async (file) => {
    try {
      console.log('Iniciando compressão da imagem:', {
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified
      });
      
      const options = { 
        maxSizeMB: 1, 
        maxWidthOrHeight: logoConfig.maxSize, 
        useWebWorker: true, 
        fileType: `image/${logoConfig.format}`, 
        quality: logoConfig.quality,
        preserveExif: false
      };
      
      console.log('Opções de compressão:', options);
      
      const compressedFile = await imageCompression(file, options);
      
      console.log('Imagem comprimida com sucesso:', {
        name: compressedFile.name,
        type: compressedFile.type,
        size: compressedFile.size,
        originalSize: file.size,
        reduction: ((1 - compressedFile.size / file.size) * 100).toFixed(1) + '%'
      });
      
      // Criar arquivo com o formato desejado
      const finalFile = new File([compressedFile], `logo.${logoConfig.format}`, { 
        type: `image/${logoConfig.format}`, 
        lastModified: Date.now() 
      });
      
      console.log('Arquivo final criado:', {
        name: finalFile.name,
        type: finalFile.type,
        size: finalFile.size
      });
      
      return finalFile;
    } catch (error) {
      console.error('Erro ao compactar imagem:', error);
      toast.current.show({ 
        severity: 'warn', 
        summary: 'Aviso', 
        detail: 'Não foi possível comprimir a imagem. Usando arquivo original.', 
        life: 3000 
      });
      return file;
    }
  };

  const handleImageUpload = (e) => {
    console.log('🖼️ handleImageUpload chamado!', e);
    console.log('🔍 Target:', e.target);
    console.log('🔍 Files:', e.target.files);
    
    // Prevenir comportamento padrão do formulário
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const file = e.target.files?.[0];
      if (!file) {
        console.log('Nenhum arquivo selecionado');
        return;
      }
      
      if (!file.type.match('image.*')) {
        toast.current.show({ 
          severity: 'error', 
          summary: 'Erro', 
          detail: 'Por favor, selecione um arquivo de imagem válido.', 
          life: 3000 
        });
        return;
      }
      
      console.log('Arquivo selecionado:', file.name, file.type, file.size);
      
      console.log('📁 Arquivo selecionado, atualizando estado...');
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        console.log('📖 Arquivo lido, atualizando estados...');
        setImageSrc(reader.result);
        setLogoCrop({ unit: '%', width: 50, height: 50, x: 25, y: 25 });
        setShowCropModal(true);
        setShowLogoCropSelection(false);
        setIsLogoCropped(false);
        setCroppedLogoSrc('');
        setHasLogoCropChanged(false);
        console.log('✅ Estados atualizados, modal deve aparecer');
      };
      reader.onerror = () => {
        console.error('Erro ao ler arquivo');
        toast.current.show({ 
          severity: 'error', 
          summary: 'Erro', 
          detail: 'Erro ao ler o arquivo de imagem.', 
          life: 3000 
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Erro no handleImageUpload:', error);
      toast.current.show({ 
        severity: 'error', 
        summary: 'Erro', 
        detail: 'Erro ao processar a imagem. Tente novamente.', 
        life: 3000 
      });
    }
  };

  const handleLogoCropChange = (crop, percentCrop) => {
    setLogoCrop(percentCrop);
    setHasLogoCropChanged(true);
  };

  const handleLogoCropComplete = (crop, percentCrop) => {
    setLogoCrop(percentCrop);
  };

  const applyLogoCrop = async () => {
    if (!hasLogoCropChanged) {
      toast.current.show({ 
        severity: 'info', 
        summary: 'Aviso', 
        detail: 'Mova ou redimensione a seleção para aplicar o corte.', 
        life: 3000 
      });
      return;
    }

    if (!imageRef || !logoCrop.width || !logoCrop.height) {
      return;
    }

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Calcular dimensões reais da imagem
      const naturalWidth = imageRef.naturalWidth;
      const naturalHeight = imageRef.naturalHeight;
      const displayWidth = imageRef.offsetWidth;
      const displayHeight = imageRef.offsetHeight;
      
      // Calcular escala
      const scaleX = naturalWidth / displayWidth;
      const scaleY = naturalHeight / displayHeight;
      
      // Calcular dimensões do crop em pixels reais
      const cropWidth = Math.round(logoCrop.width * scaleX);
      const cropHeight = Math.round(logoCrop.height * scaleY);
      const cropX = Math.round(logoCrop.x * scaleX);
      const cropY = Math.round(logoCrop.y * scaleY);
      
      // Configurar canvas
      canvas.width = cropWidth;
      canvas.height = cropHeight;
      
      // Desenhar a área cortada
      ctx.drawImage(
        imageRef, 
        cropX, cropY, cropWidth, cropHeight, 
        0, 0, cropWidth, cropHeight
      );
      
      canvas.toBlob((blob) => {
        if (blob) {
          setCroppedLogoSrc(URL.createObjectURL(blob));
          setIsLogoCropped(true);
          setShowLogoCropSelection(false);
        }
      }, selectedFile.type, logoConfig.quality);
      
    } catch (erro) {
      console.error("Erro ao aplicar corte:", erro);
      toast.current.show({ 
        severity: 'error', 
        summary: 'Erro', 
        detail: 'Erro ao aplicar o corte. Tente novamente.', 
        life: 3000 
      });
    }
  };

  const handleRemoveLogo = () => {
    try {
      console.log('🔄 Removendo logo...');
      setNewCredential(prev => ({ ...prev, logo: null }));
      
      if (fileInputRef.current) fileInputRef.current.value = '';
      toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Logo removida com sucesso!' });
      console.log('✅ Logo removida com sucesso');
    } catch (error) {
      console.error('❌ Erro ao remover logo:', error);
      toast.current.show({ 
        severity: 'error', 
        summary: 'Erro', 
        detail: 'Erro ao remover logo: ' + error.message 
      });
    }
  };

  const handleCropImage = async () => {
    try {
      if (!imageRef || !logoCrop.width || !logoCrop.height) {
        console.log('Dados de corte inválidos:', { imageRef: !!imageRef, logoCrop });
        toast.current.show({ 
          severity: 'error', 
          summary: 'Erro', 
          detail: 'Dados de corte inválidos. Tente novamente.', 
          life: 3000 
        });
        return;
      }
      
      setUploading(true);
      console.log('Iniciando processamento da logo...');

      let fileToProcess;
      
      if (isLogoCropped && croppedLogoSrc) {
        // Usar imagem cortada
        const response = await fetch(croppedLogoSrc);
        const blob = await response.blob();
        fileToProcess = new File([blob], `logo.${logoConfig.format}`, { type: `image/${logoConfig.format}` });
      } else {
        // Usar imagem original
        fileToProcess = selectedFile;
      }
      
      const compressedFile = await compressImage(fileToProcess);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        try {
          console.log('🔄 Atualizando logo após processamento...');
          const dataUrl = reader.result;
          console.log('Data URL criado, tamanho:', dataUrl.length);
          
          // Atualizar logo na credencial
          setNewCredential(prev => ({ ...prev, logo: dataUrl }));
          
          toast.current.show({ 
            severity: 'success', 
            summary: 'Sucesso', 
            detail: `Logo salva em formato ${logoConfig.format.toUpperCase()} com sucesso!` 
          });
          handleCancelCrop();
          console.log('✅ Logo atualizada com sucesso');
        } catch (error) {
          console.error('❌ Erro ao atualizar logo:', error);
          toast.current.show({ 
            severity: 'error', 
            summary: 'Erro', 
            detail: 'Erro ao atualizar logo: ' + error.message 
          });
        }
      };
      reader.onerror = () => {
        console.error('Erro ao ler arquivo comprimido');
        toast.current.show({ 
          severity: 'error', 
          summary: 'Erro', 
          detail: 'Erro ao processar a imagem.', 
          life: 3000 
        });
      };
      reader.readAsDataURL(compressedFile);
      
    } catch (error) {
      console.error('Erro no handleCropImage:', error);
      toast.current.show({ 
        severity: 'error', 
        summary: 'Erro', 
        detail: 'Erro ao processar a imagem. Tente novamente.', 
        life: 3000 
      });
    } finally {
      setUploading(false);
    }
  };

  const handleCancelCrop = () => {
    console.log('Cancelando modal de corte...');
    setShowCropModal(false);
    setImageSrc('');
    setSelectedFile(null);
    setLogoCrop({ unit: '%', width: 50, height: 50, x: 25, y: 25 });
    setIsLogoCropped(false);
    setCroppedLogoSrc('');
    setHasLogoCropChanged(false);
    setShowLogoCropSelection(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    console.log('Modal de corte fechado e estado limpo');
  };

  // Iniciar criação de nova credencial
  const iniciarCriacaoCredencial = () => {
    // Limpar estado de edição
    setEditingCredential(null);
    
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

    // Salvar nova credencial ou atualizar existente
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

      // Função para converter data URL em File
      const dataURLtoFile = (dataurl, filename) => {
        if (!dataurl || !dataurl.startsWith('data:')) return null;
        
        const arr = dataurl.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        
        while(n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        
        return new File([u8arr], filename, { type: mime });
      };

      // Verificar se há logo para enviar
      const hasLogo = newCredential.logo && newCredential.logo.startsWith('data:');
      let logoFile = null;
      
      if (hasLogo) {
        logoFile = dataURLtoFile(newCredential.logo, 'logo.png');
        console.log('🔍 Debug - Logo convertido para arquivo:', {
          name: logoFile?.name,
          type: logoFile?.type,
          size: logoFile?.size
        });
      }

      // Preparar dados da credencial
      let requestData;
      let isFormData = false;

      if (hasLogo && logoFile) {
        // Usar FormData quando há logo
        isFormData = true;
        requestData = new FormData();
        
        // Adicionar campos básicos
        requestData.append('nome_sistema', newCredential.nome_sistema);
        requestData.append('descricao', newCredential.descricao || '');
        requestData.append('logo', logoFile);
        requestData.append('url_endpoint', newCredential.url_endpoint);
        requestData.append('tipo_autenticacao', newCredential.tipo_autenticacao);
        requestData.append('timeout', newCredential.timeout);
        requestData.append('ativo', newCredential.ativo);
        requestData.append('observacoes', newCredential.observacoes || '');

        // Adicionar campos específicos por tipo de autenticação
        switch (newCredential.tipo_autenticacao) {
          case 'basic':
            requestData.append('usuario', newCredential.usuario);
            requestData.append('senha', newCredential.senha);
            break;
          case 'api_key':
            requestData.append('api_key', newCredential.api_key);
            break;
          case 'bearer':
            requestData.append('bearer_token', newCredential.bearer_token);
            break;
          case 'oauth':
            requestData.append('client_id', newCredential.client_id);
            requestData.append('client_secret', newCredential.client_secret);
            break;
        }

        // Adicionar headers adicionais se não estiver vazio
        try {
          const headers = JSON.parse(newCredential.headers_adicionais);
          if (Object.keys(headers).length > 0) {
            requestData.append('headers_adicionais', JSON.stringify(headers));
          }
        } catch (e) {
          // Se não for JSON válido, ignorar
        }

        console.log('🔍 Debug - Enviando FormData com logo');
      } else {
        // Usar JSON quando não há logo
        requestData = {
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
            requestData.usuario = newCredential.usuario;
            requestData.senha = newCredential.senha;
            break;
          case 'api_key':
            requestData.api_key = newCredential.api_key;
            break;
          case 'bearer':
            requestData.bearer_token = newCredential.bearer_token;
            break;
          case 'oauth':
            requestData.client_id = newCredential.client_id;
            requestData.client_secret = newCredential.client_secret;
            break;
        }

        // Adicionar headers adicionais se não estiver vazio
        try {
          const headers = JSON.parse(newCredential.headers_adicionais);
          if (Object.keys(headers).length > 0) {
            requestData.headers_adicionais = headers;
          }
        } catch (e) {
          // Se não for JSON válido, ignorar
        }

        console.log('🔍 Debug - Enviando JSON sem logo');
      }

      console.log('🔍 Debug - Dados a serem enviados:', {
        isFormData,
        hasLogo,
        logoFileSize: logoFile?.size || 'N/A'
      });

      let response;
      
      if (editingCredential) {
        // Atualizar credencial existente
        response = await http.put(`/integracao-tenant/credenciais-externas/${editingCredential.id}/`, requestData);
        
        // Excluir campos adicionais existentes
        if (editingCredential.campos_adicionais && editingCredential.campos_adicionais.length > 0) {
          for (const campo of editingCredential.campos_adicionais) {
            await http.delete(`/integracao-tenant/credenciais-externas-campos/${campo.id}/`);
          }
        }
        
        // Criar novos campos adicionais
        if (additionalFields.length > 0) {
          for (const field of additionalFields) {
            await http.post('/integracao-tenant/credenciais-externas-campos/', {
              credencial: editingCredential.id,
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
          detail: 'Credencial atualizada com sucesso!',
          life: 3000
        });
      } else {
        // Criar nova credencial
        response = await http.post('/integracao-tenant/credenciais-externas/', requestData);
        
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
      }

      // Fechar modal e recarregar lista
      setShowCreateCredentialModal(false);
      setEditingCredential(null);
      
      // Recarregar credenciais
      loadData(page, pageSize, searchTerm, getSortParam(), filters);

    } catch (error) {
      console.error('Erro ao salvar credencial:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Erro',
        detail: editingCredential ? 'Erro ao atualizar credencial' : 'Erro ao criar credencial',
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
      loadData(page, pageSize, searchTerm, getSortParam(), filters);

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
    <>
      <Toast ref={toast} />
      <Loading opened={loading} />
      
      {
        credenciais ?
        <ConteudoFrame>
          <DataTableCredenciais 
            credenciais={credenciais} 
            paginator={true} 
            rows={pageSize} 
            totalRecords={totalRecords} 
            totalPages={totalPages}
            first={first} 
            onPage={onPage}
            onSearch={onSearch}
            onSort={onSort}
            sortField={sortField}
            sortOrder={sortOrder}
            onFilter={onFilter}
            filters={filters}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewDetails={handleViewDetails}
            onNewCredential={iniciarCriacaoCredencial}
          />
        </ConteudoFrame>
        :
        <ContainerSemRegistro>
          <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <img src={Management} />
            <h6>Não há credenciais registradas</h6>
            <p>Aqui você verá todas as credenciais externas registradas.</p>
          </section>
        </ContainerSemRegistro>
      }

      {/* Modal de Confirmação de Exclusão */}
      <Dialog
        header="Confirmar Exclusão"
        visible={showDeleteConfirmModal}
        onHide={() => {
          setShowDeleteConfirmModal(false);
          setCredencialToDelete(null);
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
              setCredencialToDelete(null);
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
            {editingCredential ? 'Editar Credencial Externa' : 'Adicionar Credencial Externa'}
          </div>
        }
        visible={showCreateCredentialModal}
        onHide={() => {
          setShowCreateCredentialModal(false);
          setEditingCredential(null);
        }}
        style={{ width: '90vw', maxWidth: '1200px', zIndex: 1000 }}
        modal
        closeOnEscape
        closable
        footer={
          <div style={{ 
            display: 'flex', 
            justifyContent: 'end', 
            alignItems: 'center',
            padding: '16px 0'
          }}>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <Botao
                size="medium"
                aoClicar={() => {
                  setShowCreateCredentialModal(false);
                  setEditingCredential(null);
                }}
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
                  size="medium"
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
                  size="medium"
                  aoClicar={saveNewCredential}
                  loading={savingCredential}
                  style={{
                    background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                    border: 'none',
                    color: 'white'
                  }}
                >
                  <FaSave size={editingCredential ? 26 : 16}/> {editingCredential ? 'Atualizar' : 'Salvar'}
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
            alignItems: 'center',
            marginBottom: '24px',
            padding: '0 20px'
          }}>
            {[
              { icon: FaInfo, label: 'Informações Básicas' },
              { icon: FaGlobe, label: 'Configuração de Conexão' },
              { icon: FaKey, label: 'Credenciais' },
              { icon: FaShieldAlt, label: 'OAuth 2.0' },
              { icon: FaCog, label: 'Configurações Avançadas' },
              { icon: FaPlus, label: 'Campos Adicionais' }
            ].map((tab, index) => (
              <React.Fragment key={index}>
                <div
                  onClick={() => setActiveTab(index)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    flex: 1
                  }}
                >
                  {/* Círculo com ícone */}
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: activeTab === index ? 'var(--primaria)' : '#ffffff',
                    border: `2px solid ${activeTab === index ? 'var(--primaria)' : '#e9ecef'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '8px',
                    transition: 'all 0.3s ease'
                  }}>
                    <tab.icon 
                      size={18} 
                    />
                  </div>
                  
                  {/* Label */}
                  <span style={{
                    fontSize: '11px',
                    fontWeight: activeTab === index ? '600' : '500',
                    textAlign: 'center',
                    lineHeight: '1.2'
                  }}>
                    {tab.label}
                  </span>
                </div>
                
                {/* Linha conectora */}
                {index < 5 && (
                  <div style={{
                    flex: '0 0 20px',
                    height: '2px',
                    background: activeTab > index ? 'var(--primaria)' : '#e9ecef',
                    margin: '0 8px',
                    marginTop: '20px',
                    transition: 'all 0.3s ease'
                  }} />
                )}
              </React.Fragment>
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
                  <ImageUploadContainer style={{ flexDirection: 'row', gap: 32 }}>
                    {/* Logo */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        id="credencial-logo-upload"
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.stopPropagation()}
                      />
                      {newCredential.logo ? (
                        <>
                          <ImageContainer $width="180px" $height="80px">
                            <UploadPreview 
                              src={newCredential.logo} 
                              alt="Logo da credencial" 
                              style={{ cursor: 'pointer' }}
                              onClick={() => setShowLogoModal(true)}
                            />
                            <div className="hover-overlay">
                              <HoverIconButton 
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  fileInputRef.current.click();
                                }}
                              >
                                <RiUpload2Fill />
                              </HoverIconButton>
                            </div>
                          </ImageContainer>
                          <RemoveButton onClick={handleRemoveLogo}><HiX size={12} /> Remover</RemoveButton>
                        </>
                      ) : (
                        <UploadArea 
                          $width="180px" 
                          $height="80px"
                          onClick={() => {
                            console.log('🖱️ UploadArea clicado!');
                            console.log('🔍 fileInputRef.current:', fileInputRef.current);
                            if (fileInputRef.current) {
                              console.log('🔄 Acionando click no input...');
                              fileInputRef.current.click();
                            } else {
                              console.error('❌ fileInputRef.current é null!');
                            }
                          }}
                        >
                          <UploadIcon>
                            <RiUpload2Fill size={'28px'} />
                            <UploadText>Clique para adicionar uma logo</UploadText>
                          </UploadIcon>
                        </UploadArea>
                      )}
                    </div>
                  </ImageUploadContainer>
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
                <AlertaInfo>
                  <FaInfo size={20} style={{ color: '#1a73e8', flexShrink: 0 }}/>
                  <span>
                    Preencha apenas os campos necessários para o tipo de autenticação selecionado
                  </span>
                </AlertaInfo>

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
                <AlertaOAuth>
                  <FaShieldAlt size={20} style={{ color: '#dc3545', flexShrink: 0 }}/>
                  <span>
                    Campos específicos para autenticação OAuth 2.0
                  </span>
                </AlertaOAuth>

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
                <AlertaAviso>
                  <FaPlus size={20} style={{ color: '#ffc107', flexShrink: 0 }}/>
                  <span>
                    <strong>CAMPOS ADICIONAIS DE CREDENCIAIS</strong>
                  </span>
                </AlertaAviso>

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

      {/* Modal de Detalhes da Credencial */}
      <ModalDetalhesCredencial
        credencial={selectedCredencialForDetails}
        visible={showDetailsModal}
        onHide={handleCloseDetails}
        onEdit={(credencial) => {
          handleCloseDetails();
          handleEdit(credencial);
        }}
        onDelete={handleDelete}
      />

      {/* Modal de visualização da logo */}
      {showLogoModal && newCredential.logo && (
        <div 
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            backgroundColor: 'rgba(0, 0, 0, 0.8)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            zIndex: 9998,
            padding: '20px'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowLogoModal(false);
            }
          }}
        >
          <div style={{
            background: '#fff', 
            borderRadius: '12px', 
            maxWidth: '90vw', 
            maxHeight: '90vh', 
            width: '600px',
            display: 'flex', 
            flexDirection: 'column', 
            overflow: 'hidden'
          }}>
            {/* Header */}
            <div style={{
              padding: '16px 20px', 
              borderBottom: '1px solid #e5e7eb',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between'
            }}>
              <h3 style={{ margin: 0, color: '#374151', fontSize: '18px' }}>Logo da Credencial</h3>
              <button 
                onClick={() => setShowLogoModal(false)} 
                style={{
                  background: 'none', 
                  border: 'none', 
                  fontSize: '24px', 
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >×</button>
            </div>

            {/* Content */}
            <div style={{
              padding: '20px', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '20px'
            }}>
              <img 
                src={newCredential.logo} 
                alt="Logo da credencial" 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '400px', 
                  objectFit: 'contain',
                  borderRadius: '8px'
                }} 
              />
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <Botao 
                  estilo="vermilion" 
                  size="small"
                  aoClicar={() => {
                    setShowLogoModal(false);
                    fileInputRef.current.click();
                  }}
                >
                  <RiUpload2Fill /> Alterar Logo
                </Botao>
                <Botao 
                  estilo="neutro" 
                  size="small"
                  aoClicar={handleRemoveLogo}
                >
                  <HiX /> Remover Logo
                </Botao>
                <Botao 
                  estilo="neutro" 
                  size="small"
                  aoClicar={() => setShowLogoModal(false)}
                >
                  Fechar
                </Botao>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Corte */}
      {showCropModal && imageSrc && selectedFile && (
        <>
          <style>
            {`
              @keyframes modalSlideIn {
                from {
                  opacity: 0;
                  transform: scale(0.9) translateY(-20px);
                }
                to {
                  opacity: 1;
                  transform: scale(1) translateY(0);
                }
              }
              
              .modal-backdrop {
                animation: backdropFadeIn 0.3s ease-out;
              }
              
              @keyframes backdropFadeIn {
                from {
                  opacity: 0;
                }
                to {
                  opacity: 1;
                }
              }
            `}
          </style>
          <div 
            className="modal-backdrop"
            style={{ 
              position: 'fixed', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              backgroundColor: 'rgba(0, 0, 0, 0.4)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              zIndex: 9999,
              backdropFilter: 'blur(1px)',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{ 
              background: '#fff', 
              borderRadius: '16px', 
              maxWidth: '90vw', 
              width: '900px', 
              maxHeight: '90vh',
              display: 'flex', 
              flexDirection: 'column',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              animation: 'modalSlideIn 0.3s ease-out',
              transform: 'scale(1)',
              opacity: 1
            }}>
              {/* Header do Modal */}
              <div style={{ 
                padding: '20px 24px', 
                borderBottom: '1px solid #e5e7eb', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
                borderTopLeftRadius: '16px',
                borderTopRightRadius: '16px'
              }}>
                <h3 style={{ 
                  margin: 0, 
                  fontSize: '20px', 
                  fontWeight: '600',
                  color: '#1f2937'
                }}>
                  🖼️ Configurar Logo
                </h3>
                <button 
                  onClick={handleCancelCrop} 
                  style={{ 
                    background: 'rgba(239, 68, 68, 0.1)', 
                    border: '1px solid rgba(239, 68, 68, 0.2)', 
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    fontSize: '18px', 
                    cursor: 'pointer',
                    color: '#dc2626',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease'
                  }}
                >
                  ×
                </button>
              </div>
              
              {/* Conteúdo do Modal */}
              <div style={{ 
                padding: '24px', 
                display: 'flex', 
                gap: '24px',
                minHeight: '400px',
                maxHeight: '60vh',
                overflow: 'hidden'
              }}>
                {/* Imagem Original ou Cortada */}
                <div style={{
                  flex: showLogoCropSelection && !isLogoCropped ? 0.5 : 1,
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  background: '#f9fafb', 
                  borderRadius: '12px', 
                  padding: '20px', 
                  minHeight: '400px'
                }}>
                  {isLogoCropped ? (
                    <img src={croppedLogoSrc} alt="Logo Cortada" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  ) : (
                    <img ref={setImageRef} src={imageSrc} alt="Logo Original" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  )}
                </div>
                
                {/* Área de Seleção */}
                {showLogoCropSelection && !isLogoCropped && (
                  <div style={{
                    flex: 0.5, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    background: '#f0f9ff', 
                    borderRadius: '12px', 
                    padding: '20px', 
                    minHeight: '400px',
                    border: '2px dashed #0ea5e9'
                  }}>
                    <ReactCrop 
                      crop={logoCrop} 
                      onChange={handleLogoCropChange}
                      onComplete={handleLogoCropComplete}
                      minWidth={30}
                      minHeight={30}
                      keepSelection
                      ruleOfThirds
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%'
                      }}
                    >
                      <img 
                        src={imageSrc} 
                        alt="Para Cortar" 
                        style={{ 
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain',
                          borderRadius: '8px'
                        }}
                      />
                    </ReactCrop>
                  </div>
                )}

                {/* Controles */}
                <div style={{
                  width: '250px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}>
                  {!isLogoCropped ? (
                    <>
                      {!showLogoCropSelection ? (
                        <button
                          onClick={() => setShowLogoCropSelection(true)}
                          style={{ 
                            width: '100%', 
                            background: '#374151', 
                            border: 'none', 
                            borderRadius: '6px', 
                            padding: '12px', 
                            cursor: 'pointer', 
                            fontSize: '14px', 
                            color: '#fff', 
                            transition: 'all 0.2s ease' 
                          }}
                        >
                          ✂️ Cortar
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={applyLogoCrop}
                            disabled={!hasLogoCropChanged}
                            style={{ 
                              width: '100%', 
                              background: !hasLogoCropChanged ? '#9ca3af' : '#059669', 
                              border: 'none', 
                              borderRadius: '6px', 
                              padding: '12px', 
                              cursor: !hasLogoCropChanged ? 'not-allowed' : 'pointer', 
                              fontSize: '14px', 
                              color: '#fff', 
                              transition: 'all 0.2s ease' 
                            }}
                          >
                            ✅ Aplicar Corte
                          </button>
                          <button
                            onClick={() => setShowLogoCropSelection(false)}
                            style={{ 
                              width: '100%', 
                              background: '#f3f4f6', 
                              border: '1px solid #d1d5db', 
                              borderRadius: '6px', 
                              padding: '10px', 
                              cursor: 'pointer', 
                              fontSize: '14px', 
                              transition: 'all 0.2s ease' 
                            }}
                          >
                            🔄 Resetar Seleção
                          </button>
                        </>
                      )}
                      
                      {/* Instruções */}
                      <div style={{ 
                        background: '#f8fafc', 
                        border: '1px solid #e2e8f0', 
                        borderRadius: '8px', 
                        padding: '12px', 
                        fontSize: '13px', 
                        color: '#6b7280', 
                        lineHeight: '1.5' 
                      }}>
                        <strong style={{ color: '#374151' }}>Como usar:</strong><br/>
                        {!showLogoCropSelection ? 'Clique em "Cortar" para começar.' : 'Arraste para selecionar e clique em "Aplicar Corte".'}
                      </div>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => { 
                          setIsLogoCropped(false); 
                          setCroppedLogoSrc(''); 
                          setShowLogoCropSelection(true); 
                        }}
                        style={{ 
                          width: '100%', 
                          background: '#f3f4f6', 
                          border: '1px solid #d1d5db', 
                          borderRadius: '6px', 
                          padding: '10px', 
                          cursor: 'pointer', 
                          fontSize: '14px', 
                          transition: 'all 0.2s ease' 
                        }}
                      >
                        🔄 Voltar e Editar
                      </button>
                      <div style={{ 
                        background: '#f8fafc', 
                        border: '1px solid #e2e8f0', 
                        borderRadius: '8px', 
                        padding: '12px', 
                        fontSize: '13px', 
                        color: '#6b7280', 
                        lineHeight: '1.5' 
                      }}>
                        <strong style={{ color: '#374151' }}>Pronto!</strong><br/>
                        Clique em "Salvar" para finalizar ou volte para editar.
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              {/* Footer do Modal */}
              <div style={{ 
                padding: '20px 24px', 
                borderTop: '1px solid #e5e7eb', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                background: '#f9fafb',
                borderBottomLeftRadius: '16px',
                borderBottomRightRadius: '16px'
              }}>
                <div style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  fontStyle: 'italic'
                }}>
                  {uploading ? 'Processando logo...' : 'Configure sua logo como desejar'}
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <Botao 
                    estilo="neutro" 
                    aoClicar={handleCancelCrop}
                    size="small"
                  >
                    ❌ Cancelar
                  </Botao>
                  <Botao 
                    estilo="vermilion" 
                    aoClicar={handleCropImage} 
                    disabled={uploading || (showLogoCropSelection && !isLogoCropped)} 
                    size="small"
                  >
                    {uploading ? '⏳ Processando...' : (showLogoCropSelection && !isLogoCropped) ? 'Aplique ou cancele o corte' : (isLogoCropped ? 'Salvar Logo Cortada' : 'Salvar Logo Original')}
                  </Botao>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Credenciais;

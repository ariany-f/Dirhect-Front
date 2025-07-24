import { Link, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import BotaoVoltar from "@components/BotaoVoltar"
import BotaoGrupo from "@components/BotaoGrupo"
import BotaoSemBorda from "@components/BotaoSemBorda"
import Texto from "@components/Texto"
import Botao from "@components/Botao"
import Titulo from "@components/Titulo"
import Frame from "@components/Frame"
import BadgeGeral from "@components/BadgeGeral"
import FrameVertical from "@components/FrameVertical"
import ContainerHorizontal from "@components/ContainerHorizontal"
import Container from "@components/Container"
import styles from './Colaboradores.module.css'
import { Skeleton } from 'primereact/skeleton'
import { FaCopy, FaTrash, FaUserTimes } from 'react-icons/fa'
import { IoMdFemale, IoMdMale } from "react-icons/io";
import { Toast } from 'primereact/toast'
import http from '@http'
import { useEffect, useRef, useState } from 'react'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { addLocale } from 'primereact/api'
import { Tag } from 'primereact/tag';
import { useSessaoUsuarioContext } from '@contexts/SessaoUsuario';
import { RiFileCopy2Line, RiGasStationFill, RiShoppingCartFill, RiUpload2Fill } from 'react-icons/ri';
import { MdOutlineFastfood } from 'react-icons/md';
import { IoCopyOutline } from 'react-icons/io5';
import styled from 'styled-components';
import { BiFemale, BiMale } from 'react-icons/bi';
import { ArmazenadorToken } from '@utils';
import ModalDemissao from '@components/ModalDemissao';
import { TiUserDelete } from "react-icons/ti";
import { FaUser, FaIdCard, FaBirthdayCake, FaBuilding, FaBriefcase, FaUserTie } from 'react-icons/fa';
import { HiX } from 'react-icons/hi';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import imageCompression from 'browser-image-compression';


const Col12 = styled.div`
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    justify-content: space-between;
    
    @media screen and (max-width: 768px) {
        flex-direction: column;
        gap: 16px;
    }
`;

const Col6 = styled.div`
    display: flex;
    flex-direction: column;
    padding: 10px;
    flex: 1 1 calc(50% - 10px);
    gap: 8px;

    @media screen and (max-width: 768px) {
        flex: 1 1 100%;
        padding: 0;
    }
`;

const Col12Vertical = styled.div`
    display: flex;
    flex-direction: row;
    margin-top: 20px;
    flex-wrap: wrap;
    width: 100%;
    gap: 4px;
    justify-content: space-between;

    @media screen and (max-width: 768px) {
        flex-direction: column;
        margin-top: 16px;
        flex-direction: column-reverse;
    }
`;

const Col4Vertical = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1 1 calc(25% - 4px);
    max-width: calc(25% - 4px);
    gap: 12px;
    background: #fafbfc;
    border-radius: 16px;
    padding: 20px;
    border: 1px solid #f1f5f9;

    @media screen and (max-width: 768px) {
        flex: 1 1 100%;
        max-width: 100%;
        order: 2;
        padding: 16px;
    }
`;

const Col8Vertical = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1 1 calc(75% - 8px);
    max-width: calc(75% - 8px);
    gap: 16px;

    @media screen and (max-width: 768px) {
        flex: 1 1 100%;
        max-width: 100%;
        order: 1;
    }
`;

const BeneficiosContainer = styled(FrameVertical)`
    @media screen and (max-width: 768px) {
        flex-direction: row;
        flex-wrap: wrap;
        gap: 8px;
        justify-content: flex-start;

        & > div {
            flex: 1 1 calc(50% - 8px);
            min-width: calc(50% - 8px);
        }
    }

    @media screen and (max-width: 480px) {
        & > div {
            flex: 1 1 100%;
        }
    }
`;

const HeaderContainer = styled(Container)`
    @media screen and (max-width: 768px) {
        & h3 {
            font-size: 1.2rem;
        }
    }
`;

const InfoItem = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4px 0;
    border-bottom: 1px solid #f1f5f9;
    transition: all 0.2s ease;
    
    &:last-child {
        border-bottom: none;
    }
    
    &:hover {
        margin: 0 -12px;
        padding: 8px 12px;
        border-radius: 8px;
        border-bottom: 1px solid transparent;
    }
    
    &:hover:last-child {
        border-bottom: none;
    }
`;

const InfoLabel = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 500;
    color: #64748b;
    min-width: 80px;
`;

const InfoValue = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    justify-content: flex-end;
`;

const InfoText = styled.span`
    font-size: 14px;
    font-weight: 600;
    color: #1e293b;
    text-align: right;
`;

const CopyButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border: none;
    background: #f8fafc;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s ease;
    color: #64748b;
    opacity: 0.3;
    
    ${InfoItem}:hover & {
        opacity: 1;
    }
    
    &:hover {
        color: #fff;
        transform: scale(1.1);
    }
`;

const GenderIcon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    border-radius: 8px;
    color: white;
    margin-right: 8px;
`;

const SectionTitle = styled.h3`
    font-size: 20px;
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 20px 0;
    display: flex;
    align-items: center;
    gap: 12px;
`;

const CustomTag = styled.div`
    background: ${props => props.bg || '#f1f5f9'};
    color: ${props => props.color || '#475569'};
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    border: 2px solid ${props => props.border || 'transparent'};
    white-space: nowrap;
    max-width: 140px;
    overflow: hidden;
    text-overflow: ellipsis;
    text-transform: uppercase;
`;

const UploadArea = styled.label`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 160px;
    height: 150px;
    border: 2px dashed var(--primaria);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    background-color: var(--neutro-50);
    &:hover {
        border-color: var(--primaria-escuro);
        background-color: var(--neutro-100);
    }
`;

const UploadIcon = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    color: var(--primaria);
    & svg {
        font-size: 24px;
        margin-bottom: 4px;
    }
`;

const UploadText = styled.span`
    text-align: center;
    color: var(--neutro-600);
    padding: 0 8px;
    font-size: 10px;
`;

// Adiciona a animação do spinner
const GlobalStyle = styled.div`
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;

const ImageModal = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    animation: fadeIn 0.3s ease-out;
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;

const ImageModalContent = styled.div`
    position: relative;
    max-width: 90vw;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
`;

const ImageModalImage = styled.img`
    max-width: 100%;
    max-height: 80vh;
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
`;

const ImageModalButton = styled.button`
    background: rgba(255, 255, 255, 0.9);
    border: none;
    border-radius: 6px;
    padding: 8px 16px;
    color: #333;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.2s ease;
    
    &:hover {
        background: rgba(255, 255, 255, 1);
        transform: translateY(-1px);
    }
`;

const ImageActionButton = styled.button`
    background: ${props => props.variant === 'danger' ? '#ef4444' : 'var(--primaria)'};
    color: white;
    border: none;
    border-radius: 6px;
    padding: 8px 16px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.2s ease;
    margin: 0 4px;
    
    &:hover {
        background: ${props => props.variant === 'danger' ? '#dc2626' : 'var(--primaria-escuro)'};
        transform: translateY(-1px);
    }
    
    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none !important;
    }
`;

const ImageContainer = styled.div`
    position: relative;
    display: inline-block;
    
    .hover-button {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
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
        opacity: 0;
        transition: all 0.3s ease;
        backdrop-filter: blur(4px);
        
        svg {
            color: white !important;
        }

        svg * {
            fill: white !important;
        }
    }
    
    &:hover .hover-button {
        opacity: 1;
    }
    
    &:hover img {
        filter: brightness(0.7);
    }
`;

function ColaboradorDetalhes() {

    let { id } = useParams()
    const location = useLocation();
    const [colaborador, setColaborador] = useState(null)
    const [filial, setFilial] = useState(null)
    const [funcao, setFuncao] = useState(null)
    const [secao, setSecao] = useState(null)
    const [tipoFuncionario, setTipoFuncionario] = useState(null)
    const [tipoSituacao, setTipoSituacao] = useState(null)
    const [departamento, setDepartamento] = useState(null)
    const [centroCusto, setCentroCusto] = useState(null)
    const [modalDemissaoAberto, setModalDemissaoAberto] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [showCropModal, setShowCropModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [crop, setCrop] = useState({
        unit: '%',
        width: 50,
        height: 50,
        x: 25,
        y: 25,
        aspect: 1,
    });
    const [imageSrc, setImageSrc] = useState('');
    const [imageRef, setImageRef] = useState(null);
    const [croppedImageSrc, setCroppedImageSrc] = useState('');
    const [isCropped, setIsCropped] = useState(false);
    const [hasCropChanged, setHasCropChanged] = useState(false);
    const [showCropSelection, setShowCropSelection] = useState(false);
    const navegar = useNavigate()
    const toast = useRef(null)
    const fileInputRef = useRef(null)
    const modalFileInputRef = useRef(null);

    const {usuario} = useSessaoUsuarioContext()

    addLocale('pt', {
        accept: 'Sim',
        reject: 'Não'
    })

    // Função para verificar se uma aba é válida para o usuário
    const isAbaValida = (pathname) => {
        const abas = [
            { url: `/colaborador/detalhes/${id}`, permission: 'view_pedido' },
            { url: `/colaborador/detalhes/${id}/dados-contratuais`, permission: null },
            { url: `/colaborador/detalhes/${id}/dados-pessoais`, permission: null },
            { url: `/colaborador/detalhes/${id}/dependentes`, permission: 'view_dependente', useStartsWith: true },
            { url: `/colaborador/detalhes/${id}/ferias`, permission: 'view_ferias' },
            { url: `/colaborador/detalhes/${id}/ausencias`, permission: 'view_ausencia' },
            { url: `/colaborador/detalhes/${id}/ciclos`, permission: null, condition: () => usuario.tipo === 'cliente' || usuario.tipo === 'equipeFolhaPagamento' },
            { url: `/colaborador/detalhes/${id}/esocial`, permission: null, condition: () => usuario.tipo === 'cliente' || usuario.tipo === 'equipeFolhaPagamento' },
            { url: `/colaborador/detalhes/${id}/pedidos`, permission: null, condition: () => usuario.tipo === 'grupo_rh' || usuario.tipo === 'global' },
            { url: `/colaborador/detalhes/${id}/movimentos`, permission: null, condition: () => usuario.tipo === 'grupo_rh' || usuario.tipo === 'global' }
        ];

        const abaAtual = abas.find(aba => {
            if (aba.useStartsWith) {
                return pathname.startsWith(aba.url);
            }
            return pathname === aba.url;
        });
        
        if (!abaAtual) return false;

        const temPermissao = !abaAtual.permission || ArmazenadorToken.hasPermission(abaAtual.permission);
        const atendeCondicao = !abaAtual.condition || abaAtual.condition();
        
        return temPermissao && atendeCondicao;
    };

    // Função para obter a primeira aba disponível
    const getPrimeiraAbaDisponivel = () => {
        const abas = [
            { url: `/colaborador/detalhes/${id}`, permission: 'view_pedido' },
            { url: `/colaborador/detalhes/${id}/dados-contratuais`, permission: null },
            { url: `/colaborador/detalhes/${id}/dados-pessoais`, permission: null },
            { url: `/colaborador/detalhes/${id}/dependentes`, permission: 'view_dependente' },
            { url: `/colaborador/detalhes/${id}/ferias`, permission: 'view_ferias' },
            { url: `/colaborador/detalhes/${id}/ausencias`, permission: 'view_ausencia' },
            { url: `/colaborador/detalhes/${id}/ciclos`, permission: null, condition: () => usuario.tipo === 'cliente' || usuario.tipo === 'equipeFolhaPagamento' },
            { url: `/colaborador/detalhes/${id}/esocial`, permission: null, condition: () => usuario.tipo === 'cliente' || usuario.tipo === 'equipeFolhaPagamento' },
            { url: `/colaborador/detalhes/${id}/pedidos`, permission: null, condition: () => usuario.tipo === 'grupo_rh' || usuario.tipo === 'global' },
            { url: `/colaborador/detalhes/${id}/movimentos`, permission: null, condition: () => usuario.tipo === 'grupo_rh' || usuario.tipo === 'global' }
        ];

        for (const aba of abas) {
            const temPermissao = !aba.permission || ArmazenadorToken.hasPermission(aba.permission);
            const atendeCondicao = !aba.condition || aba.condition();
            
            if (temPermissao && atendeCondicao) {
                return aba.url;
            }
        }
        
        return `/colaborador/detalhes/${id}/dados-contratuais`; // Fallback
    };

    // Redirecionar para primeira aba disponível se estiver na rota base ou em uma aba inválida
    useEffect(() => {
        if (colaborador && !modalDemissaoAberto) { // Evitar redirecionamento durante modal
            // Se está na rota base, redireciona para primeira aba disponível
            if (location.pathname === `/colaborador/detalhes/${id}`) {
                const primeiraAba = getPrimeiraAbaDisponivel();
                if (primeiraAba !== location.pathname) {
                    navegar(primeiraAba, { replace: true });
                }
            }
            // Se está em uma aba inválida, redireciona para primeira aba disponível
            else if (!isAbaValida(location.pathname)) {
                const primeiraAba = getPrimeiraAbaDisponivel();
                if (primeiraAba !== location.pathname) {
                    navegar(primeiraAba, { replace: true });
                }
            }
        }
    }, [colaborador, location.pathname, id, usuario.tipo, modalDemissaoAberto]);

    // Fechar modal de imagem com ESC
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape' && showImageModal) {
                setShowImageModal(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [showImageModal]);

    const handleSalvarDemissao = (dadosDemissao) => {
        http.post(`funcionario/${id}/solicita_demissao/`, {
            ...dadosDemissao
        })
        .then(() => {
            toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Solicitação de demissão enviada com sucesso!', life: 3000 });
            setModalDemissaoAberto(false);
            // Re-fetch collaborator data to update status
            http.get(`funcionario/${id}/?format=json`)
                .then(response => {
                    setColaborador(response);
                });
        })
        .catch(erro => {
            console.error("Erro ao enviar solicitação de demissão", erro);
            const errorMessage = erro.response?.data?.detail || 'Falha ao enviar solicitação de demissão.';
            toast.current.show({ severity: 'error', summary: 'Erro', detail: errorMessage, life: 3000 });
        });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file && file.type.match('image.*')) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onload = () => {
                setImageSrc(reader.result);
                setShowCropModal(true);
                setShowCropSelection(false);
                setIsCropped(false);
                setCroppedImageSrc('');
                setHasCropChanged(false);
            };
            reader.readAsDataURL(file);
        } else {
            toast.current.show({ 
                severity: 'warn', 
                summary: 'Atenção', 
                detail: 'Por favor, selecione um arquivo de imagem válido.', 
                life: 3000 
            });
        }
    };

    const handleRemoveImage = () => {
        const formData = new FormData();
        formData.append('imagem', ''); // Envia string vazia para remover
        
        http.put(`funcionario/${id}/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .then(() => {
            setColaborador(prev => ({ ...prev, imagem: null }));
            toast.current.show({ 
                severity: 'success', 
                summary: 'Sucesso', 
                detail: 'Imagem removida com sucesso!', 
                life: 3000 
            });
        })
        .catch(erro => {
            console.error("Erro ao remover imagem:", erro);
            toast.current.show({ 
                severity: 'error', 
                summary: 'Erro', 
                detail: 'Falha ao remover a imagem.', 
                life: 3000 
            });
        });
    };

    const compressImage = async (file) => {
        try {
            const options = {
                maxSizeMB: 2,
                maxWidthOrHeight: 1920,
                useWebWorker: true,
                fileType: file.name.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg',
                quality: 0.8
            };
            const compressedFile = await imageCompression(file, options);
            return new File([compressedFile], file.name, {
                type: compressedFile.type,
                lastModified: Date.now(),
            });
        } catch (error) {
            console.error('Erro ao compactar imagem:', error);
            return file;
        }
    };

    const handleCropChange = (crop, percentCrop) => {
        setCrop(percentCrop);
        setHasCropChanged(true);
    };

    const handleCropComplete = (crop, percentCrop) => {
        if (crop && crop.width && crop.height) {
            const size = Math.min(crop.width, crop.height);
            const squareCrop = {
                ...crop,
                width: size,
                height: size,
            };
            setCrop(squareCrop);
        } else {
            setCrop(percentCrop);
        }
    };

    const applyCrop = async () => {
        if (!hasCropChanged) {
            toast.current.show({ 
                severity: 'info', 
                summary: 'Aviso', 
                detail: 'Mova ou redimensione a seleção para aplicar o corte.', 
                life: 3000 
            });
            return;
        }

        if (!imageRef || !crop.width || !crop.height) {
            return;
        }

        try {
            const outputSize = 400;
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = outputSize;
            canvas.height = outputSize;
            
            await new Promise((resolve) => {
                if (imageRef.complete) resolve();
                else imageRef.onload = resolve;
            });
            
            const scaleX = imageRef.naturalWidth / imageRef.offsetWidth;
            const scaleY = imageRef.naturalHeight / imageRef.offsetHeight;
            
            ctx.drawImage(
                imageRef,
                crop.x * scaleX,
                crop.y * scaleY,
                crop.width * scaleX,
                crop.height * scaleY,
                0, 0, outputSize, outputSize
            );
            
            canvas.toBlob((blob) => {
                if (blob) {
                    setCroppedImageSrc(URL.createObjectURL(blob));
                    setIsCropped(true);
                    setShowCropSelection(false);
                }
            }, selectedFile.type, 0.9);
            
        } catch (erro) {
            console.error("Erro ao aplicar corte:", erro);
        }
    };

    const handleCropImage = async () => {
        setUploading(true);
        try {
            let fileToUpload;
            if (isCropped && croppedImageSrc) {
                const response = await fetch(croppedImageSrc);
                const blob = await response.blob();
                fileToUpload = new File([blob], selectedFile.name, { type: selectedFile.type });
            } else {
                fileToUpload = selectedFile;
            }
            
            const compressedFile = await compressImage(fileToUpload);
            
            const formData = new FormData();
            formData.append('imagem', compressedFile);
            
            const uploadResponse = await http.put(`funcionario/${id}/`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            
            setColaborador(prev => ({ ...prev, imagem: uploadResponse.imagem }));
            
            toast.current.show({ 
                severity: 'success', 
                summary: 'Sucesso', 
                detail: 'Imagem atualizada com sucesso!', 
                life: 4000 
            });
            
            setShowCropModal(false);
        } catch (erro) {
            console.error("Erro no upload:", erro);
            toast.current.show({ 
                severity: 'error', 
                summary: 'Erro', 
                detail: 'Falha no upload da imagem.', 
                life: 5000 
            });
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
            if (modalFileInputRef.current) modalFileInputRef.current.value = '';
        }
    };

    const handleCancelCrop = () => {
        setShowCropModal(false);
        // Limpar ambos os inputs de arquivo para permitir a mesma seleção novamente
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (modalFileInputRef.current) modalFileInputRef.current.value = '';
    };

    useEffect(() => {
        if (showCropSelection && !isCropped) {
            setCrop({
                unit: '%',
                width: 50,
                height: 50, // Adicionado para garantir que a altura esteja definida
                x: 25,
                y: 25,
                aspect: 1,
            });
        }
    }, [showCropSelection, isCropped]);

    useEffect(() => {
        if(!colaborador)
        {
            http.get(`funcionario/${id}/?format=json`)
                .then(response => {
                    setColaborador(response);
                    setTipoFuncionario(response.tipo_funcionario_descricao);
                    setTipoSituacao(response.tipo_situacao_descricao);
                })
                .catch(erro => console.log(erro))
        }
        
    }, [colaborador])

    const desativarColaborador = () => {
        confirmDialog({
            message: 'Você quer desativar esse colaborador?',
            header: 'Desativar',
            icon: 'pi pi-info-circle',
            accept: () => {
                http.delete(`api/collaborator/destroy/${id}`)
                .then(response => {
                   if(response.success)
                    {
                        toast.current.show({ severity: 'info', summary: 'Sucesso', detail: response.message, life: 3000 });
                        navegar('/colaborador')
                    }
                })
                .catch(erro => console.log(erro))
            },
            reject: () => {

            },
        });
    }

    function representativSituacaoTemplate() {
        let situacao = colaborador?.tipo_situacao_descricao;
        let cor = colaborador?.tipo_situacao_cor_tag;
        
        situacao = <Tag severity={null} style={{backgroundColor: cor}} value={situacao}></Tag>;
        return situacao
    }

    function formataCPF(cpf) {
        cpf = cpf.replace(/[^\d]/g, "");
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }

    function copiarTexto(texto) {
        navigator.clipboard.writeText(texto);
        toast.current.show({ severity: 'info', summary: '', detail: 'Texto copiado para a área de transferência.', life: 2000 });
    }

    function representativeGeneroTemplate() {
        let genero = colaborador?.genero_descricao ?? colaborador?.funcionario_pessoa_fisica?.sexo;
        switch(genero)
        {
            case 'Masculino':
            case 'M':
                genero = <IoMdMale size={16} fill='var(--info)'/>;
                break;
            case 'Feminino':
            case 'F':
                genero = <IoMdFemale size={16} fill='var(--error)'/>;
                break;
            default:
                genero = '';
        }
        return genero
    }

    const formatarCPF = (cpf) => {
        if (!cpf) return 'CPF não informado';
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    };

    return (
        <Frame>
            <GlobalStyle />
            <Toast ref={toast} />
            <ConfirmDialog />
            
            {/* Botão voltar acima do header */}
            {colaborador?.funcionario_pessoa_fisica?.nome && (
                <div style={{ marginBottom: '16px' }}>
                    <BotaoVoltar linkFixo="/colaborador" />
                </div>
            )}
            
            {/* Header com informações do colaborador - similar ao da admissão */}
            {colaborador?.funcionario_pessoa_fisica && (
                <div style={{
                    background: 'linear-gradient(to bottom, var(--black), var(--gradient-secundaria))',
                    borderRadius: 8,
                    padding: '12px 16px',
                    marginBottom: 0,
                    marginRight: '-24px', // Compensa o padding do Frame
                    color: '#fff',
                    boxShadow: '0 2px 8px rgba(12, 0, 76, 0.3)',
                    position: 'sticky',
                    top: 0,
                    width: '100%'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 10
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10
                        }}>
                            <div>
                                <h2 style={{
                                    margin: 0,
                                    fontSize: 16,
                                    fontWeight: 700,
                                    color: '#fff',
                                    textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                                }}>
                                    {colaborador.chapa} - {colaborador.funcionario_pessoa_fisica.nome}
                                </h2>
                                <p style={{
                                    margin: 0,
                                    fontSize: 12,
                                    color: '#fff',
                                    opacity: 0.9,
                                    fontWeight: 400,
                                    textAlign: 'left'
                                }}>
                                    CPF: {formatarCPF(colaborador.funcionario_pessoa_fisica.cpf)}
                                </p>
                            </div>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                                background: 'rgba(255, 255, 255, 0.15)',
                                padding: '4px 8px',
                                borderRadius: 6,
                                backdropFilter: 'blur(10px)'
                            }}>
                                <span style={{
                                    fontSize: 11,
                                    fontWeight: 600,
                                    color: '#fff',
                                    opacity: 0.9
                                }}>
                                    Status:
                                </span>
                                <span style={{
                                    background: colaborador.tipo_situacao_descricao === 'Ativo' ? '#4CAF50' : '#FF9800',
                                    color: '#fff',
                                    padding: '4px 8px',
                                    borderRadius: 12,
                                    fontSize: 11,
                                    fontWeight: 400,
                                    textTransform: 'capitalize'
                                }}>
                                    {colaborador.tipo_situacao_descricao || 'Status não informado'}
                                </span>
                            </div>
                            
                            {colaborador?.tipo_situacao_descricao == 'Ativo' && ArmazenadorToken.hasPermission('add_demissao') && (
                                <Botao aoClicar={() => setModalDemissaoAberto(true)} estilo="vermilion" size="small">
                                    <FaUserTimes fill='var(--white)' size={16} style={{marginRight: '8px'}} /> 
                                    Solicitar Demissão
                                </Botao>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Conteúdo original simplificado */}
            <HeaderContainer gap="24px" alinhamento="space-between">
                {!colaborador?.funcionario_pessoa_fisica?.nome && (
                    <>
                        <Skeleton variant="rectangular" width={'70%'} height={'20%'} />
                        <ContainerHorizontal gap="16px" align="start">
                            <Skeleton variant="rectangular" width={'50%'} height={40} />
                            <Skeleton variant="rectangular" width={70} height={30} />
                        </ContainerHorizontal>
                    </>
                )}
            </HeaderContainer>
            <Col12Vertical>
                {colaborador && colaborador?.funcionario_pessoa_fisica?.nome ? 
                    <Col4Vertical>
                        {/* Imagem do Colaborador */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            marginBottom: '4px',
                            paddingBottom: '0',
                            borderBottom: '1px solid #f1f5f9'
                        }}>
                            <div style={{ marginBottom: colaborador.imagem && ArmazenadorToken.hasPermission('change_funcionario') ? '12px' : '0' }}>
                                {colaborador.imagem ? (
                                    <ImageContainer>
                                        <img 
                                            src={colaborador.imagem}
                                            alt={`Foto de ${colaborador.funcionario_pessoa_fisica.nome}`}
                                            style={{
                                                width: '160px',
                                                height: '150px',
                                                borderRadius: '12px',
                                                objectFit: 'cover',
                                                border: '2px solid #f8fafc',
                                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                                cursor: 'pointer',
                                                transition: 'filter 0.3s ease'
                                            }}
                                            onClick={() => setShowImageModal(true)}
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                        {ArmazenadorToken.hasPermission('change_funcionario') && (
                                            <>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    style={{ display: 'none' }}
                                                    id="colaborador-image-change-hover"
                                                />
                                                <button
                                                    className="hover-button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        document.getElementById('colaborador-image-change-hover').click();
                                                    }}
                                                    disabled={uploading}
                                                    title="Alterar imagem"
                                                >
                                                    <RiUpload2Fill size={20} />
                                                </button>
                                            </>
                                        )}
                                    </ImageContainer>
                                ) : (
                                    // Se não tem imagem e usuário tem permissão, mostra área de upload
                                    ArmazenadorToken.hasPermission('change_funcionario') ? (
                                        <>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                ref={fileInputRef}
                                                style={{ display: 'none' }}
                                                id="colaborador-image-upload"
                                            />
                                            <UploadArea htmlFor="colaborador-image-upload">
                                                {uploading ? (
                                                    <div style={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        color: 'var(--primaria)'
                                                    }}>
                                                        <div style={{
                                                            border: '2px solid var(--primaria)',
                                                            borderTop: '2px solid transparent',
                                                            borderRadius: '50%',
                                                            width: '24px',
                                                            height: '24px',
                                                            animation: 'spin 1s linear infinite'
                                                        }}></div>
                                                        <UploadText style={{ marginTop: '8px' }}>Enviando...</UploadText>
                                                    </div>
                                                ) : (
                                                    <UploadIcon>
                                                        <RiUpload2Fill />
                                                        <UploadText>Adicionar foto</UploadText>
                                                        <UploadText>PNG, JPG</UploadText>
                                                    </UploadIcon>
                                                )}
                                            </UploadArea>
                                        </>
                                    ) : (
                                        // Se não tem permissão, mostra apenas o avatar com inicial
                                        <div style={{
                                            width: '160px',
                                            height: '150px',
                                            borderRadius: '12px',
                                            background: 'linear-gradient(135deg, #e2e8f0, #cbd5e1)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '52px',
                                            fontWeight: 'bold',
                                            color: '#64748b',
                                            border: '2px solid #f8fafc',
                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                                        }}>
                                            {colaborador.funcionario_pessoa_fisica.nome?.charAt(0)?.toUpperCase() || 'C'}
                                        </div>
                                    )
                                )}
                                {/* Fallback para quando a imagem falha ao carregar */}
                                <div style={{
                                    width: '160px',
                                    height: '150px',
                                    borderRadius: '12px',
                                    background: 'linear-gradient(135deg, #e2e8f0, #cbd5e1)',
                                    display: 'none',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '52px',
                                    fontWeight: 'bold',
                                    color: '#64748b',
                                    border: '2px solid #f8fafc',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                                }}>
                                    {colaborador.funcionario_pessoa_fisica.nome?.charAt(0)?.toUpperCase() || 'C'}
                                </div>
                            </div>

                            {/* Botão de remover quando há imagem e usuário tem permissão */}
                            {colaborador.imagem && ArmazenadorToken.hasPermission('change_funcionario') && (
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <button
                                        onClick={handleRemoveImage}
                                        disabled={uploading}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: '#64748b',
                                            fontSize: '12px',
                                            fontWeight: '500',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            transition: 'all 0.2s ease',
                                            opacity: uploading ? 0.6 : 1
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!uploading) {
                                                e.target.style.color = '#ef4444';
                                                e.target.style.background = '#fef2f2';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!uploading) {
                                                e.target.style.color = '#64748b';
                                                e.target.style.background = 'transparent';
                                            }
                                        }}
                                    >
                                        <HiX size={12} /> Remover
                                    </button>
                                </div>
                            )}
                        </div>
                        
                        <InfoItem>
                            <InfoLabel>
                                Nome Social
                            </InfoLabel>
                            <InfoValue>
                                <GenderIcon gender={colaborador?.funcionario_pessoa_fisica?.sexo}>
                                    {representativeGeneroTemplate()}
                                </GenderIcon>
                                <InfoText>{colaborador?.funcionario_pessoa_fisica?.nome_social || 'Não informado'}</InfoText>
                                <CopyButton onClick={() => copiarTexto(colaborador?.funcionario_pessoa_fisica?.nome_social)}>
                                    <IoCopyOutline size={12} />
                                </CopyButton>
                            </InfoValue>
                        </InfoItem>
                    
                        <InfoItem>
                            <InfoLabel>
                                CPF
                            </InfoLabel>
                            <InfoValue>
                                <InfoText>{formataCPF(colaborador?.funcionario_pessoa_fisica?.cpf)}</InfoText>
                                <CopyButton onClick={() => copiarTexto(colaborador?.funcionario_pessoa_fisica?.cpf)}>
                                    <IoCopyOutline size={12} />
                                </CopyButton>
                            </InfoValue>
                        </InfoItem>
                    
                        <InfoItem>
                            <InfoLabel>
                                Nascimento
                            </InfoLabel>
                            <InfoValue>
                                <InfoText>{new Date(colaborador?.funcionario_pessoa_fisica?.data_nascimento).toLocaleDateString('pt-BR')}</InfoText>
                                <CopyButton onClick={() => copiarTexto(new Date(colaborador?.funcionario_pessoa_fisica?.data_nascimento).toLocaleDateString('pt-BR'))}>
                                    <IoCopyOutline size={12} />
                                </CopyButton>
                            </InfoValue>
                        </InfoItem>
                        
                        <InfoItem>
                            <InfoLabel>
                                Filial
                            </InfoLabel>
                            <InfoValue>
                                <CustomTag 
                                    bg="linear-gradient(135deg, #eff6ff, #dbeafe)"
                                    color="#1e40af"
                                    border="#93c5fd"
                                >
                                    {colaborador?.filial_nome ?? 'Não definida'}
                                </CustomTag>
                            </InfoValue>
                        </InfoItem>
                        
                        <InfoItem>
                            <InfoLabel>
                                Função
                            </InfoLabel>
                            <InfoValue>
                                <CustomTag 
                                    bg="linear-gradient(135deg, #f0fdf4, #dcfce7)"
                                    color="#166534"
                                    border="#86efac"
                                >
                                    {colaborador?.funcao_nome ?? 'Não definida'}
                                </CustomTag>
                            </InfoValue>
                        </InfoItem>
                        
                        <InfoItem>
                            <InfoLabel>
                                Tipo de Funcionário
                            </InfoLabel>
                            <InfoValue>
                                <CustomTag 
                                    bg="linear-gradient(135deg, #fefce8, #fef3c7)"
                                    color="#92400e"
                                    border="#fbbf24"
                                >
                                    {tipoFuncionario ?? 'Não definida'}
                                </CustomTag>
                            </InfoValue>
                        </InfoItem>
                    </Col4Vertical>
                : <Skeleton variant="rectangular" width={'23%'} height={420} />
                }
                {colaborador && colaborador?.funcionario_pessoa_fisica?.nome ? 
                <Col8Vertical>
                <BotaoGrupo tabs gap="8px">
                    {ArmazenadorToken.hasPermission('view_pedido') &&
                    <Link className={styles.link} to={`/colaborador/detalhes/${id}`}>
                        <Botao estilo={location.pathname == `/colaborador/detalhes/${id}` ? 'black':''} size="small" tab>Benefícios</Botao>
                    </Link>}
                    <Link className={styles.link} to={`/colaborador/detalhes/${id}/dados-contratuais`}>
                        <Botao estilo={location.pathname == `/colaborador/detalhes/${id}/dados-contratuais` ? 'black':''} size="small" tab>Dados Contratuais</Botao>
                    </Link>
                    <Link className={styles.link} to={`/colaborador/detalhes/${id}/dados-pessoais`}>
                        <Botao estilo={location.pathname == `/colaborador/detalhes/${id}/dados-pessoais` ? 'black':''} size="small" tab>Dados Pessoais</Botao>
                    </Link>
                    {ArmazenadorToken.hasPermission('view_dependente') &&
                    <Link className={styles.link} to={`/colaborador/detalhes/${id}/dependentes`}>
                        <Botao 
                            estilo={location.pathname.startsWith(`/colaborador/detalhes/${id}/dependentes`) ? 'black' : ''} 
                            size="small" 
                            tab
                        >
                            Dependentes
                        </Botao>
                    </Link>}
                    {ArmazenadorToken.hasPermission('view_ferias') &&
                    <Link className={styles.link} to={`/colaborador/detalhes/${id}/ferias`}>
                        <Botao estilo={location.pathname == `/colaborador/detalhes/${id}/ferias` ? 'black':''} size="small" tab>Férias</Botao>
                    </Link>}
                    {ArmazenadorToken.hasPermission('view_ausencia') &&
                    <Link className={styles.link} to={`/colaborador/detalhes/${id}/ausencias`}>
                        <Botao estilo={location.pathname == `/colaborador/detalhes/${id}/ausencias` ? 'black':''} size="small" tab>Ausências</Botao>
                    </Link>}
                    {(usuario.tipo == 'cliente' || usuario.tipo == 'equipeFolhaPagamento') &&
                        <>
                        <Link className={styles.link} to={`/colaborador/detalhes/${id}/ciclos`}>
                            <Botao estilo={location.pathname == `/colaborador/detalhes/${id}/ciclos` ? 'black':''} size="small" tab>Ciclos de Folha</Botao>
                        </Link>
                        <Link className={styles.link} to={`/colaborador/detalhes/${id}/esocial`}>
                            <Botao estilo={location.pathname == `/colaborador/detalhes/${id}/esocial` ? 'black':''} size="small" tab>ESocial</Botao>
                        </Link>
                        </>
                    }

                    {(usuario.tipo == 'grupo_rh' || usuario.tipo == 'global') && 
                        <>
                            <Link className={styles.link} to={`/colaborador/detalhes/${id}/pedidos`}>
                                <Botao estilo={location.pathname == `/colaborador/detalhes/${id}/pedidos` ? 'black':''} size="small" tab>Pedidos</Botao>
                            </Link>
                            <Link className={styles.link} to={`/colaborador/detalhes/${id}/movimentos`}>
                                <Botao estilo={location.pathname == `/colaborador/detalhes/${id}/movimentos` ? 'black':''} size="small" tab>Movimentos</Botao>
                            </Link>
                        </>
                    }
                </BotaoGrupo>
                <Outlet context={colaborador}/>
            </Col8Vertical>
            : <Container gap="8px">
                    <Skeleton variant="rectangular" width={'100%'} height={30} />
                    <Skeleton variant="rectangular" width={'100%'} height={420} />
                </Container>
            }
        </Col12Vertical>
        <ModalDemissao 
            opened={modalDemissaoAberto}
            aoFechar={() => setModalDemissaoAberto(false)}
            colaborador={colaborador}
            aoSalvar={handleSalvarDemissao}
            mostrarColaborador={false}
        />

        {/* Modal de visualização da imagem */}
        {showImageModal && colaborador.imagem && (
            <ImageModal onClick={(e) => {
                if (e.target === e.currentTarget) {
                    setShowImageModal(false);
                }
            }}>
                <ImageModalContent>
                    <ImageModalImage 
                        src={colaborador.imagem} 
                        alt={`Foto de ${colaborador.funcionario_pessoa_fisica.nome}`} 
                    />
                    <div style={{display: 'flex', gap: '12px'}}>
                        <input
                            type="file"
                            accept="image/*"
                            ref={modalFileInputRef}
                            onChange={handleImageUpload}
                            style={{ display: 'none' }}
                            id="colaborador-image-change-modal"
                        />
                         <ImageModalButton onClick={() => modalFileInputRef.current.click()}>
                            <RiUpload2Fill /> Alterar Imagem
                        </ImageModalButton>
                        <ImageModalButton onClick={handleRemoveImage} style={{background: '#ef4444', color: 'white'}}>
                            <FaTrash /> Remover Imagem
                        </ImageModalButton>
                        <ImageModalButton onClick={() => setShowImageModal(false)}>
                            <HiX /> Fechar
                        </ImageModalButton>
                    </div>
                </ImageModalContent>
            </ImageModal>
        )}

        {/* Modal de Corte de Imagem */}
        {showCropModal && (
            <div style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 10001, padding: '20px'
            }} onClick={(e) => e.target === e.currentTarget && handleCancelCrop()}>
                <div style={{
                    background: '#fff', borderRadius: '12px',
                    maxWidth: '90vw', maxHeight: '90vh', width: '800px',
                    display: 'flex', flexDirection: 'column', overflow: 'hidden'
                }}>
                    {/* Header */}
                    <div style={{
                        padding: '16px 20px', borderBottom: '1px solid #e5e7eb',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                    }}>
                        <h3 style={{ margin: 0, color: '#374151', fontSize: '18px' }}>Cortar Imagem</h3>
                        <button onClick={handleCancelCrop} style={{
                            background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer',
                            color: '#6b7280'
                        }}>×</button>
                    </div>

                    {/* Content */}
                    <div style={{
                        padding: '20px', display: 'flex', gap: '20px',
                        flex: 1, minHeight: 0
                    }}>
                        {/* Imagem Original ou Cortada */}
                        <div style={{
                            flex: showCropSelection && !isCropped ? 0.5 : 1,
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            background: '#f9fafb', borderRadius: '8px', padding: '20px', minHeight: '400px'
                        }}>
                             {isCropped ? (
                                <img src={croppedImageSrc} alt="Cortada" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                            ) : (
                                <img ref={setImageRef} src={imageSrc} alt="Original" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                            )}
                        </div>
                        
                        {/* Área de Seleção */}
                        {showCropSelection && !isCropped && (
                            <div style={{
                                flex: 0.5, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                background: '#f0f9ff', borderRadius: '8px', padding: '20px', minHeight: '400px',
                                border: '2px dashed #0ea5e9'
                            }}>
                                <ReactCrop
                                    crop={crop}
                                    onChange={handleCropChange}
                                    onComplete={handleCropComplete}
                                    aspect={1}
                                    minWidth={30}
                                    minHeight={30}
                                    keepSelection
                                    ruleOfThirds
                                >
                                    <img src={imageSrc} alt="Para Cortar" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
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
                           {!isCropped ? (
                                <>
                                    {!showCropSelection ? (
                                        <button
                                            onClick={() => setShowCropSelection(true)}
                                            style={{ width: '100%', background: '#374151', border: 'none', borderRadius: '6px', padding: '12px', cursor: 'pointer', fontSize: '14px', color: '#fff', transition: 'all 0.2s ease' }}
                                            onMouseEnter={(e) => e.target.style.background = '#1f2937'}
                                            onMouseLeave={(e) => e.target.style.background = '#374151'}
                                        >
                                            ✂️ Cortar
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                onClick={applyCrop}
                                                disabled={!hasCropChanged}
                                                style={{ width: '100%', background: !hasCropChanged ? '#9ca3af' : '#059669', border: 'none', borderRadius: '6px', padding: '12px', cursor: !hasCropChanged ? 'not-allowed' : 'pointer', fontSize: '14px', color: '#fff', transition: 'all 0.2s ease' }}
                                                onMouseEnter={(e) => { if (hasCropChanged) e.target.style.background = '#047857'; }}
                                                onMouseLeave={(e) => { if (hasCropChanged) e.target.style.background = '#059669'; }}
                                            >
                                                ✅ Aplicar Corte
                                            </button>
                                            <button
                                                onClick={() => setShowCropSelection(false)}
                                                style={{ width: '100%', background: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '6px', padding: '10px', cursor: 'pointer', fontSize: '14px', transition: 'all 0.2s ease' }}
                                                onMouseEnter={(e) => e.target.style.background = '#e5e7eb'}
                                                onMouseLeave={(e) => e.target.style.background = '#f3f4f6'}
                                            >
                                                🔄 Resetar Seleção
                                            </button>
                                        </>
                                    )}
                                     {/* Instruções */}
                                     <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', fontSize: '13px', color: '#6b7280', lineHeight: '1.5' }}>
                                        <strong style={{ color: '#374151' }}>Como usar:</strong><br/>
                                        {!showCropSelection ? 'Clique em "Cortar" para começar.' : 'Arraste para selecionar e clique em "Aplicar Corte".'}
                                    </div>
                                </>
                            ) : (
                                <>
                                <button
                                    onClick={() => { setIsCropped(false); setCroppedImageSrc(''); setShowCropSelection(true); }}
                                    style={{ width: '100%', background: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '6px', padding: '10px', cursor: 'pointer', fontSize: '14px', transition: 'all 0.2s ease' }}
                                    onMouseEnter={(e) => e.target.style.background = '#e5e7eb'}
                                    onMouseLeave={(e) => e.target.style.background = '#f3f4f6'}
                                >
                                    🔄 Voltar e Editar
                                </button>
                                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', fontSize: '13px', color: '#6b7280', lineHeight: '1.5' }}>
                                    <strong style={{ color: '#374151' }}>Pronto!</strong><br/>
                                    Clique em "Salvar" para finalizar ou volte para editar.
                                </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div style={{
                        padding: '16px 20px', borderTop: '1px solid #e5e7eb',
                        display: 'flex', justifyContent: 'flex-end', gap: '12px'
                    }}>
                        <button 
                            onClick={handleCancelCrop} 
                            style={{ background: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '6px', padding: '10px 16px', cursor: 'pointer', fontSize: '14px', transition: 'all 0.2s ease' }}
                            onMouseEnter={(e) => e.target.style.background = '#e5e7eb'}
                            onMouseLeave={(e) => e.target.style.background = '#f3f4f6'}
                        >
                            × Cancelar
                        </button>
                        <button 
                            onClick={handleCropImage} 
                            disabled={uploading || (showCropSelection && !isCropped)} 
                            style={{ 
                                background: uploading || (showCropSelection && !isCropped) ? '#9ca3af' : '#374151', 
                                border: 'none', 
                                borderRadius: '6px', 
                                padding: '10px 16px', 
                                cursor: uploading || (showCropSelection && !isCropped) ? 'not-allowed' : 'pointer', 
                                fontSize: '14px', 
                                color: '#fff', 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '8px', 
                                transition: 'all 0.2s ease' 
                            }}
                            onMouseEnter={(e) => { if (!uploading && !(showCropSelection && !isCropped)) e.target.style.background = '#1f2937'; }}
                            onMouseLeave={(e) => { if (!uploading && !(showCropSelection && !isCropped)) e.target.style.background = '#374151'; }}
                        >
                            {uploading ? 'Processando...' : (showCropSelection && !isCropped) ? 'Aplique ou cancele o corte' : (isCropped ? 'Salvar' : 'Salvar Imagem Original')}
                        </button>
                    </div>
                </div>
            </div>
        )}
    </Frame>
)
}

export default ColaboradorDetalhes
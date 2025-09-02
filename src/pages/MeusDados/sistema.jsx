import { useState, useEffect, useRef } from 'react';
import Titulo from '@components/Titulo';
import Frame from '@components/Frame';
import SubTitulo from '@components/SubTitulo';
import Texto from '@components/Texto';
import CampoTexto from '@components/CampoTexto';
import { Skeleton } from 'primereact/skeleton';
import Botao from '@components/Botao';
import { Toast } from 'primereact/toast';
import { useSessaoUsuarioContext } from "@contexts/SessaoUsuario"
import styled from 'styled-components';
import { ColorPicker } from 'primereact/colorpicker';
import { RiUpload2Fill } from 'react-icons/ri';
import DropdownItens from '@components/DropdownItens';
import BrandColors from '@utils/brandColors';
import SwitchInput from '@components/SwitchInput';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import imageCompression from 'browser-image-compression';
import { HiX } from 'react-icons/hi';
import http from '@http';

const Col12 = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
`;

const Col6 = styled.div`
    padding: 20px;
    flex: 1 1 50%;
`;

const ContainerButton = styled.div`
    display: flex;
    width: 100%;
    padding: 20px;
    justify-content: flex-end;
    & button {
        width: initial;
    }
`;

const CheckboxLabel = styled.label`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
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

const SwitchContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 8px 0;
`;

const UploadArea = styled.label`
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
        fill: #e2e8f0; /* Cor cinza claro padrão */
        transition: fill 0.2s ease-in-out;
    }

    &:hover {
        transform: scale(1.1);
        background: rgba(0, 0, 0, 0.9);
    }

    &:hover svg * {
        fill: white; /* Cor branca ao passar o mouse */
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

function MeusDadosSistema() {
    const [loading, setLoading] = useState(false);
    const [sistema, setSistema] = useState({
        logoPreview: '',
        brandName: BrandColors.getBrandName(),
        corPrimaria: BrandColors.getBrandColors().primary,
        corSecundaria: BrandColors.getBrandColors().secondary,
        corAcento: BrandColors.getBrandColors().accent,
        corTerciaria: BrandColors.getBrandColors().tertiary,
        candidatoPodeEditar: true,
        habilidadesCandidato: import.meta.env.VITE_OPTION_HABILIDADES === 'true',
        experienciaCandidato: import.meta.env.VITE_OPTION_EXPERIENCIA === 'true',
        educacaoCandidato: import.meta.env.VITE_OPTION_EDUCACAO === 'true',
        timezone: 'America/Sao_Paulo',
        feriadosTipo: 'nacionais',
        feriadosUF: '',
        idioma: 'pt',
    });
    const toast = useRef(null);
    const fileInputRef = useRef(null);

    // Crop states
    const [uploading, setUploading] = useState(false);
    const [showCropModal, setShowCropModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [crop, setCrop] = useState({ unit: '%', width: 50, height: 50, x: 25, y: 25 });
    const [imageSrc, setImageSrc] = useState('');
    const [imageRef, setImageRef] = useState(null);

    const { usuario } = useSessaoUsuarioContext();

    useEffect(() => {
        setLoading(true);
        
        // Buscar parâmetros de layout da API apenas se não existirem dados locais
        const existingLayoutColors = localStorage.getItem('layoutColors');
        
        // Buscar parâmetros de admissão da API
        const fetchAdmissaoParams = http.get('parametros/por-assunto/?assunto=ADMISSAO')
            .then(response => {
                if (response && response.parametros) {
                    return response.parametros;
                }
                return null;
            })
            .catch(error => {
                console.error('Erro ao buscar parâmetros de admissão:', error);
                return null;
            });
        
        if (!existingLayoutColors) {
            // Buscar parâmetros de layout
            const fetchLayoutParams = http.get('parametros/por-assunto/?assunto=LAYOUT')
                .then(response => {
                    if (response && response.parametros) {
                        return response.parametros;
                    }
                    return null;
                })
                .catch(error => {
                    console.error('Erro ao buscar parâmetros de layout:', error);
                    return null;
                });
            
            // Aguardar ambas as requisições
            Promise.all([fetchLayoutParams, fetchAdmissaoParams])
                .then(([layoutParams, admissaoParams]) => {
                    // Carrega configurações salvas do localStorage (apenas para campos não relacionados ao layout)
                    const savedSettings = JSON.parse(localStorage.getItem('systemSettings'));
                    
                    setSistema(prev => ({
                        ...prev,
                        brandName: layoutParams?.NOME_SISTEMA || BrandColors.getBrandName(),
                        corPrimaria: layoutParams?.COR_PRIMARIA || BrandColors.getBrandColors().primary,
                        corSecundaria: layoutParams?.COR_SECUNDARIA || BrandColors.getBrandColors().secondary,
                        corAcento: layoutParams?.COR_ACENTO || BrandColors.getBrandColors().accent,
                        corTerciaria: layoutParams?.COR_TERCIARIA || BrandColors.getBrandColors().tertiary,
                        // Parâmetros de admissão da API
                        candidatoPodeEditar: admissaoParams?.CANDIDATO_PREENCHE_DADOS === 'true',
                        habilidadesCandidato: admissaoParams?.PREENCHER_HABILIDADES === 'true',
                        experienciaCandidato: admissaoParams?.PREENCHER_EXPERIENCIA === 'true',
                        educacaoCandidato: admissaoParams?.PREENCHER_EDUCACAO === 'true',
                        // Manter outras configurações do localStorage
                        timezone: savedSettings?.timezone ?? prev.timezone,
                        feriadosTipo: savedSettings?.feriadosTipo ?? prev.feriadosTipo,
                        feriadosUF: savedSettings?.feriadosUF ?? prev.feriadosUF,
                        idioma: savedSettings?.idioma ?? prev.idioma,
                    }));
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            // Usar dados existentes de layout e buscar apenas admissão
            const layoutColors = JSON.parse(existingLayoutColors);
            const savedSettings = JSON.parse(localStorage.getItem('systemSettings'));
            
            fetchAdmissaoParams.then(admissaoParams => {
                setSistema(prev => ({
                    ...prev,
                    brandName: layoutColors.NOME_SISTEMA || BrandColors.getBrandName(),
                    corPrimaria: layoutColors.COR_PRIMARIA || BrandColors.getBrandColors().primary,
                    corSecundaria: layoutColors.COR_SECUNDARIA || BrandColors.getBrandColors().secondary,
                    corAcento: layoutColors.COR_ACENTO || BrandColors.getBrandColors().accent,
                    corTerciaria: layoutColors.COR_TERCIARIA || BrandColors.getBrandColors().tertiary,
                    // Parâmetros de admissão da API
                    candidatoPodeEditar: admissaoParams?.CANDIDATO_PREENCHE_DADOS === 'true',
                    habilidadesCandidato: admissaoParams?.PREENCHER_HABILIDADES === 'true',
                    experienciaCandidato: admissaoParams?.PREENCHER_EXPERIENCIA === 'true',
                    educacaoCandidato: admissaoParams?.PREENCHER_EDUCACAO === 'true',
                    // Manter outras configurações do localStorage
                    timezone: savedSettings?.timezone ?? prev.timezone,
                    feriadosTipo: savedSettings?.feriadosTipo ?? prev.feriadosTipo,
                    feriadosUF: savedSettings?.feriadosUF ?? prev.feriadosUF,
                    idioma: savedSettings?.idioma ?? prev.idioma,
                }));
            }).finally(() => {
                setLoading(false);
            });
        }

        // Carrega logo salva
        const savedLogo = BrandColors.getBrandLogo();
        setSistema(prev => ({
            ...prev,
            logoPreview: savedLogo || (usuario && usuario.company_logo)
        }));
    }, [usuario]);

    const handleChange = (campo, valor) => {
        setSistema(prev => ({ ...prev, [campo]: valor }));
    };

    // Função para validar e formatar cores hex
    const handleColorChange = (campo, valor) => {
        // Remover # se existir
        let cleanValue = valor.replace('#', '');
        
        // Validar se é um hex válido (6 caracteres, apenas números e letras A-F)
        if (cleanValue.length === 6 && /^[0-9A-Fa-f]{6}$/.test(cleanValue)) {
            // Adicionar # e converter para maiúsculas
            const formattedValue = '#' + cleanValue.toUpperCase();
            setSistema(prev => ({ ...prev, [campo]: formattedValue }));
        } else if (cleanValue.length === 0) {
            // Permitir campo vazio
            setSistema(prev => ({ ...prev, [campo]: '' }));
        } else if (cleanValue.length <= 6) {
            // Permitir digitação parcial
            setSistema(prev => ({ ...prev, [campo]: valor }));
        }
    };

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
                maxWidthOrHeight: 1024, 
                useWebWorker: true, 
                fileType: file.type, 
                quality: 0.8 
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
            
            const finalFile = new File([compressedFile], file.name, { 
                type: compressedFile.type, 
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
                setCrop({ unit: '%', width: 50, height: 50, x: 25, y: 25 });
                setShowCropModal(true);
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

    const handleRemoveLogo = () => {
        try {
            console.log('🔄 Removendo logo...');
            setSistema(prev => ({ ...prev, logoPreview: '' }));
            BrandColors.setBrandLogo(null);
            
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
            if (!imageRef || !crop.width || !crop.height) {
                console.log('Dados de corte inválidos:', { imageRef: !!imageRef, crop });
                toast.current.show({ 
                    severity: 'error', 
                    summary: 'Erro', 
                    detail: 'Dados de corte inválidos. Tente novamente.', 
                    life: 3000 
                });
                return;
            }
            
            setUploading(true);
            console.log('Iniciando corte da imagem...');

            const canvas = document.createElement('canvas');
            
            // Calcular dimensões reais da imagem
            const naturalWidth = imageRef.naturalWidth;
            const naturalHeight = imageRef.naturalHeight;
            const displayWidth = imageRef.offsetWidth;
            const displayHeight = imageRef.offsetHeight;
            
            console.log('Dimensões da imagem:', {
                natural: { width: naturalWidth, height: naturalHeight },
                display: { width: displayWidth, height: displayHeight },
                crop: crop
            });
            
            // Calcular escala
            const scaleX = naturalWidth / displayWidth;
            const scaleY = naturalHeight / displayHeight;
            
            // Calcular dimensões do crop em pixels reais
            const cropWidth = Math.round(crop.width * scaleX);
            const cropHeight = Math.round(crop.height * scaleY);
            const cropX = Math.round(crop.x * scaleX);
            const cropY = Math.round(crop.y * scaleY);
            
            console.log('Dimensões do crop calculadas:', {
                scaleX, scaleY,
                cropWidth, cropHeight, cropX, cropY
            });
            
            // Configurar canvas
            canvas.width = cropWidth;
            canvas.height = cropHeight;
            const ctx = canvas.getContext('2d');
            
            // Desenhar a área cortada
            ctx.drawImage(
                imageRef, 
                cropX, cropY, cropWidth, cropHeight, 
                0, 0, cropWidth, cropHeight
            );

            // Converter para blob
            canvas.toBlob(async (blob) => {
                if (!blob) { 
                    console.error('Falha ao criar blob da imagem cortada');
                    setUploading(false); 
                    return; 
                }
                
                console.log('Blob criado com sucesso, tamanho:', blob.size);
                
                try {
                    const croppedFile = new File([blob], selectedFile.name, { type: selectedFile.type });
                    console.log('Arquivo cortado criado:', croppedFile.name, croppedFile.size);
                    
                    const compressedFile = await compressImage(croppedFile);
                    console.log('Arquivo comprimido:', compressedFile.name, compressedFile.size);
                    
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        try {
                            console.log('🔄 Atualizando logo após corte...');
                            const dataUrl = reader.result;
                            console.log('Data URL criado, tamanho:', dataUrl.length);
                            
                            // Atualizar logo e notificar mudanças (agora automático via BrandColors)
                            BrandColors.setBrandLogo(dataUrl);
                            setSistema(prev => ({ ...prev, logoPreview: dataUrl }));
                            
                            toast.current.show({ 
                                severity: 'success', 
                                summary: 'Sucesso', 
                                detail: 'Logo atualizada com sucesso!' 
                            });
                            handleCancelCrop();
                            console.log('✅ Logo atualizada com sucesso após corte');
                        } catch (error) {
                            console.error('❌ Erro ao atualizar logo após corte:', error);
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
                            detail: 'Erro ao processar a imagem cortada.', 
                            life: 3000 
                        });
                    };
                    reader.readAsDataURL(compressedFile);
                } catch (error) {
                    console.error('Erro ao processar arquivo cortado:', error);
                    toast.current.show({ 
                        severity: 'error', 
                        summary: 'Erro', 
                        detail: 'Erro ao processar a imagem cortada.', 
                        life: 3000 
                    });
                } finally {
                    setUploading(false);
                }
            }, selectedFile.type, 0.9);
            
        } catch (error) {
            console.error('Erro no handleCropImage:', error);
            toast.current.show({ 
                severity: 'error', 
                summary: 'Erro', 
                detail: 'Erro ao cortar a imagem. Tente novamente.', 
                life: 3000 
            });
            setUploading(false);
        }
    };

    const handleCancelCrop = () => {
        console.log('Cancelando modal de corte...');
        setShowCropModal(false);
        setImageSrc('');
        setSelectedFile(null);
        setCrop({ unit: '%', width: 50, height: 50, x: 25, y: 25 });
        if (fileInputRef.current) fileInputRef.current.value = '';
        console.log('Modal de corte fechado e estado limpo');
    };

    const handleSalvar = async () => {
        setLoading(true);
        
        try {
            // Validar se todas as cores são hex válidas
            const cores = [sistema.corPrimaria, sistema.corSecundaria, sistema.corAcento, sistema.corTerciaria];
            const coresInvalidas = cores.filter(cor => !cor || !/^#[0-9A-F]{6}$/i.test(cor));
            
            if (coresInvalidas.length > 0) {
                toast.current.show({ 
                    severity: 'error', 
                    summary: 'Erro', 
                    detail: 'Por favor, insira cores hex válidas (ex: #FF0000) para todos os campos.', 
                    life: 5000 
                });
                setLoading(false);
                return;
            }

            // Definir cada parâmetro individualmente usando POST /api/parametros/definir/
            const parametros = [
                {
                    assunto: 'LAYOUT',
                    chave: 'NOME_SISTEMA',
                    valor: sistema.brandName,
                    descricao: 'Nome do sistema'
                },
                {
                    assunto: 'LAYOUT',
                    chave: 'COR_PRIMARIA',
                    valor: sistema.corPrimaria,
                    descricao: 'Cor primária da marca'
                },
                {
                    assunto: 'LAYOUT',
                    chave: 'COR_SECUNDARIA',
                    valor: sistema.corSecundaria,
                    descricao: 'Cor secundária da marca'
                },
                {
                    assunto: 'LAYOUT',
                    chave: 'COR_ACENTO',
                    valor: sistema.corAcento,
                    descricao: 'Cor de acento da marca'
                },
                {
                    assunto: 'LAYOUT',
                    chave: 'COR_TERCIARIA',
                    valor: sistema.corTerciaria,
                    descricao: 'Cor terciária da marca'
                },
                {
                    assunto: 'LAYOUT',
                    chave: 'LOGO_URL',
                    valor: sistema.logoPreview || '',
                    descricao: 'URL da logo da empresa'
                },
                {
                    assunto: 'LAYOUT',
                    chave: 'FAVICON_URL',
                    valor: BrandColors.getBrandFaviconBaseUrl() || '',
                    descricao: 'URL do favicon'
                },
                // Parâmetros de admissão
                {
                    assunto: 'ADMISSAO',
                    chave: 'CANDIDATO_PREENCHE_DADOS',
                    valor: sistema.candidatoPodeEditar.toString(),
                    descricao: 'Permitir que o candidato preencha seus próprios dados'
                },
                {
                    assunto: 'ADMISSAO',
                    chave: 'PREENCHER_HABILIDADES',
                    valor: sistema.habilidadesCandidato.toString(),
                    descricao: 'Habilitar dados de habilidade do candidato'
                },
                {
                    assunto: 'ADMISSAO',
                    chave: 'PREENCHER_EXPERIENCIA',
                    valor: sistema.experienciaCandidato.toString(),
                    descricao: 'Habilitar dados de experiência do candidato'
                },
                {
                    assunto: 'ADMISSAO',
                    chave: 'PREENCHER_EDUCACAO',
                    valor: sistema.educacaoCandidato.toString(),
                    descricao: 'Habilitar dados de educação do candidato'
                }
            ];

            // Fazer POST para cada parâmetro
            for (const parametro of parametros) {
                await http.post('parametros/definir/', parametro);
            }

            // Salva as cores para aplicação imediata
            const newColors = {
                primary: sistema.corPrimaria,
                secondary: sistema.corSecundaria,
                accent: sistema.corAcento,
                tertiary: sistema.corTerciaria
            };
            BrandColors.setBrandColors(newColors);

            // Salva o nome do sistema
            BrandColors.setBrandName(sistema.brandName);

            // Salva logo se foi alterada
            if (sistema.logoPreview) {
                try {
                    console.log('🔄 Salvando logo no handleSalvar...');
                    BrandColors.setBrandLogo(sistema.logoPreview);
                    console.log('✅ Logo salva com sucesso no handleSalvar');
                } catch (error) {
                    console.error('❌ Erro ao salvar logo no handleSalvar:', error);
                    toast.current.show({ 
                        severity: 'warn', 
                        summary: 'Aviso', 
                        detail: 'Logo não foi salva devido a um erro: ' + error.message 
                    });
                }
            }

            // Atualizar layoutColors após confirmar as alterações
            try {
                console.log('🔄 Atualizando layout colors...');
                BrandColors.updateLayoutColors(newColors, sistema.brandName, sistema.logoPreview);
                console.log('✅ Layout colors atualizado com sucesso');
            } catch (error) {
                console.error('❌ Erro ao atualizar layout colors:', error);
                toast.current.show({ 
                    severity: 'warn', 
                    summary: 'Aviso', 
                    detail: 'Layout não foi atualizado devido a um erro: ' + error.message 
                });
            }

            // Prepara e salva todas as configurações no localStorage
            const settingsToSave = {
                brandName: sistema.brandName,
                corPrimaria: sistema.corPrimaria,
                corSecundaria: sistema.corSecundaria,
                corAcento: sistema.corAcento,
                corTerciaria: sistema.corTerciaria,
                timezone: sistema.timezone,
                feriadosTipo: sistema.feriadosTipo,
                feriadosUF: sistema.feriadosUF,
                idioma: sistema.idioma,
            };
            localStorage.setItem('systemSettings', JSON.stringify(settingsToSave));

            toast.current.show({ 
                severity: 'success', 
                summary: 'Salvo', 
                detail: 'Configurações do sistema salvas com sucesso!', 
                life: 3000 
            });
        } catch (error) {
            console.error('Erro ao salvar configurações:', error);
            toast.current.show({ 
                severity: 'error', 
                summary: 'Erro', 
                detail: 'Erro ao salvar configurações. Tente novamente.', 
                life: 5000 
            });
        } finally {
            setLoading(false);
        }
    };

    const feriadosOptions = [
        { label: 'Nacionais', value: 'nacionais' },
        { label: 'Estaduais', value: 'estaduais' },
    ];

    const estados = [
        { label: 'AC', value: 'AC' }, { label: 'AL', value: 'AL' }, { label: 'AP', value: 'AP' }, { label: 'AM', value: 'AM' },
        { label: 'BA', value: 'BA' }, { label: 'CE', value: 'CE' }, { label: 'DF', value: 'DF' }, { label: 'ES', value: 'ES' },
        { label: 'GO', value: 'GO' }, { label: 'MA', value: 'MA' }, { label: 'MT', value: 'MT' }, { label: 'MS', value: 'MS' },
        { label: 'MG', value: 'MG' }, { label: 'PA', value: 'PA' }, { label: 'PB', value: 'PB' }, { label: 'PR', value: 'PR' },
        { label: 'PE', value: 'PE' }, { label: 'PI', value: 'PI' }, { label: 'RJ', value: 'RJ' }, { label: 'RN', value: 'RN' },
        { label: 'RS', value: 'RS' }, { label: 'RO', value: 'RO' }, { label: 'RR', value: 'RR' }, { label: 'SC', value: 'SC' },
        { label: 'SP', value: 'SP' }, { label: 'SE', value: 'SE' }, { label: 'TO', value: 'TO' },
    ];

    const languages = [
        { code: 'en', name: 'English' },
        { code: 'pt', name: 'Português' },
    ];

    const timezones = [
        { label: 'São Paulo (GMT-3)', value: 'America/Sao_Paulo' },
        { label: 'Brasília (GMT-3)', value: 'America/Sao_Paulo' },
        { label: 'Buenos Aires (GMT-3)', value: 'America/Argentina/Buenos_Aires' },
        { label: 'Lisboa (GMT+0)', value: 'Europe/Lisbon' },
        { label: 'Nova York (GMT-5)', value: 'America/New_York' },
        { label: 'Londres (GMT+0)', value: 'Europe/London' },
        { label: 'Tóquio (GMT+9)', value: 'Asia/Tokyo' },
        { label: 'Los Angeles (GMT-8)', value: 'America/Los_Angeles' },
        { label: 'Paris (GMT+1)', value: 'Europe/Paris' },
        { label: 'Berlim (GMT+1)', value: 'Europe/Berlin' },
        { label: 'Dubai (GMT+4)', value: 'Asia/Dubai' },
        { label: 'Cidade do México (GMT-6)', value: 'America/Mexico_City' },
    ];

    return (
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
            <form onSubmit={(e) => e.preventDefault()}>
                <Toast ref={toast} />
                <Frame estilo="spaced">
                    <Titulo>
                        <h6>Configurações do Sistema</h6>
                    </Titulo>
                </Frame>
                <Col12>
                    <Col6>
                        <SubTitulo>Identidade Visual</SubTitulo>
                        <Texto>Nome do Sistema</Texto>
                        <CampoTexto
                            valor={sistema.brandName}
                            setValor={valor => handleChange('brandName', valor)}
                            placeholder="Digite o nome do sistema"
                        />
                        <Texto>Logo</Texto>
                        <ImageUploadContainer style={{ flexDirection: 'row', gap: 32 }}>
                            {/* Logo */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    id="sistema-logo-upload"
                                    onClick={(e) => e.stopPropagation()}
                                    onKeyDown={(e) => e.stopPropagation()}
                                />
                                {loading ? <Skeleton width="180px" height="80px" /> : (
                                    sistema.logoPreview ? (
                                        <>
                                            <ImageContainer $width="180px" $height="80px">
                                                <UploadPreview src={sistema.logoPreview} alt="Logo da empresa" />
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
                                            htmlFor="sistema-logo-upload" 
                                            $width="180px" 
                                            $height="80px"
                                            onClick={(e) => e.preventDefault()}
                                        >
                                            <UploadIcon>
                                                <RiUpload2Fill size={'28px'} />
                                                <UploadText>Clique para adicionar uma logo</UploadText>
                                            </UploadIcon>
                                        </UploadArea>
                                    )
                                )}
                                

                            </div>
                        </ImageUploadContainer>
                        <Texto>Cores da Marca</Texto>
                        {loading ? <Skeleton width={80} height={30} /> : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                    <ColorPicker value={sistema.corPrimaria} onChange={e => handleChange('corPrimaria', '#' + e.value)} style={{ height: 40 }} />
                                    <div style={{display: 'flex', flexDirection: 'column', gap: 4, flex: 1}}>
                                        <span>Cor Primária (Botões, Borda de Campos Selecionados)</span>
                                        <CampoTexto
                                            valor={sistema.corPrimaria}
                                            setValor={valor => handleColorChange('corPrimaria', valor)}
                                            placeholder="#000000"
                                            style={{ fontFamily: 'monospace', fontSize: 12 }}
                                        />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                    <ColorPicker value={sistema.corAcento} onChange={e => handleChange('corAcento', '#' + e.value)} style={{ height: 40 }} />
                                    <div style={{display: 'flex', flexDirection: 'column', gap: 4, flex: 1}}>
                                        <span>Cor de Acento (Texto dos botões com fundo da Cor Primária)</span>
                                        <CampoTexto
                                            valor={sistema.corAcento}
                                            setValor={valor => handleColorChange('corAcento', valor)}
                                            placeholder="#000000"
                                            style={{ fontFamily: 'monospace', fontSize: 12 }}
                                        />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                    <ColorPicker value={sistema.corSecundaria} onChange={e => handleChange('corSecundaria', '#' + e.value)} style={{ height: 40 }} />
                                    <div style={{display: 'flex', flexDirection: 'column', gap: 4, flex: 1}}>
                                        <span>Cor Secundária (Final do Gradient Sidebar)</span>
                                        <CampoTexto
                                            valor={sistema.corSecundaria}
                                            setValor={valor => handleColorChange('corSecundaria', valor)}
                                            placeholder="#000000"
                                            style={{ fontFamily: 'monospace', fontSize: 12 }}
                                        />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                    <ColorPicker value={sistema.corTerciaria} onChange={e => handleChange('corTerciaria', '#' + e.value)} style={{ height: 40 }} />
                                    <div style={{display: 'flex', flexDirection: 'column', gap: 4, flex: 1}}>
                                        <span>Cor Terciária (Topo do Gradient Sidebar)</span>
                                        <CampoTexto
                                            valor={sistema.corTerciaria}
                                            setValor={valor => handleColorChange('corTerciaria', valor)}
                                            placeholder="#000000"
                                            style={{ fontFamily: 'monospace', fontSize: 12 }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </Col6>
                    <Col6>
                        <SubTitulo>Localização</SubTitulo>
                        {loading ? <Skeleton width={200} height={25} /> : (
                            <>
                                <Texto>Timezone</Texto>
                                <DropdownItens
                                    valor={timezones.find(tz => tz.value === sistema.timezone) || timezones[0]}
                                    setValor={e => handleChange('timezone', e.value)}
                                    options={timezones}
                                    placeholder="Selecione o timezone"
                                    name="timezone"
                                    $height="65px"
                                    $margin="16px"
                                    optionLabel="label"
                                />
                                <Texto>Idioma padrão</Texto>
                                <DropdownItens
                                    valor={languages.find(lang => lang.code === sistema.idioma)}
                                    setValor={e => handleChange('idioma', e.code)}
                                    options={languages}
                                    placeholder="Selecione o idioma"
                                    name="idioma"
                                    $height="65px"
                                    optionLabel="name"
                                />
                            </>
                        )}
                        <SubTitulo>Feriados</SubTitulo>
                        {loading ? <Skeleton width={200} height={25} /> : (
                            <>
                                <Texto>Tipo de feriado</Texto>
                                <DropdownItens 
                                    valor={sistema.feriadosTipo}
                                    setValor={e => handleChange('feriadosTipo', e)}
                                    options={feriadosOptions}
                                    placeholder="Selecione o tipo de feriado"
                                    name="feriadosTipo"
                                    $height="65px"
                                    $margin="16px"
                                    optionLabel="label"
                                />
                                {sistema.feriadosTipo === 'estaduais' && (
                                    <>
                                        <Texto>Estado (UF)</Texto>
                                        <DropdownItens
                                            valor={sistema.feriadosUF}
                                            setValor={e => handleChange('feriadosUF', e)}
                                            options={estados}
                                            placeholder="Selecione o estado"
                                            name="feriadosUF"
                                            $height="65px"
                                            optionLabel="label"
                                        />
                                    </>
                                )}
                            </>
                        )}
                        <SubTitulo>Admissão Digital</SubTitulo>
                        {loading ? <Skeleton width={200} height={25} /> : (
                            <>
                                <SwitchContainer>
                                    <Texto>Permitir que o candidato preencha seus próprios dados?</Texto>
                                    <SwitchInput
                                        checked={sistema.candidatoPodeEditar}
                                        onChange={valor => handleChange('candidatoPodeEditar', valor)}
                                    />
                                </SwitchContainer>
                                <SwitchContainer>
                                    <Texto>Habilitar dados de habilidade do candidato?</Texto>
                                    <SwitchInput
                                        checked={sistema.habilidadesCandidato}
                                        onChange={valor => handleChange('habilidadesCandidato', valor)}
                                    />
                                </SwitchContainer>
                                <SwitchContainer>
                                    <Texto>Habilitar dados de experiência do candidato?</Texto>
                                    <SwitchInput
                                        checked={sistema.experienciaCandidato}
                                        onChange={valor => handleChange('experienciaCandidato', valor)}
                                    />
                                </SwitchContainer>
                                <SwitchContainer>
                                    <Texto>Habilitar dados de educação do candidato?</Texto>
                                    <SwitchInput
                                        checked={sistema.educacaoCandidato}
                                        onChange={valor => handleChange('educacaoCandidato', valor)}
                                    />
                                </SwitchContainer>
                            </>
                        )}
                    </Col6>
                </Col12>
                <ContainerButton>
                    <Botao 
                        estilo="vermilion" 
                        size="medium" 
                        aoClicar={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleSalvar();
                        }}
                        disabled={loading}
                    >
                        {loading ? 'Salvando...' : 'Salvar Configurações'}
                    </Botao>
                </ContainerButton>
            </form>
                {/* Modal de Corte */}
                {showCropModal && imageSrc && selectedFile && (
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
                            zIndex: 1000,
                            backdropFilter: 'blur(1px)',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <div style={{ 
                            background: '#fff', 
                            borderRadius: '16px', 
                            maxWidth: '90vw', 
                            width: '700px', 
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
                                    ✂️ Cortar Imagem
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
                                    onMouseEnter={(e) => {
                                        e.target.style.background = 'rgba(239, 68, 68, 0.2)';
                                        e.target.style.transform = 'scale(1.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = 'rgba(239, 68, 68, 0.1)';
                                        e.target.style.transform = 'scale(1)';
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                            
                            {/* Conteúdo do Modal */}
                            <div style={{ 
                                padding: '24px', 
                                display: 'flex', 
                                justifyContent: 'center', 
                                minHeight: '400px',
                                maxHeight: '60vh',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '16px',
                                    width: '100%'
                                }}>
                                    <div style={{
                                        background: '#f8fafc',
                                        border: '2px dashed #d1d5db',
                                        borderRadius: '12px',
                                        padding: '20px',
                                        textAlign: 'center',
                                        marginBottom: '16px'
                                    }}>
                                        <ReactCrop 
                                            crop={crop} 
                                            onChange={c => {
                                                console.log('Crop alterado:', c);
                                                setCrop(c);
                                            }}
                                            onComplete={(c) => {
                                                console.log('Crop completado:', c);
                                            }}
                                            aspect={1}
                                            minWidth={50}
                                            minHeight={50}
                                            style={{
                                                maxWidth: '100%',
                                                maxHeight: '50vh'
                                            }}
                                        >
                                            <img 
                                                ref={setImageRef} 
                                                src={imageSrc} 
                                                alt="Para Cortar" 
                                                style={{ 
                                                    maxWidth: '100%',
                                                    maxHeight: '50vh',
                                                    objectFit: 'contain',
                                                    borderRadius: '8px'
                                                }}
                                                onLoad={() => {
                                                    console.log('Imagem carregada no modal de corte');
                                                }}
                                                onError={(e) => {
                                                    console.error('Erro ao carregar imagem no modal:', e);
                                                }}
                                            />
                                        </ReactCrop>
                                    </div>
                                    
                                    {/* Instruções */}
                                    <div style={{
                                        background: '#f0f9ff',
                                        border: '1px solid #0ea5e9',
                                        borderRadius: '8px',
                                        padding: '12px 16px',
                                        fontSize: '14px',
                                        color: '#0c4a6e',
                                        textAlign: 'center',
                                        maxWidth: '400px'
                                    }}>
                                        <strong>💡 Como usar:</strong><br/>
                                        • Arraste para selecionar a área quadrada (1:1)<br/>
                                        • A seleção mantém sempre proporção quadrada<br/>
                                        • Clique em "Aplicar Corte" para ver o resultado
                                    </div>
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
                                    {uploading ? 'Processando imagem...' : 'Selecione a área desejada'}
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
                                        disabled={uploading}
                                        size="small"
                                    >
                                        {uploading ? '⏳ Processando...' : '✅ Aplicar Corte'}
                                    </Botao>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    }

    export default MeusDadosSistema;

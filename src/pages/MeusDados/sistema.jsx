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
import { Dropdown } from 'primereact/dropdown';
import BrandColors from '@utils/brandColors';
import SwitchInput from '@components/SwitchInput';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import imageCompression from 'browser-image-compression';
import { HiX } from 'react-icons/hi';

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
        corPrimaria: BrandColors.getBrandColors().primary,
        corSecundaria: BrandColors.getBrandColors().secondary,
        corAcento: BrandColors.getBrandColors().accent,
        corTerciaria: BrandColors.getBrandColors().tertiary,
        colaboradorPodeEditar: true,
        habilidadesCandidato: true,
        experienciaCandidato: true,
        moduloLinhasTransporte: false,
        timezone: 'America/Sao_Paulo',
        feriadosTipo: 'nacionais',
        feriadosUF: '',
        idioma: 'pt-BR',
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
        // Carrega configurações salvas do localStorage
        const savedSettings = JSON.parse(localStorage.getItem('systemSettings'));
        if (savedSettings) {
            setSistema(prev => ({ ...prev, ...savedSettings }));
        }

        // Carrega logo salva
        const savedLogo = BrandColors.getBrandLogo();
        setSistema(prev => ({
            ...prev,
            logoPreview: savedLogo || (usuario && usuario.company_logo)
        }));
        
        setLoading(false);
    }, [usuario]);

    const handleChange = (campo, valor) => {
        setSistema(prev => ({ ...prev, [campo]: valor }));
    };

    const compressImage = async (file) => {
        try {
            const options = { maxSizeMB: 1, maxWidthOrHeight: 1024, useWebWorker: true, fileType: file.type, quality: 0.8 };
            const compressedFile = await imageCompression(file, options);
            return new File([compressedFile], file.name, { type: compressedFile.type, lastModified: Date.now() });
        } catch (error) {
            console.error('Erro ao compactar imagem:', error);
            return file;
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file && file.type.match('image.*')) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onload = () => {
                setImageSrc(reader.result);
                setCrop({ unit: '%', width: 50, height: 50, x: 25, y: 25 });
                setShowCropModal(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveLogo = () => {
        setSistema(prev => ({ ...prev, logoPreview: '' }));
        BrandColors.setBrandLogo(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Logo removida com sucesso!' });
    };

    const handleCropImage = async () => {
        if (!imageRef || !crop.width || !crop.height) return;
        setUploading(true);

        const canvas = document.createElement('canvas');
        const scaleX = imageRef.naturalWidth / imageRef.width;
        const scaleY = imageRef.naturalHeight / imageRef.height;
        canvas.width = crop.width * scaleX;
        canvas.height = crop.height * scaleY;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(imageRef, crop.x * scaleX, crop.y * scaleY, crop.width * scaleX, crop.height * scaleY, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(async (blob) => {
            if (!blob) { setUploading(false); return; }
            const croppedFile = new File([blob], selectedFile.name, { type: selectedFile.type });
            const compressedFile = await compressImage(croppedFile);
            
            const reader = new FileReader();
            reader.onloadend = () => {
                const dataUrl = reader.result;
                BrandColors.setBrandLogo(dataUrl);
                setSistema(prev => ({ ...prev, logoPreview: dataUrl }));
                toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Logo atualizada com sucesso!' });
                handleCancelCrop();
            };
            reader.readAsDataURL(compressedFile);

            setUploading(false);
        }, selectedFile.type);
    };

    const handleCancelCrop = () => {
        setShowCropModal(false);
        setImageSrc('');
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSalvar = () => {
        // Salva as cores para aplicação imediata
        const newColors = {
            primary: sistema.corPrimaria,
            secondary: sistema.corSecundaria,
            accent: sistema.corAcento,
            tertiary: sistema.corTerciaria
        };
        BrandColors.setBrandColors(newColors);

        // Salva logo se foi alterada - REMOVIDO, pois salva no crop
        
        // Prepara e salva todas as configurações no localStorage
        const settingsToSave = {
            corPrimaria: sistema.corPrimaria,
            corSecundaria: sistema.corSecundaria,
            corAcento: sistema.corAcento,
            corTerciaria: sistema.corTerciaria,
            colaboradorPodeEditar: sistema.colaboradorPodeEditar,
            habilidadesCandidato: sistema.habilidadesCandidato,
            experienciaCandidato: sistema.experienciaCandidato,
            moduloLinhasTransporte: sistema.moduloLinhasTransporte,
            timezone: sistema.timezone,
            feriadosTipo: sistema.feriadosTipo,
            feriadosUF: sistema.feriadosUF,
            idioma: sistema.idioma,
        };
        localStorage.setItem('systemSettings', JSON.stringify(settingsToSave));

        toast.current.show({ severity: 'success', summary: 'Salvo', detail: 'Configurações do sistema salvas!', life: 3000 });
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
            <form>
                <Toast ref={toast} />
                <Frame estilo="spaced">
                    <Titulo>
                        <h6>Configurações do Sistema</h6>
                    </Titulo>
                </Frame>
                <Col12>
                    <Col6>
                        <SubTitulo>Identidade Visual</SubTitulo>
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
                                />
                                {loading ? <Skeleton width="180px" height="80px" /> : (
                                    sistema.logoPreview ? (
                                        <>
                                            <ImageContainer $width="180px" $height="80px">
                                                <UploadPreview src={sistema.logoPreview} alt="Logo da empresa" />
                                                <div className="hover-overlay">
                                                    <HoverIconButton onClick={() => fileInputRef.current.click()}><RiUpload2Fill /></HoverIconButton>
                                                </div>
                                            </ImageContainer>
                                            <RemoveButton onClick={handleRemoveLogo}><HiX size={12} /> Remover</RemoveButton>
                                        </>
                                    ) : (
                                        <UploadArea htmlFor="sistema-logo-upload" $width="180px" $height="80px">
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
                                    <div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
                                        <span>Cor Primária</span>
                                        <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{sistema.corPrimaria}</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                    <ColorPicker value={sistema.corSecundaria} onChange={e => handleChange('corSecundaria', '#' + e.value)} style={{ height: 40 }} />
                                    <div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
                                        <span>Cor Secundária</span>
                                        <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{sistema.corSecundaria}</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                    <ColorPicker value={sistema.corAcento} onChange={e => handleChange('corAcento', '#' + e.value)} style={{ height: 40 }} />
                                    <div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
                                        <span>Cor de Acento</span>
                                        <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{sistema.corAcento}</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                    <ColorPicker value={sistema.corTerciaria} onChange={e => handleChange('corTerciaria', '#' + e.value)} style={{ height: 40 }} />
                                    <div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
                                        <span>Cor Terciária</span>
                                        <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{sistema.corTerciaria}</span>
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
                                <Dropdown
                                    value={timezones.find(tz => tz.value === sistema.timezone) || timezones[0]}
                                    options={timezones}
                                    onChange={e => handleChange('timezone', e.value.value)}
                                    optionLabel="label"
                                    placeholder="Selecione o timezone"
                                    style={{ width: '100%', height: 65, display: 'flex', alignItems: 'center', marginBottom: 16 }}
                                />
                                <Texto>Idioma padrão</Texto>
                                <Dropdown
                                    value={languages.find(lang => lang.code === sistema.idioma)}
                                    options={languages}
                                    onChange={e => handleChange('idioma', e.value.code)}
                                    optionLabel="name"
                                    placeholder="Selecione o idioma"
                                    style={{ width: '100%', height: 65, display: 'flex', alignItems: 'center' }}
                                />
                            </>
                        )}
                        <SubTitulo>Feriados</SubTitulo>
                        {loading ? <Skeleton width={200} height={25} /> : (
                            <>
                                <Texto>Tipo de feriado</Texto>
                                <Dropdown 
                                    value={sistema.feriadosTipo}
                                    options={feriadosOptions}
                                    onChange={e => handleChange('feriadosTipo', e.value)}
                                    placeholder="Selecione o tipo de feriado"
                                    style={{ width: '100%', marginBottom: 16, height: 65, display: 'flex', alignItems: 'center' }}
                                />
                                {sistema.feriadosTipo === 'estaduais' && (
                                    <>
                                        <Texto>Estado (UF)</Texto>
                                        <Dropdown
                                            value={sistema.feriadosUF}
                                            options={estados}
                                            onChange={e => handleChange('feriadosUF', e.value)}
                                            placeholder="Selecione o estado"
                                            style={{ width: '100%', height: 65, display: 'flex', alignItems: 'center' }}
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
                                        checked={sistema.colaboradorPodeEditar}
                                        onChange={valor => handleChange('colaboradorPodeEditar', valor)}
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
                            </>
                        )}
                    </Col6>
                </Col12>
                <Col12>
                    <Col6>
                        <SubTitulo>Módulos</SubTitulo>
                        {loading ? <Skeleton width={200} height={25} /> : (
                            <SwitchContainer>
                                <Texto>Linhas de Transporte</Texto>
                                <SwitchInput
                                    checked={sistema.moduloLinhasTransporte}
                                    onChange={valor => handleChange('moduloLinhasTransporte', valor)}
                                />
                            </SwitchContainer>
                        )}
                    </Col6>
                </Col12>
                <ContainerButton>
                    <Botao estilo="vermilion" size="medium" aoClicar={handleSalvar}>Salvar Configurações</Botao>
                </ContainerButton>
            </form>
                {/* Modal de Corte */}
                {showCropModal && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10001 }}>
                        <div style={{ background: '#fff', borderRadius: '12px', maxWidth: '90vw', width: '600px', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <h3 style={{ margin: 0, fontSize: '18px' }}>Cortar Imagem</h3>
                                <button onClick={handleCancelCrop} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
                            </div>
                            <div style={{ padding: '20px', display: 'flex', justifyContent: 'center', minHeight: '300px' }}>
                                <ReactCrop crop={crop} onChange={c => setCrop(c)}>
                                    <img ref={setImageRef} src={imageSrc} alt="Para Cortar" style={{ maxHeight: '60vh' }} />
                                </ReactCrop>
                            </div>
                            <div style={{ padding: '16px 20px', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                <Botao estilo="neutro" aoClicar={handleCancelCrop}>Cancelar</Botao>
                                <Botao estilo="vermilion" aoClicar={handleCropImage} disabled={uploading}>{uploading ? 'Processando...' : 'Salvar'}</Botao>
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    }

    export default MeusDadosSistema;

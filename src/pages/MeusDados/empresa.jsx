import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Skeleton } from 'primereact/skeleton';
import { Toast } from 'primereact/toast';
import { useSessaoUsuarioContext } from "@contexts/SessaoUsuario";
import Titulo from '@components/Titulo';
import Frame from '@components/Frame';
import SubTitulo from '@components/SubTitulo';
import Texto from '@components/Texto';
import Botao from '@components/Botao';
import CampoTexto from '@components/CampoTexto';
import { RiUpload2Fill } from 'react-icons/ri';
import http from '@http';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import imageCompression from 'browser-image-compression';
import { HiX } from 'react-icons/hi';
import { FaTrash } from 'react-icons/fa';
import { ArmazenadorToken } from '@utils';
import DropdownItens from '@components/DropdownItens';

const Col12 = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;
    gap: 16px;
`;

const Col6 = styled.div`
    padding: 10px 0;
    flex: 1 1 calc(50% - 10px);
    min-width: 300px;
`;

const SectionWrapper = styled.div`
    width: 100%;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--neutro-200);
    text-align: left;
    &:last-of-type {
        margin-bottom: 0;
        padding-bottom: 0;
        border-bottom: none;
    }
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
    position: relative;

    &:hover {
        border-color: var(--primaria-escuro);
        background-color: var(--neutro-100);
    }
`;

const UploadPreview = styled.img`
    width: 100%;
    height: 100%;
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

const ContainerButton = styled.div`
    display: flex;
    width: 100%;
    padding: 20px 0;
    justify-content: flex-end;
    & button {
        width: initial;
    }
`;

function MeusDadosEmpresa() {
    const [loading, setLoading] = useState(true);
    const [empresa, setEmpresa] = useState({ logo: '', symbol: '' });
    const [dadosFaturamento, setDadosFaturamento] = useState(null);
    const [endereco, setEndereco] = useState(null);
    const toast = useRef(null);
    const { usuario, setCompanyLogo, setCompanySymbol } = useSessaoUsuarioContext();

    // State for crop modal
    const [editingImageType, setEditingImageType] = useState(null); // 'logo' or 'symbol'
    const [uploading, setUploading] = useState(false);
    const [showCropModal, setShowCropModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [crop, setCrop] = useState({ unit: '%', width: 50, height: 50, x: 25, y: 25 });
    const [imageSrc, setImageSrc] = useState('');
    const [imageRef, setImageRef] = useState(null);
    const logoInputRef = useRef(null);
    const symbolInputRef = useRef(null);
    const [estados, setEstados] = useState([]);

    useEffect(() => {
        if (!estados.length) {
            http.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
                .then(response => {
                    response.map((item) => {
                        let obj = {
                            name: item.nome,
                            code: item.sigla
                        }
                        if (!estados.includes(obj)) {
                            setEstados(estadoAnterior => [...estadoAnterior, obj]);
                        }
                    })
                })
                .catch(() => {})
                .finally(() => {});
        }

        setLoading(true);
        if (usuario && usuario.companies && usuario.companies.length > 0) {
            
            const selecionada = usuario.companies.find(c => String(c.id_tenant) === String(ArmazenadorToken.UserCompanyPublicId)) || usuario.companies[0];
            
            // Load images from localStorage first, then fallback to the selected company context
            const companySymbol = localStorage.getItem(`companySymbol_${selecionada.id_tenant}`) || selecionada.tenant?.simbolo || '';
            const companyLogo = localStorage.getItem('brandLogo') || selecionada.tenant?.logo || '';
            
            setEmpresa({ logo: companyLogo, symbol: companySymbol });

            // Load faturamento and endereco data from the selected company
            if (selecionada?.pessoaJuridica) {
                const pj = selecionada.pessoaJuridica;
                setDadosFaturamento({
                    razaoSocial: pj.razao_social || '',
                    cnpj: pj.cnpj || '',
                    nomeFantasia: pj.nome_fantasia || '',
                    banco: '',
                    agencia: '',
                    conta: '',
                    email: pj.email || '',
                    inscricaoEstadual: pj.inscricao_estadual || '',
                    inscricaoMunicipal: pj.inscricao_municipal || '',
                });
                setEndereco({
                    cep: pj.cep || '',
                    logradouro: pj.logradouro || '',
                    bairro: pj.bairro || '',
                    numero: pj.numero_logradouro || '',
                    complemento: pj.complemento || '',
                    cidade: '',
                    estado: '',
                });
            }
        }
        setLoading(false);
    }, [usuario]);

    const compressImage = async (file, isSymbol = false) => {
        try {
            const options = { maxSizeMB: 1, maxWidthOrHeight: isSymbol ? 512 : 1024, useWebWorker: true, fileType: file.type, quality: 0.8 };
            const compressedFile = await imageCompression(file, options);
            return new File([compressedFile], file.name, { type: compressedFile.type, lastModified: Date.now() });
        } catch (error) {
            console.error('Erro ao compactar imagem:', error);
            return file;
        }
    };

    const handleImageUpload = (e, imageType) => {
        const file = e.target.files[0];
        if (file && file.type.match('image.*')) {
            setEditingImageType(imageType);
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onload = () => {
                setImageSrc(reader.result);
                setCrop({ unit: '%', width: 50, height: 50, x: 25, y: 25, aspect: imageType === 'symbol' ? 1 : undefined });
                setShowCropModal(true);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleRemoveImage = async (imageType) => {
        const field = imageType === 'logo' ? 'logo' : 'simbolo';
        const formData = new FormData();
        formData.append(field, '');

        try {
            await http.put(`client_tenant/${usuario.company_public_id}/`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });

            if(imageType === 'logo') {
                localStorage.removeItem('brandLogo');
                setEmpresa(prev => ({ ...prev, logo: '' }));
                setCompanyLogo('');
            } else {
                localStorage.removeItem(`companySymbol_${usuario.company_id}`);
                setEmpresa(prev => ({ ...prev, symbol: '' }));
                setCompanySymbol('');
            }
            toast.current.show({ severity: 'success', summary: 'Sucesso', detail: `${imageType === 'logo' ? 'Logo' : 'Símbolo'} removido com sucesso!` });
        } catch(err) {
            toast.current.show({ severity: 'error', summary: 'Erro', detail: `Falha ao remover ${imageType === 'logo' ? 'a logo' : 'o símbolo'}.` });
        }
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
            const compressedFile = await compressImage(croppedFile, editingImageType === 'symbol');
            const formData = new FormData();
            const field = editingImageType === 'logo' ? 'logo' : 'simbolo';
            formData.append(field, compressedFile, compressedFile.name);

            try {
                const response = await http.put(`client_tenant/${usuario.company_public_id}/`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
                const imageUrl = response[field];
                
                const reader = new FileReader();
                reader.onloadend = () => {
                    const dataUrl = reader.result;
                    if (editingImageType === 'logo') {
                        localStorage.setItem('brandLogo', dataUrl);
                        setEmpresa(prev => ({ ...prev, logo: dataUrl }));
                        setCompanyLogo(dataUrl);
                    } else {
                        localStorage.setItem(`companySymbol_${usuario.company_id}`, dataUrl);
                        setEmpresa(prev => ({ ...prev, symbol: dataUrl }));
                        setCompanySymbol(dataUrl);
                    }
                };
                reader.readAsDataURL(compressedFile);

                toast.current.show({ severity: 'success', summary: 'Sucesso', detail: `${editingImageType === 'logo' ? 'Logo' : 'Símbolo'} atualizado com sucesso!` });
                handleCancelCrop();
            } catch (err) {
                toast.current.show({ severity: 'error', summary: 'Erro', detail: `Falha ao atualizar.` });
            } finally {
                setUploading(false);
            }
        }, selectedFile.type);
    };

    const handleCancelCrop = () => {
        setShowCropModal(false);
        setEditingImageType(null);
        setImageSrc('');
        setSelectedFile(null);
        if (logoInputRef.current) logoInputRef.current.value = '';
        if (symbolInputRef.current) symbolInputRef.current.value = '';
    };

    const handleFaturamentoChange = (campo, valor) => {
        setDadosFaturamento(prev => ({ ...prev, [campo]: valor }))
    }

    const handleEnderecoChange = (campo, valor) => {
        setEndereco(prev => ({ ...prev, [campo]: valor }))
    }

    const handleSalvar = (event) => {
        event.preventDefault();
        // TODO: Implementar PUT para dados de faturamento e endereço
        console.log("Salvando Dados de Faturamento:", dadosFaturamento);
        console.log("Salvando Endereço:", endereco);
        toast.current.show({ severity: 'success', summary: 'Salvo', detail: 'Configurações da empresa salvas!', life: 3000 });
    };

    return (
        <>
            <Toast ref={toast} />
            <Frame gap="20px">
                <Titulo><h6>Configurações da Empresa</h6></Titulo>
                
                <form onSubmit={handleSalvar}>
                    {/* Identidade Visual */}
                    <SectionWrapper>
                        <SubTitulo>Identidade Visual</SubTitulo>
                        <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap', paddingTop: '16px' }}>
                            {/* Logo */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                                <Texto>Logo</Texto>
                                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'logo')} ref={logoInputRef} style={{ display: 'none' }} id="empresa-logo-upload" />
                                {loading ? <Skeleton width="180px" height="80px" /> : (
                                    empresa.logo ? (
                                        <>
                                            <ImageContainer $width="180px" $height="80px">
                                                <UploadPreview src={empresa.logo} alt="Logo da empresa" />
                                                <div className="hover-overlay">
                                                    <HoverIconButton onClick={() => logoInputRef.current.click()}><RiUpload2Fill /></HoverIconButton>
                                                </div>
                                            </ImageContainer>
                                            <RemoveButton onClick={() => handleRemoveImage('logo')}><HiX size={12} /> Remover</RemoveButton>
                                        </>
                                    ) : (
                                        <UploadArea htmlFor="empresa-logo-upload" $width="180px" $height="80px">
                                            <UploadIcon><RiUpload2Fill /><UploadText>Adicionar Logo</UploadText></UploadIcon>
                                        </UploadArea>
                                    )
                                )}
                            </div>
                            {/* Símbolo */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                                <Texto>Símbolo</Texto>
                                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'symbol')} ref={symbolInputRef} style={{ display: 'none' }} id="empresa-symbol-upload" />
                                {loading ? <Skeleton width="120px" height="120px" /> : (
                                    empresa.symbol ? (
                                        <>
                                            <ImageContainer $width="120px" $height="120px">
                                                <UploadPreview src={empresa.symbol} alt="Símbolo da empresa" />
                                                <div className="hover-overlay">
                                                    <HoverIconButton onClick={() => symbolInputRef.current.click()}><RiUpload2Fill /></HoverIconButton>
                                                </div>
                                            </ImageContainer>
                                            <RemoveButton onClick={() => handleRemoveImage('symbol')}><HiX size={12} /> Remover</RemoveButton>
                                        </>
                                    ) : (
                                        <UploadArea htmlFor="empresa-symbol-upload">
                                            <UploadIcon><RiUpload2Fill /><UploadText>Adicionar Símbolo</UploadText></UploadIcon>
                                        </UploadArea>
                                    )
                                )}
                            </div>
                        </div>
                    </SectionWrapper>

                    {/* Dados de Faturamento */}
                    <SectionWrapper>
                        <SubTitulo>Dados de Faturamento</SubTitulo>
                        <Col12><Col6><Texto>Razão Social</Texto>{loading ? <Skeleton width={200} height={25} /> : <CampoTexto valor={dadosFaturamento?.razaoSocial} setValor={v => handleFaturamentoChange('razaoSocial', v)} />}</Col6><Col6><Texto>CNPJ</Texto>{loading ? <Skeleton width={200} height={25} /> : <CampoTexto valor={dadosFaturamento?.cnpj} setValor={v => handleFaturamentoChange('cnpj', v)} />}</Col6></Col12>
                        <Col12><Col6><Texto>Nome Fantasia</Texto>{loading ? <Skeleton width={200} height={25} /> : <CampoTexto valor={dadosFaturamento?.nomeFantasia} setValor={v => handleFaturamentoChange('nomeFantasia', v)} />}</Col6><Col6><Texto>Banco</Texto>{loading ? <Skeleton width={200} height={25} /> : <CampoTexto valor={dadosFaturamento?.banco} setValor={v => handleFaturamentoChange('banco', v)} />}</Col6></Col12>
                        <Col12><Col6><Texto>Agência</Texto>{loading ? <Skeleton width={200} height={25} /> : <CampoTexto valor={dadosFaturamento?.agencia} setValor={v => handleFaturamentoChange('agencia', v)} />}</Col6><Col6><Texto>Conta</Texto>{loading ? <Skeleton width={200} height={25} /> : <CampoTexto valor={dadosFaturamento?.conta} setValor={v => handleFaturamentoChange('conta', v)} />}</Col6></Col12>
                        <Col12><Col6><Texto>E-mail de faturamento</Texto>{loading ? <Skeleton width={200} height={25} /> : <CampoTexto valor={dadosFaturamento?.email} setValor={v => handleFaturamentoChange('email', v)} />}</Col6><Col6><Texto>Inscrição Estadual</Texto>{loading ? <Skeleton width={200} height={25} /> : <CampoTexto valor={dadosFaturamento?.inscricaoEstadual} setValor={v => handleFaturamentoChange('inscricaoEstadual', v)} />}</Col6></Col12>
                        <Col12><Col6><Texto>Inscrição Municipal</Texto>{loading ? <Skeleton width={200} height={25} /> : <CampoTexto valor={dadosFaturamento?.inscricaoMunicipal} setValor={v => handleFaturamentoChange('inscricaoMunicipal', v)} />}</Col6></Col12>
                    </SectionWrapper>

                    {/* Endereço */}
                    <SectionWrapper>
                        <SubTitulo>Endereço</SubTitulo>
                        <Col12><Col6><Texto>CEP</Texto>{loading ? <Skeleton width={200} height={25} /> : <CampoTexto type="text" patternMask={['99999-999']} valor={endereco?.cep} setValor={v => handleEnderecoChange('cep', v)} />}</Col6><Col6><Texto>Logradouro</Texto>{loading ? <Skeleton width={200} height={25} /> : <CampoTexto type="text" valor={endereco?.logradouro} setValor={v => handleEnderecoChange('logradouro', v)} />}</Col6></Col12>
                        <Col12><Col6><Texto>Bairro</Texto>{loading ? <Skeleton width={200} height={25} /> : <CampoTexto type="text" valor={endereco?.bairro} setValor={v => handleEnderecoChange('bairro', v)} />}</Col6><Col6><Texto>Número</Texto>{loading ? <Skeleton width={200} height={25} /> : <CampoTexto type="text" valor={endereco?.numero} setValor={v => handleEnderecoChange('numero', v)} />}</Col6></Col12>
                        <Col12><Col6><Texto>Complemento</Texto>{loading ? <Skeleton width={200} height={25} /> : <CampoTexto type="text" valor={endereco?.complemento} setValor={v => handleEnderecoChange('complemento', v)} />}</Col6><Col6><Texto>Cidade</Texto>{loading ? <Skeleton width={200} height={25} /> : <CampoTexto type="text" valor={endereco?.cidade} setValor={v => handleEnderecoChange('cidade', v)} />}</Col6></Col12>
                        <Col12>
                            <Col6>
                                <Texto>Estado</Texto>
                                {loading ? <Skeleton width={200} height={25} /> : 
                                    <DropdownItens
                                        options={estados}
                                        valor={estados.find(e => e.code === endereco?.estado)}
                                        setValor={option => handleEnderecoChange('estado', option ? option.code : '')}
                                        placeholder="Selecione o Estado"
                                        filter
                                    />
                                }
                            </Col6>
                            <Col6 />
                        </Col12>
                    </SectionWrapper>
                    
                    <ContainerButton>
                        <Botao type="submit" estilo="vermilion" size="medium">Salvar Configurações</Botao>
                    </ContainerButton>
                </form>
            </Frame>

            {/* Modal de Corte */}
            {showCropModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10001 }}>
                    <div style={{ background: '#fff', borderRadius: '12px', maxWidth: '90vw', width: '600px', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <h3 style={{ margin: 0, fontSize: '18px' }}>Cortar Imagem</h3>
                            <button onClick={handleCancelCrop} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
                        </div>
                        <div style={{ padding: '20px', display: 'flex', justifyContent: 'center', minHeight: '300px' }}>
                            <ReactCrop crop={crop} onChange={c => setCrop(c)} aspect={editingImageType === 'symbol' ? 1 : undefined}>
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

export default MeusDadosEmpresa;

import http from '@http'
import { useEffect, useRef, useState } from 'react'
import Titulo from '@components/Titulo'
import Texto from '@components/Texto'
import Frame from '@components/Frame'
import BotaoSemBorda from '@components/BotaoSemBorda'
import ContainerHorizontal from '@components/ContainerHorizontal'
import { Skeleton } from 'primereact/skeleton'
import styles from './MeusDados.module.css'
import { Link } from 'react-router-dom'
import { RiEditBoxFill, RiUpload2Fill } from 'react-icons/ri'
import { FaEye, FaEyeSlash, FaTrash } from 'react-icons/fa'
import { ArmazenadorToken } from '@utils'
import { Toast } from 'primereact/toast'
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import imageCompression from 'browser-image-compression';
import { HiX } from 'react-icons/hi';
import ModalAlterarTelefone from '@components/ModalAlterar/telefone'
import ModalAlterarEmail from '@components/ModalAlterar/email'
import ModalAlterarNome from '@components/ModalAlterar/nome'
import { useSessaoUsuarioContext } from "@contexts/SessaoUsuario"
import CampoTexto from '@components/CampoTexto'
import Botao from '@components/Botao'
import SubTitulo from '@components/SubTitulo'
import SwitchInput from '@components/SwitchInput'
import ModalAtivarMFA from '@components/ModalAtivarMFA'
import styled from 'styled-components'
import { Dialog } from 'primereact/dialog'
import { InputOtp } from 'primereact/inputotp'
import RadioButton from '@components/RadioButton'
import Loading from '@components/Loading';

const PasswordWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px 0;
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

// Adiciona a animação do spinner
const GlobalStyle = styled.div`
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;

function MeusDadosDadosGerais() {

    const [userProfile, setUserProfile] = useState([])
    const [modalTelefoneOpened, setModalTelefoneOpened] = useState(false)
    const [modalEmailOpened, setModalEmailOpened] = useState(false)
    const [modalNomeOpened, setModalNomeOpened] = useState(false)
    const toast = useRef(null)
    const [senhaAtual, setSenhaAtual] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [alterandoSenha, setAlterandoSenha] = useState(false);
    const [mostrarCamposSenha, setMostrarCamposSenha] = useState(false);
    
    // Visibility states for contact info
    const [isPhoneVisible, setIsPhoneVisible] = useState(false);
    const [isEmailVisible, setIsEmailVisible] = useState(false);

    // MFA States
    const [mfaAtivo, setMfaAtivo] = useState(false);
    const [modalMFAOpened, setModalMFAOpened] = useState(false);
    const [qrCode, setQrCode] = useState('');
    const [secret, setSecret] = useState('');
    const [loadingMFA, setLoadingMFA] = useState(false);

    // New state for deactivation
    const [showDisableMfaModal, setShowDisableMfaModal] = useState(false);
    const [otpForDisable, setOtpForDisable] = useState('');
    const [disablingMFA, setDisablingMFA] = useState(false);

    // State for MFA method selection and email validation
    const [showMethodSelectionModal, setShowMethodSelectionModal] = useState(false);
    const [showEmailValidationModal, setShowEmailValidationModal] = useState(false);
    const [otpForEmail, setOtpForEmail] = useState('');
    const [validatingEmailMFA, setValidatingEmailMFA] = useState(false);
    const [selectedMfaMethod, setSelectedMfaMethod] = useState('app');
    const [isSendingEmail, setIsSendingEmail] = useState(false);
    const [primaryMfaMethod, setPrimaryMfaMethod] = useState('app');

    // Estados para upload de foto de perfil
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

    const {
        usuario,
        setFirstName,
        setLastName,
        setFotoPerfil,
        setMfaRequired
    } = useSessaoUsuarioContext()

    const fileInputRef = useRef(null)
    const modalFileInputRef = useRef(null);

    const customInput = ({events, props, key}) => (
        <input 
            key={key}
            {...events} 
            {...props} 
            type="tel" 
            inputMode="numeric"
            pattern="[0-9]*"
            className="custom-otp-input"
            invalid={props.invalid ? "true" : undefined}
            unstyled={props.unstyled ? "true" : undefined}
        />
    );

    useEffect(() => {
        if(usuario)
        {
            setUserProfile(usuario);
            setMfaAtivo((usuario.mfa_required == 'true' || usuario.mfa_required == true) ? true : false);
            
        }
    }, [usuario])

    function editarTelefone(telefone) {
        let contact_info = {}
        contact_info['phone_number'] = telefone
        let obj = {
            contact_info: contact_info
        }
        http.put(`usuario/${ArmazenadorToken.UserPublicId}`, obj)
        .then(response => {
           if(response.success)
            {
                toast.current.show({ severity: 'info', summary: 'Sucesso', detail: response.message, life: 3000 });
                setModalTelefoneOpened(false)
            }
        })
        .catch(erro => console.log(erro))
    }

    function editarEmail(email) {
        let contact_info = {}
        contact_info['email'] = email
        let obj = {
            contact_info: contact_info
        }
        http.put(`usuario/${ArmazenadorToken.UserPublicId}`, obj)
        .then(response => {
           if(response.success)
            {
                toast.current.show({ severity: 'info', summary: 'Sucesso', detail: response.message, life: 3000 });
                setModalEmailOpened(false)
            }
        })
        .catch(erro => console.log(erro))
    }

    function editarNome(firstName, lastName) {
        let obj = {
            first_name: firstName || '',
            last_name: lastName || ''
        }
        http.put(`usuario/${ArmazenadorToken.UserPublicId}/`, obj)
        .then(response => {
           if(response)
            {
                toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Nome alterado com sucesso!', life: 3000 });
                setModalNomeOpened(false)
                // Atualiza o perfil local
                setUserProfile(prev => ({ ...prev, first_name: firstName, last_name: lastName }))
                // Atualiza o contexto do usuário usando as funções setter
                setFirstName(firstName);
                setLastName(lastName);
                ArmazenadorToken.definirFirstName(firstName);
                ArmazenadorToken.definirLastName(lastName);
            }
        })
        .catch(erro => {
            console.log(erro)
            toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao alterar nome', life: 3000 });
        })
    }

    const handleAlterarSenha = async () => {
        setAlterandoSenha(true);
        if (!senhaAtual || !novaSenha || !confirmarSenha) {
            toast.current.show({ severity: 'warn', summary: 'Atenção', detail: 'Preencha todos os campos.', life: 3000 });
            setAlterandoSenha(false);
            return;
        }
        if (novaSenha !== confirmarSenha) {
            toast.current.show({ severity: 'error', summary: 'Erro', detail: 'As senhas não coincidem.', life: 3000 });
            setAlterandoSenha(false);
            return;
        }

        try {
            const payload = {
                old_password: senhaAtual,
                new_password: novaSenha,
            };
            await http.post(`usuario/${ArmazenadorToken.UserPublicId}/`	, payload);

            toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Senha alterada com sucesso!', life: 3000 });
            setSenhaAtual('');
            setNovaSenha('');
            setConfirmarSenha('');
            setAlterandoSenha(false);
            setMostrarCamposSenha(false);
        } catch (error) {
            const errors = error.response?.data;
            let errorMessage = 'Não foi possível alterar a senha.';
            if (errors) {
                // Captura a primeira mensagem de erro disponível
                const errorKey = Object.keys(errors)[0];
                errorMessage = errors[errorKey][0];
            }
            toast.current.show({ severity: 'error', summary: 'Erro', detail: errorMessage, life: 3000 });
            setAlterandoSenha(false);
        }
    };

    const handleCloseMfaModal = () => {
        setModalMFAOpened(false);
        ArmazenadorToken.removerTempTokenMFA();
    };

    const handleToggleMFA = async () => {
        // Abre o modal para pedir o OTP para desativar
        if (mfaAtivo) {
            // Verifica se o método primário é email
            try {
                const mfaPreferences = await http.get('/mfa/preferences/');
                setPrimaryMfaMethod(mfaPreferences?.primary_method || 'app');
                
                if (mfaPreferences?.primary_method === 'email') {
                    // Se for email, envia o código primeiro
                    setIsSendingEmail(true);
                    try {
                        await http.post('/mfa/email/send/');
                        toast.current.show({ 
                            severity: 'success', 
                            summary: 'Enviado', 
                            detail: 'Um código de verificação foi enviado para o seu e-mail.', 
                            life: 4000 
                        });
                        setShowDisableMfaModal(true);
                    } catch (error) {
                        toast.current.show({ 
                            severity: 'error', 
                            summary: 'Erro', 
                            detail: 'Não foi possível enviar o código por e-mail.', 
                            life: 3000 
                        });
                    } finally {
                        setIsSendingEmail(false);
                    }
                } else {
                    // Se for app, abre o modal diretamente
                    setShowDisableMfaModal(true);
                }
            } catch (error) {
                // Se não conseguir verificar as preferências, assume que é app
                setPrimaryMfaMethod('app');
                setShowDisableMfaModal(true);
            }
        } else {
            // Abre o modal para escolher o método de ativação
            setShowMethodSelectionModal(true);
        }
    };

    const handleSelectAppMethod = async () => {
        setLoadingMFA(true);
        try {
            const response = await http.get('mfa/generate/');
            if (response && response.qr_code) {
                if (response.temp_token) {
                    ArmazenadorToken.definirTempTokenMFA(response.temp_token);
                }
                setQrCode(`data:image/png;base64,${response.qr_code}`);
                setSecret(response.secret || '');
                setModalMFAOpened(true);
            } else {
                toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Resposta inválida do servidor ao gerar MFA.', life: 3000 });
            }
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Não foi possível iniciar a ativação do MFA por app.', life: 3000 });
        } finally {
            setLoadingMFA(false);
        }
    };

    const handleSelectEmailMethod = async () => {
        setIsSendingEmail(true);
        try {
            await http.post('/mfa/email/send/');
            toast.current.show({ severity: 'success', summary: 'Enviado', detail: 'Um código de verificação foi enviado para o seu e-mail.', life: 4000 });
            setShowEmailValidationModal(true);
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Não foi possível enviar o código por e-mail.', life: 3000 });
        } finally {
            setIsSendingEmail(false);
        }
    };
    
    const handleConfirmMfaMethod = () => {
        setShowMethodSelectionModal(false);
        if (selectedMfaMethod === 'app') {
            handleSelectAppMethod();
        } else if (selectedMfaMethod === 'email') {
            handleSelectEmailMethod();
        }
    };

    const onMfaActivationSuccess = async () => {
        await http.put(`/usuario/${ArmazenadorToken.UserPublicId}/`, { mfa_required: true });
        ArmazenadorToken.definirMfaRequired(true);
        setMfaRequired(true);
        setMfaAtivo(true);
        toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'MFA ativado com sucesso!', life: 3000 });
    };

    const handleConfirmMFA = async (verificationCode) => {
        try {
            ArmazenadorToken.definirTempTokenMFA(ArmazenadorToken.AccessToken);
            await http.post('/mfa/validate/', { otp: verificationCode });
            await onMfaActivationSuccess();
            setModalMFAOpened(false);
        } catch (error) {
            const errorMessage = error?.response?.data?.otp?.[0] || 'Código de verificação inválido. Tente novamente.';
            toast.current.show({ severity: 'error', summary: 'Erro', detail: errorMessage, life: 3000 });
            throw error;
        } finally {
            ArmazenadorToken.removerTempTokenMFA();
        }
    };

    const handleConfirmEmailMFA = async () => {
        if (!otpForEmail || otpForEmail.length < 6) {
            toast.current.show({ severity: 'warn', summary: 'Atenção', detail: 'Por favor, insira o código de 6 dígitos.', life: 3000 });
            return;
        }
        setValidatingEmailMFA(true);
        try {
            ArmazenadorToken.definirTempTokenMFA(ArmazenadorToken.AccessToken);
            await http.post('/mfa/email/validate/', { otp: otpForEmail });
            await onMfaActivationSuccess();
            setShowEmailValidationModal(false);
        } catch (error) {
            const errorMessage = error?.response?.data?.detail || 'Código de verificação de e-mail inválido.';
            toast.current.show({ severity: 'error', summary: 'Erro', detail: errorMessage, life: 3000 });
        } finally {
            await http.put(`/mfa/preferences/`, { primary_method: 'email' });
            ArmazenadorToken.definirMfaRequired(true);
            setMfaRequired(true);
            setMfaAtivo(true);
            ArmazenadorToken.removerTempTokenMFA();
            setValidatingEmailMFA(false);
            setOtpForEmail('');
        }
    };

    const handleConfirmDisableMFA = async () => {
        if (!otpForDisable || otpForDisable.length < 6) {
            toast.current.show({ severity: 'warn', summary: 'Atenção', detail: 'Por favor, insira o código de 6 dígitos.', life: 3000 });
            return;
        }

        setDisablingMFA(true);
        try {
            if(primaryMfaMethod === 'app') {
                await http.post('mfa/disable/', { otp: otpForDisable });
            }
            else {
                await http.put(`/mfa/preferences/`, { primary_method: 'app' });
            }

            setMfaAtivo(false);
            setShowDisableMfaModal(false);
            toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'MFA desativado com sucesso!', life: 3000 });
        } catch (error) {
            const errorMessage = error?.response?.data?.detail || 'Código de verificação inválido.';
            toast.current.show({ severity: 'error', summary: 'Erro', detail: errorMessage, life: 3000 });
        } finally {
            setOtpForDisable('');
            await http.put(`/usuario/${ArmazenadorToken.UserPublicId}/`, { mfa_required: false });
            ArmazenadorToken.definirMfaRequired(false);
            setMfaRequired(false);
            setDisablingMFA(false);
        }
    }

    const maskEmail = (email) => {
        if (!email) {
            return '';
        }
        const [localPart, domain] = email.split('@');
        if (!domain) {
            if (email.length < 2) return '*'.repeat(email.length);
            return email.substring(0, 2) + '*'.repeat(email.length - 2);
        }

        if (localPart.length <= 2) {
            return `${localPart}@${domain}`;
        }

        const maskedLocal = localPart.substring(0, 2) + '*'.repeat(localPart.length - 2);
        return `${maskedLocal}@${domain}`;
    };

    const maskPhoneNumber = (phoneCode, phoneNumber) => {
        if (!phoneCode || !phoneNumber) {
            return '';
        }
        const lastFourDigits = phoneNumber.slice(-4);
        const maskedPart = '*'.repeat(phoneNumber.length - 4);
        return `(${phoneCode}) ${maskedPart}-${lastFourDigits}`;
    };

    // Funções para upload de foto de perfil
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
        formData.append('foto_perfil', ''); // Envia string vazia para remover
        
        http.put(`usuario/${ArmazenadorToken.UserPublicId}/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .then(() => {
            setUserProfile(prev => ({ ...prev, foto_perfil: null }));
            setFotoPerfil('');
            ArmazenadorToken.definirFotoPerfil(null);
            toast.current.show({ 
                severity: 'success', 
                summary: 'Sucesso', 
                detail: 'Foto removida com sucesso!', 
                life: 3000 
            });
        })
        .catch(erro => {
            console.error("Erro ao remover foto:", erro);
            toast.current.show({ 
                severity: 'error', 
                summary: 'Erro', 
                detail: 'Falha ao remover a foto.', 
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
            formData.append('foto_perfil', compressedFile);
            
            const uploadResponse = await http.put(`usuario/${ArmazenadorToken.UserPublicId}/`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            
            setUserProfile(prev => ({ ...prev, foto_perfil: uploadResponse.foto_perfil }));
            setFotoPerfil(uploadResponse.foto_perfil);
            ArmazenadorToken.definirFotoPerfil(uploadResponse.foto_perfil);
            
            toast.current.show({ 
                severity: 'success', 
                summary: 'Sucesso', 
                detail: 'Foto atualizada com sucesso!', 
                life: 4000 
            });
            
            setShowCropModal(false);
        } catch (erro) {
            console.error("Erro no upload:", erro);
            toast.current.show({ 
                severity: 'error', 
                summary: 'Erro', 
                detail: 'Falha no upload da foto.', 
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
                height: 50,
                x: 25,
                y: 25,
                aspect: 1,
            });
        }
    }, [showCropSelection, isCropped]);

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


    return (
        <>
        <Loading opened={isSendingEmail} />
        <style>
            {`
                .custom-otp-input {
                    width: 40px;
                    font-size: 36px;
                    border: 0 none;
                    appearance: none;
                    text-align: center;
                    transition: all 0.2s;
                    background: transparent;
                    border-bottom: 2px solid var(--surface-500);
                }

                .custom-otp-input:focus {
                    outline: 0 none;
                    border-bottom-color: var(--primary-color);
                }

                @media screen and (max-width: 768px) {
                    .custom-otp-input {
                        width: 35px;
                        font-size: 28px;
                    }
                }

                @media screen and (max-width: 480px) {
                    .custom-otp-input {
                        width: 50px;
                        font-size: 24px;
                    }
                }

                @media screen and (max-width: 360px) {
                    .custom-otp-input {
                        width: 35px;
                        font-size: 20px;
                    }
                }
            `}
        </style>
        <Toast ref={toast} />
        <GlobalStyle />
        <Titulo><h6>Informações gerais</h6></Titulo>
        <div className={styles.card_dashboard}>
            {/* Container principal com foto e nome lado a lado */}
            <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '24px',
                marginBottom: '24px',
                paddingBottom: '24px',
                borderBottom: '1px solid #f1f5f9'
            }}>
                {/* Foto de Perfil */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    flexShrink: 0
                }}>
                    <div style={{ marginBottom: userProfile?.foto_perfil && userProfile?.foto_perfil !== "" ? '12px' : '0' }}>
                        {userProfile?.foto_perfil && userProfile?.foto_perfil !== "" ? (
                            <ImageContainer>
                                <img 
                                    src={userProfile.foto_perfil.includes(import.meta.env.VITE_API_BASE_DOMAIN) ? userProfile.foto_perfil : `https://dirhect.${import.meta.env.VITE_API_BASE_DOMAIN}/${userProfile.foto_perfil}`}
                                    alt={`Foto de ${userProfile?.first_name || userProfile?.name || 'Usuário'}`}
                                    style={{
                                        width: '120px',
                                        height: '120px',
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
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    style={{ display: 'none' }}
                                    id="user-profile-image-change-hover"
                                />
                                <button
                                    className="hover-button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        document.getElementById('user-profile-image-change-hover').click();
                                    }}
                                    disabled={uploading}
                                    title="Alterar foto"
                                >
                                    <RiUpload2Fill size={20} />
                                </button>
                            </ImageContainer>
                        ) : (
                            <>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    id="user-profile-image-upload"
                                />
                                <UploadArea htmlFor="user-profile-image-upload" style={{ width: '120px', height: '120px' }}>
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
                        )}
                        {/* Fallback para quando a imagem falha ao carregar */}
                        <div style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #e2e8f0, #cbd5e1)',
                            display: 'none',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '42px',
                            fontWeight: 'bold',
                            color: '#64748b',
                            border: '2px solid #f8fafc',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                        }}>
                            {(userProfile?.first_name || userProfile?.name)?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                    </div>

                    {/* Botão de remover quando há foto */}
                    {userProfile?.foto_perfil && userProfile?.foto_perfil !== "" && (
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

                {/* Informações do usuário */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    flex: 1,
                    minHeight: '120px'
                }}>
                    {!userProfile || Object.keys(userProfile).length === 0 ? (
                        <Skeleton variant="rectangular" width={250} height={40} />
                    ) : (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%',
                            gap: '24px'
                        }}>
                            <div style={{ flex: 1 }}>
                                <Texto style={{ marginBottom: '8px' }}>Nome completo</Texto>
                                <Texto weight="800" style={{ fontSize: '24px', color: '#1e293b' }}>
                                    {userProfile?.first_name && userProfile?.last_name 
                                        ? `${userProfile.first_name} ${userProfile.last_name}`.trim()
                                        : userProfile?.first_name || userProfile?.last_name || userProfile?.name || '---'
                                    }
                                </Texto>
                            </div>
                            <div style={{ flexShrink: 0 }}>
                                <BotaoSemBorda>
                                    <RiEditBoxFill size={18} />
                                    <Link to="#" onClick={() => setModalNomeOpened(true)} className={styles.link}>
                                        Alterar
                                    </Link>
                                </BotaoSemBorda>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
        
        <Titulo><h6>Segurança da Conta</h6></Titulo>
        <div className={styles.card_dashboard}>
            <SubTitulo>Alterar Senha</SubTitulo>
            {!mostrarCamposSenha && (
                <BotaoSemBorda aoClicar={() => setMostrarCamposSenha(true)}>
                    <RiEditBoxFill size={18} />
                    <span className={styles.link}>Alterar</span>
                </BotaoSemBorda>
            )}

            {mostrarCamposSenha && (
                <PasswordWrapper>
                    <CampoTexto label="Senha Atual" tipo="password" valor={senhaAtual} setValor={setSenhaAtual} />
                    <CampoTexto label="Nova Senha" tipo="password" valor={novaSenha} setValor={setNovaSenha} />
                    <CampoTexto label="Confirmar Nova Senha" tipo="password" valor={confirmarSenha} setValor={setConfirmarSenha} />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
                        <Botao estilo="neutro" size="medium" aoClicar={() => setMostrarCamposSenha(false)}>Cancelar</Botao>
                        <Botao estilo="vermilion" size="medium" aoClicar={handleAlterarSenha} disabled={alterandoSenha}>
                            {alterandoSenha ? 'Alterando...' : 'Alterar Senha'}
                        </Botao>
                    </div>
                </PasswordWrapper>
            )}

            <hr style={{width: '100%', border: 'none', borderTop: '1px solid var(--neutro-200)', margin: '24px 0'}} />

            <SubTitulo>Autenticação de Múltiplos Fatores (MFA)</SubTitulo>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingTop: '8px' }}>
                <Texto>Ativar MFA no seu próximo login</Texto>
                <SwitchInput checked={mfaAtivo} onChange={handleToggleMFA} disabled={loadingMFA} />
            </div>
        </div>

        <Titulo><h6>Informações de contato</h6></Titulo>
        <div className={styles.card_dashboard}>
            <ContainerHorizontal width="50%">
                {!userProfile || Object.keys(userProfile).length === 0 ? (
                    <Skeleton variant="rectangular" width={250} height={40} />
                ) : (
                    <>
                        <Frame gap="5px">
                            <Texto>Telefone/Celular</Texto>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                {userProfile.phones && userProfile.phones.length > 0 && userProfile.phones[0].phone_number ? (
                                    <>
                                        <Texto weight="800">
                                            {isPhoneVisible
                                                ? `(${userProfile.phones[0].phone_code}) ${userProfile.phones[0].phone_number}`
                                                : maskPhoneNumber(userProfile.phones[0].phone_code, userProfile.phones[0].phone_number)}
                                        </Texto>
                                        <BotaoSemBorda aoClicar={() => setIsPhoneVisible(!isPhoneVisible)}>
                                            {isPhoneVisible ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                                        </BotaoSemBorda>
                                    </>
                                ) : (
                                    <Texto weight="800">---</Texto>
                                )}
                            </div>
                        </Frame>
                        <BotaoSemBorda>
                            <RiEditBoxFill size={18} />
                            <Link to="#" onClick={() => setModalTelefoneOpened(true)} className={styles.link}>
                                {userProfile.phones && userProfile.phones.length > 0 && userProfile.phones[0].phone_number ? 'Alterar' : 'Adicionar'}
                            </Link>
                        </BotaoSemBorda>
                    </>
                )}
            </ContainerHorizontal>
            <ContainerHorizontal width="50%">
                {!userProfile || Object.keys(userProfile).length === 0 ? (
                     <Skeleton variant="rectangular" width={250} height={40} />
                ) : (
                    <>
                        <Frame gap="5px">
                            <Texto>E-mail</Texto>
                             <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                {userProfile.email ? (
                                    <>
                                        <Texto weight="800">
                                            {isEmailVisible ? userProfile.email : maskEmail(userProfile.email)}
                                        </Texto>
                                        <BotaoSemBorda aoClicar={() => setIsEmailVisible(!isEmailVisible)}>
                                            {isEmailVisible ? <FaEyeSlash size={16}/> : <FaEye size={16} />}
                                        </BotaoSemBorda>
                                    </>
                                ) : (
                                    <Texto weight="800">---</Texto>
                                )}
                            </div>
                        </Frame>
                        <BotaoSemBorda>
                            <RiEditBoxFill size={18} />
                            <Link to="#" onClick={() => setModalEmailOpened(true)} className={styles.link}>
                                {userProfile.email ? 'Alterar' : 'Adicionar'}
                            </Link>
                        </BotaoSemBorda>
                    </>
                )}
            </ContainerHorizontal>
        </div>
        <ModalAlterarTelefone dadoAntigo={(userProfile && userProfile.phones && userProfile.phones.length) ? ('(' + userProfile.phones[0].phone_code + ') ' + userProfile.phones[0].phone_number) : ''} aoClicar={editarTelefone} opened={modalTelefoneOpened} aoFechar={() => setModalTelefoneOpened(!modalTelefoneOpened)} />
        <ModalAlterarEmail dadoAntigo={userProfile.email ?? ''} aoClicar={editarEmail} opened={modalEmailOpened} aoFechar={() => setModalEmailOpened(!modalEmailOpened)} />
        <ModalAlterarNome 
            firstName={userProfile?.first_name} 
            lastName={userProfile?.last_name}
            fotoPerfil={userProfile?.foto_perfil}
            aoClicar={editarNome} 
            opened={modalNomeOpened} 
            aoFechar={() => setModalNomeOpened(!modalNomeOpened)} 
        />
        <ModalAtivarMFA 
            opened={modalMFAOpened}
            aoFechar={handleCloseMfaModal}
            qrCode={qrCode}
            secret={secret}
            onConfirm={handleConfirmMFA}
        />
        <Dialog 
            header="Escolha um Método de Autenticação" 
            visible={showMethodSelectionModal} 
            style={{ width: '30vw', minWidth: '400px' }} 
            onHide={() => setShowMethodSelectionModal(false)}
            footer={
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', paddingTop: '16px' }}>
                    <Botao estilo="neutro" size="medium" aoClicar={() => setShowMethodSelectionModal(false)}>Cancelar</Botao>
                    <Botao estilo="vermilion" size="medium" aoClicar={handleConfirmMfaMethod} disabled={loadingMFA}>
                        {loadingMFA ? 'Aguarde...' : 'Confirmar'}
                    </Botao>
                </div>
            }
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '16px 0' }}>
                <Texto>Selecione como você prefere proteger sua conta.</Texto>
                <div className="flex flex-column gap-3" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="flex align-items-center" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <RadioButton id="mfaMethodApp" name="mfaMethod" value="app" onSelected={(e) => setSelectedMfaMethod(e)} checked={selectedMfaMethod === 'app'} />
                        <label htmlFor="mfaMethodApp" style={{ cursor: 'pointer' }}>
                            Aplicativo Autenticador
                            <Texto size="small" color="var(--neutro-500)" style={{ display: 'block', marginTop: '4px' }}>
                                Ex: Google Authenticator, Authy, Microsoft Authenticator
                            </Texto>
                        </label>
                    </div>
                    <div className="flex align-items-center" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <RadioButton id="mfaMethodEmail" name="mfaMethod" value="email" onSelected={(e) => setSelectedMfaMethod(e)} checked={selectedMfaMethod === 'email'} />
                        <label htmlFor="mfaMethodEmail" style={{ cursor: 'pointer' }}>
                            E-mail
                            <Texto size="small" color="var(--neutro-500)" style={{ display: 'block', marginTop: '4px' }}>
                                Será enviado para {maskEmail(userProfile?.email)}
                            </Texto>
                        </label>
                    </div>
                </div>
            </div>
        </Dialog>
        <Dialog 
            header="Verificação por E-mail" 
            visible={showEmailValidationModal} 
            style={{ width: '30vw', minWidth: '400px' }} 
            onHide={() => setShowEmailValidationModal(false)}
            footer={
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', paddingTop: '16px' }}>
                    <Botao estilo="neutro" size="medium" aoClicar={() => setShowEmailValidationModal(false)}>Cancelar</Botao>
                    <Botao estilo="vermilion" size="medium" aoClicar={handleConfirmEmailMFA} disabled={validatingEmailMFA}>
                        {validatingEmailMFA ? 'Verificando...' : 'Confirmar e Ativar'}
                    </Botao>
                </div>
            }
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', padding: '16px 0' }}>
                <Texto>Insira o código de 6 dígitos enviado para o seu e-mail para concluir a ativação.</Texto>
                <InputOtp 
                    key="otp-email"
                    value={otpForEmail} 
                    onChange={(e) => setOtpForEmail(e.value)} 
                    length={6}
                    inputTemplate={customInput}
                />
            </div>
        </Dialog>
        <Dialog 
            header="Desativar Autenticação de Múltiplos Fatores" 
            visible={showDisableMfaModal} 
            style={{ width: '30vw', minWidth: '400px' }} 
            onHide={() => setShowDisableMfaModal(false)}
            footer={
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', paddingTop: '16px' }}>
                    <Botao estilo="neutro" size="medium" aoClicar={() => setShowDisableMfaModal(false)}>Cancelar</Botao>
                    <Botao estilo="vermilion" size="medium" aoClicar={handleConfirmDisableMFA} disabled={disablingMFA}>
                        {disablingMFA ? 'Desativando...' : 'Confirmar e Desativar'}
                    </Botao>
                </div>
            }
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', padding: '16px 0' }}>
                <Texto>
                    {primaryMfaMethod === 'email' 
                        ? 'Insira o código de 6 dígitos enviado para o seu e-mail para confirmar a desativação.'
                        : 'Insira o código de 6 dígitos do seu aplicativo de autenticação para confirmar a desativação.'
                    }
                </Texto>
                <InputOtp 
                    key="otp-disable"
                    value={otpForDisable} 
                    onChange={(e) => setOtpForDisable(e.value)} 
                    length={6}
                    inputTemplate={customInput}
                />
            </div>
        </Dialog>

        {/* Modal de visualização da foto */}
        {showImageModal && userProfile?.foto_perfil && userProfile?.foto_perfil !== "" && (
            <ImageModal onClick={(e) => {
                if (e.target === e.currentTarget) {
                    setShowImageModal(false);
                }
            }}>
                <ImageModalContent>
                    <ImageModalImage 
                        src={userProfile.foto_perfil} 
                        alt={`Foto de ${userProfile?.first_name || userProfile?.name || 'Usuário'}`} 
                    />
                    <div style={{display: 'flex', gap: '12px'}}>
                        <input
                            type="file"
                            accept="image/*"
                            ref={modalFileInputRef}
                            onChange={handleImageUpload}
                            style={{ display: 'none' }}
                            id="user-profile-image-change-modal"
                        />
                         <ImageModalButton onClick={() => modalFileInputRef.current.click()}>
                            <RiUpload2Fill /> Alterar Foto
                        </ImageModalButton>
                        <ImageModalButton onClick={handleRemoveImage} style={{background: '#ef4444', color: 'white'}}>
                            <FaTrash fill='var(--white)'/> Remover Foto
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
                        <h3 style={{ margin: 0, color: '#374151', fontSize: '18px' }}>Cortar Foto</h3>
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
                            {uploading ? 'Processando...' : (showCropSelection && !isCropped) ? 'Aplique ou cancele o corte' : (isCropped ? 'Salvar' : 'Salvar Foto Original')}
                        </button>
                    </div>
                </div>
            </div>
        )}
        </>
    )
}
export default MeusDadosDadosGerais
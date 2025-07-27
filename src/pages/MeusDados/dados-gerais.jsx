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
import { RiEditBoxFill } from 'react-icons/ri'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { ArmazenadorToken } from '@utils'
import { Toast } from 'primereact/toast'
import ModalAlterarTelefone from '@components/ModalAlterar/telefone'
import ModalAlterarEmail from '@components/ModalAlterar/email'
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

function MeusDadosDadosGerais() {

    const [userProfile, setUserProfile] = useState([])
    const [modalTelefoneOpened, setModalTelefoneOpened] = useState(false)
    const [modalEmailOpened, setModalEmailOpened] = useState(false)
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

    const {
        usuario,
        setMfaRequired
    } = useSessaoUsuarioContext()

    const customInput = ({events, props}) => (
        <input 
            {...events} 
            {...props} 
            type="tel" 
            inputMode="numeric"
            pattern="[0-9]*"
            className="custom-otp-input" 
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
            setShowDisableMfaModal(true);
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
            await http.post('mfa/disable/', { otp: otpForDisable });

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
        <Titulo><h6>Informações gerais</h6></Titulo>
        <div className={styles.card_dashboard}>
            <Texto>Nome completo</Texto>
            {userProfile?.name ?
                <Texto weight="800">{userProfile.name}</Texto>
                : <Skeleton variant="rectangular" width={200} height={25} />
            }
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
                <InputOtp value={otpForEmail} onChange={(e) => setOtpForEmail(e.value)} length={6} inputTemplate={customInput} />
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
                <Texto>Insira o código de 6 dígitos do seu aplicativo de autenticação para confirmar a desativação.</Texto>
                <InputOtp value={otpForDisable} onChange={(e) => setOtpForDisable(e.value)} length={6} inputTemplate={customInput} />
            </div>
        </Dialog>
        </>
    )
}
export default MeusDadosDadosGerais
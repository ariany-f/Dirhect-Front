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

    const {
        usuario,
        setMfaRequired
    } = useSessaoUsuarioContext()

    useEffect(() => {
        if(usuario)
        {
            setUserProfile(usuario);
            setMfaAtivo(usuario.mfa_required == 'true' ? true : false);
        }
    }, [usuario])

    function editarTelefone(telefone) {
        let contact_info = {}
        contact_info['phone_number'] = telefone
        let obj = {
            contact_info: contact_info
        }
        http.put(`api/auth/me/${ArmazenadorToken.UserCompanyPublicId}`, obj)
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
        http.put(`api/auth/me/${ArmazenadorToken.UserCompanyPublicId}`, obj)
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
                new_password1: novaSenha,
                new_password2: confirmarSenha,
            };
            await http.post('auth/users/set_password/', payload);

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
        ArmazenadorToken.removerTempToken();
    };

    const handleToggleMFA = async () => {
        if (mfaAtivo) {
            // Abre o modal para pedir o OTP para desativar
            setShowDisableMfaModal(true);
        } else {
            // Lógica para iniciar ativação
            setLoadingMFA(true);
            try {
                const response = await http.get('mfa/generate/');
                if (response && response.qr_code) {
                   
                    if (response.temp_token) {
                        ArmazenadorToken.definirTempToken(response.temp_token);
                    }
                    setQrCode(`data:image/png;base64,${response.qr_code}`);
                    setSecret(response.secret || '');
                    setModalMFAOpened(true);
                } else {
                    toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Resposta inválida do servidor ao gerar MFA.', life: 3000 });
                }
            } catch (error) {
                toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Não foi possível iniciar a ativação do MFA.', life: 3000 });
            } finally {
                setLoadingMFA(false);
            }
        }
    };
    
    const handleConfirmMFA = async (verificationCode) => {
        try {
            ArmazenadorToken.definirTempTokenMFA(ArmazenadorToken.AccessToken);
            await http.post('/mfa/validate/', { otp: verificationCode });
            setMfaAtivo(true);
            setModalMFAOpened(false);
            toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'MFA ativado com sucesso!', life: 3000 });
        } catch (error) {
            const errorMessage = error?.response?.data?.otp?.[0] || 'Código de verificação inválido. Tente novamente.';
            toast.current.show({ severity: 'error', summary: 'Erro', detail: errorMessage, life: 3000 });
            throw error; // Re-lança para que o onConfirm do modal possa lidar com o loading state se necessário
        } finally {
            await http.put(`/usuario/${ArmazenadorToken.UserPublicId}/`, { mfa_required: true });
            ArmazenadorToken.definirMfaRequired(true);
            setMfaRequired(true);
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


    return (
        <>
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
                {(Object.keys(userProfile)?.length && userProfile.phones && userProfile?.phones.length) ?
                    <>
                    <Frame gap="5px">
                        <Texto>Telefone/Celular</Texto>
                        {userProfile.phones[0].phone_number ?
                            <Texto weight="800">({userProfile?.phones[0].phone_code}) {userProfile?.phones[0].phone_number}</Texto>
                            : '---'
                        }
                    </Frame>
                    <BotaoSemBorda>
                        <RiEditBoxFill size={18} />
                        <Link to="#" onClick={() => {setModalTelefoneOpened(true)}} className={styles.link}>Alterar</Link>
                    </BotaoSemBorda>
                    </>
                    : <Skeleton variant="rectangular" width={200} height={25} />
                }
            </ContainerHorizontal>
            <ContainerHorizontal width="50%">
                {Object.keys(userProfile)?.length ?
                    <>
                        <Frame gap="5px">
                            <Texto>E-mail</Texto>
                            {userProfile.email ?
                                <Texto weight="800">{userProfile?.email}</Texto>
                                : <Skeleton variant="rectangular" width={200} height={25} />
                            }
                        </Frame>
                        <BotaoSemBorda>
                            <RiEditBoxFill size={18} />
                            <Link to="#" onClick={() => setModalEmailOpened(true)} className={styles.link}>Alterar</Link>
                        </BotaoSemBorda>
                    </>
                    : <Skeleton variant="rectangular" width={200} height={25} />
                }
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
                <InputOtp value={otpForDisable} onChange={(e) => setOtpForDisable(e.value)} length={6} />
            </div>
        </Dialog>
        </>
    )
}
export default MeusDadosDadosGerais
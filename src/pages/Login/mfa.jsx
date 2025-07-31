import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { InputOtp } from 'primereact/inputotp';
import Botao from '@components/Botao';
import { toast } from 'react-toastify'
import Frame from '@components/Frame';
import BotaoVoltar from '@components/BotaoVoltar';
import BotaoSemBorda from '@components/BotaoSemBorda';
import Titulo from '@components/Titulo';
import SubTitulo from '@components/SubTitulo';
import { useNavigate, useParams } from 'react-router-dom';
import http from '@http';
import { useSessaoUsuarioContext } from "@contexts/SessaoUsuario";
import { ArmazenadorToken } from '@utils';

function Mfa() {
    const navegar = useNavigate();
    const { confirmed, method } = useParams();
    const [otpCode, setOtpCode] = useState('');
    const [countdown, setCountdown] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const { control, handleSubmit, formState: { errors } } = useForm();

    const { 
        usuario,
        setRemember,
        usuarioEstaLogado,
        setUsuarioEstaLogado,
        setCpf,
        setEmail,
        setTipo,
        setGroups,
        setPassword,
        setUserPublicId,
        setName,
        setMfaRequired,
    } = useSessaoUsuarioContext();

    // Contador para o botão de reenvio
    useEffect(() => {
        let interval;
        if (countdown > 0) {
            interval = setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        } else {
            setCanResend(true);
        }
        return () => clearInterval(interval);
    }, [countdown]);

    const customInput = ({events, props, key}) => (
        <input 
            key={key}
            {...events} 
            {...props} 
            type="tel" 
            inputMode="numeric"
            pattern="[0-9]*"
            className="custom-otp-input" 
        />
    );

    const handleSuccessfulLogin = (response) => {
        try {
            
            const expiration = new Date();
            expiration.setMinutes(expiration.getMinutes() + 15);

            ArmazenadorToken.definirToken(
                response.access,
                expiration,
                response.refresh,
                response.permissions
            );
            
            setEmail(response.user.email);
            setCpf(response.user.cpf ?? '');
            setUserPublicId(response.user.id);
            setName(response.user.first_name + ' ' + response.user.last_name);
            
            setUsuarioEstaLogado(true);
            
            const gruposValidos = response.groups.filter(grupo => !grupo.startsWith('_'));
            
            if (gruposValidos.length > 1) {
                setGroups(response.groups);
                ArmazenadorToken.definirUsuario(
                    response.user.first_name + ' ' + response.user.last_name,
                    response.user.email,
                    response.user.cpf ?? '',
                    response.user.id,
                    '', '', '', '', '', 
                    response.user.mfa_required,
                    response.user.perfil,
                    response.user.first_name,
                    response.user.last_name,
                    response.user.foto_perfil
                );
                ArmazenadorToken.removerTempToken();
                ArmazenadorToken.definirGrupos(response.groups);
                navegar('/login/selecionar-grupo');
            } else {
                const grupoSelecionado = gruposValidos[0] || response.groups[0];
                setTipo(grupoSelecionado);
                ArmazenadorToken.definirUsuario(
                    response.user.first_name + ' ' + response.user.last_name,
                    response.user.email,
                    response.user.cpf ?? '',
                    response.user.id,
                    grupoSelecionado,
                    '', '', '', '', 
                    response.user.mfa_required,
                    response.user.perfil,
                    response.user.first_name,
                    response.user.last_name,
                    response.user.foto_perfil
                );
                ArmazenadorToken.removerTempToken();   
                navegar('/login/selecionar-empresa');
            }
        } catch (error) {
            toast.error('Erro ao processar login: ' + error.message);
        }
    };

    async function handleMfaValidade() {
        return new Promise((resolve, reject) => {
            http.post('/mfa/validate/', { otp: otpCode })
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
        });
    }

    async function handleToken() {
        return new Promise((resolve, reject) => {
            http.post('/token/', { otp: otpCode })
            .then(response => {
                console.log(response)
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
        });
    }

    async function handleEmailMfaValidate() {
        console.log('handleEmailMfaValidate chamado com otpCode:', otpCode);
        return new Promise((resolve, reject) => {
            http.post('/mfa/email/validate/', { otp: otpCode })
                .then(response => {
                    console.log('handleEmailMfaValidate sucesso:', response);
                    resolve(response);
                })
                .catch(error => {
                    console.log('handleEmailMfaValidate erro:', error);
                    reject(error);
                });
        });
    }

    async function handleResendCode() {
        setResendLoading(true);
        try {
            if (method === 'email') {
                await http.post('/mfa/email/send/');
                toast.success('Código de verificação reenviado para o seu e-mail.');
            } else {
                await http.post('/mfa/generate/');
                toast.success('Novo código OTP gerado no seu aplicativo de autenticação.');
            }
            
            // Reset do contador
            setCountdown(30);
            setCanResend(false);
        } catch (error) {
            if (method === 'email') {
                toast.error('Erro ao reenviar o código de verificação por e-mail.');
            } else {
                toast.error('Erro ao gerar novo código OTP.');
            }
        } finally {
            setResendLoading(false);
        }
    }

    async function handleVerifyOtp() {
        console.log('handleVerifyOtp chamado');
        console.log('confirmed:', confirmed);
        console.log('method:', method);
        
        if (confirmed === 'true') {
            console.log('Usando fluxo confirmed=true');
            const validationPromise = method === 'email' 
                ? handleEmailMfaValidate() 
                : handleToken();

            validationPromise
                .then(response => {
                    console.log('Resposta de sucesso:', response);
                    toast.success('Token verificado com sucesso!');
                    handleSuccessfulLogin(response);
                })
                .catch(error => {
                    console.log('Erro capturado:', error);
                    if (error.otp) {
                        toast.error(error.otp[0]);
                    } else if (error.detail) {
                        toast.error(error.detail);
                    } else {
                        toast.error('Erro ao verificar Token!');
                    }
                });
        } else {
            console.log('Usando fluxo confirmed=false');
            await handleMfaValidade()
            .then(response => {
                console.log('Resposta de sucesso (mfaValidade):', response);
                handleSuccessfulLogin(response);
            })
            .catch(error => {
                console.log('Erro capturado (mfaValidade):', error);
                if(error.otp)
                {
                    toast.error(error.otp[0]);
                }else{
                    toast.error('Erro ao verificar Token!');
                }
            });
        }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '0 20px' }}>
            <style scoped>
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
            <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '50px'}}>
                <Frame gap="20px">
                    <BotaoVoltar />
                    <Titulo>
                        <h2>Segurança</h2>
                        <SubTitulo>
                            Digite o código OTP {method == 'email' ? 'enviado para o seu e-mail' : 'gerado no seu aplicativo de autenticação'} para continuar
                        </SubTitulo>
                    </Titulo>
                </Frame>
                <Frame alinhamento="center" gap="20px" alinhamentoLabel="left">
                    <InputOtp 
                        length={6} 
                        value={otpCode} 
                        onChange={(e) => setOtpCode(e.value)} 
                        inputTemplate={customInput}
                        className="w-full"
                        unstyled={false}
                    />
                    <Botao aoClicar={handleVerifyOtp}>Verificar Código</Botao>
                    
                    <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        gap: '10px',
                        marginTop: '10px'
                    }}>
                        {!canResend ? (
                            <p style={{ 
                                fontSize: '14px', 
                                color: 'var(--surface-600)',
                                margin: 0
                            }}>
                                Reenviar código em {countdown}s
                            </p>
                        ) : (
                            <BotaoSemBorda
                                aoClicar={handleResendCode}
                                disabled={resendLoading}
                                color="var(--primaria)"
                            >
                                {resendLoading ? 'Reenviando...' : 'Reenviar Código'}
                            </BotaoSemBorda>
                        )}
                    </div>
                </Frame>
            </div>
        </div>
    )
}

export default Mfa;

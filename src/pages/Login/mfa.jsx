import { useEffect, useState } from 'react';
import { useSessaoUsuarioContext } from '@contexts/SessaoUsuario';
import http from '@http';
import { useForm } from 'react-hook-form';
import { InputOtp } from 'primereact/inputotp';
import Botao from '@components/Botao';
import { toast } from 'react-toastify'
import Frame from '@components/Frame';
import BotaoVoltar from '@components/BotaoVoltar';
import Titulo from '@components/Titulo';
import SubTitulo from '@components/SubTitulo';
import { useNavigate } from 'react-router-dom';


function Mfa() {
    const navegar = useNavigate();
    const { usuario } = useSessaoUsuarioContext();
    const [mfaEnabled, setMfaEnabled] = useState(false);
    const [mfaSecret, setMfaSecret] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const { control, handleSubmit, formState: { errors } } = useForm();

    const [teste, setTeste] = useState(false);

    const customInput = ({events, props}) => <input {...events} {...props} type="text" className="custom-otp-input" />;

    function base64_decode(str) {      
        return decodeURIComponent(escape(window.atob( str )))
    }
    
    useEffect(() => {
        http.get('/mfa/status/').
        then(response => {
            if(response.mfa_enabled) {
                setMfaEnabled(true);
            }else {
                handleMfa();
            }
        })
        .catch(error => {
            toast.error('Erro ao verificar status do MFA!');
        });
    }, [usuario]);

    function handleMfa() {
        http.get('/mfa/generate/')
        .then(response => {
            setMfaSecret(response);
        })
        .catch(error => {
            toast.error('Erro ao gerar QR Code!');
        });
    }

    function handleVerifyOtp() {
        http.post('/mfa/validate/', { token: otpCode })
        .then(response => {
            toast.success('Token verificado com sucesso!');
            console.log(response);
        })
        .catch(error => {
            if(error.error)
            {
                toast.error(error.error);
            }
            else {
                toast.error('Erro ao verificar Token!');
            }
        }).finally(() => {
            navegar('/login/selecionar-empresa');
        });
    }

    return (
        <div className="flex flex-column align-items-center justify-content-center min-h-screen p-4">
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
            `}
            </style>
            {mfaEnabled ? 
                mfaSecret?.qr_code ? (
                    <div>
                        <img 
                            src={`data:image/png;base64,${mfaSecret.qr_code}`} 
                            alt="QR Code"
                            width="100%"
                        />
                        <Botao aoClicar={() => setMfaSecret(null)}>Prosseguir</Botao>
                    </div>
                ) : (
                   <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '50px'}}>
                        <Frame gap="20px">
                            <BotaoVoltar />
                            <Titulo>
                                <h2>Segurança</h2>
                                <SubTitulo>
                                    Digite o código OTP para continuar
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
                            />
                            <Botao aoClicar={handleVerifyOtp}>Verificar Código</Botao>
                        </Frame>
                    </div> 
                )
            : (
                <div>
                    <img 
                        src={`data:image/png;base64,${mfaSecret.qr_code}`} 
                        alt="QR Code"
                        width="100%"
                    />
                    <Botao aoClicar={() => setMfaSecret(null)}>Prosseguir</Botao>
                </div>
            )}
        </div>
    )
}

export default Mfa;

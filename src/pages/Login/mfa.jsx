import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { InputOtp } from 'primereact/inputotp';
import Botao from '@components/Botao';
import { toast } from 'react-toastify'
import Frame from '@components/Frame';
import BotaoVoltar from '@components/BotaoVoltar';
import Titulo from '@components/Titulo';
import SubTitulo from '@components/SubTitulo';
import { useNavigate } from 'react-router-dom';
import http from '@http';
import { useSessaoUsuarioContext } from "@contexts/SessaoUsuario";
import { ArmazenadorToken } from '@utils';

function Mfa() {
    const navegar = useNavigate();
    const [otpCode, setOtpCode] = useState('');
    const { control, handleSubmit, formState: { errors } } = useForm();

    const { 
        usuario,
        setRemember,
        usuarioEstaLogado,
        setUsuarioEstaLogado,
        setCpf,
        setEmail,
        setTipo,
        setPassword,
        setUserPublicId,
        setName,
        setMfaRequired,
    } = useSessaoUsuarioContext();

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

    function handleVerifyOtp() {
        http.post('/token/', { otp: otpCode })
        .then(response => {

            toast.success('Token verificado com sucesso!');

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
            setTipo(response.groups[0]);
            setUserPublicId(response.user.id);
            setName(response.user.first_name + ' ' + response.user.last_name);

            ArmazenadorToken.definirUsuario(
                response.user.first_name + ' ' + response.user.last_name,
                response.user.email,
                response.user.cpf ?? '',
                response.user.id,
                response.groups[0],
                '', 
                '', 
                '', 
                '', 
                response.mfa_required
            );
            ArmazenadorToken.removerTempToken();   
            
            setUsuarioEstaLogado(true);
            console.log(usuarioEstaLogado);
            navegar('/login/selecionar-empresa');
        })
        .catch(error => {
            if(error.error) {
                toast.error(error.error);
            } else {
                toast.error('Erro ao verificar Token!');
            }
        });
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
        </div>
    )
}

export default Mfa;

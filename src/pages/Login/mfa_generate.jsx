import { useState, useEffect } from 'react';
import Botao from '@components/Botao';
import { toast } from 'react-toastify'
import Frame from '@components/Frame';
import BotaoVoltar from '@components/BotaoVoltar';
import Titulo from '@components/Titulo';
import SubTitulo from '@components/SubTitulo';
import { useNavigate } from 'react-router-dom';
import http from '@http';

function MfaGenerate() {
    const navegar = useNavigate();
    const [mfaSecret, setMfaSecret] = useState('');

    useEffect(() => {
        handleMfa();
    }, []);

    function handleMfa() {
        http.get('/mfa/generate/')
        .then(response => {
            setMfaSecret(response);
        })
        .catch(error => {
            toast.error('Erro ao gerar QR Code!');
        });
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '0 20px' }}>
            <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '50px'}}>
                <Frame gap="20px">
                    <BotaoVoltar />
                    <Titulo>
                        <h2>Configuração MFA</h2>
                        <SubTitulo>
                            Escaneie o QR Code com seu aplicativo autenticador
                        </SubTitulo>
                    </Titulo>
                </Frame>
                <Frame alinhamento="center" gap="20px">
                    {mfaSecret?.qr_code && 
                        <img 
                            src={`data:image/png;base64,${mfaSecret.qr_code}`} 
                            alt="QR Code"
                            style={{ maxWidth: '300px', width: '100%' }}
                        />
                    }
                    <Botao aoClicar={() => navegar('/login/mfa/false')}>Tudo Pronto!</Botao>
                </Frame>
            </div>
        </div>
    )
}

export default MfaGenerate;

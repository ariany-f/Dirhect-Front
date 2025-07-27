import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import Botao from '@components/Botao';
import { InputOtp } from 'primereact/inputotp';
import styled from 'styled-components';
import { HiCheckCircle } from 'react-icons/hi';
import Texto from '@components/Texto';
import CampoTexto from '@components/CampoTexto';
import SubTitulo from '@components/SubTitulo';
import { Skeleton } from 'primereact/skeleton';

const ModalContainer = styled.div`
    display: flex;
    gap: 32px;
    padding: 24px 8px;

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: center;
        text-align: center;
    }
`;

const Column = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const QRCodeColumn = styled(Column)`
    align-items: center;
    justify-content: center;
`;

const VerificationColumn = styled(Column)`
    justify-content: center;
`;


const ModalAtivarMFA = ({ opened, aoFechar, qrCode, secret, onConfirm }) => {
    const [verificationCode, setVerificationCode] = useState('');
    const [loading, setLoading] = useState(false);

    const customInput = ({ events, props }) => (
        <input
            {...events}
            {...props}
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            className="custom-otp-input"
        />
    );

    const handleConfirm = async () => {
        setLoading(true);
        try {
            await onConfirm(verificationCode);
        } catch (error) {
            // O erro já é tratado no componente pai, apenas para o loading
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Limpa o código quando o modal é fechado ou reaberto
        if (!opened) {
            setVerificationCode('');
        }
    }, [opened]);

    const footerContent = (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
            <Botao estilo="neutro" size="medium" aoClicar={aoFechar}>Cancelar</Botao>
            <Botao estilo="vermilion" size="medium" aoClicar={handleConfirm} disabled={loading || verificationCode.length < 6}>
                {loading ? 'Verificando...' : 'Ativar MFA'}
            </Botao>
        </div>
    );

    return (
        <Dialog 
            header="Ativar Autenticação de Múltiplos Fatores (MFA)" 
            visible={opened} 
            style={{ width: '90%', maxWidth: '700px' }} 
            onHide={aoFechar} 
            footer={footerContent}
            blockScroll
            draggable={false}
        >
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
                `}
            </style>
            <ModalContainer>
                <QRCodeColumn>
                    <SubTitulo>1. Escaneie o QR Code</SubTitulo>
                    {qrCode ? (
                        <img src={qrCode} alt="MFA QR Code" style={{ width: '200px', height: '200px' }} />
                    ) : (
                        <Skeleton width="200px" height="200px" />
                    )}
                    {secret && (
                        <div style={{ textAlign: 'center', paddingTop: '8px' }}>
                            <Texto>Não consegue escanear? Use esta chave:</Texto>
                            <Texto weight="bold" style={{ userSelect: 'all', background: 'var(--neutro-100)', padding: '8px 12px', borderRadius: '4px', wordBreak: 'break-all', marginTop: '8px' }}>
                                {secret}
                            </Texto>
                        </div>
                    )}
                </QRCodeColumn>
                <VerificationColumn>
                    <SubTitulo>2. Digite o código</SubTitulo>
                    <Texto>Use seu aplicativo de autenticação (ex: Google Authenticator) para escanear a imagem e digite o código de 6 dígitos.</Texto>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <InputOtp 
                            value={verificationCode} 
                            onChange={(e) => setVerificationCode(e.value)} 
                            length={6} 
                            inputTemplate={customInput}
                        />
                    </div>
                </VerificationColumn>
            </ModalContainer>
        </Dialog>
    );
};

export default ModalAtivarMFA; 
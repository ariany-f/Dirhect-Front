import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import CampoTexto from '@components/CampoTexto';
import Botao from '@components/Botao';
import BotaoSemBorda from '@components/BotaoSemBorda';
import BotaoGrupo from '@components/BotaoGrupo';
import { RiCloseFill } from 'react-icons/ri';
import styled from 'styled-components';
import { Overlay, DialogEstilizado } from '@components/Modal/styles';
import Titulo from '@components/Titulo';
import Frame from '@components/Frame';
import styles from './ModalAlterar.module.css';

const ProfileImage = styled.div`
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: bold;
    color: #64748b;
    background: linear-gradient(135deg, #e2e8f0, #cbd5e1);
    border: 2px solid #f8fafc;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`;

function ModalAlterarNome({ opened = false, aoFechar, aoClicar, firstName = '', lastName = '', fotoPerfil = '' }) {
    const [primeiroNome, setPrimeiroNome] = useState('');
    const [sobrenome, setSobrenome] = useState('');

    useEffect(() => {
        if (opened) {
            setPrimeiroNome(firstName || '');
            setSobrenome(lastName || '');
        }
    }, [opened, firstName, lastName]);

    const handleSalvar = () => {
        if (!primeiroNome.trim()) {
            return;
        }
        aoClicar(primeiroNome.trim(), sobrenome.trim());
    };

    const handleFechar = () => {
        setPrimeiroNome('');
        setSobrenome('');
        aoFechar();
    };

    return (
        opened && (
            <Overlay>
                <DialogEstilizado $width="40vw" $minWidth="400px" open={opened}>
                    <Frame>
                        <Titulo>
                            <button className="close" onClick={handleFechar}>
                                <RiCloseFill size={20} className="fechar" />
                            </button>
                            <h6>Alterar Nome</h6>
                        </Titulo>
                    </Frame>
                    <Frame padding="24px 0px">
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <CampoTexto
                                label="Primeiro Nome"
                                valor={primeiroNome}
                                setValor={setPrimeiroNome}
                                type="text"
                                placeholder="Digite seu primeiro nome"
                                required={true}
                            />
                            <CampoTexto
                                label="Sobrenome"
                                valor={sobrenome}
                                setValor={setSobrenome}
                                type="text"
                                placeholder="Digite seu sobrenome"
                            />
                        </div>
                    </Frame>
                    <BotaoGrupo>
                        <Botao
                            aoClicar={handleFechar}
                            estilo="neutro"
                            size="medium"
                            filled
                        >
                            Cancelar
                        </Botao>
                        <Botao
                            aoClicar={handleSalvar}
                            estilo="vermilion"
                            size="medium"
                            filled
                            disabled={!primeiroNome.trim()}
                        >
                            Salvar
                        </Botao>
                    </BotaoGrupo>
                </DialogEstilizado>
            </Overlay>
        )
    );
}

export default ModalAlterarNome; 
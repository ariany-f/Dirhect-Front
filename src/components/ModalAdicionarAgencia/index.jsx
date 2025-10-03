import React, { useState, useEffect } from 'react';
import { Overlay, DialogEstilizado } from '@components/Modal/styles';
import Titulo from '@components/Titulo';
import { RiCloseFill } from 'react-icons/ri';
import CampoTexto from '@components/CampoTexto';
import Frame from '@components/Frame';
import Botao from '@components/Botao';
import { FormContainer, ActionsContainer } from './styles';

const ModalAdicionarAgencia = ({ opened, aoFechar, aoSalvar, valorBusca, bancoId }) => {
    const [numero, setNumero] = useState('');
    const [nome, setNome] = useState('');

    useEffect(() => {
        if (opened) {
            setNumero(valorBusca || '');
            setNome('');
        }
    }, [opened, valorBusca]);

    const handleSalvar = () => {
        if (!numero) {
            alert('O número da agência é obrigatório.');
            return;
        }
        aoSalvar({
            numero,
            nome,
            banco: bancoId,
        });
    };

    if (!opened) {
        return null;
    }

    return (
        <Overlay onClick={aoFechar}>
            <DialogEstilizado open={opened} onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
                <Frame>
                    <Titulo>
                        <button className="close" onClick={aoFechar}>
                            <RiCloseFill size={20} className="fechar" />
                        </button>
                        <h6>Adicionar Nova Agência</h6>
                    </Titulo>
                </Frame>
                <FormContainer>
                    <CampoTexto
                        label="Número da Agência"
                        valor={numero}
                        setValor={setNumero}
                        placeholder="Digite o número da agência"
                        disabled
                    />
                    <CampoTexto
                        label="Nome da Agência (Opcional)"
                        valor={nome}
                        setValor={setNome}
                        placeholder="Digite o nome da agência"
                    />
                </FormContainer>
                <ActionsContainer>
                    <Botao estilo="neutro" size="medium" aoClicar={aoFechar}>
                        Cancelar
                    </Botao>
                    <Botao estilo="vermilion" size="medium" filled aoClicar={handleSalvar}>
                        Salvar Agência
                    </Botao>
                </ActionsContainer>
            </DialogEstilizado>
        </Overlay>
    );
};

export default ModalAdicionarAgencia; 
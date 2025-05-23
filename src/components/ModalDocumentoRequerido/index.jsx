import React, { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import CampoTexto from '@components/CampoTexto';
import { Dropdown } from 'primereact/dropdown';
import SwitchInput from '@components/SwitchInput';
import Botao from '@components/Botao';
import { FaSave } from 'react-icons/fa';

const tiposArquivos = [
    { label: 'PDF', value: 'PDF' },
    { label: 'Imagem', value: 'Imagem' },
    { label: 'Word', value: 'Word' },
    { label: 'Excel', value: 'Excel' },
    { label: 'Outros', value: 'Outros' },
];

function ModalDocumentoRequerido({ opened, documento, aoFechar, aoSalvar }) {
    const [nome, setNome] = useState('');
    const [tipoArquivo, setTipoArquivo] = useState('PDF');
    const [obrigatorio, setObrigatorio] = useState(true);

    useEffect(() => {
        if (documento) {
            setNome(documento.nome || '');
            setTipoArquivo(documento.tipoArquivo || 'PDF');
            setObrigatorio(!!documento.obrigatorio);
        } else {
            setNome('');
            setTipoArquivo('PDF');
            setObrigatorio(true);
        }
    }, [documento, opened]);

    const handleSalvar = () => {
        if (!nome) return;
        aoSalvar({ nome, tipoArquivo, obrigatorio });
    };

    return (
        <Dialog header={documento ? 'Editar Documento' : 'Adicionar Documento'} visible={opened} style={{ width: '400px' }} onHide={aoFechar} footer={null} closable>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <CampoTexto label="Nome do Documento" valor={nome} setValor={setNome} width="100%" />
                <div>
                    <label style={{ fontWeight: 600, marginBottom: 4, display: 'block' }}>Tipo de Arquivo</label>
                    <Dropdown value={tipoArquivo} options={tiposArquivos} onChange={e => setTipoArquivo(e.value)} placeholder="Selecione o tipo" style={{ width: '100%' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <label style={{ fontWeight: 600 }}>Obrigatório</label>
                    <SwitchInput checked={obrigatorio} onChange={e => setObrigatorio(e.value)} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 12 }}>
                    <Botao size="small" aoClicar={aoFechar} variante="secundario">Cancelar</Botao>
                    <Botao size="small" aoClicar={handleSalvar} disabled={!nome}><FaSave fill="white" /> Salvar</Botao>
                </div>
            </div>
        </Dialog>
    );
}

export default ModalDocumentoRequerido; 
import React, { useState, useEffect } from 'react';
import { OverlayRight, DialogEstilizadoRight } from '@components/Modal/styles';
import Botao from '@components/Botao';
import BotaoGrupo from '@components/BotaoGrupo';
import Frame from '@components/Frame';
import Titulo from '@components/Titulo';
import { RiCloseFill } from 'react-icons/ri';
import CampoArquivo from '@components/CampoArquivo';
import BotaoSemBorda from '@components/BotaoSemBorda';
import { FaFile, FaCheck, FaEye } from 'react-icons/fa';

function ModalItemKitAdmissional({ opened, aoFechar, aoSalvar, item }) {
    const [nome, setNome] = useState('');
    const [arquivo, setArquivo] = useState(null);

    useEffect(() => {
        if (item && opened) {
            setNome(item.nome || '');
            setArquivo(null); // Não pré-carrega arquivo
        } else if (opened && !item) {
            setNome('');
            setArquivo(null);
        }
    }, [item, opened]);

    const handleFileChange = (e) => {
        setArquivo(e.target.files[0]);
    };

    const handleSalvar = () => {
        if (!nome) return;
        aoSalvar({ nome, arquivo });
        setNome('');
        setArquivo(null);
    };

    const handleFechar = () => {
        setNome('');
        setArquivo(null);
        aoFechar();
    };

    function getArquivoNome(arquivo) {
        if (!arquivo) return '';
        if (arquivo instanceof File) return arquivo.name;
        if (typeof arquivo === 'string') {
            const partes = arquivo.split('/');
            return decodeURIComponent(partes[partes.length - 1]);
        }
        return '';
    }

    function getArquivoUrl(arquivo) {
        if (!arquivo) return '';
        if (arquivo instanceof File) return '';
        if (arquivo.includes(import.meta.env.VITE_API_BASE_DOMAIN)) return arquivo;
        const caminhoLimpo = arquivo.startsWith('/') ? arquivo.substring(1) : arquivo;
        return `https://dirhect.${import.meta.env.VITE_API_BASE_DOMAIN}/${caminhoLimpo}`;
    }

    return (
        <OverlayRight $opened={opened}>
            <DialogEstilizadoRight $width="40vw" id="modal-item-kit" open={opened} $opened={opened}>
                <Frame>
                    <Titulo>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                            <h6 style={{marginBottom: 0}}>{item ? 'Editar Item do Kit Admissional' : 'Adicionar Item ao Kit Admissional'}</h6>
                            <button className="close" onClick={handleFechar} formMethod="dialog">
                                <RiCloseFill size={20} className="fechar" />
                            </button>
                        </div>
                    </Titulo>
                </Frame>
                <Frame gap="20px" padding="24px 0px">
                    <div style={{ width: '100%' }}>
                        <label style={{ fontWeight: 500 }}>Nome do Item</label>
                        <input
                            type="text"
                            value={nome}
                            onChange={e => setNome(e.target.value)}
                            style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ccc', marginTop: 6, fontSize: 15 }}
                            placeholder="Ex: DIRETORIA SP"
                        />
                    </div>
                    <div style={{ width: '100%' }}>
                        <CampoArquivo
                            nome={nome || 'Arquivo'}
                            valor={arquivo || (item && item.arquivo) || null}
                            onFileChange={handleFileChange}
                            label={'Arquivo'}
                            accept={'.pdf,.jpg,.jpeg,.png'}
                        />
                        {(arquivo || (item && item.arquivo)) && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, padding: 8, background: 'var(--surface-100)', borderRadius: 4 }}>
                                <FaFile />
                                <span style={{ fontSize: 14, color: 'var(--text-color)', flex: 1 }}>{getArquivoNome(arquivo || (item && item.arquivo))}</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                                        <FaCheck /> Enviado
                                    </div>
                                    {((item && item.arquivo) || arquivo) && (
                                        <BotaoSemBorda
                                            aoClicar={() => {
                                                const url = getArquivoUrl(arquivo || item.arquivo);
                                                if (url) window.open(url, '_blank');
                                            }}
                                            color="var(--primary-color)"
                                        >
                                            <FaEye /> Visualizar
                                        </BotaoSemBorda>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </Frame>
                <form method="dialog">
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, padding: '0 24px 24px 24px' }}>
                        <Botao aoClicar={handleFechar} estilo="neutro" formMethod="dialog" size="medium" filled>Cancelar</Botao>
                        <Botao aoClicar={handleSalvar} estilo="vermillion" size="medium" filled disabled={!nome}>Salvar</Botao>
                    </div>
                </form>
            </DialogEstilizadoRight>
        </OverlayRight>
    );
}

export default ModalItemKitAdmissional;

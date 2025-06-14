import { useState, useRef, useEffect } from "react";
import { RiCloseFill, RiUpload2Fill } from 'react-icons/ri';
import styled from "styled-components";
import Botao from "@components/Botao";
import Frame from "@components/Frame";
import CampoTexto from "@components/CampoTexto";
import Titulo from "@components/Titulo";
import styles from './ModalOperadoras.module.css';
import { Toast } from "primereact/toast";
import { OverlayRight, DialogEstilizadoRight } from '@components/Modal/styles';

const ImageUploadContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    margin: 20px 0;
`;

const UploadArea = styled.label`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 200px;
    height: 200px;
    border: 2px dashed var(--primaria);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    background-color: ${props => props.$hasImage ? 'transparent' : 'var(--neutro-50)'};
    overflow: hidden;
    
    &:hover {
        border-color: var(--primaria-escuro);
        background-color: var(--neutro-100);
    }
`;

const UploadPreview = styled.img`
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
`;

const UploadIcon = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    color: var(--primaria);
    
    & svg {
        font-size: 48px;
        margin-bottom: 8px;
    }
`;

const UploadText = styled.span`
    text-align: center;
    color: var(--neutro-600);
    padding: 0 16px;
    font-size: 12px;
`;

function ModalOperadoras({ opened = false, aoFechar, aoSalvar, operadora }) {
    const [nome, setNome] = useState('');
    const [ativo, setAtivo] = useState(true);
    const [imagem, setImagem] = useState(null);
    const [previewImagem, setPreviewImagem] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);
    const [base64Image, setBase64Image] = useState('');
    const toast = useRef(null);

    // Preencher campos ao abrir para edição
    useEffect(() => {
        if (opened && operadora) {
            setNome(operadora.nome || '');
            setAtivo(operadora.ativo || true);
            setImagem(null);
            setBase64Image('');
            setPreviewImagem(operadora.imagem_url || '');
        } else if (opened) {
            setNome('');
            setAtivo(true);
            setImagem(null);
            setBase64Image('');
            setPreviewImagem('');
        }
    }, [opened, operadora]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.match('image.*')) {
            setImagem(file);
            
            // Criar preview
            const reader = new FileReader();
            reader.onload = (event) => {
                setPreviewImagem(event.target.result);
            };
            reader.onloadend = () => {
                setBase64Image(reader.result); // Aqui está a imagem em base64
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImagem(null);
        setPreviewImagem('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async () => {
        if (!nome.trim()) {
            toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Por favor, informe o nome da operadora' });
            return;
        }

        setIsUploading(true);
        
        try {
            await aoSalvar({
                nome: nome,
                imagem: imagem,
                base64Image: base64Image,
                ativo: ativo
            });
           
        } catch (error) {
            console.error('Erro ao salvar operadora:', error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <OverlayRight $opened={opened}>
            <Toast ref={toast} />
            <DialogEstilizadoRight $align="flex-start" $width="40vw" open={opened} $opened={opened}>
                <Frame>
                    <Titulo>
                        <button className="close" onClick={aoFechar}>
                            <RiCloseFill size={20} className="fechar" />  
                        </button>
                        <h6>{operadora ? 'Editar Operadora' : 'Nova Operadora'}</h6>
                    </Titulo>
                </Frame>
                <br/>
                <Frame padding="24px">
                    <CampoTexto
                        name="nome"
                        valor={nome}
                        setValor={setNome}
                        type="text"
                        label="Nome da Operadora*"
                        placeholder="Digite o nome da operadora"
                    />
                    
                    <ImageUploadContainer>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            id="operadora-image-upload"
                        />
                        
                        <UploadArea 
                            htmlFor="operadora-image-upload"
                            $hasImage={!!previewImagem}
                        >
                            {previewImagem ? (
                                <UploadPreview 
                                    src={previewImagem} 
                                    alt="Preview da imagem da operadora"
                                />
                            ) : (
                                <UploadIcon>
                                    <RiUpload2Fill size={'28px'} />
                                    <UploadText>Clique para adicionar uma imagem</UploadText>
                                    <UploadText>(PNG, JPG, até 2MB)</UploadText>
                                </UploadIcon>
                            )}
                        </UploadArea>
                        
                        {previewImagem && (
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <Botao 
                                    aoClicar={() => fileInputRef.current.click()}
                                    estilo="neutro" 
                                    size="small"
                                >
                                    Alterar Imagem
                                </Botao>
                                <Botao 
                                    aoClicar={handleRemoveImage}
                                    estilo="erro" 
                                    size="small"
                                >
                                    Remover Imagem
                                </Botao>
                            </div>
                        )}
                    </ImageUploadContainer>
                </Frame>
                
                <div className={styles.containerBottom}>
                    <Botao 
                        aoClicar={aoFechar} 
                        estilo="neutro" 
                        size="medium" 
                        filled
                        disabled={isUploading}
                    >
                        Cancelar
                    </Botao>
                    <Botao 
                        aoClicar={handleSubmit} 
                        estilo="vermilion" 
                        size="small" 
                        filled
                        loading={isUploading}
                    >
                        {isUploading ? 'Salvando...' : 'Salvar Operadora'}
                    </Botao>
                </div>
            </DialogEstilizadoRight>
        </OverlayRight>
    );
}

export default ModalOperadoras;
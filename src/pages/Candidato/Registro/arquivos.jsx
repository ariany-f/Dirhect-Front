import React, { useState } from 'react';
import CampoArquivo from '@components/CampoArquivo';
import axios from 'axios';

const CandidatoRegistroArquivos = () => {
    const [arquivos, setArquivos] = useState([
        { id: 1, nome: 'RG', caminho: null },
        { id: 2, nome: 'Comprovante de Residência', caminho: null }
    ]);

    const handleUpload = async (arquivoId, file) => {
        if (!file) return;
        
        try {
            // Converte o arquivo para Base64
            const base64 = await convertToBase64(file);
    
            // Atualiza a interface com o nome do arquivo antes do upload
            setArquivos((prev) =>
                prev.map((arquivo) =>
                    arquivo.id === arquivoId ? { ...arquivo, caminho: file.name } : arquivo
                )
            );
    
            // Monta o JSON para a API
            const payload = {
                base64: {
                    fileName: base64, // Envia o Base64 no formato correto
                },
            };
    
            // Faz a requisição para a API
            const response = await axios.post('https://api-homolog.nxcd.app/full-ocr/v4', payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'ApiKey 67af9caf49a98cd56801648b:m98bx4uYC3MbutgRlBN_l-k3',
                },
            });
    
            // Atualiza a lista com o caminho retornado pela API
            setArquivos((prev) =>
                prev.map((arquivo) =>
                    arquivo.id === arquivoId ? { ...arquivo, caminho: response.data.caminho } : arquivo
                )
            );
        } catch (error) {
            console.error('Erro ao enviar arquivo:', error);
        } finally {
            setLoading(false);
        }
    };
    
    // Função para converter um arquivo para Base64
    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]); // Pega apenas o Base64 puro
            reader.onerror = (error) => reject(error);
        });
    };    

    return (
        <div>
            <h3>Arquivos</h3>
            {arquivos.map((arquivo) => (
                <div key={arquivo.id}>
                    <p>{arquivo.nome}</p>
                    <CampoArquivo
                        onFileChange={(file) => handleUpload(arquivo.id, file)}
                        accept=".pdf, .jpg, .png"
                        id={`arquivo-${arquivo.id}`}
                        name={`arquivo-${arquivo.id}`}
                    />
                    {arquivo.caminho && <p>Arquivo selecionado: {arquivo.caminho}</p>}
                </div>
            ))}
        </div>
    );
};

export default CandidatoRegistroArquivos;
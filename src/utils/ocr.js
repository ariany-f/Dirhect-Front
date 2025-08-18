// Utilitário para OCR
import axios from 'axios';

export async function buscarDadosOCR(file) {
    if (!file) return null;
    // Converte o arquivo para Base64
    const base64 = await convertToBase64(file);
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
            'Authorization': `ApiKey ${import.meta.env.VITE_NEXT_CODE_API}`,
        },
    });
    return response.data;
}

export function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]); // Pega apenas o Base64 puro
        reader.onerror = (error) => reject(error);
    });
} 
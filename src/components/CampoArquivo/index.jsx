import React, { useRef } from 'react';
import styled from 'styled-components';
import { FaUpload } from 'react-icons/fa';
import Botao from '@components/Botao';
import Texto from '@components/Texto';

const CampoArquivoContainer = styled.div`
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
`;

const CampoArquivoInput = styled.input`
    display: none;
`;

const CampoArquivoBotao = styled(Botao)`
    margin-top: 10px;
`;

const CampoArquivo = ({ label, onFileChange, disabled = false, accept = "*", id, name }) => {

    const inputRef = useRef(null);

    const handleClick = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && onFileChange) {
            onFileChange(file);
        }
    };

    return (
        <CampoArquivoContainer>
            {label && 
                <label htmlFor={id}>{label}</label>
            }
            <CampoArquivoInput
                ref={inputRef}
                type="file"
                id={id}
                name={name}
                accept={accept}
                disabled={disabled}
                onChange={handleFileChange}
            />
            <CampoArquivoBotao
                type="button"
                aoClicar={handleClick}
                disabled={disabled}
                estilo="vermilion"
                size="medium"
                filled
            >
                <Texto color="white" weight="600">
                    <FaUpload size={14} /> &nbsp;&nbsp;Selecionar arquivo
                </Texto>
            </CampoArquivoBotao>
        </CampoArquivoContainer>
    );
};

export default CampoArquivo;
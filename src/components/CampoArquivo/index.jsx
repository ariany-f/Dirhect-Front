import React, { useRef } from 'react';
import styled from 'styled-components';
import { FaUpload } from 'react-icons/fa';
import Texto from '@components/Texto';

const CampoArquivoContainer = styled.div`
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
`;

const CampoArquivoInput = styled.input`
    display: none;
`;

const CampoArquivoCard = styled.div`
    margin-top: 10px;
    border-style: dashed;
    border-color: #aaa;
    border-width: 1px;
    padding: 10px;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 50px;
    cursor: pointer;
`;

const CampoArquivo = ({ label, onFileChange, disabled = false, accept = "*", id, name }) => {

    const inputRef = useRef(null);

    const handleClick = () => {
        console.log(inputRef.current)
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
            <CampoArquivoCard
                onClick={handleClick}
            >
                <Texto color="black" weight="600">
                    <FaUpload size={14} /> &nbsp;&nbsp;Selecionar arquivo
                </Texto>
            </CampoArquivoCard>
        </CampoArquivoContainer>
    );
};

export default CampoArquivo;
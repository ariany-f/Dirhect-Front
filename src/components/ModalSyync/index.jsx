import React from 'react';
import { OverlayRight, DialogEstilizadoRight } from '@components/Modal/styles';
import Syync from '@pages/Syync';

const ModalSyync = ({ opened, onClose }) => {
    return (
        <OverlayRight $opened={opened}>
            <DialogEstilizadoRight 
                $opened={opened}
                $width="50vw"
                $align="flex-start"
            >
                <button 
                    className="close" 
                    onClick={onClose}
                >
                    <svg className="fechar" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
                
                <Syync />
            </DialogEstilizadoRight>
        </OverlayRight>
    );
};

export default ModalSyync;




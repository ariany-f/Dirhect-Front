import React from 'react';
import { LoaderContainer, Spinner } from './styles';

const InlineLoader = () => {
    return (
        <LoaderContainer>
            <Spinner />
        </LoaderContainer>
    );
};

export default InlineLoader; 
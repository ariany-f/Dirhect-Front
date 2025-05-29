import React, { createContext, useContext, useState, useEffect } from 'react';
import vagasData from '@json/vagas.json'; // Importando o arquivo JSON

const vagasInicial = vagasData;

export const VagasContext = createContext({
    vagas: vagasInicial, 
    setVagas: () => null
});

export const useVagasContext = () => {
    return useContext(VagasContext);
}; 

export const VagasProvider = ({ children }) => {

    const [vagas, setVagas] = useState(vagasInicial);

    useEffect(() => {
        // Carregar vagas do sessionStorage ou usar dados iniciais
        const storedVagas = sessionStorage.getItem('vagas');
        if (storedVagas) {
            setVagas(JSON.parse(storedVagas));
        } else {
            setVagas(vagasData);
        }
    }, [vagasData]);

    const updateVagas = (newVaga) => {
        setVagas((prevState) => {
            const updatedVagas = {
                ...prevState,
                abertas: [...prevState.abertas, newVaga],
            };
            // Salvar no sessionStorage
            sessionStorage.setItem('vagas', JSON.stringify(updatedVagas));
            return updatedVagas;
        });
    };

    const contexto = {
        vagas,
        setVagas: updateVagas
    }

    return (
        <VagasContext.Provider value={contexto}>
            {children}
        </VagasContext.Provider>
    );
}
import { createContext, useContext, useState } from 'react';

const TransporteContext = createContext();

export const TransporteProvider = ({ children }) => {
    const [colaboradores, setColaboradores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filtros, setFiltros] = useState({
        filial: null,
        distanciaMinima: null,
        distanciaMaxima: null,
        valorMinimo: null,
        valorMaximo: null,
        tipoTransporte: null
    });

    const atualizarColaboradores = (novosColaboradores) => {
        setColaboradores(novosColaboradores);
    };

    const atualizarFiltros = (novosFiltros) => {
        setFiltros(prev => ({ ...prev, ...novosFiltros }));
    };

    const limparFiltros = () => {
        setFiltros({
            filial: null,
            distanciaMinima: null,
            distanciaMaxima: null,
            valorMinimo: null,
            valorMaximo: null,
            tipoTransporte: null
        });
    };

    return (
        <TransporteContext.Provider
            value={{
                colaboradores,
                setColaboradores,
                atualizarColaboradores,
                loading,
                setLoading,
                filtros,
                setFiltros,
                atualizarFiltros,
                limparFiltros
            }}
        >
            {children}
        </TransporteContext.Provider>
    );
};

export const useTransporteContext = () => {
    const context = useContext(TransporteContext);
    if (!context) {
        throw new Error('useTransporteContext deve ser usado dentro de TransporteProvider');
    }
    return context;
};

export default TransporteContext;


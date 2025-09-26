import { createContext, useContext } from 'react';

const CompanyContext = createContext();

export const useCompanyContext = () => {
    const context = useContext(CompanyContext);
    if (!context) {
        throw new Error('useCompanyContext must be used within a CompanyProvider');
    }
    return context;
};

export default CompanyContext; 
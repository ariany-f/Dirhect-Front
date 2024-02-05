import http from '@http';
import { createContext, useContext, useState } from 'react';

const balanceInicial = {
    payment_type_enum: 1,
    transaction_type_enum: 3,
    amount: '',
    card: {
        installments: 0,
        installment_amount: '',
        number: '',
        validate: '',
        cvv: 0,
        holder: ''
    },
    transaction_status_enum: "quos"
}

export const BalanceContext = createContext({
    saldo: balanceInicial,
    erros: {},
    submeterSaldo: () => null
})

export const useBalanceContext = () => {
    return useContext(BalanceContext);
}

export const BalanceProvider = ({ children }) => {

    const [saldo, setSaldo] = useState(balanceInicial)

    const submeterSaldo = () => {
        return http.post('api/dashboard/balance', saldo)
        .then((response) => {
            return response
        })
        .catch(erro => {
            return erro.response.data
        })
    }
    
    const contexto = {
        saldo,
        submeterSaldo
    }

    return (<BalanceContext.Provider value={contexto}>
        {children}
    </BalanceContext.Provider>)
}
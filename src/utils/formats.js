/**
 * Formatador de moeda para Real brasileiro
 */
export const Real = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});

/**
 * Formata um número para moeda brasileira
 * @param {number} value - Valor a ser formatado
 * @returns {string} Valor formatado em Real (ex: R$ 1.234,56)
 */
export const formatCurrency = (value) => {
    return Real.format(value);
};

/**
 * Remove a formatação de moeda brasileira
 * @param {string} value - Valor a ser desformatado
 * @returns {number} Valor desformatado em Real (ex: 123456)
 */
export const unformatCurrency = (value) => {
    return value.replace(/[^\d]/g, "");
};

/**
 * Formata um CNPJ
 * @param {string} cnpj - CNPJ a ser formatado (apenas números)
 * @returns {string} CNPJ formatado (ex: 12.345.678/0001-90)
 */
export const formatCNPJ = (cnpj) => {
    if (!cnpj) return '';
    
    // Remove caracteres não numéricos
    cnpj = cnpj.replace(/[^\d]/g, "");
    
    // Aplica a máscara
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
};

/**
 * Formata um CPF
 * @param {string} cpf - CPF a ser formatado (apenas números)
 * @returns {string} CPF formatado (ex: 123.456.789-10)
 */
export const formatCPF = (cpf) => {
    if (!cpf) return '';
    
    // Remove caracteres não numéricos
    cpf = cpf.replace(/[^\d]/g, "");
    
    // Aplica a máscara
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

/**
 * Remove a formatação de um documento (CPF/CNPJ)
 * @param {string} doc - Documento formatado
 * @returns {string} Documento sem formatação (apenas números)
 */
export const unformatDocument = (doc) => {
    if (!doc) return '';
    return doc.replace(/[^\d]/g, "");
};

/**
 * Verifica se um CPF é válido
 * @param {string} cpf - CPF a ser validado (pode estar formatado)
 * @returns {boolean} true se o CPF é válido
 */
export const isValidCPF = (cpf) => {
    cpf = unformatDocument(cpf);
    
    if (cpf.length !== 11) return false;
    
    // Elimina CPFs inválidos conhecidos
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    
    // Validação do primeiro dígito
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let rev = 11 - (sum % 11);
    if (rev === 10 || rev === 11) rev = 0;
    if (rev !== parseInt(cpf.charAt(9))) return false;
    
    // Validação do segundo dígito
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    rev = 11 - (sum % 11);
    if (rev === 10 || rev === 11) rev = 0;
    if (rev !== parseInt(cpf.charAt(10))) return false;
    
    return true;
};

/**
 * Verifica se um CNPJ é válido
 * @param {string} cnpj - CNPJ a ser validado (pode estar formatado)
 * @returns {boolean} true se o CNPJ é válido
 */
export const isValidCNPJ = (cnpj) => {
    cnpj = unformatDocument(cnpj);
    
    if (cnpj.length !== 14) return false;
    
    // Elimina CNPJs inválidos conhecidos
    if (/^(\d)\1{13}$/.test(cnpj)) return false;
    
    // Validação do primeiro dígito
    let size = cnpj.length - 2;
    let numbers = cnpj.substring(0, size);
    let digits = cnpj.substring(size);
    let sum = 0;
    let pos = size - 7;
    
    for (let i = size; i >= 1; i--) {
        sum += numbers.charAt(size - i) * pos--;
        if (pos < 2) pos = 9;
    }
    
    let result = sum % 11 < 2 ? 0 : 11 - sum % 11;
    if (result !== parseInt(digits.charAt(0))) return false;
    
    // Validação do segundo dígito
    size = size + 1;
    numbers = cnpj.substring(0, size);
    sum = 0;
    pos = size - 7;
    
    for (let i = size; i >= 1; i--) {
        sum += numbers.charAt(size - i) * pos--;
        if (pos < 2) pos = 9;
    }
    
    result = sum % 11 < 2 ? 0 : 11 - sum % 11;
    if (result !== parseInt(digits.charAt(1))) return false;
    
    return true;
}; 
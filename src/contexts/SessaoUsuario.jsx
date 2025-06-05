import http from '@http';
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArmazenadorToken } from '../utils';
import { PrimeReactProvider } from 'primereact/api';
import { addLocale, locale } from 'primereact/api';
import { I18nextProvider } from 'react-i18next';
import i18n from '@locales/1i8n';
// Importar traduções
import enCommon from '@locales/en/common.json';
import ptCommon from '@locales/pt/common.json';

addLocale('pt', ptCommon);
addLocale('en', enCommon);

const usuarioInicial = {
    name: sessionStorage.getItem('name') ?? '',
    email: sessionStorage.getItem('email') ?? '',
    password: '',
    cpf: sessionStorage.getItem('cpf') ?? '',
    document: '',
    public_id: sessionStorage.getItem('public_id') ?? '',
    company_public_id: sessionStorage.getItem('company_public_id') ?? '',
    company_domain: sessionStorage.getItem('company_domain') ??     '',
    company_logo: sessionStorage.getItem('company_logo') ?? '',
    company_symbol: sessionStorage.getItem('company_symbol') ?? '',
    remember: false,
    companies: null,
    code: [],
    mfa_required: false,
    tipo: sessionStorage.getItem('tipo') ?? '',
    groups: sessionStorage.getItem('groups') ?? null
}

const recuperacaoSenhaInicial = {
    token: '',
    password: '',
    confirm_password: '',
    uuid: ''
}

export const SessaoUsuarioContext = createContext({
    usuario: usuarioInicial,
    recuperacaoSenha: recuperacaoSenhaInicial,
    erros: {},
    setUsuarioEstaLogado: () => null,
    setCompanies: () => null,
    setRemember: () => null,
    setUserPublicId: () => null,
    setMfaRequired: () => null,
    setCpf: () => null,
    setDocument: () => null,
    setSessionCompany: () => null,
    setCompanyDomain: () => null,
    setCompanyLogo: () => null,
    setCompanySymbol: () => null,
    setEmail: () => null,
    setName: () => null,
    setPassword: () => null,
    setCode: () => null,
    setRecuperacaoToken:() => null,
    setRecuperacaoPassword:() => null,
    setRecuperacaoConfirmPassword:() => null,
    setRecuperacaoUuid:() => null,
    submeterCompanySession: () => null,
    retornarCompanySession: () => null,
    dadosUsuario: () => null,
    solicitarCodigo: () => null,
    solicitarCodigoLogin: () => null,
    validarCodigo: () => null,
    submeterLogout: () => null,
    submeterLogin: () => null,
    gerarBearer: () => null,
    solicitarCodigoRecuperacaoSenha: () => null,
    redefinirSenha: () => null,
    setTipo: () => null
})

export const useSessaoUsuarioContext = () => {

    return useContext(SessaoUsuarioContext);
}

export const SessaoUsuarioProvider = ({ children }) => {

    const navegar = useNavigate()

    const [usuario, setUsuario] = useState(() => {

        let usuarioSalvo = null;

        // Tenta recuperar os dados do sessionStorage ou localStorage
        const cpfSalvo = sessionStorage.getItem('cpf');
        const nameSalvo = sessionStorage.getItem('name');
        const emailSalvo = sessionStorage.getItem('email');
        const publicIdSalvo = sessionStorage.getItem('public_id');
        const tipoSalvo = sessionStorage.getItem('tipo');
        const groupsSalvo = sessionStorage.getItem('groups');
        const domainSalvo = sessionStorage.getItem('domain');
        const simboloSalvo = sessionStorage.getItem('simbolo');
        const logoSalvo = sessionStorage.getItem('logo');
        const companyPublicIdSalvo = sessionStorage.getItem('company_public_id');
        const mfaRequiredSalvo = sessionStorage.getItem('mfa_required');
        usuarioSalvo = {
            cpf: cpfSalvo ?? '',
            email: emailSalvo ?? '',
            mfa_required: mfaRequiredSalvo ?? false,
            tipo: tipoSalvo ?? '',
            groups: groupsSalvo ?? null,
            name: nameSalvo ?? '',
            public_id: publicIdSalvo ?? '',
            company_domain: domainSalvo ?? '',
            company_public_id: companyPublicIdSalvo ?? '',
            companies: [],
            company_symbol: simboloSalvo ?? '',
            company_logo: logoSalvo ?? ''
        }

        return usuarioSalvo ? usuarioSalvo : usuarioInicial;
    });
    const [recuperacaoSenha, setRecuperacaoSenha] = useState(recuperacaoSenhaInicial)
    // Retornar para validar se existe o 'access' token no Armazeanador Token ao invés do CPF na seção
    const [usuarioEstaLogado, setUsuarioEstaLogado] = useState(!!usuario.email)

    const setRecuperacaoToken = (token) => {
        setRecuperacaoSenha(estadoAnterior => {
            return {
                ...estadoAnterior,
                token
            }
        })
    }
    const setRecuperacaoUuid = (uuid) => {
        setRecuperacaoSenha(estadoAnterior => {
            return {
                ...estadoAnterior,
                uuid
            }
        })
    }
    const setCpf = (cpf) => {
        setUsuario(estadoAnterior => {
            return {
                ...estadoAnterior,
                cpf
            }
        })
    }
    const setMfaRequired = (mfa_required) => {
        setUsuario(estadoAnterior => {
            return {
                ...estadoAnterior,
                mfa_required
            }
        })
    }
    const setUserPublicId = (public_id) => {
        setUsuario(estadoAnterior => {
            return {
                ...estadoAnterior,
                public_id
            }
        })
    }
    const setRecuperacaoPassword = (password) => {
        setRecuperacaoSenha(estadoAnterior => {
            return {
                ...estadoAnterior,
                password
            }
        })
    }
    const setRecuperacaoConfirmPassword = (confirm_password) => {
        setRecuperacaoSenha(estadoAnterior => {
            return {
                ...estadoAnterior,
                confirm_password
            }
        })
    }
    const setRemember = (remember) => {
        setUsuario(estadoAnterior => {
            return {
                ...estadoAnterior,
                remember
            }
        })
    }
    const setDocument = (document) => {
        setUsuario(estadoAnterior => {
            return {
                ...estadoAnterior,
                document
            }
        })
    }
    const setEmail = (email) => {
        setUsuario(estadoAnterior => {
            return {
                ...estadoAnterior,
                email
            }
        })
    }
    const setName = (name) => {
        setUsuario(estadoAnterior => {
            return {
                ...estadoAnterior,
                name
            }
        })
    }
    const setPassword = (password) => {
        setUsuario(estadoAnterior => {
            return {
                ...estadoAnterior,
                password
            }
        })
    }
    const setCode = (code) => {
        setUsuario(estadoAnterior => {
            return {
                ...estadoAnterior,
                code
            }
        })
    }
    const setCompanies = (companies) => {
        setUsuario(estadoAnterior => {
            return {
                ...estadoAnterior,
                companies
            }
        })
    }
    const setSessionCompany = (company_public_id) => {
        setUsuario(estadoAnterior => {
            return {
                ...estadoAnterior,
                company_public_id
            }
        })
    }
    const setCompanyDomain = (company_domain) => {
        setUsuario(estadoAnterior => {
            return {
                ...estadoAnterior,
                company_domain
            }
        })
    }

    const setCompanyLogo = (company_logo) => {
        setUsuario(estadoAnterior => {
            return {
                ...estadoAnterior,
                company_logo
            }
        })
    }

    const setCompanySymbol = (company_symbol) => {
        setUsuario(estadoAnterior => {
            return {
                ...estadoAnterior,
                company_symbol
            }
        })
    }

    const setTipo = (tipo) => {
        setUsuario(estadoAnterior => {
            return {
                ...estadoAnterior,
                tipo
            }
        })
    }

    const setGroups = (groups) => {
        setUsuario(estadoAnterior => {
            return {
                ...estadoAnterior,
                groups
            }
        })
    }

    const solicitarCodigoLogin = () => {

        var sendableContent = {
            password: usuario.password,
            cpf: usuario.cpf
        }

        return http.post('api/auth/code-generate', sendableContent)
            .then((response) => {
                return response
            })
            .catch(erro => {
                return erro.response.data
            })
    }

    const solicitarCodigo = () => {

        var sendableContent = {
            password: usuario.password,
            cpf: usuario.cpf
        }

        return http.post('api/auth/code', sendableContent)
            .then((response) => {
                return response
            })
            .catch(erro => {
                return erro.response.data
            })
    }

    
    const dadosUsuario = () => {
        return http.get('api/auth/me')
            .then((response) => {
                return response
            })
            .catch(erro => {
                return erro
            })
    }

    const solicitarCodigoRecuperacaoSenha = () => {
        const obj = {   
            email: usuario.email
        }
        return http.post('password/reset/', obj)
            .then((response) => {
                return response
            })
            .catch(erro => {
                return erro
            })
    }

    const redefinirSenha = () => {

        const obj = {
            uuid: recuperacaoSenha.uuid,
            token: recuperacaoSenha.token,
            new_password: recuperacaoSenha.password
        }
        return http.post(`password/reset/confirm/`, obj)
            .then((response) => {
                return response
            })
            .catch(erro => {
                return erro
            })
    }
    
    const gerarBearer = () => {
        var sendCode = '';
        usuario.code.map(item => {
            if(typeof item.preenchimento !== undefined)
            {
                sendCode += item.preenchimento
            }
        })
        var sendableContent = {
            cpf: usuario.cpf,
            code: sendCode
        }

        return http.post('api/auth/bearer-token', sendableContent)
            .then((response) => {
                return response
            })
            .catch(erro => {
                return erro
            })
    }
    
    const validarCodigo = () => {
        var sendCode = '';
        usuario.code.map(item => {
            if(typeof item.preenchimento !== undefined)
            {
                sendCode += item.preenchimento
            }
        })
        var sendableContent = {
            email: usuario.email,
            cpf: usuario.cpf,
            password: usuario.password,
            company_public_id: usuario.company_public_id,
            code: sendCode,
            remember: usuario.remember
        }

        return http.post('api/auth/code-validate', sendableContent)
            .then((response) => {
                return response
            })
            .catch(erro => {
                return erro
            })
    }

    const submeterLogin = () => {
       
        var sendableContent = {
            email: usuario.email,
            cpf: usuario.cpf,
            password: usuario.password,
            company_public_id: usuario.company_public_id,
            remember: usuario.remember
        }

        return http.post('api/auth/login', sendableContent)
            .then((response) => {
                return response
            })
            .catch(erro => {
                return erro
            })
    }

    const submeterCompanySession = () => {
        
        if(ArmazenadorToken.UserCompanyPublicId)
        {
            var sendableContent = {
                public_id: ArmazenadorToken.UserCompanyPublicId
            }
            
            return http.post(`api/company/set-logged-in`, sendableContent)
                .then((response) => {
                    return response
                })
                .catch(erro => {
                    return erro.response
                })
        }
    }


    const retornarCompanySession = () => {
        
        return http.get(`api/company/get-logged-in`)
            .then((response) => {
                return response
            })
            .catch(erro => {
                return erro.response
            })
    }

    const submeterLogout = () => {
        return http.post('api/auth/logout')
            .then((response) => {
                return response
            })
            .catch(erro => {
                return erro
            })
    }

    const contexto = {
        usuario,
        usuarioEstaLogado,
        recuperacaoSenha,
        setUsuarioEstaLogado,
        setRemember,
        setDocument,
        setEmail,
        setPassword,
        setCompanies,
        setCode,
        setName,
        setSessionCompany,
        setCompanyDomain,
        setCompanyLogo,
        setCompanySymbol,
        setCpf,
        setUserPublicId,
        setMfaRequired,
        setRecuperacaoToken,
        setRecuperacaoPassword,
        setRecuperacaoConfirmPassword,
        setRecuperacaoUuid,
        submeterLogin,
        submeterLogout,
        submeterCompanySession,
        retornarCompanySession,
        solicitarCodigo,
        solicitarCodigoLogin,
        validarCodigo,
        gerarBearer,
        dadosUsuario,
        solicitarCodigoRecuperacaoSenha,
        redefinirSenha,
        setTipo,
        setGroups
    }

    const value = {
        ripple: true
    };
    return (
        <PrimeReactProvider value={value}>
            <I18nextProvider i18n={i18n}>
                <SessaoUsuarioContext.Provider value={contexto}>
                    {children}
                </SessaoUsuarioContext.Provider>
            </I18nextProvider>
        </PrimeReactProvider>
    )
}
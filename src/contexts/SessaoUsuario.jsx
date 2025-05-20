import http from '@http';
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArmazenadorToken } from '../utils';
import { PrimeReactProvider, addLocale, locale } from 'primereact/api';
import { classNames } from 'primereact/utils';
import { I18nextProvider } from 'react-i18next';
import i18n from '@locales/1i8n';


// Importar traduções
import enCommon from '@locales/en/common.json';
import ptCommon from '@locales/pt/common.json';

addLocale('pt', ptCommon);
addLocale('en', enCommon);

const usuarioInicial = {
    name: '',
    email: '',
    password: '',
    cpf: '',
    document: '',
    public_id: '',
    company_public_id: '',
    company_domain: '',
    company_logo: '',
    company_symbol: '',
    remember: false,
    companies: null,
    code: [],
    tipo: ''
}

const recuperacaoSenhaInicial = {
    token: '',
    password: '',
    confirm_password: '',
    publicId: ''
}

export const SessaoUsuarioContext = createContext({
    usuario: usuarioInicial,
    recuperacaoSenha: recuperacaoSenhaInicial,
    erros: {},
    setUsuarioEstaLogado: () => null,
    setCompanies: () => null,
    setRemember: () => null,
    setUserPublicId: () => null,
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
    setRecuperacaoPublicId:() => null,
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
    submeterRecuperacaoSenha: () => null,
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
        const domainSalvo = sessionStorage.getItem('domain');
        const simboloSalvo = sessionStorage.getItem('simbolo');
        const logoSalvo = sessionStorage.getItem('logo');
        const companyPublicIdSalvo = sessionStorage.getItem('company_public_id');
        
        usuarioSalvo = {
            cpf: cpfSalvo ?? '',
            email: emailSalvo ?? '',
            tipo: tipoSalvo ?? '',
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
    // Retornar para validar se existe o access token no Armazeanador Token ao invés do CPF na seção
    const [usuarioEstaLogado, setUsuarioEstaLogado] = useState(!!usuario.email)

    const setRecuperacaoToken = (token) => {
        setRecuperacaoSenha(estadoAnterior => {
            return {
                ...estadoAnterior,
                token
            }
        })
    }
    const setRecuperacaoPublicId = (publicId) => {
        setRecuperacaoSenha(estadoAnterior => {
            return {
                ...estadoAnterior,
                publicId
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

        usuario.cpf = usuario.cpf.replace(/[^a-zA-Z0-9 ]/g, '')
        return http.post('api/auth/forgot-password', usuario)
            .then((response) => {
                return response
            })
            .catch(erro => {
                return erro
            })
    }
    
    const submeterRecuperacaoSenha = () => {

        var sendCode = '';
        
        usuario.code.map(item => {
            if(typeof item.preenchimento !== undefined)
            {
                sendCode += item.preenchimento
            }
        })

        usuario.code = sendCode

        return http.post('api/auth/reset-password', usuario)
            .then((response) => {
                return response
            })
            .catch(erro => {
                return erro
            })
    }

    const redefinirSenha = () => {

        return http.post(`api/user/password/reset/${recuperacaoSenha.publicId}`, recuperacaoSenha)
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
        setRecuperacaoToken,
        setRecuperacaoPassword,
        setRecuperacaoConfirmPassword,
        setRecuperacaoPublicId,
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
        submeterRecuperacaoSenha,
        redefinirSenha,
        setTipo
    }

        
    // const TRANSITIONS = {
    //     overlay: {
    //         timeout: 150,
    //         classNames: {
    //             enter: 'opacity-0 scale-75',
    //             hover: 'opacity-100',
    //             enterActive: 'opacity-100 !scale-100 transition-transform transition-opacity duration-150 ease-in',
    //             exit: 'opacity-100',
    //             exitActive: '!opacity-0 transition-opacity duration-150 ease-linear'
    //         }
    //     }
    // };

    const TRANSITIONS = {
        overlay: {
            enterFromClass: 'opacity-0 scale-75',
            enterActiveClass: 'transition-transform transition-opacity duration-150 ease-in',
            leaveActiveClass: 'transition-opacity duration-150 ease-linear',
            leaveToClass: 'opacity-0'
        }
    };
        
    const value = {
        ripple: true,
        pt: {
            tabview: {
                navContainer: ({ props }) => ({
                    className: classNames(
                        'relative',
                        { 'overflow-hidden': props.scrollable },
                        'bg-transparent'
                    )
                }),
                navContent: 'overflow-y-hidden overscroll-contain overscroll-auto scroll-smooth [&::-webkit-scrollbar]:hidden bg-transparent',
                previousButton: {
                    className: classNames('h-full flex items-center justify-center !absolute top-0 z-20', 'left-0', 'bg-white text-blue-500 w-12 shadow-md rounded-none', 'dark:bg-gray-900 dark:border-blue-900/40 dark:text-white/80 )')
                },
                nextButton: {
                    className: classNames('h-full flex items-center justify-center !absolute top-0 z-20', 'right-0', 'bg-white text-blue-500 w-12 shadow-md rounded-none', 'dark:bg-gray-900 dark:border-blue-900/40 dark:text-white/80 ')
                },
                nav: {
                    className: classNames('flex flex-1 list-none m-0 p-0', 'bg-transparent border-0')
                },
            },
            tabpanel: {
                header: ({ props }) => ({
                    className: classNames('mr-0', { 'cursor-default pointer-events-none select-none user-select-none opacity-60': props?.disabled })
                }),
                headerAction: ({ parent, context }) => ({
                    className: classNames(
                        'items-center cursor-pointer flex overflow-hidden relative select-none text-decoration-none user-select-none',
                        'px-5 py-2 font-bold rounded-full transition-colors duration-200 m-0',
                        'text-base',
                        {
                            'bg-black text-white shadow font-bold': parent != null ? parent.state.activeIndex === context.index : false,
                            'bg-gray-200 text-black': parent != null ? parent.state.activeIndex !== context.index : true
                        }
                    ),
                    style: { marginBottom: 0 }
                }),
                headerTitle: {
                    className: classNames('leading-none whitespace-nowrap')
                },
                content: {
                    className: classNames('bg-white p-5 border-0 text-gray-700 rounded-bl-md rounded-br-md')
                }
            },
            inputswitch: {
                root: ({ props }) => ({
                    className: classNames('inline-block relative', 'w-12 h-7', {
                        'opacity-60 select-none pointer-events-none cursor-default': props.disabled
                    })
                }),
                input: {
                    className: classNames('absolute appearance-none top-0 left-0 size-full p-0 m-0 opacity-0 z-10 outline-none cursor-pointer')
                },
                slider: ({ props }) => ({
                    className: classNames(
                        'absolute cursor-pointer top-0 left-0 right-0 bottom-0 border border-transparent',
                        'transition-colors duration-200 rounded-2xl',
                        'focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)] dark:focus:shadow-[0_0_0_0.2rem_rgba(147,197,253,0.5)]',
                        "before:absolute before:content-'' before:top-1/2 before:w-5 before:h-5 before:left-1 before:-mt-2.5 before:rounded-full before:transition-duration-200",
                        {
                            'bg-[#0a0140] before:bg-gray-200 before:transform before:translate-x-5': props.checked,
                            'bg-gray-300 before:bg-white': !props.checked
                        }
                    )
                })
            },
            datatable: {
                column: {
                    headercell: () => ({
                        className: 'text-left border-0 text-base font-medium py-3 text-sm bg-white text-black px-4 rounded-t-md'
                    }),
                    headercontent: 'flex items-center',
                    bodycell: () => ({
                        className: 'text-left border-0 border-b border-gray-100 text-gray-800 px-3 py-4 text-sm rounded-md'
                    }),
                    sorticon: () => ({
                        className: 'ml-2 text-[var(--primaria)]'
                    }),
                },
                bodyrow: ({ context }) => ({
                    className: [
                        context.stripedRows
                                ? (context.index % 2 === 0 ? 'bg-white text-gray-800' : 'bg-[#f0f0f0] text-gray-800')
                                : 'bg-white text-gray-800',
                        'transition duration-200',
                        'focus:outline focus:outline-[0.15rem] focus:outline-blue-200 focus:outline-offset-[-0.15rem]',
                        'dark:text-white/80',
                        context.selectable ? 'cursor-pointer' : '',
                        context.selectable && !context.selected ? 'hover:bg-[#edf0fa] hover:text-gray-900' : ''
                    ].filter(Boolean).join(' ')
                }),
                footer: {
                    className: classNames(
                        'bg-slate-50 text-slate-700 border-t-0 border-b border-x-0 border-gray-300 font-medium py-2 px-4',
                        'dark:border-blue-900/40 dark:text-white/80 dark:bg-gray-900' // Dark Mode
                    )
                },
            },
            tooltip: {
                root: ({ context }) => {
                    return {
                        className: classNames('absolute shadow-md', {
                            'py-0 px-1': context.right || context.left || (!context.right && !context.left && !context.top && !context.bottom),
                            'py-1 px-0': context.top || context.bottom
                        })
                    };
                },
                arrow: ({ context }) => ({
                    className: classNames('absolute w-0 h-0 border-transparent border-solid', {
                        '-mt-1 border-y-[0.25rem] border-r-[0.25rem] border-l-0 border-r-gray-600': context.right,
                        '-mt-1 border-y-[0.25rem] border-l-[0.25rem] border-r-0 border-l-gray-600': context.left,
                        '-ml-1 border-x-[0.25rem] border-t-[0.25rem] border-b-0 border-t-gray-600': context.top,
                        '-ml-1 border-x-[0.25rem] border-b-[0.25rem] border-t-0 border-b-gray-600': context.bottom
                    })
                }),
                text: {
                    className: 'p-3 bg-gray-600 text-white rounded-md whitespace-pre-line break-words'
                }
            },
            dropdown: {
                root: ({ props }) => ({
                    className: classNames(
                        'cursor-pointer inline-flex relative select-none',
                        'bg-white border border-gray-400 transition-colors duration-200 ease-in-out rounded-md',
                        'w-full md:w-56',
                        'hover:border-blue-500 focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)]',
                        { 'opacity-60 select-none pointer-events-none cursor-default': props.disabled }
                    )
                }),
                input: ({ props }) => ({
                    className: classNames(
                        'cursor-pointer block flex flex-auto overflow-hidden overflow-ellipsis whitespace-nowrap relative',
                        'bg-transparent border-0 text-gray-800',
                        'p-3 transition duration-200 bg-transparent rounded appearance-none font-sans text-base',
                        'focus:outline-none focus:shadow-none',
                        { 'pr-7': props.showClear }
                    )
                }),
                trigger: {
                    className: classNames('flex items-center justify-center shrink-0', 'bg-transparent text-gray-500 w-12 rounded-tr-lg rounded-br-lg')
                },
                wrapper: {
                    className: classNames('max-h-[200px] overflow-auto', 'bg-white text-gray-700 border-0 rounded-md shadow-lg')
                },
                list: 'py-3 list-none m-0',
                item: ({ context }) => ({
                    className: classNames(
                        'cursor-pointer font-normal overflow-hidden relative whitespace-nowrap',
                        'm-0 p-3 border-0  transition-shadow duration-200 rounded-none',
                        {
                            'text-gray-700': !context.focused && !context.selected,
                            'bg-gray-300 text-gray-700': context.focused && !context.selected,
                            'bg-blue-400 text-blue-700': context.focused && context.selected,
                            'bg-blue-50 text-blue-700': !context.focused && context.selected,
                            'opacity-60 select-none pointer-events-none cursor-default': context.disabled
                        }
                    )
                }),
                itemgroup: {
                    className: classNames('m-0 p-3 text-gray-800 bg-white font-bold', 'cursor-auto')
                },
                header: {
                    className: classNames('p-3 border-b border-gray-300 text-gray-700 bg-gray-100 mt-0 rounded-tl-lg rounded-tr-lg')
                },
                filtercontainer: 'relative',
                filterinput: {
                    className: classNames(
                        'pr-7 -mr-7',
                        'w-full',
                        'font-sans text-base text-gray-700 bg-white py-3 px-3 border border-gray-300 transition duration-200 rounded-lg appearance-none',
                        'hover:border-blue-500 focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)]'
                    )
                },
                filtericon: '-mt-2 absolute top-1/2',
                clearicon: 'text-gray-500 right-12 -mt-2 absolute top-1/2',
                transition: TRANSITIONS.overlay
            },
            multiselect: {
                root: ({ props }) => ({
                    className: classNames('inline-flex cursor-pointer select-none', 
                        'bg-white border border-gray-400 transition-colors duration-200 ease-in-out rounded-md', 
                        'w-full md:w-80', 
                        {
                            'opacity-60 select-none pointer-events-none cursor-default': props.disabled
                        }
                    )
                }),
                labelContainer: 'overflow-hidden flex flex-auto cursor-pointer',
                label: ({ props }) => ({
                    className: classNames('block overflow-hidden whitespace-nowrap cursor-pointer overflow-ellipsis', 
                        'text-gray-800', 'p-3 transition duration-200', 
                        {
                            '!p-3': props.display !== 'chip' && (props.value == null || props.value == undefined),
                            '!py-1.5 px-3': props.display === 'chip' && props.value !== null
                        }
                    )
                }),
                token: {
                    className: classNames('py-1 px-2 mr-2 bg-gray-200 text-gray-700 rounded-full', 
                        'cursor-default inline-flex items-center'
                    )
                },
                removeTokenIcon: 'ml-2',
                trigger: {
                    className: classNames('flex items-center justify-center shrink-0', 
                        'bg-transparent text-gray-600 w-12 rounded-tr-lg rounded-br-lg'
                    )
                },
                panel: {
                    className: classNames('bg-white text-gray-700 border-0 rounded-md shadow-lg')
                },
                header: {
                    className: classNames('p-3 border-b border-gray-300 text-gray-700 bg-gray-100 rounded-t-lg',
                        'flex items-center justify-between'
                    )
                },
                headerCheckboxContainer: {
                    className: classNames('inline-flex cursor-pointer select-none align-bottom relative', 
                        'mr-2', 'w-6 h-6'
                    )
                },
                headerCheckbox: {
                    root: ({ props }) => ({
                        className: classNames(
                            'flex items-center justify-center',
                            'border-2 w-6 h-6 text-gray-600 rounded-lg transition-colors duration-200',
                            'hover:border-[#0a0140] focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)]',
                            'relative',
                            {
                                'border-gray-300 bg-white': !props?.checked,
                                'border-[#0a0140] bg-[#0a0140] text-white': props?.checked
                            }
                        ),
                        children: [
                            <input type="checkbox" className="hidden" />
                        ]
                    })
                },
                headerCheckboxIcon: 'w-4 h-4 transition-all duration-200 text-white text-base',
                closeButton: {
                    className: classNames(
                        'flex items-center justify-center overflow-hidden relative',
                        'w-8 h-8 text-gray-500 border-0 bg-transparent rounded-full transition duration-200 ease-in-out mr-2 last:mr-0',
                        'hover:text-gray-700 hover:border-transparent hover:bg-gray-200'
                    )
                },
                closeIcon: 'w-4 h-4 inline-block',
                wrapper: {
                    className: classNames('max-h-[200px] overflow-auto', 
                        'bg-white text-gray-700 border-0 rounded-md shadow-lg'
                    )
                },
                list: 'py-3 list-none m-0',
                item: ({ context }) => ({
                    className: classNames(
                        'cursor-pointer font-normal overflow-hidden relative whitespace-nowrap', 
                        'm-0 p-3 border-0 transition-shadow duration-200 rounded-none',
                        {
                            'text-gray-700 hover:text-gray-700 hover:bg-gray-200': !context?.focused && !context?.selected,
                            'bg-gray-300 text-gray-700 hover:text-gray-700 hover:bg-gray-200': context?.focused && !context?.selected,
                            'bg-white text-black': context?.selected,
                            'bg-gray-100': context?.focused && !context?.selected
                        }
                    )
                }),
                checkboxContainer: {
                    className: classNames('inline-flex cursor-pointer select-none align-bottom relative', 
                        'mr-2', 'w-6 h-6'
                    )
                },
                checkbox: ({ context }) => ({
                    className: classNames(
                        'flex items-center justify-center',
                        'border-2 w-6 h-6 text-gray-600 rounded-lg transition-colors duration-200',
                        'hover:border-[#0a0140] focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)]',
                        'relative',
                        {
                            'border-gray-300 bg-white': !context?.selected,
                            'border-[#0a0140] bg-[#0a0140] text-white': context?.selected
                        }
                    ),
                    children: [
                        <input type="checkbox" className="hidden" />
                    ]
                }),
                checkboxIcon: 'w-4 h-4 transition-all duration-200 text-white text-base',
                itemGroup: {
                    className: classNames('m-0 p-3 text-gray-800 bg-white font-bold', 'cursor-auto')
                },
                filterContainer: 'relative',
                filterInput: {
                    root: {
                        className: classNames(
                            'pr-7 -mr-7',
                            'w-full',
                            'font-sans text-base text-gray-700 bg-white py-2 px-3 border border-gray-300 transition duration-200 rounded-lg appearance-none',
                            'hover:border-[#0a0140] focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)]'
                        )
                    }
                },
                filterIcon: '-mt-2 absolute top-1/2',
                clearIcon: 'text-gray-500 right-12 -mt-2 absolute top-1/2',
                transition: TRANSITIONS.overlay
            },
            confirmdialog: {
                root: {
                    className: classNames(
                        'bg-white fixed inset-0 flex items-center justify-center z-50'
                    )
                },
                content: 'p-6 flex flex-col bg-white rounded-lg shadow-lg max-w-[400px] w-full mx-4 border border-gray-100',
                icon: 'text-2xl text-gray-900',
                message: 'text-[15px] text-gray-600 mt-1',
                header: {
                    className: 'text-xl font-medium text-gray-900 mb-2'
                },
                footer: 'flex gap-3 justify-end mt-6',
                acceptbutton: {
                    root: 'bg-[#0a0140] text-white px-6 py-2.5 border-0 rounded-md text-sm font-medium hover:bg-[#0a0140]/90 focus:outline-none focus:ring-2 focus:ring-[#0a0140]/50 transition-colors duration-200'
                },
                rejectbutton: {
                    root: 'bg-white text-gray-700 px-6 py-2.5 border border-gray-200 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors duration-200'
                },
                mask: {
                    className: 'fixed inset-0 bg-black/20 backdrop-blur-[1px]'
                },
                transition: TRANSITIONS.overlay
            },
            tag: {
                root: ({ props }) => ({
                    className: classNames(
                        'inline-flex items-center justify-center',
                        'text-white text-xs font-semibold px-2 py-1 ',
                        {
                            'bg-gray-500 ': props.severity == 'secondary',
                            'bg-[#97b72f]': props.severity == 'success',
                            'bg-[#36a9ce]': props.severity == 'info',
                            'bg-[#f7941d]': props.severity == 'warning',
                            'bg-purple-500 ': props.severity == 'help',
                            'bg-[#d86b82]': props.severity == 'danger'
                        },
                        {
                            'rounded-md': !props.rounded,
                            'rounded-full': props.rounded
                        }
                    )
                }),
                value: 'leading-6',
                icon: 'mr-1 text-sm'
            },
            paginator: {
                root: {
                    className: 'flex items-center justify-center flex-wrap bg-white text-gray-500 border-0 px-4 py-2 rounded-md'
                },
                pagebutton: ({ context }) => ({
                    className: [
                        'flex items-center justify-center',
                        'border-0 min-w-[3rem] h-12 m-[0.143rem] rounded-md transition duration-200',
                        context.active
                            ? 'bg-[var(--primaria)] text-white'
                            : 'text-gray-500 hover:bg-[#edf0fa] hover:text-[var(--primaria)]',
                        'focus:outline-none focus:outline-offset-0 focus:shadow-none'
                    ].join(' '),
                    style: context.active ? { background: 'var(--primaria)', color: '#fff' } : {}
                }),
                firstpagebutton: ({ context }) => ({
                    className: [
                        'flex items-center justify-center',
                        'border-0 min-w-[3rem] h-12 m-[0.143rem] rounded-md transition duration-200',
                        'text-gray-500 hover:bg-[#edf0fa] hover:text-[var(--primaria)]',
                        'focus:outline-none focus:outline-offset-0 focus:shadow-none',
                        context.disabled ? 'opacity-60 pointer-events-none' : ''
                    ].join(' ')
                }),
                prevpagebutton: ({ context }) => ({
                    className: [
                        'flex items-center justify-center',
                        'border-0 min-w-[3rem] h-12 m-[0.143rem] rounded-md transition duration-200',
                        'text-gray-500 hover:bg-[#edf0fa] hover:text-[var(--primaria)]',
                        'focus:outline-none focus:outline-offset-0 focus:shadow-none',
                        context.disabled ? 'opacity-60 pointer-events-none' : ''
                    ].join(' ')
                }),
                nextpagebutton: ({ context }) => ({
                    className: [
                        'flex items-center justify-center',
                        'border-0 min-w-[3rem] h-12 m-[0.143rem] rounded-md transition duration-200',
                        'text-gray-500 hover:bg-[#edf0fa] hover:text-[var(--primaria)]',
                        'focus:outline-none focus:outline-offset-0 focus:shadow-none',
                        context.disabled ? 'opacity-60 pointer-events-none' : ''
                    ].join(' ')
                }),
                lastpagebutton: ({ context }) => ({
                    className: [
                        'flex items-center justify-center',
                        'border-0 min-w-[3rem] h-12 m-[0.143rem] rounded-md transition duration-200',
                        'text-gray-500 hover:bg-[#edf0fa] hover:text-[var(--primaria)]',
                        'focus:outline-none focus:outline-offset-0 focus:shadow-none',
                        context.disabled ? 'opacity-60 pointer-events-none' : ''
                    ].join(' ')
                })
            },
            inputtext: {
                root: ({ props, context }) => ({
                    className: [
                        'appearance-none',
                        props.invalid ? 'border border-red-500' : 'border border-gray-300',
                        'bg-white',
                        'text-black',
                        'rounded-md',
                        'py-4 px-3',
                        'transition duration-200',
                        props.invalid
                            ? 'focus:border-red-500 focus:ring-1 focus:ring-red-500 hover:border-red-500 placeholder-red-400'
                            : 'focus:border-[var(--primaria)] focus:ring-1 focus:ring-[var(--primaria)] hover:border-gray-400 placeholder-gray-400',
                        'outline-none',
                        'w-full',
                        props.size === 'large' ? 'text-lg px-4 py-5' : '',
                        props.size === 'small' ? 'text-xs px-2 py-2' : '',
                        context.iconPosition === 'left' ? 'pl-8' : '',
                        props.iconPosition === 'right' ? 'pr-8' : ''
                    ].filter(Boolean).join(' ')
                })
            },
            iconfield: {
                root: {
                    className: classNames('relative')
                }
            },
            inputicon: {
                root: ({ context }) => ({
                    className: classNames('absolute top-1/2 -mt-2', {
                        'left-2': context.iconPosition === 'left',
                        'right-2': context.iconPosition === 'right'
                    })
                })
            },
            toast: {
                root: {
                    className: 'z-[9999] flex justify-end items-end w-full'
                },
                message: {
                    className: 'relative bg-white border border-gray-200 rounded-lg shadow-lg p-4 flex flex-row items-center min-w-[300px] max-w-[400px] justify-between'
                },
                content: {
                    className: 'flex flex-row items-center w-full'
                },
                icon: {
                    className: 'mr-3 text-xl flex-shrink-0'
                },
                text: {
                    className: 'text-gray-800 text-base flex-1'
                },
                closebutton: {
                    className: 'ml-4 text-gray-400 hover:text-gray-700 transition flex-shrink-0'
                },
                progressbar: {
                    className: 'absolute left-0 bottom-0 h-1 bg-[var(--primaria)] rounded-b-lg transition-all duration-1000'
                }
            },
        }
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
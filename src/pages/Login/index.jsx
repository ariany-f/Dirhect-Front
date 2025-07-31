import Texto from "@components/Texto"
import Botao from "@components/Botao"
import CampoTexto from "@components/CampoTexto"
import DropdownItens from "@components/DropdownItens"
import Frame from "@components/Frame"
import SubTitulo from "@components/SubTitulo"
import Titulo from "@components/Titulo"
import { Link, useNavigate } from "react-router-dom"
import styles from './Login.module.css'
import CheckboxContainer from "@components/CheckboxContainer"
import { useSessaoUsuarioContext } from "@contexts/SessaoUsuario"
import { useEffect, useRef, useState } from "react"
import { CiWarning } from "react-icons/ci";
import { toast } from 'react-toastify'
import Loading from "@components/Loading"
import { ArmazenadorToken } from "@utils"
import loginData from '@json/login.json'; // Importando o JSON
import { useTranslation } from "react-i18next"
import Input from "@components/Input"
import { useForm } from "react-hook-form"
import http from "@http";
import imagem from '@imagens/bg-mobile.jpg';
import { SuccessIcon, ErrorIcon } from '@components/ToastIcons';
import { FaTimesCircle } from "react-icons/fa"

function Login() {
    const [loading, setLoading] = useState(false)
    const [ready, setReady] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [connectionError, setConnectionError] = useState(false)
    const navegar = useNavigate()
    const { t } = useTranslation('common');
    const {
        usuario,
        setRemember,
        usuarioEstaLogado,
        setUsuarioEstaLogado,
        setCpf,
        setEmail,
        setMfaRequired,
        setGroups,
        setTipo,
        setUserPublicId,
        setName,
    } = useSessaoUsuarioContext()

    const { control, handleSubmit, formState: { errors } } = useForm();

    async function handleLogin() {
        const data = {
            username: import.meta.env.VITE_API_USER,
            password: import.meta.env.VITE_API_PASS
        }
        const expiration = new Date();
        expiration.setMinutes(expiration.getMinutes() + 15);
        try {
            const response = await http.post(`/app-login/`, data);
            ArmazenadorToken.definirToken(response.access, null, null, null);
            
            return response;
        } catch (error) {
            setLoading(false);
            console.log(error);
            throw error;
        }
    }

    useEffect(() =>{
        async function init() {
            ArmazenadorToken.removerToken();
            ArmazenadorToken.removerTempToken();
            ArmazenadorToken.removerPermissoes();
            ArmazenadorToken.removerCompany();
            if(usuarioEstaLogado) {
                setUsuarioEstaLogado(false);
            }
            let tentativas = 0;
            let sucesso = false;
            while (tentativas < 3 && !sucesso) {
                try {
                    await handleLogin();
                    sucesso = true;
                } catch (error) {
                    tentativas++;
                    if (tentativas >= 3) {
                        toast.error('Erro ao conectar com o serviço de autenticação. Tente novamente mais tarde.');
                        setConnectionError(true);
                        break;
                    }
                }
            }
            setReady(true);
        }
        init();
    }, [])

    const onSubmit = async (data) => {
        if(!data.email || !data.password) {
            toast.info('Preencha usuário e senha!');
            return;
        }
        setLoading(true);
        setErrorMessage(''); // Limpa mensagem de erro anterior
        try {
            data.app_token = ArmazenadorToken.AccessToken;
            
            const response = await http.post('/token/', data);
            
            if(response.access) {
                const expiration = new Date();
                expiration.setMinutes(expiration.getMinutes() + 5);

                ArmazenadorToken.definirToken(
                    response.access, 
                    expiration, 
                    response.refresh, 
                    response.permissions
                );
                
                setMfaRequired(response.mfa_required);
                setEmail(response.user.email);
                setCpf(response.user.cpf ?? '');
                setUserPublicId(response.user.id);
                setName(response.user.first_name + ' ' + response.user.last_name);

                // Aguarda o estado ser atualizado
                await new Promise(resolve => setTimeout(resolve, 0));

                if(response.mfa_required) {
                    navegar('/login/mfa');
                } else {

                    setUsuarioEstaLogado(true);
                    
                    // Filtrar grupos que não começam com "_" (grupos válidos)
                    const gruposValidos = response.groups.filter(grupo => !grupo.startsWith('_'));
                    
                    if(gruposValidos.length > 1) {

                        setGroups(response.groups);

                        ArmazenadorToken.definirUsuario(
                            response.user.first_name + ' ' + response.user.last_name,
                            response.user.email,
                            response.user.cpf ?? '',
                            response.user.id,
                            '',
                            '', 
                            '', 
                            '', 
                            '', 
                            response.mfa_required,
                            response.user.perfil,
                            response.user.first_name,
                            response.user.last_name,
                            response.user.foto_perfil
                        );
                        ArmazenadorToken.removerTempToken();

                        ArmazenadorToken.definirGrupos(response.groups);
                        navegar('/login/selecionar-grupo');
                    } else {

                        // Usar o primeiro grupo válido
                        const grupoSelecionado = gruposValidos[0] || response.groups[0];
                        setTipo(grupoSelecionado);
                        ArmazenadorToken.definirUsuario(
                            response.user.first_name + ' ' + response.user.last_name,
                            response.user.email,
                            response.user.cpf ?? '',
                            response.user.id,
                            grupoSelecionado,
                            '', 
                            '', 
                            '', 
                            '', 
                            response.mfa_required,
                            response.user.perfil,
                            response.user.first_name,
                            response.user.last_name,
                            response.user.foto_perfil
                        );

                        ArmazenadorToken.removerTempToken();

                        // Navegação conforme tipo de usuário
                        if(grupoSelecionado !== 'funcionario') {
                            if(grupoSelecionado !== 'candidato') {

                                navegar('/login/selecionar-empresa');
                            } else {
                                navegar(`/admissao/registro/${response.user.id}`);
                            }
                        } else {
                            navegar(`/colaborador/detalhes/${response.user.id}`);
                        }
                    }
                }
            } else {
                toast.error('Usuário ou senha não encontrados', { icon: ErrorIcon });
                setErrorMessage('Usuário ou senha não encontrados');
            }
        } catch (error) {
            if(error?.password) {
                toast.error(error.password[0], { icon: ErrorIcon });
                setErrorMessage(error.password[0]);
                setLoading(false);
            } else if(error?.mfa_required?.[0] === 'True') {
                ArmazenadorToken.definirTempToken(error.temp_token[0]);
                ArmazenadorToken.definirMfaRequired(true);
                setMfaRequired(true);
                const primaryMethod = error.primary_method?.[0];

                if (primaryMethod === 'email') {
                    try {
                        await http.post('/mfa/email/send/');
                        toast.success('Código de verificação enviado para o seu e-mail.');
                        navegar('/login/mfa/true/email');
                    } catch (sendError) {
                        toast.error('Erro ao enviar o código de verificação por e-mail.');
                        setLoading(false);
                    }
                } else { // 'app' ou padrão
                    if (error?.mfa_configured?.[0] === 'True') {
                        navegar('/login/mfa/true/app'); // ou /login/mfa/true/app
                    } else {
                        navegar('/login/mfa/generate');
                    }
                }
            } else {
                toast.error('Ocorreu um erro ao tentar fazer login', { icon: ErrorIcon });
                setErrorMessage('Ocorreu um erro ao tentar fazer login');
                setLoading(false);
            }
        }
    }

    if (!ready) {
        return <Loading opened={true} />;
    }

    if (connectionError) {
        return (
            <>
                <Titulo align="center">
                    <h2>{t('welcome')}</h2>
                    <SubTitulo>
                        {t('choose_profile')}
                    </SubTitulo>
                </Titulo>
                <Frame gap="20px" alinhamento="center">
                    <div style={{ 
                        width: '100%',
                        textAlign: 'center'
                    }}>
                        <Frame 
                            estilo="error" 
                            padding="24px" 
                        >
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                                <CiWarning size={48} color="var(--vermilion-700)" />
                                <div>
                                    <Texto weight="600" size="18px" color="var(--neutro-900)" style={{ marginBottom: '8px' }}>
                                        Erro de Conexão
                                    </Texto>
                                    <Texto weight="400" color="var(--neutro-700)">
                                        Erro ao conectar com o serviço de autenticação. Tente novamente mais tarde.
                                    </Texto>
                                </div>
                                <Botao 
                                    onClick={() => window.location.reload()} 
                                    estilo="vermilion" 
                                    size="medium"
                                    style={{ marginTop: '16px' }}
                                >
                                    Tentar Novamente
                                </Botao>
                            </div>
                        </Frame>
                    </div>
                </Frame>
            </>
        );
    }

    return (
        <>
            <Loading opened={loading} />
            <Titulo align="center">
                <h2>{t('welcome')}</h2>
                {!errorMessage && (
                    <SubTitulo>
                        {t('choose_profile')}
                    </SubTitulo>
                )}
            </Titulo>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Frame gap="20px" alinhamento="start">
                    <Input
                        control={control}
                        type="email"
                        id="email"
                        name="email"
                        label="E-mail"
                        defaultValue={usuario.email}
                        icon="pi pi-envelope"
                        required
                        rules={{
                            required: 'E-mail é obrigatório',
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: 'Por favor, insira um e-mail válido'
                            }
                        }}
                    />
                    <Input
                        control={control}
                        type="password"
                        id="password"
                        name="password"
                        label={t('password')}
                        icon="pi pi-lock"
                        toggleMask={true}
                        required
                        showPasswordFeedback={false}
                        rules={{
                            required: 'Senha é obrigatória',
                            minLength: {
                                value: 6,
                                message: 'A senha deve ter pelo menos 6 caracteres'
                            }
                        }}
                    />
                    <div className={styles.containerBottom}>
                        <CheckboxContainer name="remember" valor={usuario.remember} setValor={setRemember} label={t('remember_me')} />
                        <Link className={styles.link} to="/esqueci-a-senha">
                            <Texto weight="800" color="var(--primaria)">{t('forgot_password')}</Texto>
                        </Link>
                    </div>
                </Frame>
                <Botao type="submit" estilo="vermilion" size="medium" filled style={{ marginTop: '20px', width: '100%' }}>{t('confirm')}</Botao>
                {errorMessage && (
                     <div style={{ 
                        width: '100%',
                        marginTop: '16px'
                    }}>
                        <Frame 
                            estilo="error" 
                            padding="16px" 
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <CiWarning size={24} color="var(--vermilion-700)" />
                                <Texto weight="400" color="var(--neutro-900)">
                                    {errorMessage}
                                </Texto>
                            </div>
                        </Frame>
                    </div>
                )}
            </form>
        </>
    )
}

export default Login


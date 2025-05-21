import Texto from "@components/Texto";
import Botao from "@components/Botao";
import Input from "@components/Input";
import Frame from "@components/Frame";
import Titulo from "@components/Titulo";
import { Link, useNavigate } from "react-router-dom";
import styles from './Login.module.css';
import { useSessaoUsuarioContext } from "@contexts/SessaoUsuario";
import { useEffect, useRef, useState } from "react";
import { toast } from 'react-toastify';
import Loading from "@components/Loading";
import { ArmazenadorToken } from "@utils";
import loginData from '@json/login.json';
import { useTranslation } from "react-i18next";
import imagem from '@imagens/bg-mobile.jpg';
import logo from '@imagens/logo.png';
import http from "@http";
import { useForm } from "react-hook-form";
import { SuccessIcon, ErrorIcon } from '@components/ToastIcons';

function LoginMobile() {
    const [classError, setClassError] = useState([]);
    const [loading, setLoading] = useState(false);
    const navegar = useNavigate();
    const [logins, setLogins] = useState([]);
    const { t } = useTranslation('common');
    const { 
        usuario,
        setRemember,
        usuarioEstaLogado,
        setUsuarioEstaLogado,
        setCpf,
        setEmail,
        setTipo,
        setPassword,
        setUserPublicId,
        setName,
    } = useSessaoUsuarioContext();

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
            console.log(error);
            throw error;
        }
    }

    useEffect(() => {
        async function init() {
            ArmazenadorToken.removerToken();
            ArmazenadorToken.removerCompany();
            if(usuarioEstaLogado) {
                setUsuarioEstaLogado(false);
            }
            await handleLogin();
        }
        init();
    }, []);

    const onSubmit = (data) => {
        if(!data.email || !data.password) {
            toast.info('Preencha usuário e senha!');
            return;
        }
        setLoading(true);
        handleLogin()
            .then(() => {
                data.app_token = ArmazenadorToken.AccessToken;
                return http.post('/token/', data);
            })
            .then(response => {
                if(response.access) {
                    const expiration = new Date();
                    expiration.setMinutes(expiration.getMinutes() + 5);
                    ArmazenadorToken.definirToken(response.access, expiration, response.refresh, response.permissions);
                    setEmail(response.user.email);
                    setCpf(response.user.cpf ?? '');
                    setTipo('equipeBeneficios');
                    setUserPublicId(response.user.id);
                    setName(response.user.first_name + ' ' + response.user.last_name);
                    ArmazenadorToken.definirUsuario(
                        response.user.first_name + ' ' + response.user.last_name,
                        response.user.email,
                        response.user.cpf ?? '',
                        response.user.id,
                        'equipeBeneficios',
                        '', '', '', ''
                    );
                    setUsuarioEstaLogado(true);
                } else {
                    toast.error('Usuário ou senha não encontrados', { icon: ErrorIcon });
                }
            }).then(response => {
                // Navegação conforme tipo de usuário
                if(usuario.tipo !== 'funcionario') {
                    if(usuario.tipo !== 'candidato') {
                        navegar('/login/selecionar-empresa');
                    } else {
                        navegar(`/admissao/registro/${usuario.id}`);
                    }
                } else {
                    navegar(`/colaborador/detalhes/${usuario.public_id}`);
                }
            })
            .catch(error => {
                if(error?.detail) {
                    toast.error(error.detail, { icon: ErrorIcon });
                } else {
                    toast.error('Ocorreu um erro ao tentar fazer login', { icon: ErrorIcon });
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div style={{
            width: '100%', 
            height: '100vh', 
            display: 'flex', 
            flexDirection: 'column', 
            padding: '20px 0', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.4), transparent), url(${imagem})`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center'
        }}>
            <Loading opened={loading} />
            
            <Titulo align="center">
                <img width="200" src={logo} alt="Logo" />
            </Titulo>
            
            <div style={{
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                backgroundColor: 'white', 
                padding: '25px 30px', 
                borderRadius: '15px',
                width: '90%',
                maxWidth: '400px'
            }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Frame gap="20px" estilo="mb-5">
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
                        
                        <Link className={styles.link} to="/esqueci-a-senha">
                            <Texto size={'12px'} weight="500" color="var(--primaria)">
                                {t('forgot_password')}
                            </Texto>
                        </Link>
                    </Frame>
                    
                    <Botao 
                        type="submit" 
                        estilo="vermilion" 
                        size="medium" 
                        filled
                        style={{ marginTop: '20px', width: '100%' }}
                    >
                        {t('confirm')}
                    </Botao>
                </form>
            </div>
        </div>
    );
}

export default LoginMobile;
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

function Login() {
    const [loading, setLoading] = useState(false)
    const [ready, setReady] = useState(false)
    const navegar = useNavigate()
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
    } = useSessaoUsuarioContext()

    const { control, handleSubmit, formState: { errors } } = useForm();

    async function handleLogin() {
        const data = {
            username: import.meta.env.VITE_API_USER,
            password: import.meta.env.VITE_API_PASS
        }
        const expiration = new Date();
        expiration.setMinutes(expiration.getMinutes() + 15);
        http.post(`/app-login/`, data)
        .then(response => {
            ArmazenadorToken.definirToken(response.access, null, null, null);
            return response;
        })
        .catch(error => {
            console.log(error);
        });
    }

    useEffect(() =>{
        async function init() {
            ArmazenadorToken.removerToken();
            ArmazenadorToken.removerCompany();
            if(usuarioEstaLogado) {
                setUsuarioEstaLogado(false);
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
        await handleLogin().then(response => {
            console.log('Salvou o access_token',response);
            data.app_token = ArmazenadorToken.AccessToken;
            
            http.post('/token/', data)
                .then(response => {
                    if(response.access) {
                        const expiration = new Date();
                        expiration.setMinutes(expiration.getMinutes() + 15);
                        ArmazenadorToken.definirToken(response.access, expiration, response.refresh, response.permissions);
                        setUsuarioEstaLogado(true);
                        ArmazenadorToken.definirUsuario(
                            response.user.first_name + ' ' + response.user.last_name,
                            response.user.email,
                            response.user.cpf ?? '',
                            response.user.id,
                            'equipeBeneficios',
                            '', '', '', ''
                        );
                        // Navegação conforme tipo de usuário
                        if(response.user.tipo !== 'funcionario') {
                            if(response.user.tipo !== 'candidato') {
                                navegar('/login/selecionar-empresa');
                            } else {
                                navegar(`/admissao/registro/${response.user.id}`);
                            }
                        } else {
                            navegar(`/colaborador/detalhes/${response.user.public_id}`);
                        }
                        toast.success('Login realizado com sucesso!', { icon: SuccessIcon });
                    } else {
                        toast.error('Usuário ou senha não encontrados', { icon: ErrorIcon });
                    }
                })
                .catch(error => {
                    console.log(error);
                    toast.error('Ocorreu um erro ao tentar fazer login', { icon: ErrorIcon });
                });
        }).finally(() => {
            setLoading(false);
        });
    }

    if (!ready) {
        return <Loading opened={true} />;
    }

    return (
        <>
            <Loading opened={loading} />
            <Titulo align="center">
                <h2>{t('welcome')}</h2>
                <SubTitulo>
                    {t('choose_profile')}
                </SubTitulo>
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
            </form>
        </>
    )
}

export default Login

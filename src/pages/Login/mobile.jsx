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
import { Toast } from 'primereact/toast'
import Loading from "@components/Loading"
import { ArmazenadorToken } from "@utils"
import loginData from '@json/login.json'; // Importando o JSON
import { useTranslation } from "react-i18next"
import imagem from '@imagens/bg-mobile.jpg'
import logo from '@imagens/logo.png'

function LoginMobile() {
    const [classError, setClassError] = useState([])
    const [loading, setLoading] = useState(false)
    const navegar = useNavigate()
    const toast = useRef(null)
    const [logins, setLogins] = useState([])
    const { t } = useTranslation('common');
    const { 
        usuario,
        setRemember,
        usuarioEstaLogado,
        setUsuarioEstaLogado,
        setCpf,
        setTipo,
        setPassword,
        setUserPublicId,
        setName,
    } = useSessaoUsuarioContext()

    useEffect(() =>{
        if(usuarioEstaLogado)
        {
            setUsuarioEstaLogado(false)
        }
        
        if ((logins.length < loginData.perfis.length)) {
            setLogins((estadoAnterior) => {
                const novosLogins = loginData.perfis.map((item) => ({
                    name: item.name,
                    code: item.cpf
                }));
                return [...estadoAnterior, ...novosLogins];
            });
        }
        else
        {
            if(logins.length > 0)
            {
                setCpf(logins[0])
            }
        }

    }, [logins])

    const AlreadyAccessed = () => {
        if((!usuario.cpf) || (!usuario.password))
        {
            toast.current.show({ severity: 'info', detail: 'Preencha usuário e senha!', life: 3000 });
        }
        else
        {
            const perfilEncontrado = loginData.perfis.find(perfil => 
                perfil.cpf === usuario.cpf.code && perfil.senha === usuario.password
            );
    
            if (perfilEncontrado) {
                // Atualizando o contexto com o tipo de usuário
                setUsuarioEstaLogado(true);
                setCpf(usuario.cpf);
                setPassword(usuario.password);
                setUserPublicId(perfilEncontrado.public_id);
                setTipo(perfilEncontrado.tipo);
                setName(perfilEncontrado.name);
    
                 // Adicionando o tipo de usuário ao objeto usuario
                ArmazenadorToken.definirUsuario(
                    perfilEncontrado.name,
                    perfilEncontrado.email,
                    perfilEncontrado.cpf,
                    perfilEncontrado.public_id,
                    perfilEncontrado.tipo,
                    ArmazenadorToken.UserCompanyPublicId ?? '1',
                    ArmazenadorToken.UserCompanyDomain ?? 'geral',
                    ArmazenadorToken.UserCompanySymbol ?? '',
                    ArmazenadorToken.UserCompanyLogo ?? ''
                )
    
                if(perfilEncontrado.tipo != 'funcionario')
                {
                    if(perfilEncontrado.tipo != 'candidato')
                    {
                        navegar('/login/selecionar-empresa');
                    }
                    else
                    {
                        navegar(`/admissao/registro/${perfilEncontrado.id}`)
                    }
                }
                else
                {
                    navegar(`/colaborador/detalhes/${perfilEncontrado.public_id}`)
                }
            } else {
                toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Usuário ou senha não encontrados', life: 3000 });
                // Lógica para usuário não encontrado (opcional)
                console.error("Usuário não encontrado");
            }
        }
    }

    return (
        <div style={{width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', padding: '20px 0', alignItems: 'center', justifyContent: 'space-between', backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.4), transparent), url(${imagem})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
            <Toast ref={toast} />
            <Loading opened={loading} />
            <Titulo align="center">
                <img width="200" src={logo} alt="Logo" />
            </Titulo>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', padding: '25px 40px', borderRadius: '15px'}}>
                <form>
                    <Frame gap="20px">
                        <DropdownItens camposVazios={classError} valor={usuario.cpf} setValor={setCpf} options={logins} label={t('user')} name="cpf" placeholder="Usuário"/>
                        <CampoTexto camposVazios={classError} onEnter={evento => AlreadyAccessed()} name="password" valor={usuario.password} setValor={setPassword} type="password" label={t('password')} placeholder="Digite sua senha" />
                        
                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'end', gap: '10px', marginBottom: '20px', width: '100%', marginTop: '-55px', justifyContent: 'center'}}>
                            <Link className={styles.link} to="/esqueci-a-senha">
                                <Texto size={'12px'} weight="800" color="var(--primaria)">{t('forgot_password')}</Texto>
                            </Link>
                        </div>
                    </Frame>
                </form>
                <Botao aoClicar={evento => AlreadyAccessed()} estilo="vermilion" size="medium" filled>{t('confirm')}</Botao>
            </div>
        </div>
    )
}

export default LoginMobile
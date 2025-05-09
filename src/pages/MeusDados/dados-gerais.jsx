import http from '@http'
import { useEffect, useRef, useState } from 'react'
import Titulo from '@components/Titulo'
import Texto from '@components/Texto'
import Frame from '@components/Frame'
import BotaoSemBorda from '@components/BotaoSemBorda'
import ContainerHorizontal from '@components/ContainerHorizontal'
import { Skeleton } from 'primereact/skeleton'
import styles from './MeusDados.module.css'
import { Link } from 'react-router-dom'
import { RiEditBoxFill } from 'react-icons/ri'
import { ArmazenadorToken } from '@utils'
import { Toast } from 'primereact/toast'
import ModalAlterarTelefone from '@components/ModalAlterar/telefone'
import ModalAlterarEmail from '@components/ModalAlterar/email'
import { useSessaoUsuarioContext } from "@contexts/SessaoUsuario"
import CampoTexto from '@components/CampoTexto'
import Botao from '@components/Botao'
import BotaoGrupo from '@components/BotaoGrupo'

function MeusDadosDadosGerais() {

    const [userProfile, setUserProfile] = useState([])
    const [empresaSelecionada, setEmpresaSelecionada] = useState(null)
    const [modalTelefoneOpened, setModalTelefoneOpened] = useState(false)
    const [modalEmailOpened, setModalEmailOpened] = useState(false)
    const toast = useRef(null)
    const [senhaAtual, setSenhaAtual] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [alterandoSenha, setAlterandoSenha] = useState(false);
    
    const {
        usuario,
        retornarCompanySession,
        setSessionCompany,
    } = useSessaoUsuarioContext()

    useEffect(() => {
        if(usuario && !Object.keys(userProfile).length)
        {
            setUserProfile(usuario)
        }
        // /**
        //  * Dados necessários para exibição no painel do usuário
        //  */
        // if(!Object.keys(userProfile).length)
        // {
        //     http.get(`usuario/${ArmazenadorToken.UserPublicId}`)
        //     .then(response => {
        //         if(response.detail != 'Não encontrado')
        //         {
        //             setUserProfile(response)
        //         }
        //     })
        //     .catch(erro => {
        //         console.error(erro)
        //     })
        // }
    }, [userProfile, usuario])

    function editarTelefone(telefone) {
        let contact_info = {}
        contact_info['phone_number'] = telefone
        let obj = {
            contact_info: contact_info
        }
        http.put(`api/auth/me/${ArmazenadorToken.UserCompanyPublicId}`, obj)
        .then(response => {
           if(response.success)
            {
                toast.current.show({ severity: 'info', summary: 'Sucesso', detail: response.message, life: 3000 });
                setModalTelefoneOpened(false)
            }
        })
        .catch(erro => console.log(erro))
    }

    function editarEmail(email) {
        let contact_info = {}
        contact_info['email'] = email
        let obj = {
            contact_info: contact_info
        }
        http.put(`api/auth/me/${ArmazenadorToken.UserCompanyPublicId}`, obj)
        .then(response => {
           if(response.success)
            {
                toast.current.show({ severity: 'info', summary: 'Sucesso', detail: response.message, life: 3000 });
                setModalEmailOpened(false)
            }
        })
        .catch(erro => console.log(erro))
    }

    function formataCNPJ(cnpj) {
        cnpj = cnpj.replace(/[^\d]/g, "");
        return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    }

    const handleAlterarSenha = () => {
        setAlterandoSenha(true);
        if (!senhaAtual || !novaSenha || !confirmarSenha) {
            toast.current.show({ severity: 'warn', summary: 'Atenção', detail: 'Preencha todos os campos.', life: 3000 });
            setAlterandoSenha(false);
            return;
        }
        if (novaSenha !== confirmarSenha) {
            toast.current.show({ severity: 'error', summary: 'Erro', detail: 'As senhas não coincidem.', life: 3000 });
            setAlterandoSenha(false);
            return;
        }
        setTimeout(() => {
            toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Senha alterada com sucesso!', life: 3000 });
            setSenhaAtual('');
            setNovaSenha('');
            setConfirmarSenha('');
            setAlterandoSenha(false);
        }, 1000);
    };

    return (
        <>
        <Toast ref={toast} />
        <Titulo><h6>Informações gerais</h6></Titulo>
        <div className={styles.card_dashboard}>
            <Texto>Nome completo</Texto>
            {ArmazenadorToken.UserName ?
                <Texto weight="800">{ArmazenadorToken.UserName}</Texto>
                : <Skeleton variant="rectangular" width={200} height={25} />
            }
            <Texto>Senha</Texto>
            <BotaoSemBorda>
                <RiEditBoxFill size={18} />
                <Link to="/usuario/sistema" className={styles.link}>Alterar</Link>
            </BotaoSemBorda>
        </div>
        <Titulo><h6>Informações de contato</h6></Titulo>
        <div className={styles.card_dashboard}>
            <ContainerHorizontal width="50%">
                {(Object.keys(userProfile)?.length && userProfile.phones && userProfile?.phones.length) ?
                    <>
                    <Frame gap="5px">
                        <Texto>Telefone/Celular</Texto>
                        {userProfile.phones[0].phone_number ?
                            <Texto weight="800">({userProfile?.phones[0].phone_code}) {userProfile?.phones[0].phone_number}</Texto>
                            : '---'
                        }
                    </Frame>
                    <BotaoSemBorda>
                        <RiEditBoxFill size={18} />
                        <Link onClick={() => {setModalTelefoneOpened(true)}} className={styles.link}>Alterar</Link>
                    </BotaoSemBorda>
                    </>
                    : <Skeleton variant="rectangular" width={200} height={25} />
                }
            </ContainerHorizontal>
            <ContainerHorizontal width="50%">
                {Object.keys(userProfile)?.length ?
                    <>
                        <Frame gap="5px">
                            <Texto>E-mail</Texto>
                            {userProfile.email ?
                                <Texto weight="800">{userProfile?.email}</Texto>
                                : <Skeleton variant="rectangular" width={200} height={25} />
                            }
                        </Frame>
                        <BotaoSemBorda>
                            <RiEditBoxFill size={18} />
                            <Link onClick={() => setModalEmailOpened(true)} className={styles.link}>Alterar</Link>
                        </BotaoSemBorda>
                    </>
                    : <Skeleton variant="rectangular" width={200} height={25} />
                }
            </ContainerHorizontal>
        </div>
        <ModalAlterarTelefone dadoAntigo={(userProfile && userProfile.phones && userProfile.phones.length) ? ('(' + userProfile.phones[0].phone_code + ') ' + userProfile.phones[0].phone_number) : ''} aoClicar={editarTelefone} opened={modalTelefoneOpened} aoFechar={() => setModalTelefoneOpened(!modalTelefoneOpened)} />
        <ModalAlterarEmail dadoAntigo={userProfile.email ?? ''} aoClicar={editarEmail} opened={modalEmailOpened} aoFechar={() => setModalEmailOpened(!modalEmailOpened)} />
        </>
    )
}
export default MeusDadosDadosGerais
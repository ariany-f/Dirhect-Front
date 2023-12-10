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
import { ArmazenadorToken } from './../../utils'
import { Toast } from 'primereact/toast'
import ModalAlterar from "@components/ModalAlterar"

function MeusDadosDadosGerais() {

    const [userProfile, setUserProfile] = useState([])
    const [modalOpened, setModalOpened] = useState(false)
    const [parametroEdicao, setParametroEdicao] = useState(null)
    const [dadoEdicao, setDadoEdicao] = useState(null)
    const toast = useRef(null)

    useEffect(() => {
        /**
         * Dados necessários para exibição no painel do usuário
         */
        if(!Object.keys(userProfile).length)
        {
            http.get('api/dashboard/user/profile')
            .then(response => {
                setUserProfile(response.data.profileResource.general_info)
            })
            .catch(erro => {
                console.error(erro)
            })
        }
    }, [userProfile, modalOpened])

    function editarUsuario(dado){

        let contact_info = {}
        contact_info[parametroEdicao] = dado

        let obj = {
            contact_info: contact_info
        }

        http.put(`api/dashboard/user/profile/${ArmazenadorToken.UserCompanyPublicId}`, obj)
        .then(response => {
            if(response.status === 'success')
            {
                toast.current.show({ severity: 'info', summary: 'Sucesso', detail: response.message, life: 3000 });
                setModalOpened(false)
            }
        })
        .catch(erro => console.log(erro))
    }
    
    function AbrirModalEditarUsuario(parametro, dado_antigo){
        setParametroEdicao(parametro)
        setDadoEdicao(dado_antigo)
        setModalOpened(true)
    }

    function formataCNPJ(cnpj) {
        cnpj = cnpj.replace(/[^\d]/g, "");
        return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    }

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
            <Texto>Nome fantasia</Texto>
            {Object.keys(userProfile)?.length ?
                (userProfile.social_reason.fantasy_name ?
                    <Texto weight="800">{userProfile?.social_reason.fantasy_name}</Texto>
                    : '--')
                : <Skeleton variant="rectangular" width={200} height={25} />
            }
            {Object.keys(userProfile)?.length ?
                <>
                    <Texto>CNPJ</Texto>
                    {userProfile.social_reason.document ?
                        <Texto weight="800">{formataCNPJ(userProfile?.social_reason.document)}</Texto>
                        : <Skeleton variant="rectangular" width={200} height={25} />
                    }
                    </>
                : <Skeleton variant="rectangular" width={200} height={25} />
                
            }
        </div>
        <Titulo><h6>Informações de contato</h6></Titulo>
        <div className={styles.card_dashboard}>
            <ContainerHorizontal width="50%">
                {Object.keys(userProfile)?.length ?
                    <>
                    <Frame gap="5px">
                        <Texto>Telefone/Celular</Texto>
                        {userProfile.contact_info.phone_number ?
                            <Texto weight="800">{userProfile?.contact_info.phone_number}</Texto>
                            : '---'
                        }
                    </Frame>
                    <BotaoSemBorda>
                        <RiEditBoxFill size={18} />
                        <Link onClick={() => AbrirModalEditarUsuario('phone_number', userProfile.contact_info.phone_number)} className={styles.link}>Alterar</Link>
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
                            {userProfile.contact_info.email ?
                                <Texto weight="800">{userProfile?.contact_info.email}</Texto>
                                : <Skeleton variant="rectangular" width={200} height={25} />
                            }
                        </Frame>
                        <BotaoSemBorda>
                            <RiEditBoxFill size={18} />
                            <Link onClick={() => AbrirModalEditarUsuario('email', userProfile.contact_info.email)} className={styles.link}>Alterar</Link>
                        </BotaoSemBorda>
                    </>
                    : <Skeleton variant="rectangular" width={200} height={25} />
                }
            </ContainerHorizontal>
        </div>
        <ModalAlterar dadoAntigo={dadoEdicao} parametroParaEditar={parametroEdicao} aoClicar={editarUsuario} opened={modalOpened} aoFechar={() => setModalOpened(!modalOpened)} />
        </>
    )
}
export default MeusDadosDadosGerais
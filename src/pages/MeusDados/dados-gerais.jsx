import http from '@http'
import { useEffect, useState } from 'react'
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

function MeusDadosDadosGerais() {

    const [userProfile, setUserProfile] = useState([])

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
    }, [userProfile])

    function formataCNPJ(cnpj) {
        cnpj = cnpj.replace(/[^\d]/g, "");
        return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    }

    return (
        <>
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
                            <Link className={styles.link}>Alterar</Link>
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
                                <Link className={styles.link}>Alterar</Link>
                            </BotaoSemBorda>
                        </>
                        : <Skeleton variant="rectangular" width={200} height={25} />
                    }
                </ContainerHorizontal>
            </div>
        </>
    )
}
export default MeusDadosDadosGerais
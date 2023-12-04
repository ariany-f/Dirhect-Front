import http from '@http'
import { useEffect, useState } from 'react'
import userProfile from '@json/user-profile.json'
import Titulo from '@components/Titulo'
import Texto from '@components/Texto'
import Frame from '@components/Frame'
import BotaoSemBorda from '@components/BotaoSemBorda'
import ContainerHorizontal from '@components/ContainerHorizontal'
import { Skeleton } from 'primereact/skeleton'
import styles from './MeusDados.module.css'
import { Link } from 'react-router-dom'
import { RiEditBoxFill } from 'react-icons/ri'

function MeusDadosDadosGerais() {

    // const [userProfile, setUserProfile] = useState({})

    useEffect(() => {
        /**
         * Dados necessários para exibição no painel do usuário
         */
        // http.get('api/dashboard/user/profile')
        // .then(response => {
        //     setUserProfile(response.data)
        // })
        // .catch(erro => {
        //     console.error(erro)
        // })
       
    }, [])

    function formataCNPJ(cnpj) {
        cnpj = cnpj.replace(/[^\d]/g, "");
        return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    }

    return (
        <>
         <Titulo><h6>Informações gerais</h6></Titulo>
         <div className={styles.card_dashboard}>
                <Texto>Nome completo</Texto>
                {userProfile.name ?
                    <Texto weight="800">{userProfile?.name}</Texto>
                    : <Skeleton variant="rectangular" width={200} height={25} />
                }
                <Texto>Nome fantasia</Texto>
                {userProfile ?
                    (userProfile.company_name ?
                        <Texto weight="800">{userProfile?.company_name}</Texto>
                        : '--')
                    : <Skeleton variant="rectangular" width={200} height={25} />
                }
                <Texto>CNPJ</Texto>
                {userProfile.company_document ?
                    <Texto weight="800">{formataCNPJ(userProfile?.company_document)}</Texto>
                    : <Skeleton variant="rectangular" width={200} height={25} />
                }
            </div>
            <Titulo><h6>Informações de contato</h6></Titulo>
            <div className={styles.card_dashboard}>
                <ContainerHorizontal width="50%">
                    <Frame gap="5px">
                        <Texto>Telefone/Celular</Texto>
                        {userProfile.phone_number ?
                            <Texto weight="800">{userProfile?.phone_number}</Texto>
                            : <Skeleton variant="rectangular" width={200} height={25} />
                        }
                    </Frame>
                    <BotaoSemBorda>
                        <RiEditBoxFill size={18} />
                        <Link className={styles.link}>Alterar</Link>
                    </BotaoSemBorda>
                </ContainerHorizontal>
                <ContainerHorizontal width="50%">
                    <Frame gap="5px">
                        <Texto>E-mail</Texto>
                        {userProfile.email ?
                            <Texto weight="800">{userProfile?.email}</Texto>
                            : <Skeleton variant="rectangular" width={200} height={25} />
                        }
                    </Frame>
                    <BotaoSemBorda>
                        <RiEditBoxFill size={18} />
                        <Link className={styles.link}>Alterar</Link>
                    </BotaoSemBorda>
                </ContainerHorizontal>
            </div>
        </>
    )
}
export default MeusDadosDadosGerais
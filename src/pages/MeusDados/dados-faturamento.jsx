import http from '@http'
import { useEffect, useState } from 'react'
import userProfile from '@json/user-profile.json'
import Titulo from '@components/Titulo'
import SubTitulo from '@components/SubTitulo'
import Texto from '@components/Texto'
import Frame from '@components/Frame'
import BotaoSemBorda from '@components/BotaoSemBorda'
import ContainerHorizontal from '@components/ContainerHorizontal'
import { Skeleton } from 'primereact/skeleton'
import styles from './MeusDados.module.css'
import { Link } from 'react-router-dom'
import { RiEditBoxFill } from 'react-icons/ri'

function MeusDadosDadosFaturamento() {

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
            <Titulo>
                <h6>CNPJ</h6>
                <SubTitulo>Para comprovantes fiscais</SubTitulo>
            </Titulo>
            <div className={styles.card_dashboard}>
                <Texto>CNPJ</Texto>
                {userProfile.company_document ?
                    <Texto weight="800">{formataCNPJ(userProfile?.company_document)}</Texto>
                    : <Skeleton variant="rectangular" width={200} height={25} />
                }
                <ContainerHorizontal width="50%">
                    <Frame gap="5px">
                        <Texto>Inscrição municipal</Texto>
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
                        <Texto>IInscrição estadual</Texto>
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
            </div>
            <Titulo>
                <h6>E-mail</h6>
                <SubTitulo>Para comprovantes fiscais</SubTitulo>
            </Titulo>
            <div className={styles.card_dashboard}>
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
            <Titulo>
                <h6>Endereço</h6>
                <SubTitulo>Para comprovantes fiscais</SubTitulo>
            </Titulo>
            <div className={styles.card_dashboard}>
                <Texto>CEP</Texto>
                {userProfile.address.postal_code ?
                    <Texto weight="800">{userProfile?.address.postal_code}</Texto>
                    : <Skeleton variant="rectangular" width={200} height={25} />
                }
                <Texto>Logradouro</Texto>
                {userProfile ?
                    (userProfile.address.street ?
                        <Texto weight="800">{userProfile?.address.street}</Texto>
                        : '--')
                    : <Skeleton variant="rectangular" width={200} height={25} />
                }
                <Texto>Bairro</Texto>
                {userProfile ?
                    (userProfile.address.district ?
                        <Texto weight="800">{userProfile?.address.district}</Texto>
                        : '--')
                    : <Skeleton variant="rectangular" width={200} height={25} />
                }
                <Texto>Número</Texto>
                {userProfile ?
                    (userProfile.address.number ?
                        <Texto weight="800">{userProfile?.address.number}</Texto>
                        : '--')
                    : <Skeleton variant="rectangular" width={200} height={25} />
                }
                <Texto>Complemento</Texto>
                {userProfile ?
                    (userProfile.address.complement ?
                        <Texto weight="800">{userProfile?.address.complement}</Texto>
                        : '--')
                    : <Skeleton variant="rectangular" width={200} height={25} />
                }
                <Texto>Cidade</Texto>
                {userProfile ?
                    (userProfile.address.city ?
                        <Texto weight="800">{userProfile?.address.city}</Texto>
                        : '--')
                    : <Skeleton variant="rectangular" width={200} height={25} />
                }
                <ContainerHorizontal width="50%">
                    <Frame gap="5px">
                        <Texto>Estado</Texto>
                        {userProfile.address.state ?
                            <Texto weight="800">{userProfile?.address.state}</Texto>
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
export default MeusDadosDadosFaturamento
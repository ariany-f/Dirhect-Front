import http from '@http'
import { useEffect, useState } from 'react'
import userProfile from '@json/user-profile.json'
import Titulo from '@components/Titulo'
import Texto from '@components/Texto'
import { Skeleton } from 'primereact/skeleton'
import styles from './MeusDados.module.css'

function MeusDadosEndereco() {

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

    return (
        <>
         <Titulo><h6>Endereço cadastrado</h6></Titulo>
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
                <Texto>Estado</Texto>
                {userProfile ?
                    (userProfile.address.state ?
                        <Texto weight="800">{userProfile?.address.state}</Texto>
                        : '--')
                    : <Skeleton variant="rectangular" width={200} height={25} />
                }
            </div>
        </>
    )
}
export default MeusDadosEndereco
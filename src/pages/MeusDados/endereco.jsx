import http from '@http'
import { useEffect, useState } from 'react'
import Titulo from '@components/Titulo'
import Texto from '@components/Texto'
import { Skeleton } from 'primereact/skeleton'
import styles from './MeusDados.module.css'

function MeusDadosEndereco() {

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

    return (
        <>
         <Titulo><h6>Endereço cadastrado</h6></Titulo>
         <div className={styles.card_dashboard}>
                <Texto>CEP</Texto>
                {Object.keys(userProfile)?.length ?
                    <>
                        {userProfile.registered_address.address_postal_code ?
                            <Texto weight="800">{userProfile?.registered_address.address_postal_code}</Texto>
                            : <Skeleton variant="rectangular" width={200} height={25} />
                        }
                    </>
                    : <Skeleton variant="rectangular" width={200} height={25} />
                }
                <Texto>Logradouro</Texto>
                {Object.keys(userProfile)?.length ?
                    (userProfile.registered_address.address_street ?
                        <Texto weight="800">{userProfile?.registered_address.address_street}</Texto>
                        : '--')
                    : <Skeleton variant="rectangular" width={200} height={25} />
                }
                <Texto>Bairro</Texto>
                {Object.keys(userProfile)?.length ?
                    (userProfile.registered_address.address_district ?
                        <Texto weight="800">{userProfile?.registered_address.address_district}</Texto>
                        : '--')
                    : <Skeleton variant="rectangular" width={200} height={25} />
                }
                <Texto>Número</Texto>
                {Object.keys(userProfile)?.length ?
                    (userProfile.registered_address.address_number ?
                        <Texto weight="800">{userProfile?.registered_address.address_number}</Texto>
                        : '--')
                    : <Skeleton variant="rectangular" width={200} height={25} />
                }
                <Texto>Complemento</Texto>
                {Object.keys(userProfile)?.length ?
                    (userProfile.registered_address.address_complement ?
                        <Texto weight="800">{userProfile?.registered_address.address_complement}</Texto>
                        : '--')
                    : <Skeleton variant="rectangular" width={200} height={25} />
                }
                <Texto>Cidade</Texto>
                {Object.keys(userProfile)?.length ?
                    (userProfile.registered_address.address_city ?
                        <Texto weight="800">{userProfile?.registered_address.address_city}</Texto>
                        : '--')
                    : <Skeleton variant="rectangular" width={200} height={25} />
                }
                <Texto>Estado</Texto>
                {Object.keys(userProfile)?.length ?
                    (userProfile.registered_address.address_state ?
                        <Texto weight="800">{userProfile?.registered_address.address_state}</Texto>
                        : '--')
                    : <Skeleton variant="rectangular" width={200} height={25} />
                }
            </div>
        </>
    )
}
export default MeusDadosEndereco
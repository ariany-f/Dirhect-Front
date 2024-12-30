import http from '@http'
import { useEffect, useRef, useState } from 'react'
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
import { Toast } from 'primereact/toast'
import { ArmazenadorToken } from './../../utils'
import ModalAlterar from "@components/ModalAlterar"
import ModalAlterarEmail from '../../components/ModalAlterar/email'
import ModalAlterarInscricaoEstadual from '../../components/ModalAlterar/inscricao_estadual'
import ModalAlterarInscricaoMunicipal from '../../components/ModalAlterar/inscricao_municipal'

function MeusDadosDadosFaturamento() {

    const [userProfile, setUserProfile] = useState([])
    const [modalOpened, setModalOpened] = useState(false)
    const [modalEmailOpened, setModalEmailOpened] = useState(false)
    const [modalInscricaoEstadualOpened, setModalInscricaoEstadualOpened] = useState(false)
    const [modalInscricaoMunicipalOpened, setModalInscricaoMunicipalOpened] = useState(false)
    const [parametroEdicao, setParametroEdicao] = useState(null)
    const [dadoEdicao, setDadoEdicao] = useState(null)
    const toast = useRef(null)

    useEffect(() => {
        /**
         * Dados necessários para exibição no painel do usuário
         */
         if(!Object.keys(userProfile).length)
         {
            //  http.get('api/auth/me')
            //  .then(response => {
            //     if(response.success)
            //     {
            //         setUserProfile(response.data)
            //     }
            //  })
            //  .catch(erro => {
            //      console.error(erro)
            //  })
         }

    }, [userProfile, modalOpened, modalEmailOpened])

    function editarEndereco(dado){
        let billing_data = {}
        billing_data['billing_data'] = dado

        http.put(`api/auth/me/${ArmazenadorToken.UserCompanyPublicId}`, billing_data)
        .then(response => {
           if(response.success)
            {
                toast.current.show({ severity: 'info', summary: 'Sucesso', detail: response.message, life: 3000 });
                setModalOpened(false)
            }
        })
        .catch(erro => console.log(erro))
    }

    function editarEmail(email) {
        let billing_data = {}
        billing_data['email'] = email
        let obj = {
            billing_data: billing_data
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

    function editarInscricaoEstadual(inscricao_estadual) {
        let billing_data = {}
        billing_data['inscricao_estadual'] = inscricao_estadual
        let obj = {
            billing_data: billing_data
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

    function editarInscricaoMunicipal(inscricao_municipal) {
        let billing_data = {}
        billing_data['inscricao_municipal'] = inscricao_municipal
        let obj = {
            billing_data: billing_data
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

    return (
        <>
            <Toast ref={toast} />
            <Titulo>
                <h6>CNPJ</h6>
                <SubTitulo>Para comprovantes fiscais</SubTitulo>
            </Titulo>
            <div className={styles.card_dashboard}>
                {(Object.keys(userProfile)?.length && userProfile.length && userProfile.billing_data && userProfile.billing_data.length) ?
                    <>
                        <Texto>CNPJ</Texto>
                        {userProfile?.billing_data.CNPJ.document ?
                            <Texto weight="800">{formataCNPJ(userProfile?.billing_data.CNPJ.document)}</Texto>
                            : <Skeleton variant="rectangular" width={200} height={25} />
                        }
                    </>
                    : <Skeleton variant="rectangular" width={200} height={25} />
                }
                <ContainerHorizontal width="50%">
                    {Object.keys(userProfile)?.length && userProfile.length && userProfile.billing_data && userProfile.billing_data.length ?
                    <>
                        <Frame gap="5px">
                            <Texto>Inscrição municipal</Texto>
                            {userProfile?.billing_data.CNPJ.document ?
                                <Texto weight="800">{userProfile?.billing_data.CNPJ.document}</Texto>
                                : <Skeleton variant="rectangular" width={200} height={25} />
                            }
                        </Frame>
                        <BotaoSemBorda>
                            <RiEditBoxFill size={18} />
                            <Link  onClick={() => setModalInscricaoMunicipalOpened(true)} className={styles.link}>Alterar</Link>
                        </BotaoSemBorda>
                    </>
                     : <Skeleton variant="rectangular" width={200} height={25} />
                    }
                </ContainerHorizontal>
                <ContainerHorizontal width="50%">
                    {Object.keys(userProfile)?.length && userProfile.length && userProfile.billing_data && userProfile.billing_data.length ?
                    <>
                        <Frame gap="5px">
                            <Texto>IInscrição estadual</Texto>
                            {userProfile?.billing_data.CNPJ.document ?
                                <Texto weight="800">{userProfile?.billing_data.CNPJ.document}</Texto>
                                : <Skeleton variant="rectangular" width={200} height={25} />
                            }
                        </Frame>
                        <BotaoSemBorda>
                            <RiEditBoxFill size={18} />
                            <Link onClick={() => setModalInscricaoEstadualOpened(true)} className={styles.link}>Alterar</Link>
                        </BotaoSemBorda>
                    </>
                     : <Skeleton variant="rectangular" width={200} height={25} />
                    }
                </ContainerHorizontal>
            </div>
            <Titulo>
                <h6>E-mail</h6>
                <SubTitulo>Para comprovantes fiscais</SubTitulo>
            </Titulo>
            <div className={styles.card_dashboard}>
                <ContainerHorizontal width="50%">
                    {Object.keys(userProfile)?.length && userProfile.length && userProfile.billing_data && userProfile.billing_data.length ?
                    <>
                        <Frame gap="5px">
                            <Texto>E-mail</Texto>
                            {userProfile?.billing_data.email.email ?
                                <Texto weight="800">{userProfile?.billing_data.email.email}</Texto>
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
            <Titulo>
                <h6>Endereço</h6>
                <SubTitulo>Para comprovantes fiscais</SubTitulo>
            </Titulo>
            <div className={styles.card_dashboard}>
                <Texto>CEP</Texto>
                 {Object.keys(userProfile)?.length && userProfile.length && userProfile.billing_data && userProfile.billing_data.length ?
                 <>
                    {userProfile.billing_data.addresses.address_postal_code ?
                        <Texto weight="800">{userProfile?.billing_data.addresses.address_postal_code}</Texto>
                        : <Skeleton variant="rectangular" width={200} height={25} />
                    }
                </>
                : <Skeleton variant="rectangular" width={200} height={25} />
            }
                <Texto>Logradouro</Texto>
                 {Object.keys(userProfile)?.length && userProfile.length && userProfile.billing_data && userProfile.billing_data.length ?
                    (userProfile.billing_data.addresses.address_street ?
                        <Texto weight="800">{userProfile?.billing_data.addresses.address_street}</Texto>
                        : '--')
                    : <Skeleton variant="rectangular" width={200} height={25} />
                }
                <Texto>Bairro</Texto>
                 {Object.keys(userProfile)?.length && userProfile.length && userProfile.billing_data && userProfile.billing_data.length ?
                    (userProfile.billing_data.addresses.address_district ?
                        <Texto weight="800">{userProfile?.billing_data.addresses.address_district}</Texto>
                        : '--')
                    : <Skeleton variant="rectangular" width={200} height={25} />
                }
                <Texto>Número</Texto>
                 {Object.keys(userProfile)?.length && userProfile.length && userProfile.billing_data && userProfile.billing_data.length ?
                    (userProfile.billing_data.addresses.address_number ?
                        <Texto weight="800">{userProfile?.billing_data.addresses.address_number}</Texto>
                        : '--')
                    : <Skeleton variant="rectangular" width={200} height={25} />
                }
                <Texto>Complemento</Texto>
                 {Object.keys(userProfile)?.length && userProfile.length && userProfile.billing_data && userProfile.billing_data.length ?
                    (userProfile.billing_data.addresses.address_complement ?
                        <Texto weight="800">{userProfile?.billing_data.addresses.address_complement}</Texto>
                        : '--')
                    : <Skeleton variant="rectangular" width={200} height={25} />
                }
                <Texto>Cidade</Texto>
                 {Object.keys(userProfile)?.length && userProfile.length && userProfile.billing_data && userProfile.billing_data.length ?
                    (userProfile.billing_data.addresses.address_city ?
                        <Texto weight="800">{userProfile?.billing_data.addresses.address_city}</Texto>
                        : '--')
                    : <Skeleton variant="rectangular" width={200} height={25} />
                }
                <ContainerHorizontal width="50%">
                    {Object.keys(userProfile)?.length && userProfile.length && userProfile.billing_data && userProfile.billing_data.length ?
                        <>
                            <Frame gap="5px">
                                <Texto>Estado</Texto>
                                {userProfile.billing_data.addresses.address_state ?
                                    <Texto weight="800">{userProfile?.billing_data.addresses.address_state}</Texto>
                                    : <Skeleton variant="rectangular" width={200} height={25} />
                                }
                            </Frame>
                            <BotaoSemBorda>
                                <RiEditBoxFill size={18} />
                                <Link onClick={() => setModalOpened(true)} className={styles.link}>Alterar</Link>
                            </BotaoSemBorda>
                        </>
                        : <Skeleton variant="rectangular" width={200} height={25} />
                    }
                </ContainerHorizontal>
            </div>
            <ModalAlterar dadoAntigo={userProfile?.billing_data?.addresses ?? []} aoClicar={editarEndereco} opened={modalOpened} aoFechar={() => setModalOpened(!modalOpened)} />
            <ModalAlterarEmail dadoAntigo={userProfile?.billing_data?.email?.email ?? ''} aoClicar={editarEmail} opened={modalEmailOpened} aoFechar={() => setModalEmailOpened(!modalEmailOpened)} />
            <ModalAlterarInscricaoEstadual dadoAntigo={userProfile?.billing_data?.CNPJ?.document ?? ''} aoClicar={editarInscricaoEstadual} opened={modalInscricaoEstadualOpened} aoFechar={() => setModalInscricaoEstadualOpened(!modalInscricaoEstadualOpened)} />
            <ModalAlterarInscricaoMunicipal dadoAntigo={userProfile?.billing_data?.CNPJ?.document ?? ''} aoClicar={editarInscricaoMunicipal} opened={modalInscricaoMunicipalOpened} aoFechar={() => setModalInscricaoMunicipalOpened(!modalInscricaoMunicipalOpened)} />
      
        </>
    )
}
export default MeusDadosDadosFaturamento
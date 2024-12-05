import { useEffect, useState } from "react"
import http from '@http'
import Texto from '@components/Texto'
import Frame from '@components/Frame'
import Titulo from '@components/Titulo'
import BotaoSemBorda from '@components/BotaoSemBorda'
import ContainerHorizontal from '@components/ContainerHorizontal'
import { Link, useParams } from "react-router-dom"
import { Skeleton } from 'primereact/skeleton'
import styles from './Detalhes.module.css'
import { RiEditBoxFill } from 'react-icons/ri';

function OperadorDados() {

    let { id } = useParams()
    const [operador, setOperador] = useState(null)

    useEffect(() => {
        if(!operador)
        {
            http.get(`api/operator/show/${id}`)
                .then((response) => {
                    if (response.success) 
                    {
                        setOperador(response.operator)
                    }
                })
                .catch(erro => console.log(erro))
        }
    }, [operador])


    function formataCPF(cpf) {
        cpf = cpf.replace(/[^\d]/g, "");
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }

    return (
        <>
            <Titulo><h6>Informações gerais</h6></Titulo>

            <div className={styles.card_dashboard}>
                <Texto>Nome completo</Texto>
                {operador ?
                    <Texto weight="800">{operador?.collaborator.social_name}</Texto>
                    : <Skeleton variant="rectangular" width={200} height={25} />
                }
                <Texto>Nome social</Texto>
                {operador ?
                    (operador.collaborator.social ?
                        <Texto weight="800">{operador?.collaborator.social_reason}</Texto>
                        : '--')
                    : <Skeleton variant="rectangular" width={200} height={25} />
                }
                <Texto>CPF</Texto>
                {operador ?
                    <Texto weight="800">{formataCPF(operador?.collaborator.cpf)}</Texto>
                    : <Skeleton variant="rectangular" width={200} height={25} />
                }
            </div>
            <Titulo><h6>Informações de contato</h6></Titulo>

            <div className={styles.card_dashboard}>
                <ContainerHorizontal width="50%">
                    <Frame gap="5px">
                        <Texto>Telefone/Celular</Texto>
                        {operador ?
                            <Texto weight="800">{operador?.collaborator.phone_number}</Texto>
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
                        {operador ?
                            <Texto weight="800">{operador?.collaborator.email}</Texto>
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

export default OperadorDados
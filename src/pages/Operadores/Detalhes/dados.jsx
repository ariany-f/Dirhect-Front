import { useEffect, useState } from "react"
import http from '@http'
import Texto from '@components/Texto'
import Frame from '@components/Frame'
import Titulo from '@components/Titulo'
import BotaoSemBorda from '@components/BotaoSemBorda'
import ContainerHorizontal from '@components/ContainerHorizontal'
import { Link, useOutletContext, useParams } from "react-router-dom"
import { Skeleton } from 'primereact/skeleton'
import styles from './Detalhes.module.css'
import { RiEditBoxFill } from 'react-icons/ri';

function OperadorDados() {

    let { id } = useParams()
    const [operador, setOperador] = useState(null)
    const context = useOutletContext()

    useEffect(() => {
        if((!operador) && context)
        {
           setOperador(context)
        }
    }, [operador, context])


    function formataCPF(cpf) {
        cpf = cpf.replace(/[^\d]/g, "");
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }

    return (
        <>
            <Titulo><h6>Informações gerais</h6></Titulo>

            <div className={styles.card_dashboard}>
                <Texto>Nome completo</Texto>
                {operador?.first_name ?
                    <Texto weight="800">{operador?.first_name} {operador?.last_name}</Texto>
                    : <Skeleton variant="rectangular" width={200} height={25} />
                }
                <Texto>Login</Texto>
                {operador?.username ?
                    <Texto weight="800">{operador?.username}</Texto>
                    : <Skeleton variant="rectangular" width={200} height={25} />
                }
            </div>
            <Titulo><h6>Informações de contato</h6></Titulo>

            <div className={styles.card_dashboard}>
                <ContainerHorizontal width="50%">
                    <Frame gap="5px">
                        <Texto>Telefone/Celular</Texto>
                        {operador?.phone_number ?
                            <Texto weight="800">{operador?.phone_number}</Texto>
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
                        {operador?.email ?
                            <Texto weight="800">{operador?.email}</Texto>
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
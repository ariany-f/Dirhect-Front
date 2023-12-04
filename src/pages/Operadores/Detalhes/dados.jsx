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
    const [operador, setOperador] = useState({})

    useEffect(() => {
        http.get(`api/dashboard/operator/${id}`)
            .then(response => {
                if (response.operator) {
                    setOperador(response.operator)
                }
            })
            .catch(erro => console.log(erro))
    }, [])


    function formataCPF(cpf) {
        cpf = cpf.replace(/[^\d]/g, "");
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }

    return (
        <>
            <Titulo><h6>Informações gerais</h6></Titulo>

            <div className={styles.card_dashboard}>
                <Texto>Nome completo</Texto>
                {operador.name ?
                    <Texto weight="800">{operador?.name}</Texto>
                    : <Skeleton variant="rectangular" width={200} height={25} />
                }
                <Texto>Nome social</Texto>
                {operador ?
                    (operador.social ?
                        <Texto weight="800">{operador?.social}</Texto>
                        : '--')
                    : <Skeleton variant="rectangular" width={200} height={25} />
                }
                <Texto>CPF</Texto>
                {operador.document ?
                    <Texto weight="800">{formataCPF(operador?.document)}</Texto>
                    : <Skeleton variant="rectangular" width={200} height={25} />
                }
            </div>
            <Titulo><h6>Informações de contato</h6></Titulo>

            <div className={styles.card_dashboard}>
                <ContainerHorizontal width="50%">
                    <Frame gap="5px">
                        <Texto>Telefone/Celular</Texto>
                        {operador.phone_number ?
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
                        {operador.email ?
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
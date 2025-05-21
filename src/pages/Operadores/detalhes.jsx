import { Link, Outlet, useLocation, useParams } from 'react-router-dom'
import BotaoVoltar from "@components/BotaoVoltar"
import BotaoGrupo from "@components/BotaoGrupo"
import Botao from "@components/Botao"
import Titulo from "@components/Titulo"
import Frame from "@components/Frame"
import Container from "@components/Container"
import styles from './Operadores.module.css'
import { Skeleton } from 'primereact/skeleton'
import http from '@http'
import { useEffect, useState } from 'react'

function OperadorDetalhes() {

    let { id } = useParams()
    const location = useLocation();
    const [operador, setOperador] = useState(null)

    useEffect(() => {
        if(!operador)
        {
            http.get(`usuario/${id}/?format=json`)
                .then(response => {
                    setOperador(response)
                })
                .catch(erro => console.log(erro))
        }
    }, [operador])

    return (
        <Frame>
            <Container gap="32px">
                <BotaoVoltar linkFixo="/operador" />
                    {operador ? 
                        <Titulo>
                            <h3>{operador?.first_name} {operador?.last_name}</h3>
                        </Titulo>
                    : <Skeleton variant="rectangular" width={300} height={40} />
                    }
                <BotaoGrupo>
                    <Link className={styles.link} to={`/operador/detalhes/${id}`}>
                        <Botao estilo={location.pathname == `/operador/detalhes/${id}` ? 'black':''} size="small" tab>Dados</Botao>
                    </Link>
                    <Link className={styles.link} to={`/operador/detalhes/${id}/permissoes`}>
                        <Botao estilo={location.pathname == `/operador/detalhes/${id}/permissoes` ? 'black':''} size="small" tab>Permissões</Botao>
                    </Link>
                </BotaoGrupo>
                <Outlet context={operador}/>
            </Container>
        </Frame>
    )
}

export default OperadorDetalhes
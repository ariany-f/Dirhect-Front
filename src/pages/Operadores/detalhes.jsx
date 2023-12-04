import { Link, Outlet, useLocation, useParams } from 'react-router-dom';
import BotaoVoltar from "@components/BotaoVoltar"
import BotaoGrupo from "@components/BotaoGrupo"
import Botao from "@components/Botao"
import Titulo from "@components/Titulo"
import Frame from "@components/Frame"
import Container from "@components/Container"
import styles from './Operadores.module.css'
import { Skeleton } from 'primereact/skeleton'
import http from '@http'
import { useEffect, useState } from 'react';

function OperadorDetalhes() {

    let { id } = useParams()
    const location = useLocation();
    const [operador, setOperador] = useState({})

    useEffect(() => {
        http.get(`api/dashboard/operator/${id}`)
            .then(response => {
                if(response.collaborator)
                {
                    setOperador(response.collaborator)
                }
            })
            .catch(erro => console.log(erro))
    }, [])

    return (
        <Frame>
            <Container gap="32px">
                <BotaoVoltar linkFixo="/operador" />
                    {operador.name ? 
                        <Titulo>
                            <h3>{operador.name}</h3>
                        </Titulo>
                    : <Skeleton variant="rectangular" width={300} height={40} />
                    }
                <BotaoGrupo>
                    <Link className={styles.link} to={`/operador/detalhes/${id}`}>
                        <Botao estilo={location.pathname == `/operador/detalhes/${id}` ? 'black':''} size="small" tab>Dados</Botao>
                    </Link>
                    <Link className={styles.link} to={`/operador/detalhes/${id}/cartoes`}>
                        <Botao estilo={location.pathname == `/operador/detalhes/${id}/permissoes` ? 'black':''} size="small" tab>Permissões</Botao>
                    </Link>
                </BotaoGrupo>
                <Outlet/>
            </Container>
        </Frame>
    )
}

export default OperadorDetalhes
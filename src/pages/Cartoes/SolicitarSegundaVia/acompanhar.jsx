import { Link, useParams } from "react-router-dom"
import { Skeleton } from 'primereact/skeleton'
import Frame from '@components/Frame'
import Texto from '@components/Texto'
import Titulo from '@components/Titulo'
import Container from '@components/Container'
import BotaoVoltar from '@components/BotaoVoltar'
import { useState } from "react"

function CartaoSolicitarSegundaViaAcompanhar() {

    const { id } = useParams()
    const [cartoes, setCartoes] = useState({})

    return (
      
       <Frame>
            <Container gap="24px">
                <BotaoVoltar linkFixo="/elegibilidade" />
                <Titulo>
                    <h3>Maria Eduarda</h3>
                </Titulo>
                <Texto weight={700}>Cartão solicitado</Texto>
                {cartoes.length ?
                    <></>
                : <Skeleton variant="rectangular" width={400} height={200} />
                }
            </Container>
        </Frame>
    )
}

export default CartaoSolicitarSegundaViaAcompanhar
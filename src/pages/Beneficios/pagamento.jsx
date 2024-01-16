import BotaoVoltar from "@components/BotaoVoltar"
import Frame from '@components/Frame'
import Container from '@components/Container'
import ContainerHorizontal from '@components/ContainerHorizontal'
import Texto from '@components/Texto'
import Titulo from '@components/Titulo'
import BotaoGrupo from '@components/BotaoGrupo'
import BadgeStatusBeneficio from '@components/BadgeStatusBeneficio'

function BeneficioPagamento() {
    return (
        <Frame>
            <Container gap="24px">
                <BotaoVoltar linkFixo="/beneficio" />
                <Container gap="12px">
                    <Texto weight={500} size="12px">Nome da recarga</Texto>
                    <Titulo>
                        <ContainerHorizontal gap="12px" align='flex-start'>
                            <h3>Recarga de Janeiro</h3><small>Código <b>DSF4SDF75</b></small>
                        </ContainerHorizontal>
                    </Titulo>
                    <BotaoGrupo align="space-between">
                        <BadgeStatusBeneficio status={2} />
                        <Texto>Criado em&nbsp;<b>13/09</b></Texto>
                    </BotaoGrupo>
                </Container>
            </Container>
        </Frame>
    )
}

export default BeneficioPagamento
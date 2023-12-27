import BotaoVoltar from "@components/BotaoVoltar"
import Container from "@components/Container"
import Frame from "@components/Frame"
function BeneficioOndeUsar() {
    
    return (
       <>
       <Frame>
            <Container gap="32px">
                <BotaoVoltar linkFixo="/beneficios" />
            </Container>
        </Frame>
       </>
    )
}

export default BeneficioOndeUsar
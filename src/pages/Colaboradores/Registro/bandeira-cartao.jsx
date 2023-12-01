import CampoTexto from "@components/CampoTexto"
import Botao from "@components/Botao"
import Frame from "@components/Frame"
import Titulo from "@components/Titulo"
import SubTitulo from "@components/SubTitulo"
import SwitchInput from '@components/SwitchInput'
import DropdownItens from '@components/DropdownItens'
import { useState, useEffect } from "react"
import http from '@http'
import styled from "styled-components"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useColaboradorContext } from "../../../contexts/Colaborador"
 
const Col12 = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
`

const Col6 = styled.div`
    padding: 20px;
    width: 455px;
`

const ContainerButton = styled.div`
    display: flex;
    width: 100%;
    padding: 20px;
    justify-content: space-between;
    & button {
        width: initial;
    }
`

function ColaboradorBandeiraCartao() {

    const navegar = useNavigate()
    const [classError, setClassError] = useState([])

    const { 
        colaborador,
        setRequestedCardEnum,
        submeterUsuario
    } = useColaboradorContext()
    


    const sendData = (evento) => {
        evento.preventDefault()

        document.querySelectorAll('input').forEach(function(element, index) {
            
            if(element.value !== '' && (!element.classList.contains('not_required')))
            {
                if(classError.includes(element.name))
                {
                    setClassError(classError.filter(item => item !== element.name))
                }
            }
            else
            {
                if(!classError.includes(element.name))
                {
                    setClassError(estadoAnterior => [...estadoAnterior, element.name])
                }
            }
        })

        if(document.querySelectorAll("form .error").length === 0)
        {
            submeterUsuario()
        }
    }

    return (
        <form>
            <Frame estilo="spaced">
                <Titulo>
                    <h6>Bandeira do cartão</h6>
                    <SubTitulo>
                        Escolha uma bandeira para o cartão do seu colaborador:
                    </SubTitulo>
                </Titulo>
            </Frame>
            <Frame estilo="spaced">
                
            
            </Frame>
            <ContainerButton>
                <Botao aoClicar={() => navegar(-1)} estilo="neutro" formMethod="dialog" size="medium" filled>Voltar</Botao>
            </ContainerButton>
        </form>
    )
}

export default ColaboradorBandeiraCartao
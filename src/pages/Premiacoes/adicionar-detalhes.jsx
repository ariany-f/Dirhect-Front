import { useRecargaSaldoLivreContext } from "../../contexts/RecargaSaldoLivre"
import http from '@http'
import { useEffect, useRef, useState } from "react"
import { Link, useNavigate, useParams } from 'react-router-dom'
import Botao from "@components/Botao"
import Frame from "@components/Frame"
import Texto from "@components/Texto"
import CampoTexto from "@components/CampoTexto"
import Titulo from "@components/Titulo"
import './SelecionarColaboradores.css'
import { Toast } from 'primereact/toast'
import styled from 'styled-components'

function PremiacaoDetalhes() {

    const toast = useRef(null)
    
    const {
        recarga,
        setColaboradores,
        setNome,
        setMotivo
    } = useRecargaSaldoLivreContext()
    
    return (
      
        <>
            <Frame>
                <Toast ref={toast} />
                <>
                    <Titulo>
                        <h6>Detalhes da recarga</h6>
                    </Titulo>
                    <CampoTexto numeroCaracteres={50} placeholder='ex. Pagamento de Janeiro' label='Nome da Recarga' />
                </>
            </Frame>
        </>
    )
}

export default PremiacaoDetalhes


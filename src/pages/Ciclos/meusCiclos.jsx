import Botao from '@components/Botao'
import BotaoGrupo from '@components/BotaoGrupo'
import Titulo from '@components/Titulo'
import BotaoVoltar from '@components/BotaoVoltar'
import { GrAddCircle } from 'react-icons/gr'
import styled from "styled-components"
import { Link, Outlet, useLocation, useOutlet, useOutletContext, useParams } from "react-router-dom"
import { FaDownload } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import React, { createContext, useContext } from 'react';
import meusCiclos from '@json/meusciclos.json'
import DataTableCiclo from '@components/DataTableCiclos'

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`

const MeusCiclos = () => {

    let { id } = useParams()
    const [ciclos, setCiclos] = useState(null)

    useEffect(() => {
        if(!ciclos)
        {
            let cc = meusCiclos.filter(evento => evento.colaborador_id == id);
            if(cc.length > 0)
            {
                setCiclos(cc)
            }
        }
    }, [ciclos])

    return (
        <ConteudoFrame>
            <DataTableCiclo ciclos={ciclos} colaborador={id}/>
        </ConteudoFrame>
    );
};

export default MeusCiclos; 
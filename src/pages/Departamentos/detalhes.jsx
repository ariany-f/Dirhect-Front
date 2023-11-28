import http from '@http'
import { useEffect } from "react";
import { useParams } from 'react-router-dom';
import BotaoVoltar from "@components/BotaoVoltar"
import Frame from "@components/Frame"
import Texto from "@components/Texto"
import Titulo from "@components/Titulo"
import { useState } from 'react';

function DepartamentoDetalhes() {

    let { id } = useParams()
    const [departamento, setDepartamento] = useState({})

    useEffect(() => {
        http.get("api/dashboard/department/"+id)
            .then(response => {
                setDepartamento(response.department)
            })
            .catch(erro => console.log(erro))
    }, [])
   
    return (
        <Frame>
            <BotaoVoltar />
            <Texto weight={500} size="12px">Departamento</Texto>
            <Titulo>
                <h3>{departamento.name}</h3>
            </Titulo>
        </Frame>
    )
}

export default DepartamentoDetalhes
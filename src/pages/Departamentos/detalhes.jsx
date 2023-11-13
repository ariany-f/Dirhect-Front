import http from '@http'
import { useEffect } from "react";
import { useParams } from 'react-router-dom';
import BotaoVoltar from "@components/BotaoVoltar"
import Frame from "@components/Frame"

function DepartamentoDetalhes() {

    let { id } = useParams()

    useEffect(() => {
        http.get("api/dashboard/department/"+id)
            .then(response => {
                console.log(response)
            })
            .catch(erro => console.log(erro))
    }, [])
   
    return (
        <Frame>
            <BotaoVoltar />
        </Frame>
    )
}

export default DepartamentoDetalhes
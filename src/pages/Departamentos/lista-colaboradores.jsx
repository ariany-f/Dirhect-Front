import http from '@http'
import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import Frame from "@components/Frame"
import DataTableColaboradores from '@components/DataTableColaboradores'

function DepartamentoListaColaboradores() {

    let { id } = useParams()
    const [colaboradores, setColaboradores] = useState(null)

    useEffect(() => {
        http.get(`api/dashboard/department/${id}`)
            .then(response => {
                setColaboradores(response.department.collaborators)
            })
            .catch(erro => console.log(erro))
    }, [])
   
    return (
        <Frame>
            <DataTableColaboradores colaboradores={colaboradores ?? []} />
        </Frame>
    )
}

export default DepartamentoListaColaboradores
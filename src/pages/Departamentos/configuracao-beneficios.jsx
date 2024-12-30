import http from '@http'
import { useEffect, useState } from "react"
import { useParams } from 'react-router-dom'
import Frame from "@components/Frame"
import Titulo from "@components/Titulo"
import SubTitulo from "@components/SubTitulo"
import MainContainer from "@components/MainContainer"
import Dashboard from '@assets/Dashboard.svg'

function DepartamentoConfiguracaoBeneficios() {

    let { id } = useParams()
    const [departamento, setDepartamento] = useState(null)

    useEffect(() => {
        // if(!departamento)
        // {
        //     http.get(`api/department/show/${id}`)
        //         .then(response => {
        //             setDepartamento(response.department)
        //         })
        //         .catch(erro => console.log(erro))
        // }
    }, [departamento])
   
    return (
        <Frame>
           {departamento && departamento.benefits && departamento?.benefits.length ?
            <></>
           :
           <Frame align="center">
            <MainContainer align="center">
                <img src={Dashboard} size={100}/>
                <Titulo>
                    <h6>Você não configurou nenhum benefício</h6>
                    <SubTitulo>Aqui você verá todos os benefícios configurados</SubTitulo>
                </Titulo>
            </MainContainer>
           </Frame>
           }
        </Frame>
    )
}

export default DepartamentoConfiguracaoBeneficios
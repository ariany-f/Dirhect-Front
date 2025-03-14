import ContainerHorizontal from '@components/ContainerHorizontal'
import RadioButton from '@components/RadioButton'
import CampoTexto from "@components/CampoTexto"
import { Link } from 'react-router-dom'
import Texto from "@components/Texto"
import { Skeleton } from 'primereact/skeleton'
import styled from "styled-components"
import { useEffect, useState } from "react"
import http from '@http'

const Col12 = styled.div`
    display: flex;
    flex-wrap: wrap;
    padding: 20px;
`

const Col3 = styled.div`
    padding: 5px 15px;
    width: 225px;
`

const ContainerRecentes = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`

function DepartamentosRecentes({ setValor }){
    
    const [departamentos, setDepartamentos] = useState([])
    const [selectedDepartment, setSelectedDepartment] = useState(null)
    const [nomeDepartamento, setNomeDepartamento] = useState('')
    
    const adicionarDepartamento = () => {
        const data = {
            nome: nomeDepartamento,
            description: ''
        }
        
        http.post('departamento/?format=json', data)
            .then((response) => {
                setNomeDepartamento('')                
            })
            .catch(erro => {
                console.error(erro)
            })
    }
    
    useEffect(() => {
        http.get('departamento/?format=json')
            .then(response => {
                if(response)
                {
                    setDepartamentos(response)
                    if(departamentos.length && selectedDepartment === null)
                    {
                        setSelectedDepartment(departamentos[0].id)
                        setValor(departamentos[0])
                    }
                }
            })
            .catch(erro => console.log(erro))
    }, [nomeDepartamento])

    function handleChange(departamento)
    {
        setSelectedDepartment(departamento.id)
        setValor(departamento)
    }

    return (
        <ContainerRecentes>
            <Col12>
                <Texto>Criados recentemente:</Texto>
            </Col12>
            <Col12>
                {departamentos ?
                    departamentos.length ?
                        departamentos.map((department, index) => {
                            return (
                                <Col3 key={index}>
                                    <ContainerHorizontal align="start" gap="8px">
                                        <RadioButton top="0" value={department.id} checked={selectedDepartment ? (department.id == selectedDepartment) : (index === 0)} onSelected={setSelectedDepartment}/>
                                        <Link>
                                            <Texto aoClicar={() => handleChange(department)} size="14px" weight={700}>{department.nome}</Texto>
                                        </Link>
                                    </ContainerHorizontal>
                                </Col3>
                            )
                        })
                    :  <Skeleton variant="rectangular" width={200} height={40} />
                : <Skeleton variant="rectangular" width={200} height={40} />
                }
            </Col12>
        </ContainerRecentes>
    )
}

export default DepartamentosRecentes
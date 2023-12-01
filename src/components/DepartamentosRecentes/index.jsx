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
            status: 10,
            name: nomeDepartamento,
            description: ''
        }
        
        http.post('api/dashboard/department', data)
            .then((response) => {
                setNomeDepartamento('')                
            })
            .catch(erro => {
                console.error(erro)
            })
    }
    
    useEffect(() => {
        http.get('api/dashboard/department')
            .then(response => {
                if(response.data.departments)
                {
                    setDepartamentos(response.data.departments)
                    if(departamentos.length && selectedDepartment === null)
                    {
                        const obj = {}
                        obj[departamentos[0].name] = departamentos[0].public_id
                        setSelectedDepartment(departamentos[0].public_id)
                        setValor(obj)
                    }
                }
            })
            .catch(erro => console.log(erro))
    }, [nomeDepartamento])

    function handleChange(nomeDepartamento, idDepartamento)
    {
        const obj = {}
        obj[nomeDepartamento] = idDepartamento
        setSelectedDepartment(idDepartamento)
        setValor(obj)
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
                                        <RadioButton top="0" value={department.public_id} checked={selectedDepartment ? (department.public_id == selectedDepartment) : (index === 0)} onSelected={setSelectedDepartment}/>
                                        <Link>
                                            <Texto aoClicar={() => handleChange(department.name, department.public_id)} size="14px" weight={700}>{department.name}</Texto>
                                        </Link>
                                    </ContainerHorizontal>
                                </Col3>
                            )
                        })
                    : <Texto>Adicione um departamento</Texto>
                : <Skeleton variant="rectangular" width={200} height={40} />
                }
            </Col12>
            <Col12>
                <CampoTexto
                    onEnter={adicionarDepartamento}
                    width="65vw"
                    name="new_department" 
                    valor={nomeDepartamento} 
                    setValor={setNomeDepartamento} 
                    type="text" 
                    label="Novo departamento" 
                    placeholder="ex: Administrativo" />
            </Col12>
        </ContainerRecentes>
    )
}

export default DepartamentosRecentes
import { Outlet } from 'react-router-dom'
import { DepartamentoProvider } from '../../contexts/Departamento'
import { useEffect, useState } from 'react'
import http from '../../http'

function DepartamentosCommon() {

    const [departamentos, setDepartamentos] = useState(null)

    useEffect(() => {
       
        if(!departamentos) {
            
            http.get('departamento/?format=json')
                .then(response => {
                    setDepartamentos(response)
                })
                .catch(erro => {
                    setLoading(false)
                })
        }    
        
    }, [departamentos])

    return (
        <DepartamentoProvider>
            <Outlet context={departamentos} />
        </DepartamentoProvider>
    )
}

export default DepartamentosCommon
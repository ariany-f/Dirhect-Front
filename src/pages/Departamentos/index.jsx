import { Outlet } from 'react-router-dom'
import { DepartamentoProvider } from '../../contexts/Departamento'
import { useEffect, useState } from 'react'
import http from '../../http'

function DepartamentosCommon() {

    useEffect(() => {
       
    }, [])

    return (
        <DepartamentoProvider>
            <Outlet />
        </DepartamentoProvider>
    )
}

export default DepartamentosCommon
import { Outlet } from "react-router-dom"
import { DependentesProvider } from "@contexts/Dependentes"
import { useEffect, useState } from "react"
import http from "@http"
import Loading from '@components/Loading'
import { useSessaoUsuarioContext } from "@contexts/SessaoUsuario"

function Dependentes() {

    const [loading, setLoading] = useState(false)
    const [dependentes, setDependentes] = useState(null)
    const [pessoasfisicas, setPessoasFisicas] = useState(null)
    const [funcionarios, setFuncionarios] = useState(null)
    const [dep_pess, setDepPess] = useState(null)

    const {
        usuario
    } = useSessaoUsuarioContext()

    useEffect(() => {
        if(!dependentes)
        {
            setLoading(true)
            if(usuario.tipo == 'funcionario')
            {
                http.get(`dependente/?format=json&id_funcionario=${usuario.public_id}`)
                .then(response => {
                   setDependentes(response)
                })
                .catch(erro => {
                    setLoading(false)
                })
                .finally(function() {
                    setLoading(false)
                })
            }
            else
            {
                http.get('dependente/?format=json')
                .then(response => {
                    setDependentes(response)
                })
                .catch(erro => {
                    setLoading(false)
                })
                .finally(function() {
                    setLoading(false)
                })
            }
        }
        
    }, [dependentes])

    return (
        <DependentesProvider>
            <Loading opened={loading} />
            <Outlet context={dependentes} />
        </DependentesProvider>
    )
}

export default Dependentes
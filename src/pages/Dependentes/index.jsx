import { Outlet } from "react-router-dom"
import { DependentesProvider } from "@contexts/Dependentes"
import { useEffect, useState } from "react"
import http from "@http"
import Loading from '@components/Loading'

function Dependentes() {

    const [loading, setLoading] = useState(false)
    const [dependentes, setDependentes] = useState(null)
    const [pessoasfisicas, setPessoasFisicas] = useState(null)
    const [funcionarios, setFuncionarios] = useState(null)
    const [dep_pess, setDepPess] = useState(null)

    useEffect(() => {
        if(!funcionarios)
        {
            setLoading(true)
            http.get('funcionario/?format=json')
                .then(response => {
                    setFuncionarios(response)
                })
                .catch(erro => {
                    setLoading(false)
                })
        } else if (pessoasfisicas && funcionarios) {
            const processados = funcionarios.map(item => {
                const pessoa = pessoasfisicas.find(pessoa => pessoa.id === item.id_pessoafisica);
        
                return { 
                    ...item, 
                    pessoa_fisica: pessoa || null, // Adiciona `pessoa_fisica`
                };
            });
            setFuncionarios(processados)
        }
        if(!dependentes)
        {
            http.get('dependente/?format=json')
            .then(response => {
               setDependentes(response)
            })
            .catch(erro => {
                setLoading(false)
            })
        }
        if(!pessoasfisicas) {
            
            http.get('pessoa_fisica/?format=json')
                .then(response => {
                    setPessoasFisicas(response)
                })
                .catch(erro => {
                    setLoading(false)
                })
        }

        if (pessoasfisicas && dependentes && funcionarios && !dep_pess) {
            // Verifica se todos os funcionários têm `pessoa_fisica`
            const funcionariosValidos = funcionarios.every(func => func.pessoa_fisica);
        
            if (funcionariosValidos) {
                const processados = dependentes.map(item => {
                    const pessoa = pessoasfisicas.find(pessoa => pessoa.id === item.id_pessoafisica);
            
                    return { 
                        ...item, 
                        dados_pessoa_fisica: pessoa || null, // Adiciona `pessoa_fisica`
                        funcionario: item.id_funcionario || null // Adiciona `funcionario`
                    };
                });
        
                setDepPess(processados); // Atualiza o estado com os dados processados
                
                setLoading(false)
            }
        }
        
    }, [dependentes, pessoasfisicas, dep_pess, funcionarios])

    return (
        <DependentesProvider>
            <Loading opened={loading} />
            <Outlet context={dep_pess} />
        </DependentesProvider>
    )
}

export default Dependentes
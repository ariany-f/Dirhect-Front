import { Outlet } from "react-router-dom"
import { DependentesProvider } from "../../contexts/Dependentes"
import { useEffect, useState } from "react"
import http from "../../http"
 

function Dependentes() {

    const [dependentes, setDependentes] = useState(null)
    const [pessoasfisicas, setPessoasFisicas] = useState(null)
    const [funcionarios, setFuncionarios] = useState(null)
    const [dep_pess, setDepPess] = useState(null)

    useEffect(() => {
        if(!funcionarios)
        {
            http.get('funcionario/?format=json')
                .then(response => {
                    setFuncionarios(response)
                })
                .catch(erro => console.log(erro))
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
                
            })
        }
        if(!pessoasfisicas) {
            
            http.get('pessoa_fisica/?format=json')
                .then(response => {
                    setPessoasFisicas(response)
                })
                .catch(erro => console.log(erro))
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
            }
        }
        
    }, [dependentes, pessoasfisicas, dep_pess, funcionarios])

    return (
        <DependentesProvider>
            <Outlet context={dep_pess} />
        </DependentesProvider>
    )
}

export default Dependentes
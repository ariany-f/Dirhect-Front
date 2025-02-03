import Titulo from '@components/Titulo'
import QuestionCard from '@components/QuestionCard'
import { AiFillQuestionCircle } from 'react-icons/ai'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import http from '@http'
import Loading from '@components/Loading'
import DataTableDependentes from '@components/DataTableDependentes'

const DivPrincipal = styled.div`
    width: 65vw;
`

function ColaboradorDependentes() {

    let { id } = useParams()
    const [loading, setLoading] = useState(false)
    const [dependentes, setDependentes] = useState(null)
    const [pessoasfisicas, setPessoasFisicas] = useState(null)
    const [funcionarios, setFuncionarios] = useState(null)
    const [dep_pess, setDepPess] = useState(null)

    useEffect(() => {
        if(!dependentes)
        {
            setLoading(true)
            http.get(`dependente/?format=json&id_funcionario=${id}`)
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
        
        if (pessoasfisicas && dependentes && !dep_pess) {
    
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
        
    }, [dependentes, pessoasfisicas, dep_pess])

    return (
        <DivPrincipal>
            <Loading opened={loading} />
            <Titulo>
                <QuestionCard alinhamento="start" element={<h6>Dependentes</h6>}>
                    <AiFillQuestionCircle className="question-icon" size={20} />
                </QuestionCard>
            </Titulo>
            <DataTableDependentes dependentes={dep_pess}/>
        </DivPrincipal>
    )
}

export default ColaboradorDependentes
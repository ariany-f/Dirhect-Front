import { useEffect, useRef, useState } from "react"
import http from '@http'
import Texto from '@components/Texto'
import Frame from '@components/Frame'
import Titulo from '@components/Titulo'
import BotaoSemBorda from '@components/BotaoSemBorda'
import ContainerHorizontal from '@components/ContainerHorizontal'
import { useSessaoUsuarioContext } from "@contexts/SessaoUsuario"
import { Link, useOutletContext, useParams } from "react-router-dom"
import { Skeleton } from 'primereact/skeleton'
import styles from './Detalhes.module.css'
import { RiEditBoxFill } from 'react-icons/ri'
import { Toast } from 'primereact/toast'
import ModalAlterarTelefone from '@components/ModalAlterar/telefone'
import ModalAlterarEmail from '@components/ModalAlterar/email'
import styled from "styled-components"
import { Real } from '@utils/formats'
import { Tag } from "primereact/tag"

const Col12 = styled.div`
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    justify-content: space-between;
`

const Col6 = styled.div`
    padding: 10px;
    flex: 1 1 50%;
`


const Col3 = styled.div`
    padding: 10px;
    flex: 1 1 1 1 33%;
`

function ColaboradorDadosContratuais() {

    let { id } = useParams()
    const [colaborador, setColaborador] = useState(null)
    const [secao, setSecao] = useState(null)
    const [departamento, setDepartamento] = useState(null)
    const [centroCusto, setCentroCusto] = useState(null)
    const context = useOutletContext()
    const [modalTelefoneOpened, setModalTelefoneOpened] = useState(false)
    const [modalEmailOpened, setModalEmailOpened] = useState(false)
    const toast = useRef(null)
    
    const {
        usuario,
        solicitarCodigoLogin
    } = useSessaoUsuarioContext()

    useEffect(() => {
        if(context && (!colaborador))
        {
            setColaborador(context);
            console.log(context)
        } else if(colaborador) {
            if((!secao) && colaborador.id_secao)
            {
                http.get(`secao/${colaborador.id_secao}/?format=json`)
                    .then(response => {
                        setSecao(response);
                    })
                    .catch(erro => console.log(erro))
            }
            if((!departamento) && colaborador.departamento)
            {
                http.get(`departamento/${colaborador.departamento}/?format=json`)
                    .then(response => {
                        setDepartamento(response);
                    })
                    .catch(erro => console.log(erro))
            }
            if((!centroCusto) && colaborador.centro_custo)
            {
                http.get(`centro-custo/${colaborador.centro_custo}/?format=json`)
                    .then(response => {
                        setCentroCusto(response);
                    })
                    .catch(erro => console.log(erro))
            }
        }
    }, [colaborador, context, secao, departamento, centroCusto])

    function editarEmail(email) {
      
        solicitarCodigoLogin()
        .then((response) => {
            if(response.success)
            {
                let obj = {}
                obj['email'] = email
                obj['code'] = response.data.code
                http.post(`api/collaborator/update/${id}`, obj)
                .then(response => {
                   if(response.success)
                    {
                        toast.current.show({ severity: 'info', summary: 'Sucesso', detail: response.message, life: 3000 });
                        setModalTelefoneOpened(false)
                    }
                })
                .catch(erro => console.log(erro))
            }
        })
    }

    function editarTelefone(telefone) {
       
        let obj = {}
        const phoneCode = telefone.substring(0, 2);
        const phoneNumber = telefone.substring(2).trim();
        obj['phone_code'] = phoneCode
        obj['phone_number'] = phoneNumber
      
        http.post(`api/collaborator/update/${id}`, obj)
        .then(response => {
           if(response.success)
            {
                toast.current.show({ severity: 'info', summary: 'Sucesso', detail: response.message, life: 3000 });
                setModalTelefoneOpened(false)
            }
        })
        .catch(erro => console.log(erro))
    }

    function formataCPF(cpf) {
        cpf = cpf.replace(/[^\d]/g, "");
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }

    return (
        <>
        <Toast ref={toast} />
        <Col12>
            <Col6>
                <Titulo><h6>Informações trabalhistas</h6></Titulo>
                <div className={styles.card_dashboard}>
                    <Col12>
                        <Col3>
                            <Texto>Data Admissão</Texto>
                            {colaborador?.dt_admissao ?
                                <Texto weight="800">{new Date(colaborador?.dt_admissao).toLocaleDateString('pt-BR')}</Texto>
                                : <Skeleton variant="rectangular" width={200} height={25} />
                            }
                            <Texto>Tipo de Admissão</Texto>
                            {colaborador?.tipo_admissao && colaborador?.tipo_admissao_descricao ?
                                <Texto weight="800">{colaborador?.tipo_admissao_descricao}</Texto>
                                : <Skeleton variant="rectangular" width={200} height={25} />
                            }
                            <Texto>Salário</Texto>
                            {colaborador?.salario ?
                                <Texto weight="800">{Real.format(colaborador?.salario)}</Texto>
                                : <Skeleton variant="rectangular" width={200} height={25} />
                            }
                            <Texto>Deficiente Físico</Texto>
                            {colaborador?.funcionario_pessoa_fisica?.deficiente_fisico ?
                                <Texto weight="800">{colaborador?.funcionario_pessoa_fisica?.deficiente_fisico}</Texto>
                                : <Skeleton variant="rectangular" width={200} height={25} />
                            }
                            {colaborador?.situacao && colaborador?.situacao == 'D' && colaborador?.dt_demissao &&
                                <>
                                    <Texto>Data de Demissão</Texto>
                                    <Texto weight="800">{new Date(colaborador?.dt_demissao).toLocaleDateString('pt-BR')}</Texto>
                               
                                {colaborador?.tipo_demissao && colaborador?.tipo_demissao_descricao ?
                                    <>
                                        <Texto>Tipo de Demissão</Texto>
                                        <Texto weight="800">{colaborador?.tipo_demissao_descricao}</Texto>
                                    </>   
                                    : <Skeleton variant="rectangular" width={200} height={25} />
                                }
                                </>                    
                            }
                        </Col3>
                    </Col12>
                </div>  
            </Col6>
            <Col6>    
                <Titulo><h6>Informações de Localização</h6></Titulo>   
                <div className={styles.card_dashboard}>
                    <Frame gap="2px" alinhamento="start">
                        <Texto size={'14px'} weight={600}>Seção</Texto>
                        <div style={{display: 'flex', alignItems: 'center', gap: '2px', justifyContent: 'end'}}>
                            <Tag severity="info" value={secao?.nome ?? 'Não definida'}></Tag>
                        </div>
                    </Frame>
                    
                    <Frame gap="2px" alinhamento="start">
                        <Texto size={'14px'} weight={600}>Departamento</Texto>
                        <div style={{display: 'flex', alignItems: 'center', gap: '2px', justifyContent: 'end'}}>
                            <Tag severity="info" value={departamento?.nome ?? 'Não definida'}></Tag>
                        </div>
                    </Frame>

                    <Frame gap="2px" alinhamento="start">
                        <Texto size={'14px'} weight={600}>Centro de Custo</Texto>
                        <div style={{display: 'flex', alignItems: 'center', gap: '2px', justifyContent: 'end'}}>
                            <Tag severity="info" value={centroCusto?.nome ?? 'Não definida'}></Tag>
                        </div>
                    </Frame>
                </div>
            </Col6>
        </Col12>
        <ModalAlterarTelefone dadoAntigo={((colaborador?.funcionario_pessoa_fisica && colaborador?.funcionario_pessoa_fisica?.telefone1) ? (colaborador?.funcionario_pessoa_fisica?.telefone1) : '')} aoClicar={editarTelefone} opened={modalTelefoneOpened} aoFechar={() => setModalTelefoneOpened(!modalTelefoneOpened)} />
        <ModalAlterarEmail dadoAntigo={(colaborador?.funcionario_pessoa_fisica ? colaborador?.funcionario_pessoa_fisica?.email : '')} aoClicar={editarEmail} opened={modalEmailOpened} aoFechar={() => setModalEmailOpened(!modalEmailOpened)} />
       
        </>
    )
}

export default ColaboradorDadosContratuais
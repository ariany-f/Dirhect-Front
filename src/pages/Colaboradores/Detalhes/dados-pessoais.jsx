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

let Real = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
})

function ColaboradorDadosPessoais() {

    let { id } = useParams()
    const [colaborador, setColaborador] = useState(null)
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
        }
    }, [colaborador, context])

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
        <Titulo><h6>Identificação</h6></Titulo>
        <div className={styles.card_dashboard}>
            <Col12>
                <Col3>
                    <Texto>Chapa</Texto>
                    {colaborador?.chapa ?
                        <Texto weight="800">{colaborador?.chapa}</Texto>
                        : <Skeleton variant="rectangular" width={200} height={25} />
                    }
                    <Texto>Nome completo</Texto>
                    {colaborador?.funcionario_pessoa_fisica?.nome ?
                        <Texto weight="800">{colaborador?.funcionario_pessoa_fisica?.nome}</Texto>
                        : <Skeleton variant="rectangular" width={200} height={25} />
                    }
                    <Texto>Nome social</Texto>
                    {colaborador?.funcionario_pessoa_fisica?.nome_social ?
                            <Texto weight="800">{colaborador?.funcionario_pessoa_fisica.nome_social}</Texto>
                        : <Skeleton variant="rectangular" width={200} height={25} />
                    }
                </Col3>
                <Col3>
                    <Texto>Nascimento</Texto>
                    {colaborador?.funcionario_pessoa_fisica?.data_nascimento ?
                        <Texto weight="800">{new Date(colaborador?.funcionario_pessoa_fisica?.data_nascimento).toLocaleDateString('pt-BR')}</Texto>
                        : <Skeleton variant="rectangular" width={200} height={25} />
                    }
                    <Texto>Sexo</Texto>
                    {colaborador?.funcionario_pessoa_fisica?.sexo ?
                        <Texto weight="800">{colaborador?.funcionario_pessoa_fisica?.sexo}</Texto>
                        : <Skeleton variant="rectangular" width={200} height={25} />
                    }
                </Col3>
                <Col3>
                    <Texto>CPF</Texto>
                    {colaborador?.funcionario_pessoa_fisica?.cpf ?
                        <Texto weight="800">{formataCPF(colaborador?.funcionario_pessoa_fisica?.cpf)}</Texto>
                        : <Skeleton variant="rectangular" width={200} height={25} />
                    }
                    <Texto>Identidade</Texto>
                    {colaborador?.funcionario_pessoa_fisica?.identidade ?
                        <Texto weight="800">{(colaborador?.funcionario_pessoa_fisica.identidade)}</Texto>
                        : <Skeleton variant="rectangular" width={200} height={25} />
                    }
                    <Texto>Data Emissão Identidade</Texto>
                    {colaborador?.funcionario_pessoa_fisica?.data_emissao_ident ?
                        <Texto weight="800">{new Date(colaborador?.funcionario_pessoa_fisica?.data_emissao_ident).toLocaleDateString('pt-BR')}</Texto>
                        : <Skeleton variant="rectangular" width={200} height={25} />
                    }
                </Col3>
            </Col12>
        </div>
        <Titulo><h6>Informações gerais</h6></Titulo>
        <div className={styles.card_dashboard}>
            <Col12>
                <Col3>
                    <Texto>Naturalidade</Texto>
                    {colaborador?.funcionario_pessoa_fisica?.naturalidade ?
                        <Texto weight="800">{colaborador?.funcionario_pessoa_fisica?.naturalidade}</Texto>
                        : <Skeleton variant="rectangular" width={200} height={25} />
                    }
                    <Texto>Estado Civil</Texto>
                    {colaborador?.funcionario_pessoa_fisica?.estado_civil ?
                        <Texto weight="800">{colaborador?.funcionario_pessoa_fisica?.estado_civil}</Texto>
                        : <Skeleton variant="rectangular" width={200} height={25} />
                    }
                    <Texto>Cor/Raça</Texto>
                    {colaborador?.funcionario_pessoa_fisica?.cor_raca ?
                    <Texto weight="800">{colaborador?.funcionario_pessoa_fisica?.cor_raca}</Texto>
                    : <Skeleton variant="rectangular" width={200} height={25} />
                    }
                </Col3>
                <Col3>
                   
                <Texto>Carteira de Motorista</Texto>
                    {colaborador?.funcionario_pessoa_fisica?.carteira_motorista ?
                        <>
                        <Texto weight="800">{colaborador?.funcionario_pessoa_fisica?.carteira_motorista}</Texto>
                        { colaborador?.funcionario_pessoa_fisica?.tipo_carteira_habilit ?
                            <Texto weight="800">({colaborador?.funcionario_pessoa_fisica?.tipo_carteira_habilit})</Texto>
                        : null }
                        </>
                    : <Skeleton variant="rectangular" width={200} height={25} />
                    }
                    <Texto>Data Emissão CNH</Texto>
                    {colaborador?.funcionario_pessoa_fisica?.data_emissao_cnh ?
                    <Texto weight="800">{new Date(colaborador?.funcionario_pessoa_fisica?.data_emissao_cnh).toLocaleDateString('pt-BR')}</Texto>
                    : <Skeleton variant="rectangular" width={200} height={25} />
                    }
                    <Texto>Data de Validade CNH</Texto>
                    {colaborador?.funcionario_pessoa_fisica?.data_venc_habilit ?
                    <Texto weight="800">{new Date(colaborador?.funcionario_pessoa_fisica?.data_venc_habilitacao).toLocaleDateString('pt-BR')}</Texto>
                    : <Skeleton variant="rectangular" width={200} height={25} />
                    }
                </Col3>
                <Col3>
                    <Texto>Titulo de Eleitor</Texto>
                    {colaborador?.funcionario_pessoa_fisica?.titulo_eleitor ?
                    <Texto weight="800">{colaborador?.funcionario_pessoa_fisica?.titulo_eleitor}</Texto>
                    : <Skeleton variant="rectangular" width={200} height={25} />
                    }
                    <Texto>Zona Eleitoral</Texto>
                    {colaborador?.funcionario_pessoa_fisica?.zona_titulo_eleitor ?
                    <Texto weight="800">{colaborador?.funcionario_pessoa_fisica?.zona_titulo_eleitor}</Texto>
                    : <Skeleton variant="rectangular" width={200} height={25} />
                    }
                    <Texto>Secao Eleitoral</Texto>
                    {colaborador?.funcionario_pessoa_fisica?.secao_titulo_eleitor ?
                    <Texto weight="800">{colaborador?.funcionario_pessoa_fisica?.secao_titulo_eleitor}</Texto>
                    : <Skeleton variant="rectangular" width={200} height={25} />
                    }
                    <Texto>Data Emissão Titulo Eleitor</Texto>
                    {colaborador?.funcionario_pessoa_fisica?.data_titulo_eleitor ?
                    <Texto weight="800">{new Date(colaborador?.funcionario_pessoa_fisica?.data_titulo_eleitor).toLocaleDateString('pt-BR')}</Texto>
                    : <Skeleton variant="rectangular" width={200} height={25} />
                    }
                </Col3>
                <Col3>
                    <Texto>Circunscrição Militar</Texto>
                    {colaborador?.funcionario_pessoa_fisica?.circunscricao_militar ?
                    <Texto weight="800">{colaborador?.funcionario_pessoa_fisica?.circunscricao_militar}</Texto>
                    : <Skeleton variant="rectangular" width={200} height={25} />
                    }
                    <Texto>Certificado de Reservista</Texto>
                    {colaborador?.funcionario_pessoa_fisica?.certificado_reservista ?
                    <Texto weight="800">{colaborador?.funcionario_pessoa_fisica?.certificado_reservista}</Texto>
                    : <Skeleton variant="rectangular" width={200} height={25} />
                    }
                    <Texto>Situação Militar</Texto>
                    {colaborador?.funcionario_pessoa_fisica?.situacao_militar ?
                    <Texto weight="800">{colaborador?.funcionario_pessoa_fisica?.situacao_militar}</Texto>
                    : <Skeleton variant="rectangular" width={200} height={25} />
                    }
                </Col3>
            </Col12>
        </div>
        <Col12>
            <Col6>
                <Titulo><h6>Informações de contato</h6></Titulo>
                <div className={styles.card_dashboard}>
                    <ContainerHorizontal width="50%">
                        <Frame gap="5px">
                            <Texto>Telefone/Celular</Texto>
                            {colaborador?.funcionario_pessoa_fisica && colaborador?.funcionario_pessoa_fisica?.telefone1 ?
                                <Texto weight="800">{colaborador?.funcionario_pessoa_fisica?.telefone1}</Texto>
                                : <Skeleton variant="rectangular" width={200} height={25} />
                            }
                        </Frame>
                        <BotaoSemBorda>
                            <RiEditBoxFill size={18} />
                            <Link onClick={() => setModalTelefoneOpened(true)} className={styles.link}>Alterar</Link>
                        </BotaoSemBorda>
                    </ContainerHorizontal>
                    <ContainerHorizontal width="50%">
                        <Frame gap="5px">
                            <Texto>E-mail</Texto>
                            {colaborador?.funcionario_pessoa_fisica && colaborador?.funcionario_pessoa_fisica?.email ?
                                <Texto weight="800">{colaborador?.funcionario_pessoa_fisica.email}</Texto>
                                : <Skeleton variant="rectangular" width={200} height={25} />
                            }
                        </Frame>
                        <BotaoSemBorda>
                            <RiEditBoxFill size={18} />
                            <Link onClick={() => setModalEmailOpened(true)} className={styles.link}>Alterar</Link>
                        </BotaoSemBorda>
                    </ContainerHorizontal>
                </div>
            </Col6>
            <Col6>
                <Titulo><h6>Informações trabalhistas</h6></Titulo>
                <div className={styles.card_dashboard}>
                    <Col12>
                        <Col3>
                            <Texto>Data de Admissão</Texto>
                            {colaborador?.dt_admissao ?
                                <Texto weight="800">{new Date(colaborador?.dt_admissao).toLocaleDateString('pt-BR')}</Texto>
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
                        </Col3>
                        <Col3>
                            <Texto>Carteira de Trabalho</Texto>
                            {colaborador?.funcionario_pessoa_fisica?.carteira_trabalho ?
                                <>
                                    <Texto weight="800">{colaborador?.funcionario_pessoa_fisica?.carteira_trabalho}</Texto>
                                    {colaborador?.funcionario_pessoa_fisica?.serie_carteira_trab ?
                                    <Texto weight="800">{colaborador?.funcionario_pessoa_fisica?.serie_carteira_trab}</Texto>
                                    : <Skeleton variant="rectangular" width={200} height={25} />
                                    }
                                </>
                            : <Skeleton variant="rectangular" width={200} height={25} />
                            }
                            <Texto>Data de Emissão CTPS</Texto>
                            {colaborador?.funcionario_pessoa_fisica?.data_emissao_ctps ?
                            <Texto weight="800">{new Date(colaborador?.funcionario_pessoa_fisica?.data_emissao_ctps).toLocaleDateString('pt-BR')}</Texto>
                            : <Skeleton variant="rectangular" width={200} height={25} />
                            }
                            <Texto>Data de Validade CTPS</Texto>
                            {colaborador?.funcionario_pessoa_fisica?.data_venc_ctps ?
                            <Texto weight="800">{new Date(colaborador?.funcionario_pessoa_fisica?.data_venc_ctps).toLocaleDateString('pt-BR')}</Texto>
                            : <Skeleton variant="rectangular" width={200} height={25} />
                            }
                        </Col3>
                    </Col12>
                </div>  
            </Col6>
        </Col12>
        <ModalAlterarTelefone dadoAntigo={((colaborador?.funcionario_pessoa_fisica && colaborador?.funcionario_pessoa_fisica?.telefone1) ? (colaborador?.funcionario_pessoa_fisica?.telefone1) : '')} aoClicar={editarTelefone} opened={modalTelefoneOpened} aoFechar={() => setModalTelefoneOpened(!modalTelefoneOpened)} />
        <ModalAlterarEmail dadoAntigo={(colaborador?.funcionario_pessoa_fisica ? colaborador?.funcionario_pessoa_fisica?.email : '')} aoClicar={editarEmail} opened={modalEmailOpened} aoFechar={() => setModalEmailOpened(!modalEmailOpened)} />
       
        </>
    )
}

export default ColaboradorDadosPessoais
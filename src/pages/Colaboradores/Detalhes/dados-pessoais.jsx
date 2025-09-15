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
import { ArmazenadorToken } from "@utils"

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
            setColaborador(context?.colaborador);
        }
    }, [colaborador, context])

    function editarEmail(email) {
      
        let obj = {}
        obj['email'] = email
        http.put(`pessoa_fisica/${colaborador.funcionario_pessoa_fisica.id}/`, obj)
        .then(response => {
            if(response)
            {
                toast.current.show({ severity: 'info', summary: 'Sucesso', detail: response.message, life: 3000 });
                setModalEmailOpened(false)
            }
        })
        .catch(erro => console.log(erro))
    }

    function editarTelefone(telefone) {
        let obj = {}
        obj['telefone1'] = telefone
      
        http.put(`pessoa_fisica/${colaborador.funcionario_pessoa_fisica.id}/`, obj)
        .then(response => {
           if(response)
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
        <Titulo><h6>Informações gerais</h6></Titulo>
        <div className={styles.card_dashboard}>
            <Col12>
                <Col3>
                    <Texto>Naturalidade</Texto>
                    {!colaborador
                        ? <Skeleton variant="rectangular" width={200} height={25} />
                        : <Texto weight="800">{colaborador.funcionario_pessoa_fisica?.naturalidade || '---'}</Texto>
                    }
                    <Texto>Estado Civil</Texto>
                    {!colaborador
                        ? <Skeleton variant="rectangular" width={200} height={25} />
                        : <Texto weight="800">{colaborador.funcionario_pessoa_fisica?.estado_civil_descricao || '---'}</Texto>
                    }
                    <Texto>Cor/Raça</Texto>
                    {!colaborador
                        ? <Skeleton variant="rectangular" width={200} height={25} />
                        : <Texto weight="800">{colaborador.funcionario_pessoa_fisica?.cor_raca_descricao || '---'}</Texto>
                    }
                    
                    <Texto>Identidade</Texto>
                    {!colaborador
                        ? <Skeleton variant="rectangular" width={200} height={25} />
                        : <Texto weight="800">{colaborador.funcionario_pessoa_fisica?.identidade || '---'}</Texto>
                    }
                    <Texto>Data Emissão Identidade</Texto>
                    {!colaborador
                        ? <Skeleton variant="rectangular" width={200} height={25} />
                        : <Texto weight="800">{colaborador.funcionario_pessoa_fisica?.data_emissao_ident ? new Date(colaborador.funcionario_pessoa_fisica.data_emissao_ident).toLocaleDateString('pt-BR') : '---'}</Texto>
                    }
                    <Texto>Email</Texto>
                    {!colaborador
                        ? <Skeleton variant="rectangular" width={200} height={25} />
                        : (
                            colaborador.funcionario_pessoa_fisica?.email ?
                            <>
                                <Texto weight="800">{colaborador.funcionario_pessoa_fisica.email}</Texto>
                                {ArmazenadorToken.hasPermission('change_funcionario') && (
                                    <BotaoSemBorda>
                                        <RiEditBoxFill size={18} />
                                        <Link onClick={() => setModalEmailOpened(true)} className={styles.link}>Alterar</Link>
                                    </BotaoSemBorda>
                                )}
                            </>
                            : (
                                ArmazenadorToken.hasPermission('change_funcionario') ?
                                <BotaoSemBorda>
                                    <RiEditBoxFill size={18} />
                                    <Link onClick={() => setModalEmailOpened(true)} className={styles.link}>Adicionar</Link>
                                </BotaoSemBorda>
                                : <Texto weight="800">---</Texto>
                            )
                        )
                    }
                    <Texto>Telefone</Texto>
                    {!colaborador
                        ? <Skeleton variant="rectangular" width={200} height={25} />
                        : (
                            colaborador.funcionario_pessoa_fisica?.telefone1 ?
                            <>
                                <Texto weight="800">{colaborador.funcionario_pessoa_fisica.telefone1}</Texto>
                                {ArmazenadorToken.hasPermission('change_funcionario') && (
                                    <BotaoSemBorda>
                                        <RiEditBoxFill size={18} />
                                        <Link onClick={() => setModalTelefoneOpened(true)} className={styles.link}>Alterar</Link>
                                    </BotaoSemBorda>
                                )}
                            </>
                            : (
                                ArmazenadorToken.hasPermission('change_funcionario') ?
                                <BotaoSemBorda>
                                    <RiEditBoxFill size={18} />
                                    <Link onClick={() => setModalTelefoneOpened(true)} className={styles.link}>Adicionar</Link>
                                </BotaoSemBorda>
                                : <Texto weight="800">---</Texto>
                            )
                        )
                    }
                </Col3>
                <Col3>
                   
                <Texto>Carteira de Motorista</Texto>
                {!colaborador
                    ? <Skeleton variant="rectangular" width={200} height={25} />
                    : (
                        colaborador.funcionario_pessoa_fisica?.carteira_motorista ?
                        <>
                            <Texto weight="800">{colaborador.funcionario_pessoa_fisica.carteira_motorista}</Texto>
                            { colaborador.funcionario_pessoa_fisica.tipo_carteira_habilit &&
                                <Texto weight="800">({colaborador.funcionario_pessoa_fisica.tipo_carteira_habilit})</Texto>
                            }
                        </>
                        : <Texto weight="800">---</Texto>
                    )
                }
                    <Texto>Data Emissão CNH</Texto>
                    {!colaborador
                        ? <Skeleton variant="rectangular" width={200} height={25} />
                        : <Texto weight="800">{colaborador.funcionario_pessoa_fisica?.data_emissao_cnh ? new Date(colaborador.funcionario_pessoa_fisica.data_emissao_cnh).toLocaleDateString('pt-BR') : '---'}</Texto>
                    }
                    <Texto>Data de Validade CNH</Texto>
                    {!colaborador
                        ? <Skeleton variant="rectangular" width={200} height={25} />
                        : <Texto weight="800">{colaborador.funcionario_pessoa_fisica?.data_venc_habilit ? new Date(colaborador.funcionario_pessoa_fisica.data_venc_habilit).toLocaleDateString('pt-BR') : '---'}</Texto>
                    }
                    
                    <Texto>Circunscrição Militar</Texto>
                    {!colaborador
                        ? <Skeleton variant="rectangular" width={200} height={25} />
                        : <Texto weight="800">{colaborador.funcionario_pessoa_fisica?.circunscricao_militar || '---'}</Texto>
                    }
                    <Texto>Certificado de Reservista</Texto>
                    {!colaborador
                        ? <Skeleton variant="rectangular" width={200} height={25} />
                        : <Texto weight="800">{colaborador.funcionario_pessoa_fisica?.certificado_reservista || '---'}</Texto>
                    }
                    <Texto>Situação Militar</Texto>
                    {!colaborador
                        ? <Skeleton variant="rectangular" width={200} height={25} />
                        : <Texto weight="800">{colaborador.funcionario_pessoa_fisica?.situacao_militar || '---'}</Texto>
                    }
                </Col3>
                <Col3>
                    <Texto>Titulo de Eleitor</Texto>
                    {!colaborador
                        ? <Skeleton variant="rectangular" width={200} height={25} />
                        : <Texto weight="800">{colaborador.funcionario_pessoa_fisica?.titulo_eleitor || '---'}</Texto>
                    }
                    <Texto>Zona Eleitoral</Texto>
                    {!colaborador
                        ? <Skeleton variant="rectangular" width={200} height={25} />
                        : <Texto weight="800">{colaborador.funcionario_pessoa_fisica?.zona_titulo_eleitor || '---'}</Texto>
                    }
                    <Texto>Secao Eleitoral</Texto>
                    {!colaborador
                        ? <Skeleton variant="rectangular" width={200} height={25} />
                        : <Texto weight="800">{colaborador.funcionario_pessoa_fisica?.secao_titulo_eleitor || '---'}</Texto>
                    }
                    <Texto>Data Emissão Titulo Eleitor</Texto>
                    {!colaborador
                        ? <Skeleton variant="rectangular" width={200} height={25} />
                        : <Texto weight="800">{colaborador.funcionario_pessoa_fisica?.data_titulo_eleitor ? new Date(colaborador.funcionario_pessoa_fisica.data_titulo_eleitor).toLocaleDateString('pt-BR') : '---'}</Texto>
                    }
                    <Texto>Carteira de Trabalho</Texto>
                    {!colaborador
                        ? <Skeleton variant="rectangular" width={200} height={25} />
                        : (
                            colaborador.funcionario_pessoa_fisica?.carteira_trabalho ?
                            <>
                                <Texto weight="800">{colaborador.funcionario_pessoa_fisica.carteira_trabalho}</Texto>
                                {colaborador.funcionario_pessoa_fisica.serie_carteira_trab &&
                                    <Texto weight="800">{colaborador.funcionario_pessoa_fisica.serie_carteira_trab}</Texto>
                                }
                            </>
                            : <Texto weight="800">---</Texto>
                        )
                    }
                    <Texto>Data de Emissão CTPS</Texto>
                    {!colaborador
                        ? <Skeleton variant="rectangular" width={200} height={25} />
                        : <Texto weight="800">{colaborador.funcionario_pessoa_fisica?.data_emissao_ctps ? new Date(colaborador.funcionario_pessoa_fisica.data_emissao_ctps).toLocaleDateString('pt-BR') : '---'}</Texto>
                    }
                    <Texto>Data de Validade CTPS</Texto>
                    {!colaborador
                        ? <Skeleton variant="rectangular" width={200} height={25} />
                        : <Texto weight="800">{colaborador.funcionario_pessoa_fisca?.data_venc_ctps ? new Date(colaborador.funcionario_pessoa_fisica.data_venc_ctps).toLocaleDateString('pt-BR') : '---'}</Texto>
                    }
                </Col3>
            </Col12>
        </div>
        {/* <Col12>
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
        </Col12> */}
        <ModalAlterarTelefone dadoAntigo={((colaborador?.funcionario_pessoa_fisica && colaborador?.funcionario_pessoa_fisica?.telefone1) ? (colaborador?.funcionario_pessoa_fisica?.telefone1) : '')} aoClicar={editarTelefone} opened={modalTelefoneOpened} aoFechar={() => setModalTelefoneOpened(!modalTelefoneOpened)} />
        <ModalAlterarEmail dadoAntigo={(colaborador?.funcionario_pessoa_fisica ? colaborador?.funcionario_pessoa_fisica?.email : '')} aoClicar={editarEmail} opened={modalEmailOpened} aoFechar={() => setModalEmailOpened(!modalEmailOpened)} />
       
        </>
    )
}

export default ColaboradorDadosPessoais
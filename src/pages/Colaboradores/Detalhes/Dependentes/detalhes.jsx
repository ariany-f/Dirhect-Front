import { Link, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import BotaoVoltar from "@components/BotaoVoltar"
import BotaoGrupo from "@components/BotaoGrupo"
import BotaoSemBorda from "@components/BotaoSemBorda"
import ContainerHorizontal from "@components/ContainerHorizontal"
import Titulo from "@components/Titulo"
import Frame from "@components/Frame"
import Texto from "@components/Texto"
import FrameVertical from "@components/FrameVertical"
import Container from "@components/Container"
import styles from './../Detalhes.module.css'
import { Skeleton } from 'primereact/skeleton'
import Loading from '@components/Loading'
import { FaArrowLeft, FaTrash } from 'react-icons/fa'
import { Toast } from 'primereact/toast'
import http from '@http'
import { useEffect, useRef, useState } from 'react'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { addLocale } from 'primereact/api'
import { Tag } from 'primereact/tag';
import { useSessaoUsuarioContext } from '@contexts/SessaoUsuario';
import { RiEditBoxFill, RiGasStationFill, RiShoppingCartFill } from 'react-icons/ri';
import { MdOutlineFastfood } from 'react-icons/md';
import styled from 'styled-components';
import { BiChevronLeft } from 'react-icons/bi';


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

function ColaboradorDependenteDetalhes() {

    let { id, codigo } = useParams()
    const location = useLocation();
    const [dependente, setDependente] = useState(null)
    const [loading, setLoading] = useState(false)
    const navegar = useNavigate()
    const toast = useRef(null)

    const {usuario} = useSessaoUsuarioContext()

    addLocale('pt', {
        accept: 'Sim',
        reject: 'Não'
    })

    useEffect(() => {
        if(!dependente)
        {
            setLoading(true)
            http.get(`dependente/${codigo}/?format=json`)
                .then(response => {
                    setDependente(response);
                })
                .catch(erro => console.log(erro))
                .finally(function() {
                    setLoading(false)
                })
        }
        
    }, [dependente])

    function formataCPF(cpf) {
        cpf = cpf.replace(/[^\d]/g, "");
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }

    const representativeParentescoTemplate = (dependente) => {
        let grau_parentesco = dependente?.grau_parentesco;
        switch(dependente?.grau_parentesco)
        {
            case 'Filho':
                return <Tag severity="success" value="Filho"></Tag>;
            default:
                return <Tag severity="primary" value={dependente?.grau_parentesco}></Tag>;
        }
    }


    return (
        <Frame>
            <Toast ref={toast} />
            <Loading opened={loading} />
            <ConfirmDialog />
            <Container gap="32px">
                {dependente && dependente?.nome_depend ?
                    <BotaoGrupo align="space-between">
                        <Titulo align="left">
                            <Container gap="32px">
                                <BotaoVoltar/>
                                <BotaoGrupo align="space-between">
                                    <h5>{dependente?.nome_depend}</h5>
                                    <small>{representativeParentescoTemplate(dependente)}</small>
                                </BotaoGrupo>
                            </Container>
                        </Titulo>
                    </BotaoGrupo>
                : <Skeleton variant="rectangular" width={300} height={40} />
                }
                  <Titulo><h6>Identificação</h6></Titulo>
                <div className={styles.card_dashboard}>
                    <Col12>
                        <Col3>
                            <Texto>Nome completo</Texto>
                            {dependente?.nome_depend ?
                                <Texto weight="800">{dependente?.nome_depend}</Texto>
                                : <Skeleton variant="rectangular" width={200} height={25} />
                            }
                            <Texto>Estado Civil</Texto>
                            {dependente?.estadocivil ?
                                <Texto weight="800">{dependente?.estadocivil}</Texto>
                                : <Skeleton variant="rectangular" width={200} height={25} />
                            }
                        </Col3>
                        <Col3>
                            <Texto>Nascimento</Texto>
                            {dependente?.dtnascimento ?
                                <Texto weight="800">{new Date(dependente?.dtnascimento).toLocaleDateString('pt-BR')}</Texto>
                                : <Skeleton variant="rectangular" width={200} height={25} />
                            }
                            <Texto>Sexo</Texto>
                            {dependente?.sexo ?
                                <Texto weight="800">{dependente?.sexo}</Texto>
                                : <Skeleton variant="rectangular" width={200} height={25} />
                            }
                        </Col3>
                        <Col3>
                            <Texto>CPF</Texto>
                            {dependente?.cpf ?
                                <Texto weight="800">{formataCPF(dependente?.cpf)}</Texto>
                                : <Skeleton variant="rectangular" width={200} height={25} />
                            }
                            <Texto>Identidade</Texto>
                            {dependente?.nroregistro ?
                                <Texto weight="800">{(dependente?.nroregistro)}</Texto>
                                : <Skeleton variant="rectangular" width={200} height={25} />
                            }
                        </Col3>
                    </Col12>
                </div>
                {/* <Titulo><h6>Informações gerais</h6></Titulo>
                <div className={styles.card_dashboard}>
                    <Col12>
                        <Col3>
                            <Texto>Naturalidade</Texto>
                            {dependente?.dependente_pessoa_fisica?.naturalidade ?
                                <Texto weight="800">{dependente?.dependente_pessoa_fisica?.naturalidade}</Texto>
                                : <Skeleton variant="rectangular" width={200} height={25} />
                            }
                            <Texto>Estado Civil</Texto>
                            {dependente?.dependente_pessoa_fisica?.estado_civil ?
                                <Texto weight="800">{dependente?.dependente_pessoa_fisica?.estado_civil}</Texto>
                                : <Skeleton variant="rectangular" width={200} height={25} />
                            }
                            <Texto>Cor/Raça</Texto>
                            {dependente?.dependente_pessoa_fisica?.cor_raca ?
                            <Texto weight="800">{dependente?.dependente_pessoa_fisica?.cor_raca}</Texto>
                            : <Skeleton variant="rectangular" width={200} height={25} />
                            }
                        </Col3>
                        <Col3>
                        
                        <Texto>Carteira de Motorista</Texto>
                            {dependente?.dependente_pessoa_fisica?.carteira_motorista ?
                                <>
                                <Texto weight="800">{dependente?.dependente_pessoa_fisica?.carteira_motorista}</Texto>
                                { dependente?.dependente_pessoa_fisica?.tipo_carteira_habilit ?
                                    <Texto weight="800">({dependente?.dependente_pessoa_fisica?.tipo_carteira_habilit})</Texto>
                                : null }
                                </>
                            : <Skeleton variant="rectangular" width={200} height={25} />
                            }
                            <Texto>Data Emissão CNH</Texto>
                            {dependente?.dependente_pessoa_fisica?.data_emissao_cnh ?
                            <Texto weight="800">{new Date(dependente?.dependente_pessoa_fisica?.data_emissao_cnh).toLocaleDateString('pt-BR')}</Texto>
                            : <Skeleton variant="rectangular" width={200} height={25} />
                            }
                            <Texto>Data de Validade CNH</Texto>
                            {dependente?.dependente_pessoa_fisica?.data_venc_habilit ?
                            <Texto weight="800">{new Date(dependente?.dependente_pessoa_fisica?.data_venc_habilitacao).toLocaleDateString('pt-BR')}</Texto>
                            : <Skeleton variant="rectangular" width={200} height={25} />
                            }
                        </Col3>
                        <Col3>
                            <Texto>Titulo de Eleitor</Texto>
                            {dependente?.dependente_pessoa_fisica?.titulo_eleitor ?
                            <Texto weight="800">{dependente?.dependente_pessoa_fisica?.titulo_eleitor}</Texto>
                            : <Skeleton variant="rectangular" width={200} height={25} />
                            }
                            <Texto>Zona Eleitoral</Texto>
                            {dependente?.dependente_pessoa_fisica?.zona_titulo_eleitor ?
                            <Texto weight="800">{dependente?.dependente_pessoa_fisica?.zona_titulo_eleitor}</Texto>
                            : <Skeleton variant="rectangular" width={200} height={25} />
                            }
                            <Texto>Secao Eleitoral</Texto>
                            {dependente?.dependente_pessoa_fisica?.secao_titulo_eleitor ?
                            <Texto weight="800">{dependente?.dependente_pessoa_fisica?.secao_titulo_eleitor}</Texto>
                            : <Skeleton variant="rectangular" width={200} height={25} />
                            }
                            <Texto>Data Emissão Titulo Eleitor</Texto>
                            {dependente?.dependente_pessoa_fisica?.data_titulo_eleitor ?
                            <Texto weight="800">{new Date(dependente?.dependente_pessoa_fisica?.data_titulo_eleitor).toLocaleDateString('pt-BR')}</Texto>
                            : <Skeleton variant="rectangular" width={200} height={25} />
                            }
                        </Col3>
                        <Col3>
                            <Texto>Circunscrição Militar</Texto>
                            {dependente?.dependente_pessoa_fisica?.circunscricao_militar ?
                            <Texto weight="800">{dependente?.dependente_pessoa_fisica?.circunscricao_militar}</Texto>
                            : <Skeleton variant="rectangular" width={200} height={25} />
                            }
                            <Texto>Certificado de Reservista</Texto>
                            {dependente?.dependente_pessoa_fisica?.certificado_reservista ?
                            <Texto weight="800">{dependente?.dependente_pessoa_fisica?.certificado_reservista}</Texto>
                            : <Skeleton variant="rectangular" width={200} height={25} />
                            }
                            <Texto>Situação Militar</Texto>
                            {dependente?.dependente_pessoa_fisica?.situacao_militar ?
                            <Texto weight="800">{dependente?.dependente_pessoa_fisica?.situacao_militar}</Texto>
                            : <Skeleton variant="rectangular" width={200} height={25} />
                            }
                        </Col3>
                    </Col12>
                </div> */}
            </Container>
        </Frame>
    )
}

export default ColaboradorDependenteDetalhes
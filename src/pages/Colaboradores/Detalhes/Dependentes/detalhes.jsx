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
import { FaTrash } from 'react-icons/fa'
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
    const [pessoafisica, setPessoaFisica] = useState(null)
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
            http.get(`dependente/${codigo}/?format=json`)
                .then(response => {
                    setDependente(response);
                })
                .catch(erro => console.log(erro))
        }
        if(dependente && (!pessoafisica)) {
            
            http.get(`pessoa_fisica/${dependente.id_pessoafisica}/?format=json`)
                .then(response => {
                    setPessoaFisica(response)
                })
                .catch(erro => {
                    
                })
                .finally(function() {
                    setLoading(false)
                })
        }
        
    }, [dependente, pessoafisica])

    function formataCPF(cpf) {
        cpf = cpf.replace(/[^\d]/g, "");
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }

    return (
        <Frame>
            <Toast ref={toast} />
            <ConfirmDialog />
            <Container gap="32px">
                {pessoafisica && pessoafisica?.nome ? 
                    <BotaoGrupo align="space-between">
                        <Titulo align="left">
                            <Frame gap="5px">
                                <h5>{pessoafisica?.nome}</h5>
                                <small>{dependente?.grau_parentesco}</small>
                            </Frame>
                        </Titulo>
                    </BotaoGrupo>
                : <Skeleton variant="rectangular" width={300} height={40} />
                }
                  <Titulo><h6>Identificação</h6></Titulo>
                <div className={styles.card_dashboard}>
                    <Col12>
                        <Col3>
                            <Texto>Nome completo</Texto>
                            {pessoafisica?.nome ?
                                <Texto weight="800">{pessoafisica?.nome}</Texto>
                                : <Skeleton variant="rectangular" width={200} height={25} />
                            }
                            <Texto>Nome social</Texto>
                            {pessoafisica?.nome_social ?
                                    <Texto weight="800">{pessoafisica.nome_social}</Texto>
                                : <Skeleton variant="rectangular" width={200} height={25} />
                            }
                        </Col3>
                        <Col3>
                            <Texto>Nascimento</Texto>
                            {pessoafisica?.data_nascimento ?
                                <Texto weight="800">{new Date(pessoafisica?.data_nascimento).toLocaleDateString('pt-BR')}</Texto>
                                : <Skeleton variant="rectangular" width={200} height={25} />
                            }
                            <Texto>Sexo</Texto>
                            {pessoafisica?.sexo ?
                                <Texto weight="800">{pessoafisica?.sexo}</Texto>
                                : <Skeleton variant="rectangular" width={200} height={25} />
                            }
                        </Col3>
                        <Col3>
                            <Texto>CPF</Texto>
                            {pessoafisica?.cpf ?
                                <Texto weight="800">{formataCPF(pessoafisica?.cpf)}</Texto>
                                : <Skeleton variant="rectangular" width={200} height={25} />
                            }
                            <Texto>Identidade</Texto>
                            {pessoafisica?.identidade ?
                                <Texto weight="800">{(pessoafisica.identidade)}</Texto>
                                : <Skeleton variant="rectangular" width={200} height={25} />
                            }
                            <Texto>Data Emissão Identidade</Texto>
                            {pessoafisica?.data_emissao_ident ?
                                <Texto weight="800">{new Date(pessoafisica?.data_emissao_ident).toLocaleDateString('pt-BR')}</Texto>
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
                            {pessoafisica?.naturalidade ?
                                <Texto weight="800">{pessoafisica?.naturalidade}</Texto>
                                : <Skeleton variant="rectangular" width={200} height={25} />
                            }
                            <Texto>Estado Civil</Texto>
                            {pessoafisica?.estado_civil ?
                                <Texto weight="800">{pessoafisica?.estado_civil}</Texto>
                                : <Skeleton variant="rectangular" width={200} height={25} />
                            }
                            <Texto>Cor/Raça</Texto>
                            {pessoafisica?.cor_raca ?
                            <Texto weight="800">{pessoafisica?.cor_raca}</Texto>
                            : <Skeleton variant="rectangular" width={200} height={25} />
                            }
                        </Col3>
                        <Col3>
                        
                        <Texto>Carteira de Motorista</Texto>
                            {pessoafisica?.carteira_motorista ?
                                <>
                                <Texto weight="800">{pessoafisica?.carteira_motorista}</Texto>
                                { pessoafisica?.tipo_carteira_habilit ?
                                    <Texto weight="800">({pessoafisica?.tipo_carteira_habilit})</Texto>
                                : null }
                                </>
                            : <Skeleton variant="rectangular" width={200} height={25} />
                            }
                            <Texto>Data Emissão CNH</Texto>
                            {pessoafisica?.data_emissao_cnh ?
                            <Texto weight="800">{new Date(pessoafisica?.data_emissao_cnh).toLocaleDateString('pt-BR')}</Texto>
                            : <Skeleton variant="rectangular" width={200} height={25} />
                            }
                            <Texto>Data de Validade CNH</Texto>
                            {pessoafisica?.data_venc_habilit ?
                            <Texto weight="800">{new Date(pessoafisica?.data_venc_habilitacao).toLocaleDateString('pt-BR')}</Texto>
                            : <Skeleton variant="rectangular" width={200} height={25} />
                            }
                        </Col3>
                        <Col3>
                            <Texto>Titulo de Eleitor</Texto>
                            {pessoafisica?.titulo_eleitor ?
                            <Texto weight="800">{pessoafisica?.titulo_eleitor}</Texto>
                            : <Skeleton variant="rectangular" width={200} height={25} />
                            }
                            <Texto>Zona Eleitoral</Texto>
                            {pessoafisica?.zona_titulo_eleitor ?
                            <Texto weight="800">{pessoafisica?.zona_titulo_eleitor}</Texto>
                            : <Skeleton variant="rectangular" width={200} height={25} />
                            }
                            <Texto>Secao Eleitoral</Texto>
                            {pessoafisica?.secao_titulo_eleitor ?
                            <Texto weight="800">{pessoafisica?.secao_titulo_eleitor}</Texto>
                            : <Skeleton variant="rectangular" width={200} height={25} />
                            }
                            <Texto>Data Emissão Titulo Eleitor</Texto>
                            {pessoafisica?.data_titulo_eleitor ?
                            <Texto weight="800">{new Date(pessoafisica?.data_titulo_eleitor).toLocaleDateString('pt-BR')}</Texto>
                            : <Skeleton variant="rectangular" width={200} height={25} />
                            }
                        </Col3>
                        <Col3>
                            <Texto>Circunscrição Militar</Texto>
                            {pessoafisica?.circunscricao_militar ?
                            <Texto weight="800">{pessoafisica?.circunscricao_militar}</Texto>
                            : <Skeleton variant="rectangular" width={200} height={25} />
                            }
                            <Texto>Certificado de Reservista</Texto>
                            {pessoafisica?.certificado_reservista ?
                            <Texto weight="800">{pessoafisica?.certificado_reservista}</Texto>
                            : <Skeleton variant="rectangular" width={200} height={25} />
                            }
                            <Texto>Situação Militar</Texto>
                            {pessoafisica?.situacao_militar ?
                            <Texto weight="800">{pessoafisica?.situacao_militar}</Texto>
                            : <Skeleton variant="rectangular" width={200} height={25} />
                            }
                        </Col3>
                    </Col12>
                </div>
            </Container>
        </Frame>
    )
}

export default ColaboradorDependenteDetalhes
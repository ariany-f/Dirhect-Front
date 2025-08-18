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
import { Tag } from 'primereact/tag';
import { useSessaoUsuarioContext } from '@contexts/SessaoUsuario';
import { RiEditBoxFill, RiGasStationFill, RiShoppingCartFill } from 'react-icons/ri';
import { MdOutlineFastfood } from 'react-icons/md';
import styled from 'styled-components';
import { BiChevronLeft } from 'react-icons/bi';
import { Real } from '@utils/formats'

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

function ColaboradorDependenteDetalhes() {

    let { id, codigo } = useParams()
    const location = useLocation();
    const [dependente, setDependente] = useState(null)
    const [loading, setLoading] = useState(false)
    const navegar = useNavigate()
    const toast = useRef(null)

    const {usuario} = useSessaoUsuarioContext()

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
        const grau = dependente?.grau_parentesco_descricao;
        if (!grau) {
            return null;
        }
        
        let severity = "primary";
        if (grau.toLowerCase().includes('filho')) {
            severity = "success";
        } else if (grau.toLowerCase().includes('cônjuge')) {
            severity = "info";
        }
    
        return <Tag severity={severity} value={grau}></Tag>;
    }

    const calcularIdade = (dataNascimento) => {
        if (!dataNascimento) return '---';
        const hoje = new Date();
        const nascimento = new Date(dataNascimento);
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const mes = hoje.getMonth() - nascimento.getMonth();

        if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
            idade--;
        }

        return `${idade} anos`;
    };


    return (
        <Frame>
            <Toast ref={toast} />
            <Loading opened={loading} />
            <ConfirmDialog locale="pt" />
            <Container gap="32px">
                {!dependente ?
                    <Skeleton variant="rectangular" width={300} height={40} />
                :
                    <BotaoGrupo align="space-between">
                        <Titulo align="left">
                            <Container gap="32px">
                                <BotaoVoltar/>
                                <BotaoGrupo align="space-between">
                                    <h5>{dependente.nome_depend}</h5>
                                    <small>{representativeParentescoTemplate(dependente)}</small>
                                </BotaoGrupo>
                            </Container>
                        </Titulo>
                    </BotaoGrupo>
                }
                <Titulo><h6>Identificação</h6></Titulo>
                <div className={styles.card_dashboard}>
                    <Col12>
                        <Col3>
                            <Texto>Nome completo</Texto>
                            {!dependente
                                ? <Skeleton variant="rectangular" width={200} height={25} />
                                : <Texto weight="800">{dependente.nome_depend || '---'}</Texto>
                            }
                            <Texto>Estado Civil</Texto>
                            {!dependente
                                ? <Skeleton variant="rectangular" width={200} height={25} />
                                : <Texto weight="800">{dependente.estadocivil_descricao || '---'}</Texto>
                            }
                        </Col3>
                        <Col3>
                            <Texto>Nascimento</Texto>
                            {!dependente
                                ? <Skeleton variant="rectangular" width={200} height={25} />
                                : <Texto weight="800">{dependente.dtnascimento ? new Date(dependente.dtnascimento).toLocaleDateString('pt-BR') : '---'}</Texto>
                            }
                            <Texto>Idade</Texto>
                             {!dependente
                                ? <Skeleton variant="rectangular" width={200} height={25} />
                                : <Texto weight="800">{calcularIdade(dependente.dtnascimento)}</Texto>
                            }
                        </Col3>
                        <Col3>
                            <Texto>CPF</Texto>
                             {!dependente
                                ? <Skeleton variant="rectangular" width={200} height={25} />
                                : <Texto weight="800">{dependente.cpf ? formataCPF(dependente.cpf) : '---'}</Texto>
                            }
                            <Texto>Sexo</Texto>
                            {!dependente
                                ? <Skeleton variant="rectangular" width={200} height={25} />
                                : <Texto weight="800">
                                    {
                                        dependente.genero === 'M' ? 'Masculino'
                                        : dependente.genero === 'F' ? 'Feminino'
                                        : '---'
                                    }
                                  </Texto>
                            }
                        </Col3>
                    </Col12>
                </div>
            </Container>
        </Frame>
    )
}

export default ColaboradorDependenteDetalhes
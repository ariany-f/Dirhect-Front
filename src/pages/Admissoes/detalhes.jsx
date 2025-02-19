import styles from './Admissoes.module.css'
import styled from "styled-components"
import { Link, Outlet, useLocation, useParams } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import Texto from '@components/Texto'
import Frame from '@components/Frame'
import Titulo from '@components/Titulo'
import Botao from '@components/Botao'
import { Skeleton } from 'primereact/skeleton'
import Container from "@components/Container"
import { FaArrowAltCircleRight, FaTrash } from 'react-icons/fa'
import BotaoVoltar from "@components/BotaoVoltar"
import Loading from '@components/Loading'
import BotaoGrupo from "@components/BotaoGrupo"
import BotaoSemBorda from "@components/BotaoSemBorda"
import { Toast } from 'primereact/toast'
import { useVagasContext } from '@contexts/VagasContext'; // Importando o contexto
import DataTableCandidatos from '@components/DataTableCandidatos'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { addLocale } from 'primereact/api'

let Real = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`

function DetalhesAdmissao() {

    let { id, candidato } = useParams()
    const location = useLocation();
    const [vaga, setVaga] = useState(null)
    const [candidate, setCandidato] = useState(null)
    const toast = useRef(null)
    const [loading, setLoading] = useState(false)

    const { 
        vagas,
        setVagas
    } = useVagasContext()

    const cancelarVaga = () => {
        confirmDialog({
            message: 'Você quer cancelar essa vaga?',
            header: 'Desativar',
            icon: 'pi pi-info-circle',
            accept: () => {
               
            },
            reject: () => {

            },
        });
    }

   
    useEffect(() => {
        if(!vaga)
        {
            const obj = vagas.vagas;
            const vg = [...obj.abertas, ...obj.canceladas].find(item => (item.id == id));

            if(vg) {
                setVaga(vg)
            }
        } else if( !candidate )
        {
            const cd = vaga.candidatos.find(item => (item.id == candidato));
            
            if(cd) {
                setCandidato(cd)
            }
        }
    }, [vaga])

    function validar() {
      
        setLoading(true)
        const url = "https://hook.us1.make.com/78t4032nswo6cj4xhlq63ujwnftifzex";

        const data = [{
            "CHAPA": " ",
            "NROFICHAREG": "",
            "CODCOLIGADA": "859",
            "CODRECEBIMENTO": "M",
            "CODSITUACAO": "A",
            "CODTIPO": "N",
            "CODSECAO": "01.01.095",
            "CODFUNCAO": "0186",
            "CODSINDICATO": "374",
            "CODHORARIO": "8",
            "DTBASE": "2023-11-30T00:00:00",
            "SALARIO": "1.500",
            "SITUACAOFGTS": "2",
            "DTOPCAOFGTS": "2023-11-30T00:00:00",
            "AJUDACUSTO": "",
            "DATAADMISSAO": "2023-11-30T00:00:00",
            "TIPOADMISSAO": "R",
            "MOTIVOADMISSAO": "01",
            "TEMPRAZOCONTR": "0",
            "FIMPRAZOCONTR": "",
            "SITUACAORAIS": "N",
            "CONTAPAGAMENTO": "07328480",
            "VINCULORAIS": "5",
            "PISPARAFGTS": "13258765803",
            "CODFILIAL": "1",
            "NOME": candidate.nome,
            "PISPASEP": "13258765803",
            "CODBANCOFGTS": "104",
            "CODBANCOPAGTO": "033",
            "CODAGENCIAPAGTO": "1244",
            "CODBANCOPIS": "104",
            "REGATUAL": "1",
            "JORNADAMENSAL": 10800,
            "PREVDISP": "2023-11-30T00:00:00",
            "CODOCORRENCIA": "0",
            "CODCATEGORIA": "101",
            "SITUACAOINSS": "1",
            "SEXO": "M",
            "NACIONALIDADE": "10",
            "GRAUINSTRUCAO": "9",
            "NATURALIDADE": "JOINVILLE",
            "APELIDO": "DOISBICHARA TESTE",
            "EMAIL": candidate.email,
            "DTNASCIMENTO": "1990-10-31T00:00:00",
            "CARTIDENTIDADE": "140590985",
            "ORGEMISSORIDENT": "SSP",
            "DTEMISSAOIDENT": "2008-01-01T00:00:00",
            "UFCARTIDENT": "SC",
            "CARTEIRATRAB": "5147067",
            "SERIECARTTRAB": "0003",
            "TITULOELEITOR": "068137300930",
            "SECAOTITELEITOR": "0222",
            "ZONATITELEITOR": "022",
            "CERTIFRESERV": "123456789002",
            "CATEGMILITAR": "RM",
            "CARTMOTORISTA": "45471673700",
            "TIPOCARTHABILIT": "A",
            "DTVENCHABILIT": "2025-01-01T00:00:00",
            "CPF": candidate.cpf,
            "REGPROFISSIONAL": "",
            "RUA": "JARIVA",
            "NUMERO": "222",
            "COMPLEMENTO": "RESIDENCIAL ELIZABETH",
            "BAIRRO": "GUANABARA",
            "CIDADE": "JOINVILLE",
            "ESTADO": "",
            "PAIS": "BRASIL",
            "CEP": "89207780",
            "TELEFONE1": "47997246602",
            "TELEFONE2": "4730282222",
            "NOMEBANCOPGTO": "SANTANDER",
            "NOMEPAI": "PAI DOISBICHARA TESTE",
            "NOMEMAE": "MAE DOISBICHARA TESTE",
            "JORNADA_MENSAL": "180:00",
            "PAISORIGEM": "10",
            "DEFICIENTEFISICO": 0,
            "DEFICIENTEINTELECTUAL": 0,
            "DEFICIENTEAUDITIVO": 0,
            "DEFICIENTEVISUAL": 0,
            "DEFICIENTEMENTAL": 0,
            "NOMEFUNC": "DOISBICHARA TESTE",
            "CORRACA": "2",
            "ESTADOCIVIL": "S",
            "ESTADONATAL": "SC",
            "NUMEROCARTAOSUS": "123456789107002",
            "CODTIPOBAIRRO": "1",
            "CODTIPORUA": 1,
            "USAVALETRANSP": "0",
            "TPCONTABANCARIA": "1",
            "TPREGIMEPREV": "1",
            "NATUREZAESTAGIO": "N",
            "CODNIVELESTAGIO": "N",
            "AREAATUACAOESTAGIO": "",
            "NUMEROAPOLICEESTAGIO": "",
            "CODINSTITUICAOENSINOESTAGIO": "",
            "CPFCOORDENADORESTAGIO": "",
            "NOMECOORDENADORESTAGIO": "",
            "INDADMISSAO": "1",
            "DTINICIOVINCULO": "2023-11-30T00:00:00",
            "CODMUNICIPIO": "09102",
            "ORGEMISSORCNH": "DENATRAN",
            "DTEMISSAOCNH": "2009-01-01T00:00:00",
            "SITUACAOIRRF": "1",
            "CODCCUSTO": "200019",
            "TIPOREGIMEJORNADA": "4",
            "IDADE": 33,
            "COTAPCD": "1",
            "CODCATEGORIAESOCIAL": "101",
            "TIPOCONTRATOPRAZO": "E",
            "ESOCIALNATATIVIDADE": "1",
            "DTEXPCML": "2008-01-01T00:00:00",
            "DTTITELEITOR": "2008-01-01T00:00:00",
            "CODOCUPACAO": "CBO",
            "EXPED": "SSP",
            "RM": "4",
            "SITMILITAR": "RESERVA",
            "ESTELEIT": "SC",
            "PRIMEIRONOME": "DOISBICHARA TESTE",
            "SOBRENOMEPAI": "DOISBICHARA TESTE",
            "SOBRENOMEMAE": "DOISBICHARA TESTE",
            "CODORGAOCLASSE": "",
            "CODUFREGISTRO": "",
            "CODNATURALIDADE": "09102",
            "NOMESOCIAL": "DOISBICHARA TESTE",
            "DATAPRIMEIRACNH": "2009-01-01T00:00:00",
            "UFCNH": "SC",
            "EMAILPESSOAL": "DOISBICHARA@UORAK.COM",
            "familiar": [
            {
                "CHAPA": " ",
                "CODCOLIGADA": " ",
                "NRODEPEND": 1,
                "NOME": "",
                "SEXO": "F",
                "GRAUPARENTESCO": 7,
                "ESTADOCIVIL": "C"
            },
            {
                "CHAPA": " ",
                "CODCOLIGADA": " ",
                "NRODEPEND": 2,
                "NOME": "",
                "SEXO": "M",
                "GRAUPARENTESCO": 7,
                "ESTADOCIVIL": "C"
            },
            {
                "CHAPA": " ",
                "CODCOLIGADA": "859",
                "DTNASCIMENTO": "1952-01-01T03:00:00.000Z",
                "SEXO": "F",
                "INCIRRF": "0",
                "CPF": "51521000026",
                "GRAUPARENTESCO": "A"
            }
            ]
        }]
        
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Sucesso ao validar admissão', life: 3000 });
            console.log('Sucesso:', data);
        })
        .catch((error) => { 
            toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao validar', life: 3000 });
            console.error('Erro:', error);
        })
        .finally(function() {
            setLoading(false)
        });
    }
    
    return (
        <>
        <Frame>
            <Toast ref={toast} />
            <Loading opened={loading} />
            <ConfirmDialog />
            <Container gap="32px">
                <BotaoVoltar linkFixo="/admissao/validar" />
                    {candidate?.nome ? 
                        <BotaoGrupo align="space-between">
                            <Titulo>
                                <h3>{candidate?.nome}</h3>
                            </Titulo>
                            <BotaoGrupo align="space-between">
                                <Botao aoClicar={() => validar()} estilo="vermilion" size="medium" filled><FaArrowAltCircleRight fill="white" />Validar</Botao>
                            </BotaoGrupo>
                     </BotaoGrupo>
                    : <Skeleton variant="rectangular" width={300} height={40} />
                    }
                <div className={styles.card_dashboard}>
                    <Texto>Titulo</Texto>
                    {vaga?.titulo ?
                        <Texto weight="800">{vaga?.titulo}</Texto>
                        : <Skeleton variant="rectangular" width={200} height={25} />
                    }
                    <Texto>Descrição</Texto>
                    {vaga ?
                        (vaga?.descricao ?
                            <Texto weight="800">{vaga?.descricao}</Texto>
                            : '--')
                        : <Skeleton variant="rectangular" width={200} height={25} />
                    }
                    <Texto>Salário</Texto>
                    {vaga?.salario ?
                        <Texto weight="800">{Real.format(vaga?.salario)}</Texto>
                        : <Skeleton variant="rectangular" width={200} height={25} />
                    }
                </div>
                <div className={styles.card_dashboard}>
                    <Texto>Candidato</Texto>
                    {candidate?.nome ?
                        <Texto weight="800">{candidate?.nome}</Texto>
                        : <Skeleton variant="rectangular" width={200} height={25} />
                    }
                    <Texto>E-mail</Texto>
                    {candidate?.email ?
                        <Texto weight="800">{candidate?.email}</Texto>
                        : <Skeleton variant="rectangular" width={200} height={25} />
                    }
                </div>
            </Container>
        </Frame>
        </>
    )
}

export default DetalhesAdmissao
import http from '@http'
import { useEffect, useState } from "react"
import { useParams } from 'react-router-dom'
import Frame from "@components/Frame"
import Titulo from "@components/Titulo"
import SubTitulo from "@components/SubTitulo"
import FrameVertical from "@components/FrameVertical"
import CustomImage from "@components/CustomImage"
import Texto from "@components/Texto"
import MainContainer from "@components/MainContainer"
import Dashboard from '@assets/Dashboard.svg'
import styled from 'styled-components'
import IconeBeneficio from "@components/IconeBeneficio"
import { Real } from '@utils/formats'
import { FaListUl, FaRegCalendarAlt } from 'react-icons/fa'

const Beneficio = styled.div`
   display: flex;
    width: 308px;
    padding: 16px;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 24px;
    align-self: stretch;
    border-radius: 16px;
    border: 1px solid var(--neutro-200);
`

const Col12 = styled.div`
    display: flex;
    width: 100%;
    gap: 24px;
    flex-wrap: wrap;
`

const Col12Spaced = styled.div`
    display: flex;
    width: 100%;
    gap: 8px;
    justify-content: space-between;
`

const Col6Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    padding: 6px;
    border-radius: 12px;
    border: 1px solid var(--neutro-200);
    background: var(--neutro-100);
`

const Col6 = styled.div`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    flex-direction: column;
    text-align: center;
`

const Item = styled.div`
    cursor: pointer;
    border-width: 1px;
    border-style: solid;
    border-radius: 16px;
    display: flex;
    padding: 20px;
    justify-content: space-between;
    align-items: center;
    width: 94%;
    border-color: ${ props => props.$active ? 'var(--primaria)' : 'var(--neutro-200)' };
`;

const Badge = styled.div`
    cursor: pointer;
    flex-direction: column;
    gap: 24px;
    padding: 2px 8px;
    font-size: 12px;
    color: var(--neutro-600);
    font-weight: 600;
    border-radius: 8px;
    display: flex;
    border: 1px solid var(--neutro-200);
    background-color: var(--neutro-50);
    & p {
        color: var(--neutro-100);
        font-weight: 700;
    }
`

const TabPanel = styled.div`
    display: flex;
    align-items: center;
    gap: 0;
    margin-bottom: 24px;
    justify-content: flex-end;
`;

const TabButton = styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
    background: ${({ active }) => active ? 'linear-gradient(to left, #0c004c, #5d0b62)' : '#f5f5f5'};
    color: ${({ active }) => active ? '#fff' : '#333'};
    border: none;
    border-radius: 8px 8px 0 0;
    font-size: 16px;
    font-weight: 500;
    padding: 10px 22px;
    cursor: pointer;
    margin-right: 2px;
    box-shadow: ${({ active }) => active ? '0 2px 8px #5d0b6240' : 'none'};
    transition: background 0.2s, color 0.2s;
    outline: none;
    border-bottom: ${({ active }) => active ? '2px solid #5d0b62' : '2px solid transparent'};
    &:hover {
        background: ${({ active }) => active ? 'linear-gradient(to left, #0c004c, #5d0b62)' : '#ececec'};
    }
`;

const Tabela = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 12px;
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
`;
const Th = styled.th`
    background: #f5f5f5;
    font-weight: 700;
    font-size: 15px;
    padding: 10px 8px;
    border-bottom: 1px solid #ececec;
    text-align: left;
`;
const Td = styled.td`
    font-size: 15px;
    padding: 10px 8px;
    border-bottom: 1px solid #f3f3f3;
`;

function EstruturaConfiguracaoBeneficios(type = 'filial') {

    let { id } = useParams()
    const [configuracoes, setConfiguracoes] = useState(null)
    const [tab, setTab] = useState('cards')

    useEffect(() => {
        if(id && (!configuracoes)) {
            http.get(`matriz_eligibilidade/?format=json`)
                .then(response => {
                    const atualizada = response.filter(
                        el => el.entidade.tipo == type.type && el.entidade.id_origem == id
                    )
                    const configs = atualizada[0]?.itens_configurados || [];
                    setConfiguracoes(configs);
                })
                .catch(erro => console.log(erro))
        }
    }, [configuracoes, id, type])
    
    const getTipoCalculo = (tipo) => {
        const tipoMap = {
            'F': 'Valor Fixo',
            'M': 'Valor Mensal',
            'D': 'Valor Diário',
            'T': 'Tabela Interna'
        }
        return tipoMap[tipo] || tipo;
    }
    
    const getTipoDesconto = (tipo) => {
        const tipoMap = {
            'F': 'Valor Fixo',
            'C': '% sobre o valor da compra',
            'S': '% do Valor do Salário',
            'D': 'Valor Diário'
        }
        return tipoMap[tipo] || tipo;
    }

    return (
        <Frame>
            <TabPanel>
                <TabButton active={tab === 'cards'} onClick={() => setTab('cards')}>
                    <FaRegCalendarAlt fill={tab === 'cards' ? 'white' : '#000'} />
                    <Texto color={tab === 'cards' ? 'white' : '#000'}>Grid</Texto>
                </TabButton>
                <TabButton active={tab === 'lista'} onClick={() => setTab('lista')}>
                    <FaListUl fill={tab === 'lista' ? 'white' : '#000'} />
                    <Texto color={tab === 'lista' ? 'white' : '#000'}>Lista</Texto>
                </TabButton>
            </TabPanel>
            {configuracoes && configuracoes.length > 0 ? (
                tab === 'cards' ? (
                    <Col12>
                        {configuracoes.map((config) => {
                            const beneficio = config.item_beneficio;
                            const dadosBeneficio = beneficio.beneficio.dados_beneficio;
                            const ben = beneficio.beneficio;
                            const icone = <IconeBeneficio nomeIcone={dadosBeneficio?.icone ?? dadosBeneficio?.descricao ?? ''}/>
                            
                            return (
                                <Col6 key={config.contrato_item}>
                                    <Beneficio>
                                        <Col12Spaced>
                                            <FrameVertical gap="8px" align="center">
                                                <CustomImage src={ben.image_operadora} alt={ben.nome_operadora} width={'40px'} height={25} size={80} title={ben.nome_operadora} />
                                                <Texto weight={600} size="12px">{ben.nome_operadora}</Texto>
                                            </FrameVertical>
                                        </Col12Spaced>
                                        
                                        <div style={{ marginTop: '16px' }}>
                                            {icone && 
                                                <div style={{display: 'flex', fontSize: '12px', gap: '4px', fontWeight: 600}} key={icone.id}>
                                                    {icone}
                                                    <p color="black">{dadosBeneficio?.descricao}</p>
                                                </div>
                                            }
                                            <br />
                                            <Texto size={'12px'} weight={600}>Descrição: </Texto>
                                            <Texto size={'12px'} >{beneficio?.descricao}</Texto>
                                            <Texto size={'12px'} weight={600}>Tipo Desconto:</Texto>
                                            <Texto size={'12px'} >{getTipoDesconto(beneficio?.tipo_desconto)}</Texto>
                                            <Col12Spaced style={{ marginTop: '12px' }}>
                                                <Col6Container>
                                                    <Texto color="green" weight={400}>
                                                        {Real.format(beneficio.valor)}
                                                    </Texto>
                                                    <Texto weight={600} size="10px">
                                                        {getTipoCalculo(beneficio.tipo_calculo)}
                                                    </Texto>
                                                </Col6Container>
                                                <Col6Container>
                                                    <Texto color="red" weight={400}>
                                                        {Real.format(beneficio.valor_desconto)}
                                                    </Texto>
                                                    <Texto weight={600} size="10px">Colaborador</Texto>
                                                </Col6Container>
                                                <Col6Container>
                                                    <Texto color="var(--primaria)" weight={400}>
                                                        {Real.format(beneficio.valor_empresa)}
                                                    </Texto>
                                                    <Texto weight={600} size="10px">Empresa</Texto>
                                                </Col6Container>
                                            </Col12Spaced>
                                        </div>
                                    </Beneficio>
                                </Col6>
                            );
                        })}
                    </Col12>
                ) : (
                    <Tabela>
                        <thead>
                            <tr>
                                <Th>Nome</Th>
                                <Th>Operadora</Th>
                                <Th>Tipo Desconto</Th>
                                <Th>Valor</Th>
                                <Th>Valor Desconto</Th>
                                <Th>Valor Empresa</Th>
                            </tr>
                        </thead>
                        <tbody>
                            {configuracoes.map((config) => {
                                const beneficio = config.item_beneficio;
                                const ben = beneficio.beneficio;
                                return (
                                    <tr key={config.contrato_item}>
                                        <Td>{ben.dados_beneficio?.descricao}</Td>
                                        <Td>
                                            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                                <CustomImage src={ben.image_operadora} alt={ben.nome_operadora} width={'40px'} height={25} size={80} title={ben.nome_operadora} />
                                                <Texto weight={600} size="12px">{ben.nome_operadora}</Texto>
                                            </div>
                                        </Td>
                                        <Td>{getTipoDesconto(beneficio?.tipo_desconto)}</Td>
                                        <Td>{Real.format(beneficio.valor)}</Td>
                                        <Td>{Real.format(beneficio.valor_desconto)}</Td>
                                        <Td>{Real.format(beneficio.valor_empresa)}</Td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Tabela>
                )
            ) : (
                <Frame align="center">
                    <MainContainer align="center">
                        <img src={Dashboard} size={100} alt="Nenhum contrato" />
                        <Titulo>
                            <h6>Nenhum contrato configurado</h6>
                            <SubTitulo>
                                Quando houver contratos configurados, eles aparecerão aqui
                            </SubTitulo>
                        </Titulo>
                    </MainContainer>
                </Frame>
            )}
        </Frame>
    )
}

export default EstruturaConfiguracaoBeneficios
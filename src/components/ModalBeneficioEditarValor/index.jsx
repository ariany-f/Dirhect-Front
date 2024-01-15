import Botao from "@components/Botao"
import Frame from "@components/Frame"
import SwitchInput from "@components/SwitchInput"
import Titulo from "@components/Titulo"
import Texto from "@components/Texto"
import CampoTexto from "@components/CampoTexto"
import SubTitulo from "@components/SubTitulo"
import { RiCloseFill, RiCoupon3Line, RiShoppingCartLine } from 'react-icons/ri'
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"
import styles from '@pages/Beneficios/Beneficios.module.css'
import http from '@http';
import { useEffect } from "react"
import { BiCar } from "react-icons/bi"
import { CiBurger, CiForkAndKnife } from "react-icons/ci"
import { PiFirstAidKitLight, PiOfficeChair } from "react-icons/pi"
import { IoBookOutline } from "react-icons/io5"
import { currency, mask as masker, unMask } from "remask"
import { useRecargaBeneficiosContext } from "../../contexts/RecargaBeneficios"

const Overlay = styled.div`
    background-color: rgba(0,0,0,0.80);
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    overflow-y: scroll;
    left: 0;
`

const DialogEstilizado = styled.dialog`
    display: flex;
    width: 80vw;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 16px;
    border: none;
    margin: 0 auto;
    margin-top: 1%;
    padding: 24px;
    & button.close {
        & .fechar {
            box-sizing: initial;
            fill: var(--primaria);
            stroke: var(--primaria);
            color: var(--primaria);
        }
        position: absolute;
        right: 20px;
        top: 20px;
        cursor: pointer;
        border: none;
        background-color: initial;
    }
    & .icon {
        margin-right: 5px;
        box-sizing: initial;
        fill: var(--primaria);
        stroke: var(--primaria);
        color: var(--primaria);
    }
    & .frame:nth-of-type(1) {
        gap: 24px;
        & .frame {
            margin-bottom: 24px;
            & p{
                display: flex;
                flex-direction: column;
                gap: 5px;
            }
            & b {
                font-weight: 800;
                font-size: 14px;
            }
        }
    }
`

const CardBeneficio = styled.div`
    display: flex;
    flex-wrap: wrap;
    display: flex;
    align-items: center;
    gap: 24px;
    align-self: stretch;
`

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
    gap: 8px;
    justify-content: space-between;
`

const Col6Input = styled.div`
    flex: 1;
    width: 50%;
`

const Col6 = styled.div`
    flex: 1 1 50%;
    display: inline-flex;
    align-items: center;
    gap: 8px;
`

const LadoALado = styled.div`
    display: flex;
    gap: 24px;
    & span {
        display: flex;
        align-items: center;
    }
`

let Real = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});

function ModalBeneficioEditarValor({ opened = false, aoClicar, aoFechar, selecionados = [] }) {

    const {
        recarga,
        setAmount
    } = useRecargaBeneficiosContext()

    const [beneficios, setBeneficios] = useState([])
    const [checkedAuxilio, setCheckedAuxilio] = useState(false)
    const [checkedSaude, setCheckedSaude] = useState(false)
    const [checkedMobilidade, setCheckedMobilidade] = useState(false)
    const [checkedHomeOffice, setCheckedHomeOffice] = useState(false)
    const [checkedEducacao, setCheckedEducacao] = useState(false)
    const [checkedCultura, setCheckedCultura] = useState(false)
    const [checkedCombustivel, setCheckedCombustivel] = useState(false)
    const [auxilioAlimentacao, setAuxilioAlimentacao] = useState(Real.format(0))
    const [alimentacao, setAlimentacao] = useState(Real.format(0))
    const [refeicao, setRefeicao] = useState(Real.format(0))
    const [saudeFlexivel, setSaudeFlexivel] = useState(Real.format(0))
    const [saudeFixo, setSaudeFixo] = useState(Real.format(0))
    const [mobilidadeFlexivel, setMobilidadeFlexivel] = useState(Real.format(0))
    const [mobilidadeFixo, setMobilidadeFixo] = useState(Real.format(0))
    const [homeOfficeFlexivel, setHomeOfficeFlexivel] = useState(Real.format(0))
    const [homeOfficeFixo, setHomeOfficeFixo] = useState(Real.format(0))
    const [educacaoFlexivel, setEducacaoFlexivel] = useState(Real.format(0))
    const [educacaoFixo, setEducacaoFixo] = useState(Real.format(0))
    const [culturaFlexivel, setCulturaFlexivel] = useState(Real.format(0))
    const [culturaFixo, setCulturaFixo] = useState(Real.format(0))
    const [combustivelFlexivel, setCombustivelFlexivel] = useState(Real.format(0))
    const [combustivelFixo, setCombustivelFixo] = useState(Real.format(0))
    const [total, setTotal] = useState(0)

    const navegar = useNavigate()

    function removeMask(valor)
    {
        return currency.unmask({locale: 'pt-BR', currency: 'BRL', value: valor})
    }
    useEffect(() => {
        if(beneficios.length === 0)
        {
            http.get('api/dashboard/benefit')
                .then((response) => {
                    setBeneficios(response.data.benefits)
                })
                .catch(erro => {
                    console.error(erro)
                })
        }

        if(checkedAuxilio)
        {
            setTotal((
                removeMask(auxilioAlimentacao)
                + removeMask(saudeFlexivel) + (checkedSaude ? (removeMask(saudeFixo)) : 0)
                + removeMask(mobilidadeFlexivel) + (checkedMobilidade ? (removeMask(mobilidadeFixo)) : 0)
                + removeMask(homeOfficeFlexivel) + (checkedHomeOffice ? (removeMask(homeOfficeFixo)) : 0)
                + removeMask(educacaoFlexivel) + (checkedEducacao ? (removeMask(educacaoFixo)) : 0)
                + removeMask(culturaFlexivel) + (checkedCultura ? (removeMask(culturaFixo)) : 0)
                + removeMask(combustivelFlexivel) + (checkedCombustivel ? (removeMask(combustivelFixo)) : 0)
                ) * selecionados.length)
        }
        else
        {
            setTotal((
                removeMask(alimentacao) 
                + removeMask(refeicao) 
                + removeMask(saudeFlexivel) + (checkedSaude ? (removeMask(saudeFixo)) : 0)
                + removeMask(mobilidadeFlexivel) + (checkedMobilidade ? (removeMask(mobilidadeFixo)) : 0)
                + removeMask(homeOfficeFlexivel) + (checkedHomeOffice ? (removeMask(homeOfficeFixo)) : 0)
                + removeMask(educacaoFlexivel) + (checkedEducacao ? (removeMask(educacaoFixo)) : 0)
                + removeMask(culturaFlexivel) + (checkedCultura ? (removeMask(culturaFixo)) : 0)
                + removeMask(combustivelFlexivel) + (checkedCombustivel ? (removeMask(combustivelFixo)) : 0)
                ) * selecionados.length)
        }
        
    }, [
        selecionados,
        beneficios, 
        checkedAuxilio, 
        auxilioAlimentacao, 
        alimentacao, 
        refeicao, 
        checkedSaude, 
        checkedMobilidade, 
        checkedHomeOffice, 
        checkedEducacao, 
        checkedCultura, 
        checkedCombustivel, 
        saudeFlexivel, 
        saudeFixo, 
        mobilidadeFlexivel, 
        mobilidadeFixo, 
        homeOfficeFlexivel, 
        homeOfficeFixo, 
        educacaoFlexivel, 
        educacaoFixo, 
        culturaFlexivel, 
        culturaFixo, 
        combustivelFlexivel, 
        combustivelFixo
    ])
    
    function salvar() {
        selecionados.map(item => {
            const obj = item
            obj['benefits'] = []
            if(checkedAuxilio)
            {
                obj['benefits'].push({
                    name: 'Auxilio Alimentação',
                    amount: removeMask(auxilioAlimentacao),
                    food_meal_one_category: true
                })
                
                obj['benefits'].push({
                    name: 'Alimentação',
                    amount: 0,
                    food_meal_one_category: false
                })
                
                obj['benefits'].push({
                    name: 'Refeição',
                    amount: 0,
                    food_meal_one_category: false
                })
            }
            else
            {
                obj['benefits'].push({
                    name: 'Auxilio Alimentação',
                    amount: 0,
                    food_meal_one_category: true
                })
                
                obj['benefits'].push({
                    name: 'Alimentação',
                    amount: removeMask(alimentacao),
                    food_meal_one_category: false
                })
                
                obj['benefits'].push({
                    name: 'Refeição',
                    amount: removeMask(refeicao),
                    food_meal_one_category: false
                })
            }
            
            obj['benefits'].push({
                name: 'Educação',
                amount: removeMask(educacaoFixo),
                flexible_value: removeMask(educacaoFlexivel),
                food_meal_one_category: false
            })
            
            obj['benefits'].push({
                name: 'Home Office',
                amount: removeMask(homeOfficeFixo),
                flexible_value: removeMask(homeOfficeFlexivel),
                food_meal_one_category: false
            })
            
            obj['benefits'].push({
                name: 'Mobilidade',
                amount: removeMask(mobilidadeFixo),
                flexible_value: removeMask(mobilidadeFlexivel),
                food_meal_one_category: false
            })
            
            obj['benefits'].push({
                name: 'Cultura',
                amount: removeMask(culturaFixo),
                flexible_value: removeMask(culturaFlexivel),
                food_meal_one_category: false
            })
            
            obj['benefits'].push({
                name: 'Saúde',
                amount: removeMask(saudeFixo),
                flexible_value: removeMask(saudeFlexivel),
                food_meal_one_category: false
            })
            
            obj['benefits'].push({
                name: 'Combustível',
                amount: removeMask(combustivelFixo),
                flexible_value: removeMask(combustivelFlexivel),
                food_meal_one_category: false
            })
            
            setAmount(obj)
        })
        aoFechar()
    }

    return(
        <>
            {opened &&
            <Overlay>
                <DialogEstilizado id="modal-add-departamento" open={opened}>
                    <Frame>
                        <Titulo>
                             <form method="dialog">
                                <button className="close" onClick={aoFechar} formMethod="dialog">
                                    <RiCloseFill size={20} className="fechar" />  
                                </button>
                            </form>
                            <h5>Valor dos benefícios</h5>
                            <SubTitulo>Informe os valores e os benefícios que deseja disponibilizar para os colaboradores selecionados:</SubTitulo>
                        </Titulo>
                        <Texto weight={700}>Colaboradores selecionados&nbsp;<span style={{fontWeight: '600', color: 'var(--primaria)'}}>{selecionados.length}</span></Texto>
                        <Titulo>
                            <h6 style={{ fontSize: '16px' }}>Benefício Fixado</h6>
                            <SubTitulo>Digite o valor total que permanecerá fixo dentro dessa categoria.</SubTitulo>
                        </Titulo>
                        <div style={{backgroundColor: 'var(--neutro-50)', width: '100%', padding: '16px', borderRadius: '16px'}}>
                            <Texto weight="800">
                                <b style={{fontSize: '14px'}}>Auxílio Alimentação&nbsp;</b><SwitchInput checked={checkedAuxilio} onChange={setCheckedAuxilio} />
                            </Texto>
                            <SubTitulo>Utilizar Alimentação e Refeição juntos em uma só categoria.</SubTitulo>
                        </div>
                        {checkedAuxilio ?
                            <CardBeneficio>
                                <Beneficio>
                                        <Texto weight={700}><CiForkAndKnife size={18}/>&nbsp;Auxílio Alimentação</Texto>
                                        <CampoTexto valor={auxilioAlimentacao} setValor={setAuxilioAlimentacao} patternMask={'BRL'} label="Valor fixo" placeholder="R$ 0,00"/>
                                </Beneficio>
                            </CardBeneficio>
                            : 
                            <CardBeneficio>
                                <Beneficio>
                                    <Texto weight={700}><RiShoppingCartLine size={16} />&nbsp;Alimentação</Texto>
                                    <CampoTexto valor={alimentacao} setValor={setAlimentacao} patternMask={'BRL'} label="Valor fixo" placeholder="R$ 0,00"/>
                                </Beneficio>
                                <Beneficio>
                                    <Texto weight={700}><CiBurger size={20} /> &nbsp;Refeição</Texto>
                                    <CampoTexto valor={refeicao} setValor={setRefeicao} patternMask={'BRL'} label="Valor fixo" placeholder="R$ 0,00"/>
                                </Beneficio>
                            </CardBeneficio>
                        }

                        <div style={{width: '100%', borderBottom: '1px dotted var(--neutro-300)', marginTop: '4px', marginBottom: '4px'}} ></div>
                        <Titulo>
                            <h6 style={{ fontSize: '16px' }}>Benefício Flexível</h6>
                            <SubTitulo>Digite o valor flexível que pode ser distribuído entre as categorias ou habilite a opção “Fixar Valor” e definindo o valor que será fixo por categoria.</SubTitulo>
                        </Titulo>
                        
                        <CardBeneficio>
                            <Beneficio>
                                <Col12>
                                    <Col6>
                                        <PiFirstAidKitLight size={20} /><Texto weight={700}>Saúde</Texto>
                                    </Col6>
                                    <Col6>
                                        <Texto weight="800">
                                            <b style={{fontSize: '10px'}}>Fixar valor&nbsp;</b><SwitchInput checked={checkedSaude} onChange={setCheckedSaude} />
                                        </Texto>
                                    </Col6>
                                </Col12>
                                <Col12>
                                    <Col6Input>
                                        <CampoTexto valor={saudeFlexivel} setValor={setSaudeFlexivel} patternMask={'BRL'} label="Valor flexível" placeholder="R$ 0,00"/>
                                    </Col6Input>
                                    {checkedSaude &&
                                        <Col6Input>
                                            <CampoTexto valor={saudeFixo} setValor={setSaudeFixo} patternMask={'BRL'} label="Valor fixo" placeholder="R$ 0,00"/>
                                        </Col6Input>
                                    }
                                </Col12>
                            </Beneficio>
                            <Beneficio>
                                <Col12>
                                    <Col6>
                                        <BiCar size={20} /><Texto weight={700}>Mobilidade</Texto>
                                    </Col6>
                                    <Col6>
                                        <Texto weight="800">
                                            <b style={{fontSize: '10px'}}>Fixar valor&nbsp;</b><SwitchInput checked={checkedMobilidade} onChange={setCheckedMobilidade} />
                                        </Texto>
                                    </Col6>
                                </Col12>
                                <Col12>
                                    <Col6Input>
                                        <CampoTexto valor={mobilidadeFlexivel} setValor={setMobilidadeFlexivel} patternMask={'BRL'} label="Valor flexível" placeholder="R$ 0,00"/>
                                    </Col6Input>
                                    {checkedMobilidade &&
                                        <Col6Input>
                                            <CampoTexto valor={mobilidadeFixo} setValor={setMobilidadeFixo} patternMask={'BRL'} label="Valor fixo" placeholder="R$ 0,00"/>
                                        </Col6Input>
                                    }
                                </Col12>
                            </Beneficio>
                            <Beneficio>
                                <Col12>
                                    <Col6>
                                        <PiOfficeChair size={20} /><Texto weight={700}>Home Office</Texto>
                                    </Col6>
                                    <Col6>
                                        <Texto weight="800">
                                            <b style={{fontSize: '10px'}}>Fixar valor&nbsp;</b><SwitchInput checked={checkedHomeOffice} onChange={setCheckedHomeOffice} />
                                        </Texto>
                                    </Col6>
                                </Col12>
                                <Col12>
                                    <Col6Input>
                                        <CampoTexto valor={homeOfficeFlexivel} setValor={setHomeOfficeFlexivel} patternMask={'BRL'} label="Valor flexível" placeholder="R$ 0,00"/>
                                    </Col6Input>
                                    {checkedHomeOffice &&    
                                        <Col6Input>
                                            <CampoTexto valor={homeOfficeFixo} setValor={setHomeOfficeFixo} patternMask={'BRL'} label="Valor fixo" placeholder="R$ 0,00"/>
                                        </Col6Input>
                                    }
                                </Col12>
                            </Beneficio>
                        </CardBeneficio>
                        <CardBeneficio>
                            <Beneficio>
                                <Col12>
                                    <Col6>
                                        <IoBookOutline size={20} /><Texto weight={700}>Educação</Texto>
                                    </Col6>
                                    <Col6>
                                        <Texto weight="800">
                                            <b style={{fontSize: '10px'}}>Fixar valor&nbsp;</b><SwitchInput checked={checkedEducacao} onChange={setCheckedEducacao} />
                                        </Texto>
                                    </Col6>
                                </Col12>
                                <Col12>
                                    <Col6Input>
                                        <CampoTexto valor={educacaoFlexivel} setValor={setEducacaoFlexivel} patternMask={'BRL'} label="Valor flexível" placeholder="R$ 0,00"/>
                                    </Col6Input>
                                    {checkedEducacao &&
                                        <Col6Input>
                                            <CampoTexto valor={educacaoFixo} setValor={setEducacaoFixo} patternMask={'BRL'} label="Valor fixo" placeholder="R$ 0,00"/>
                                        </Col6Input>
                                    }
                                </Col12>
                            </Beneficio>
                            <Beneficio>
                                <Col12>
                                    <Col6>
                                        <RiCoupon3Line size={20} /><Texto weight={700}>Cultura</Texto>
                                    </Col6>
                                    <Col6>
                                        <Texto weight="800">
                                            <b style={{fontSize: '10px'}}>Fixar valor&nbsp;</b><SwitchInput checked={checkedCultura} onChange={setCheckedCultura} />
                                        </Texto>
                                    </Col6>
                                </Col12>
                                <Col12>
                                    <Col6Input>
                                        <CampoTexto valor={culturaFlexivel} setValor={setCulturaFlexivel} patternMask={'BRL'} label="Valor flexível" placeholder="R$ 0,00"/>
                                    </Col6Input>
                                    {checkedCultura &&
                                        <Col6Input>
                                            <CampoTexto valor={culturaFixo} setValor={setCulturaFixo} patternMask={'BRL'} label="Valor fixo" placeholder="R$ 0,00"/>
                                        </Col6Input>
                                    }
                                </Col12>
                            </Beneficio>
                            <Beneficio>
                                <Col12>
                                    <Col6>
                                        <RiCoupon3Line size={18} /><Texto weight={700}>Combustível</Texto>
                                    </Col6>
                                    <Col6>
                                        <Texto weight="800">
                                            <b style={{fontSize: '10px'}}>Fixar valor&nbsp;</b><SwitchInput checked={checkedCombustivel} onChange={setCheckedCombustivel} />
                                        </Texto>
                                    </Col6>
                                </Col12>
                                <Col12>
                                    <Col6Input>
                                        <CampoTexto valor={combustivelFlexivel} setValor={setCombustivelFlexivel} patternMask={'BRL'} label="Valor flexível" placeholder="R$ 0,00"/>
                                    </Col6Input>
                                    {checkedCombustivel &&
                                        <Col6Input>
                                            <CampoTexto valor={combustivelFixo} setValor={setCombustivelFixo} patternMask={'BRL'} label="Valor fixo" placeholder="R$ 0,00"/>
                                        </Col6Input>
                                    }
                                </Col12>
                            </Beneficio>
                        </CardBeneficio>
                    </Frame>
                    
                    <form method="dialog">
                        <div className={styles.containerBottom}>
                            <Botao aoClicar={aoFechar} estilo="neutro" formMethod="dialog" size="medium" filled>Cancelar</Botao>
                            <LadoALado>
                                <span>Total&nbsp;<b>{Real.format(total)}</b><Texto color='var(--primaria)' weight={700}></Texto></span>
                                <Botao aoClicar={salvar} estilo="vermilion" size="medium" filled>Confirmar</Botao>
                            </LadoALado>
                        </div>
                    </form>
                </DialogEstilizado>
            </Overlay>}
        </>
    )
}

export default ModalBeneficioEditarValor
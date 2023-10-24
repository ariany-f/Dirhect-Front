import Banner from "@components/Banner"
import Botao from "@components/Botao"
import MainSection from "@components/MainSection"
import MainContainer from "@components/MainContainer"
import PrecisoDeAjuda from "@components/PrecisoDeAjuda"
import Titulo from "@components/Titulo"
import styled from "styled-components"
import { useState } from "react"
import { RiBuildingLine } from "react-icons/ri"
import styles from './Login.module.css'
import { Link } from "react-router-dom"

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    align-self: stretch;
`;

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

const RadioButton = styled.input`
    cursor: pointer;
    appearance: none;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    border: 2px solid #999;
    transition: 0.2s all linear;
    margin-right: 5px;
    position: relative;
    top: 4px;
    &:checked {
        accent-color: var(--primaria);
        border: 5px solid var(--primaria);
    }
`;

function SelecionarEmpresa() {

    const empresas = [
        {
            id: 1,
            cnpj: '28.418.539/0001-84',
            nome: 'Soluções Industriais Ltda'
        },
        {
            id: 2,
            cnpj: '62.143.112/0001-59',
            nome: 'System Ltda'
        }
    ];

    const [selected, setSelected] = useState(empresas[0].nome)

    function handleSelectChange(value) {
        setSelected(value);
    };

    return (
        <MainSection>
            <Banner />
            <MainContainer>
                <Titulo>
                    <h2>Selecione uma empresa</h2>
                </Titulo>
                <Wrapper>
                    {empresas.map(empresa => {
                        return (
                            <Item 
                                key={empresa.id} 
                                $active={selected === empresa.nome}
                                onClick={nome => handleSelectChange(empresa.nome)}>
                                <div className={styles.cardEmpresa}>
                                    {(selected === empresa.nome) ?
                                        <RiBuildingLine className={styles.buildingIcon + ' ' + styles.vermilion} size={20} />
                                        : <RiBuildingLine className={styles.buildingIcon} size={20} />
                                    }
                                    <div className={styles.DadosEmpresa}>
                                        <h6>{empresa.nome}</h6>
                                        <div>{empresa.cnpj}</div>
                                    </div>
                                </div>
                                <RadioButton
                                    type="radio"
                                    name="radio"
                                    value={empresa.nome}
                                    checked={selected === empresa.nome}
                                    onChange={event => handleSelectChange(event.target.value)}
                                />
                            </Item>
                        )
                    })}
                </Wrapper>
                <Link to="/dashboard">
                    <Botao estilo="vermilion" size="medium" filled>Confirmar</Botao>
                </Link>
                <PrecisoDeAjuda />
            </MainContainer>
        </MainSection>
    )
}

export default SelecionarEmpresa
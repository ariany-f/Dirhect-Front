import Botao from "@components/Botao"
import Titulo from "@components/Titulo"
import RadioButton from "@components/RadioButton"
import styled from "styled-components"
import { useEffect, useState } from "react"
import { RiBuildingLine } from "react-icons/ri"
import styles from './Login.module.css'
import { Link } from "react-router-dom"
import { ArmazenadorToken } from "../../utils"
import http from '@http'

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

function SelecionarEmpresa() {

    const [empresas, setEmpresas] = useState([]);
    
    useEffect(() => {
        const token = ArmazenadorToken.AccessToken

        http.get('api/admin/company')
            .then(response => {
                response.data.companies.map((item) => {
                    if(!(empresas.filter(e => e.public_id === item.public_id).length > 0))
                    {
                        setEmpresas(estadoAnterior => [...estadoAnterior, item])
                    }
                })
            })
            .catch(erro => console.log(erro))
    }, [])
   
    
    const [selected, setSelected] = useState(empresas[0]?.name)

    function handleSelectChange(value) {
        setSelected(value);
    };

    return (
        <>
            <Titulo>
                <h2>Selecione uma empresa</h2>
            </Titulo>
            {empresas.length > 0 &&
                <>
                    <Wrapper>
                        {empresas.map((empresa, idx) => {
                            return (
                                <Item 
                                    key={idx} 
                                    $active={selected === empresa.name}
                                    onClick={name => handleSelectChange(empresa.name)}>
                                    <div className={styles.cardEmpresa}>
                                        {(selected === empresa.name) ?
                                            <RiBuildingLine className={styles.buildingIcon + ' ' + styles.vermilion} size={20} />
                                            : <RiBuildingLine className={styles.buildingIcon} size={20} />
                                        }
                                        <div className={styles.DadosEmpresa}>
                                            <h6>{empresa.name}</h6>
                                            <div>{empresa.document}</div>
                                        </div>
                                    </div>
                                    <RadioButton
                                        value={empresa.name}
                                        checked={selected === empresa.name}
                                        onSelected={(name) => handleSelectChange}
                                    />
                                </Item>
                            )
                        })}
                    </Wrapper>
                    <Link to="/">
                        <Botao estilo="vermilion" size="medium" filled>Confirmar</Botao>
                    </Link>
                </>
                }
        </>
    )
}

export default SelecionarEmpresa
import SubTitulo from '@components/SubTitulo'
import Titulo from '@components/Titulo'
import { Link } from 'react-router-dom'
import { FaWallet } from 'react-icons/fa'
import styled from 'styled-components'
import './Dashboard.css'
import http from '@http'
import { useEffect } from 'react'

const AddSaldo = styled.div`
    display: flex;
    color: var(--primaria);
    font-family: var(--secundaria);
    font-size: 14px;
    font-weight: 700;
    gap: 8px;
    & svg * {
        fill: var(--primaria);
    }
`

function Dashboard() {
    const registerIsComplete = true;
    const saldo = 'R$ 244.038,91';

    useEffect(() => {
        http.get('api/checkout')
            .then(response => {
                console.log(response)
            })
            .catch(erro => console.log(erro))
    }, [])

    return (
       <>
        {(!registerIsComplete) ? 
            <Titulo>
                <SubTitulo>Ficamos muito felizes em ver você por aqui 🧡</SubTitulo>
                <h6>Complete as etapas de contratação e ofereça a seus colaboradores uma experiência completa em benefícios e vantagens que só a AQBank Multibenefícios oferece!</h6>
            </Titulo>
        :
            <div className="saldo">
                <p>Saldo disponível</p>
                <h2>{saldo}</h2>
                <AddSaldo>
                    <FaWallet/>
                    <Link className="link">Adicionar saldo</Link>
                </AddSaldo>
            </div>
        }
       </>
    )
}

export default Dashboard
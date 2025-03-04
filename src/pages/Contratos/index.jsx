import styled from "styled-components"
import { Link, Outlet, useLocation } from "react-router-dom"
import { useState, useEffect } from 'react'
// import contratos from '@json/contratos.json'
import React, { createContext, useContext } from 'react';
import http from '@http'

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`

const Contratos = () => {

    const location = useLocation();
    const [contratos, setContratos] = useState(null)

    useEffect(() => {
      
        http.get('contrato/?format=json')
        .then(response => {
            setContratos(response)
        })
        .catch(erro => {

        })
        .finally(function() {
        })
       
    }, [])

    return (
        <ConteudoFrame>
            <Outlet context={contratos} />
        </ConteudoFrame>
    );
};

export default Contratos; 
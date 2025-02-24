import React, { useState, useEffect } from 'react';
import { DataView } from 'primereact/dataview';
import Texto from '@components/Texto'
import Botao from '@components/Botao'
import BadgeGeral from '@components/BadgeGeral'
import styles from './Marketplace.module.css'
// import './Marketplace.css'
import { Link, Outlet, useLocation, useOutlet, useOutletContext } from "react-router-dom"
import { BsArrowRight } from 'react-icons/bs';
import { TbTag } from 'react-icons/tb';
import styled from 'styled-components';
import { ScrollPanel } from 'primereact/scrollpanel';
import { Image } from 'primereact/image';
import { Ripple } from 'primereact/ripple';

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`

const Col6 = styled.div`
    flex: 1 1 calc(33.333% - 16px); /* 3 itens por linha considerando gap */
    max-width: calc(33.333% - 16px);
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
`;

const Col12 = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    width: 100%;
    align-items: stretch;
    justify-content: flex-start; /* Melhor alinhamento */
`

const ImageContainer = styled.div`
    width: 250px;
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
`;

const StyledImage = styled.img`
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
`;

export default function MarketplaceLista() {
    const [products, setProducts] = useState([]);
    const context = useOutletContext()

    useEffect(() => {
        setProducts(context)
    }, [context]);

    const itemTemplate = (product, index) => {
        return (
            <Col6 key={index}>
                <ImageContainer>
                    <StyledImage src={product.banner} alt={product.nome} />
                </ImageContainer>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                    <Texto weight={800}>{product.nome}</Texto>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {
                        product.categorias.map((categoria) => (
                            <BadgeGeral nomeBeneficio={categoria} iconeBeneficio={<TbTag />}></BadgeGeral>
                        ))
                    }
                    </div>
                    <ScrollPanel style={{ width: '100%', height: '100px' }}>
                        <Texto>{product.descricao}</Texto>
                    </ScrollPanel>
                </div>
                <Botao extraclasses="p-ripple">
                    Solicitar Cotação
                    <Ripple />
                </Botao>
            </Col6>
        );
    };

    const listTemplate = (items) => {
        if (!items || items.length === 0) return null;

        let list = items.map((product, index) => {
            return itemTemplate(product, index);
        });

        return <Col12>{list}</Col12>;
    };

    return (
        <ConteudoFrame>
            <DataView value={products} listTemplate={listTemplate} />
        </ConteudoFrame>
    )
}
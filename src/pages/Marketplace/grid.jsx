import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { DataView } from 'primereact/dataview';
import Texto from '@components/Texto'
import Botao from '@components/Botao'
import BadgeGeral from '@components/BadgeGeral'
import { Rating } from 'primereact/rating';
import { Tag } from 'primereact/tag';
import { classNames } from 'primereact/utils';
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
const Col12 = styled.div`
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    justify-content: space-between;
`

const Col4 = styled.div`
    flex: 1 1 40%;
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    align-items: start;
`

const Col4Centered = styled.div`
    flex: 1 1 20%;
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    align-items: center;
`

export default function MarketplaceLista() {
    const [products, setProducts] = useState([]);
    const context = useOutletContext()

    useEffect(() => {
        setProducts(context)
    }, [context]);

    // const getSeverity = (product) => {
    //     switch (product.status) {
    //         case 'Ativo':
    //             return 'success';

    //         case 'Inativo':
    //             return 'warning';

    //         case 'Removido':
    //             return 'danger';

    //         default:
    //             return null;
    //     }
    // };

    const itemTemplate = (product, index) => {
        return (
            <>
                <div className={styles.card_dashboard}>
                    <Col12>
                        <Col4>
                            <Image src={`${product.banner}`} alt={product.nome} width="250" preview />                         
                        </Col4>
                        <Col4>
                            <Texto weight={800}>{product.nome}</Texto>
                            <BadgeGeral nomeBeneficio={product.categoria} iconeBeneficio={<TbTag />}></BadgeGeral>
                            <ScrollPanel style={{ width: '100%', height: '200px' }}>
                                <Texto>{product.descricao}</Texto>
                            </ScrollPanel>
                        </Col4>
                        <Col4Centered>
                            <Botao extraclasses="p-ripple">
                                <BsArrowRight fill="white" size={24}/>
                                <Ripple />
                            </Botao>
                        </Col4Centered>
                    </Col12>
                </div>
            </>
        );
    };

    const listTemplate = (items) => {
        if (!items || items.length === 0) return null;

        let list = items.map((product, index) => {
            return itemTemplate(product, index);
        });

        return <div className="grid grid-nogutter">{list}</div>;
    };

    return (
        <ConteudoFrame>
            <DataView value={products} listTemplate={listTemplate} />
        </ConteudoFrame>
    )
}
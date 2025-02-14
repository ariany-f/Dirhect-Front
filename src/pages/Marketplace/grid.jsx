import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { DataView } from 'primereact/dataview';
import Botao from '@components/Botao'
import { Rating } from 'primereact/rating';
import { Tag } from 'primereact/tag';
import { classNames } from 'primereact/utils';
import './Marketplace.css'
import { Link, Outlet, useLocation, useOutlet, useOutletContext } from "react-router-dom"
import { BsArrowRight } from 'react-icons/bs';
import { TbTag } from 'react-icons/tb';
import styled from 'styled-components';

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
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
            <div className="col-12" key={product.id}>
                <div className={classNames('flex flex-column xl:flex-row xl:align-items-start p-4 gap-4', { 'border-top-1 surface-border': index !== 0 })}>
                    <img className="w-9 sm:w-16rem xl:w-10rem shadow-1 block xl:block mx-auto border-round" width={'240px'} src={`${product.banner}`} alt={product.nome} />
                    <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                        <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                            <div className="text-2xl font-bold text-900">{product.nome}</div>
                            <div className="flex align-items-center gap-3">
                                <span className="flex align-items-center gap-2">
                                    <TbTag />
                                    <span className="font-semibold">{product.categoria}</span>
                                </span>
                                {/* <Tag value={product.status} severity={getSeverity(product)}></Tag> */}
                            </div>
                            <div>{product.descricao}</div>
                        </div>
                        <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                            <Botao><BsArrowRight fill="white" size={24}/></Botao>
                        </div>
                    </div>
                </div>
            </div>
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
import Botao from "@components/Botao"
import Frame from "@components/Frame"
import Titulo from "@components/Titulo"
import BadgeBeneficio from "@components/BadgeBeneficio"
import { RiCloseFill } from 'react-icons/ri'
import { useState } from "react"
import styled from "styled-components"
import styles from './ModalDepartamentoAdicionarBeneficio.module.css'
import http from '@http';
import { useEffect } from "react"
import { Overlay, DialogEstilizado } from '@components/Modal/styles';

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

function ModalDepartamentoAdicionarBeneficioSelecionarValor({ opened = false, aoClicar, aoFechar }) {

    const [beneficios, setBeneficios] = useState([])

    useEffect(() => {
        if(beneficios && beneficios.length === 0)
        {
            // http.get('api/benefit/index')
            //     .then((response) => {
            //         if(response.success)
            //         {
            //             setBeneficios(response.data)
            //         }
            //     })
            //     .catch(erro => {
            //         console.error(erro)
            //     })  
        }
    }, [beneficios])

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
                            <h6>Escolha uma opção de benefício:</h6>
                        </Titulo>
                    </Frame>
                    <div className={styles.beneficios}>
                        {beneficios.map((benefit, index) => {
                            return (
                                <BadgeBeneficio layout="grid" key={benefit.public_id} nomeBeneficio={benefit.name}/>
                            )
                        })}
                    </div>
                </DialogEstilizado>
            </Overlay>}
        </>
    )
}

export default ModalDepartamentoAdicionarBeneficioSelecionarValor
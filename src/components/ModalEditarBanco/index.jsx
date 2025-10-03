import Botao from "@components/Botao"
import Frame from "@components/Frame"
import CampoTexto from "@components/CampoTexto"
import Titulo from "@components/Titulo"
import { RiCloseFill } from 'react-icons/ri'
import { useEffect, useState } from "react"
import styled from "styled-components"
import { Overlay, DialogEstilizado } from '@components/Modal/styles';
import { ArmazenadorToken } from "@utils"

const Col12 = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 16px;
    padding: 16px;
    width: 100%;
`;

const Col6 = styled.div`
    flex: 1 1 calc(50% - 8px);
    min-width: 250px;
`;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    width: 100%;
`;

function ModalEditarBanco({ opened = false, banco, aoFechar, aoSalvar }) {
    const [classError, setClassError] = useState([]);
    const [idOrigem, setIdOrigem] = useState('');
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');

    useEffect(() => {
        if (banco && opened) {
            setIdOrigem(banco.id_origem || '');
            setNome(banco.nome || '');
            setDescricao(banco.descricao || '');
        }
    }, [banco, opened]);

    const validarESalvar = () => {
        let errors = [];
        if (!idOrigem.trim()) errors.push('id_origem');
        if (!nome.trim()) errors.push('nome');
        
        if (errors.length > 0) {
            setClassError(errors);
            return;
        }

        const dadosParaAPI = {
            id_origem: idOrigem.trim(),
            nome: nome.trim(),
            descricao: descricao.trim() || null
        };
        
        aoSalvar(dadosParaAPI, banco.id);
    };

    return (
        <>
            {opened && (
                <Overlay>
                    <DialogEstilizado open={opened}>
                        <Frame>
                            <Titulo>
                                <button className="close" onClick={aoFechar}>
                                    <RiCloseFill size={20} className="fechar" />  
                                </button>
                                <h6>Editar Calendário</h6>
                            </Titulo>
                        </Frame>
                        
                        <Wrapper>
                            <Col12>
                                <Col6>
                                    <CampoTexto 
                                        camposVazios={classError.includes('id_origem') ? ['id_origem'] : []}
                                        name="id_origem" 
                                        valor={idOrigem} 
                                        setValor={setIdOrigem} 
                                        type="text" 
                                        label="ID Origem*" 
                                        placeholder="Digite o ID de origem" 
                                        maxCaracteres={50}
                                    />
                                </Col6>
                                
                                <Col6>
                                    <CampoTexto 
                                        camposVazios={classError.includes('nome') ? ['nome'] : []}
                                        name="nome" 
                                        valor={nome} 
                                        setValor={setNome} 
                                        type="text" 
                                        label="Nome*" 
                                        placeholder="Digite o nome do calendário" 
                                        maxCaracteres={100}
                                    />
                                </Col6>
                            </Col12>

                            <Col12>
                                <Col6>
                                    <CampoTexto 
                                        name="descricao" 
                                        valor={descricao} 
                                        setValor={setDescricao} 
                                        type="text" 
                                        label="Descrição" 
                                        placeholder="Digite uma descrição (opcional)" 
                                        maxCaracteres={500}
                                    />
                                </Col6>
                            </Col12>

                            <Botao
                                aoClicar={validarESalvar} 
                                estilo="vermilion" 
                                size="medium" 
                                filled
                            >
                                Salvar Alterações
                            </Botao>
                        </Wrapper>
                    </DialogEstilizado>
                </Overlay>
            )}
        </>
    );
}

export default ModalEditarBanco;
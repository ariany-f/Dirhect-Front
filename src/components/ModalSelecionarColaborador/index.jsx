import Botao from "@components/Botao"
import Frame from "@components/Frame"
import CampoTexto from "@components/CampoTexto"
import CheckboxContainer from '@components/CheckboxContainer'
import Titulo from "@components/Titulo"
import SubTitulo from "@components/SubTitulo"
import { RiCloseFill } from 'react-icons/ri'
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"
import styles from './ModalSelecionarColaborador.module.css'
import { useDepartamentoContext } from "@contexts/Departamento"
import { Overlay, DialogEstilizado } from '@components/Modal/styles'
import http from '@http'
import Loading from '@components/Loading'

const Col12 = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
`

const Col6 = styled.div`
    padding: 20px;
    flex: 1 1 50%;
`

const Col4 = styled.div`
    padding: 20px;
    flex: 1 1 25%;
`

const Col4Centered = styled.div`
    display: flex;
    flex: 1 1 25%;
    justify-content: center;
    align-items: center;
`

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

const ListaColaboradores = styled.div`
    max-height: 400px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 16px;
    padding-right: 8px;

    &::-webkit-scrollbar {
        width: 6px;
    }
    &::-webkit-scrollbar-thumb {
        background: #ccc;
        border-radius: 3px;
    }
`;

const ItemColaborador = styled.div`
    padding: 12px 16px;
    border: 1px solid ${({ $selecionado }) => $selecionado ? 'var(--vermilion-principal)' : '#ddd'};
    background-color: ${({ $selecionado }) => $selecionado ? 'var(--vermilion-100)' : '#fff'};
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;

    &:hover {
        background-color: #f9f9f9;
        border-color: var(--vermilion-principal);
    }
`;

const NomeColaborador = styled.span`
    font-weight: 600;
    color: #333;
`;

const ChapaColaborador = styled.span`
    font-size: 12px;
    color: #777;
    margin-left: 8px;
`;

const SearchContainer = styled.div`
    position: relative;
    width: 100%;
    .p-inputgroup {
        width: 100%;
    }
`;

function ModalSelecionarColaborador({ opened = false, aoFechar, aoSelecionar }) {
    const [colaboradores, setColaboradores] = useState([]);
    const [busca, setBusca] = useState('');
    const [colaboradorSelecionado, setColaboradorSelecionado] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (opened) {
            setLoading(true);
            http.get('funcionario/?format=json')
                .then(response => {
                    setColaboradores(response);
                })
                .catch(erro => console.error("Erro ao buscar colaboradores", erro))
                .finally(() => setLoading(false));
        } else {
            setBusca('');
            setColaboradorSelecionado(null);
        }
    }, [opened]);

    const handleSelecionar = () => {
        if (colaboradorSelecionado) {
            aoSelecionar(colaboradorSelecionado);
        } else {
            alert('Por favor, selecione um colaborador.');
        }
    };

    const colaboradoresFiltrados = busca.length > 0
        ? colaboradores.filter(colab =>
            (colab.chapa && colab.chapa.toLowerCase().includes(busca.toLowerCase())) ||
            (colab.funcionario_pessoa_fisica?.nome && colab.funcionario_pessoa_fisica.nome.toLowerCase().includes(busca.toLowerCase()))
        )
        : colaboradores;

    return (
        <>
            {opened &&
                <Overlay onClick={aoFechar}>
                    <DialogEstilizado open={opened} onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
                        <Loading opened={loading} />
                        <Frame>
                            <Titulo>
                                <button className="close" onClick={aoFechar}>
                                    <RiCloseFill size={20} className="fechar" />
                                </button>
                                <h6>Selecionar Colaborador</h6>
                            </Titulo>
                        </Frame>

                        <Frame padding="12px 24px">
                            <SearchContainer>
                               <CampoTexto
                                    valor={busca}
                                    setValor={setBusca}
                                    placeholder="Buscar por nome ou chapa..."
                                />
                            </SearchContainer>
                            <ListaColaboradores>
                                {colaboradoresFiltrados.map(colab => (
                                    <ItemColaborador
                                        key={colab.id}
                                        $selecionado={colaboradorSelecionado?.id === colab.id}
                                        onClick={() => setColaboradorSelecionado(colab)}
                                    >
                                        <NomeColaborador>{colab.funcionario_pessoa_fisica?.nome}</NomeColaborador>
                                        <ChapaColaborador>Chapa: {colab.chapa}</ChapaColaborador>
                                    </ItemColaborador>
                                ))}
                            </ListaColaboradores>
                        </Frame>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 24px', borderTop: '1px solid #eee', gap: '12px' }}>
                            <Botao
                                aoClicar={aoFechar}
                                estilo="neutro"
                                size="medium"
                            >
                                Cancelar
                            </Botao>
                            <Botao
                                aoClicar={handleSelecionar}
                                estilo="vermilion"
                                size="medium"
                                filled
                                disabled={!colaboradorSelecionado}
                            >
                                Selecionar
                            </Botao>
                        </div>
                    </DialogEstilizado>
                </Overlay>
            }
        </>
    )
}

export default ModalSelecionarColaborador
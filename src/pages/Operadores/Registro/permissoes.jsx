import { useOperadorContext } from '../../../contexts/Operador';
import Botao from "@components/Botao"
import Frame from "@components/Frame"
import Texto from "@components/Texto"
import SwitchInput from '@components/SwitchInput'
import RadioButton from '@components/RadioButton'
import Titulo from "@components/Titulo"
import SubTitulo from "@components/SubTitulo"
import DottedLine from '@components/DottedLine';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import styles from './Registro.module.css'
import { useState, useEffect } from 'react';
import http from '@http';

const ContainerButton = styled.div`
    display: flex;
    width: 100%;
    padding: 20px;
    justify-content: space-between;
    & button {
        width: initial;
    }
`

const CardLine = styled.div`
    padding: 24px 0px;
    border-bottom: 1px solid var(--neutro-200);
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &:nth-child(1) {
        padding-top: 8px;
    }
    &:last-of-type {
        border-bottom: none;
        padding-bottom: 8px;
    }
`

function OperadorRegistroPermissoes () {
    const { 
        operador,
        setGroups,
        submeterOperador
    } = useOperadorContext()

    const navegar = useNavigate()
    const [checkedAll, setCheckedAll] = useState(false)
    const [selectedRole, setSelectedRole] = useState(null)
    const [grupos, setGrupos] = useState([]);

    const adicionarOperador = () => {
        if(checkedAll)
        {
            setGroups(['global'])
            operador.groups = ['global']
        }
        else
        {
            setGroups([selectedRole])
            operador.groups = [selectedRole]
        }
        submeterOperador().then(response => {
        if(response)
            {
                navegar('/operador/registro/sucesso')
            }
        })
    } 

    function handleChange(valor)
    {
        setSelectedRole(valor)
    }

    useEffect(() => {
        http.get('permissao_grupo/')
            .then(response => setGrupos(response))
            .catch(error => console.log('Erro ao buscar grupos:', error));
    }, []);

    return (
        <Frame>
            <Texto weight={500} size="12px">Nome do operador</Texto>
            <Titulo>
                <h3>{operador.first_name} {operador.last_name}</h3>
            </Titulo>
            <DottedLine />
            <Titulo>
                <h6>Permissões</h6>
                <SubTitulo>
                    Defina as permissões de uso da conta para seu operador:
                </SubTitulo>
            </Titulo>
            <div className={styles.card_dashboard}>
                <CardLine>
                    <Titulo>
                        <b>Controle total da conta</b>
                        <SubTitulo>O colaborador tem acesso total a conta.</SubTitulo>
                    </Titulo>
                    <SwitchInput checked={checkedAll} onChange={setCheckedAll} />
                </CardLine>
            </div>
            
            <div className={styles.card_dashboard}>
                
                {grupos.map(grupo => (
                    <CardLine key={grupo.id}>
                        <Titulo>
                            <b>{grupo.name}</b>
                            <SubTitulo>O colaborador tem acesso a conta.</SubTitulo>
                        </Titulo>
                        {!checkedAll &&
                            <RadioButton name="role_option" top="0" value={grupo.name} checked={selectedRole === grupo.name} onSelected={() => handleChange(grupo.name)}/>
                        }
                    </CardLine>
                ))}
                
            </div>
            <ContainerButton>
                <Botao aoClicar={() => navegar(-1)} estilo="neutro" formMethod="dialog" size="medium" filled>Voltar</Botao>
                <Botao aoClicar={adicionarOperador} estilo="vermilion" size="medium" filled>Adicionar operador</Botao>
            </ContainerButton>
        </Frame>
    )
}
export default OperadorRegistroPermissoes
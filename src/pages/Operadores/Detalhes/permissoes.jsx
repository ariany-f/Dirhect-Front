import { Skeleton } from 'primereact/skeleton'
import SwitchInput from '@components/SwitchInput'
import Titulo from '@components/Titulo'
import Texto from '@components/Texto'
import styles from './Detalhes.module.css'
import styled from "styled-components"
import http from '@http'
import { useEffect, useState } from 'react'
import { useOutletContext, useParams } from 'react-router-dom'
import { ArmazenadorToken } from "@utils";
import { useSessaoUsuarioContext } from "@contexts/SessaoUsuario";
import { useTranslation } from 'react-i18next'

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

function OperadorPermissoes() {
    const { usuario } = useSessaoUsuarioContext();
    const grupos = ArmazenadorToken.UserGroups;
    const grupoUsuario = grupos && Array.isArray(grupos)
        ? grupos.find(g => g.name === usuario.tipo)
        : null;
    const permissoes = grupoUsuario ? grupoUsuario.permissions : [];

    const { t } = useTranslation('common')

    let { id } = useParams()
    const [checkedBen, setCheckedBen] = useState(false);
    const [checkedPrem, setCheckedPrem] = useState(false);
    const [checkedClbrd, setCheckedClbrd] = useState(false);
    const [checkedDesp, setCheckedDesp] = useState(false);
    const [operador, setOperador] = useState(null)
    const context = useOutletContext()

    useEffect(() => {
        if((!operador) && context)
        {
           setOperador(context)
           http.get(`perfil_usuario/?format=json&user=${id}`)
           .then(response => {
                setPermissoes(response[0])
           })
           .catch(erro => console.log(erro))
        }
    }, [operador, context])

    function alterarPermissoes(){
        const obj = {}
        
        obj['collaborator_public_id'] = id

        obj['roles'] = {
            "status": false,
            "all": (checkedBen && checkedClbrd && checkedDesp && checkedPrem),
            "read": true,
            "financial": false,
            "human_Resources": false
        }


        http.put(`api/dashboard/operator/${id}`, obj)
        .then(response => {
            if (response.status === 'success') 
            {
                setOperador(response.operator)
                setCheckedBen(response.operator.roles.all || response.operator.roles.financial)
                setCheckedPrem(response.operator.roles.all || response.operator.roles.financial)
                setCheckedClbrd(response.operator.roles.all || response.operator.roles.human_Resources)
                setCheckedDesp(response.operator.roles.all || response.operator.roles.financial)
            }
        })
        .catch(erro => console.log(erro))
    }

    return (
        <>
            <Titulo>
                <h6>Permissões de uso</h6>
            </Titulo>
            <div className={styles.card_dashboard}>
                {permissoes.length === 0 && (
                    <Texto>Nenhuma permissão encontrada para este usuário.</Texto>
                )}
                {permissoes.map(perm => {
                    const PREFIXES = ['Can view', 'Can change', 'Can add', 'Can delete'];
                    const prefix = PREFIXES.find(p => perm.name.startsWith(p));
                    let resto = '';
                    let prefixTraduzido = perm.name;
                    if (prefix) {
                        resto = perm.name.replace(prefix, '').trim();
                        prefixTraduzido = t(prefix);
                    }
                    return (
                        <CardLine key={perm.id}>
                            <Texto weight="800">
                                {prefix ? (
                                    <>
                                        {prefixTraduzido}
                                        {resto && (
                                            <span style={{ textTransform: 'capitalize', display: 'inline' }}>&nbsp;{resto}</span>
                                        )}
                                    </>
                                ) : perm.name}
                            </Texto>
                        </CardLine>
                    );
                })}
            </div>
        </>
    )
}

export default OperadorPermissoes
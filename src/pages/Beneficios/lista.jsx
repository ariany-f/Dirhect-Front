import http from '@http'
import { useEffect, useRef, useState } from "react"
import BotaoGrupo from '@components/BotaoGrupo'
import BotaoSemBorda from '@components/BotaoSemBorda'
import Botao from '@components/Botao'
import Loading from '@components/Loading'
import Container from '@components/Container'
import { GrAddCircle } from 'react-icons/gr'
import styles from './Beneficios.module.css'
import { FaMapPin } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import DataTableBeneficios from '@components/DataTableBeneficios'
import styled from 'styled-components'
import ModalBeneficios from '../../components/ModalBeneficios'
import { Toast } from 'primereact/toast'

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`

function Beneficios() {

    const [loading, setLoading] = useState(false)
    const [beneficios, setBeneficios] = useState([])
    const [modalOpened, setModalOpened] = useState(false)
    const toast = useRef(null);

    useEffect(() => {
        if(beneficios.length === 0)
        {
            setLoading(true)
            http.get('beneficio/?format=json')
                .then(response => {
                   setBeneficios(response)
                })
                .catch(erro => {
                })
                .finally(() => {
                    setLoading(false)
                })
        }
    }, [])

    const adicionarBeneficio = (nome, tipo, descricao) => {
        if(nome == '' || tipo == '' || descricao == '')
        {
            toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Preencha todos os campos', life: 3000 });
            return;
        }
        const data = {};
        data.nome = nome;
        data.tipo = tipo;
        data.descricao = descricao;

        http.post('beneficio/', data)
            .then(response => {
                if(response.id)
                {
                    beneficios.push(response)
                    setModalOpened(false)
                }
            })
            .catch(erro => {
                
            })
            .finally(function() {
                
            })
    }

    return (
        <>
            <ConteudoFrame>
                <Toast ref={toast} />
                <Loading opened={loading} />
                <BotaoGrupo align="space-between">
                    <BotaoSemBorda color="var(--primaria)">
                        <FaMapPin/><Link to={'/beneficio/onde-usar'} className={styles.link}>Onde usar</Link>
                    </BotaoSemBorda>
                    <Botao aoClicar={() => setModalOpened(true)} estilo="vermilion" size="small" tab><GrAddCircle className={styles.icon}/> Adicionar Benefício</Botao>
                </BotaoGrupo>
                <Container>
                    <DataTableBeneficios beneficios={beneficios} />
                </Container>
                <ModalBeneficios aoSalvar={adicionarBeneficio} aoFechar={() => setModalOpened(false)} opened={modalOpened} />
            </ConteudoFrame>
        </>
    )
}

export default Beneficios
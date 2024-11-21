import Frame from '@components/Frame'
import Titulo from '@components/Titulo'
import SubTitulo from '@components/SubTitulo'
import Texto from '@components/Texto'
import styles from './SolicitarSegundaVia.module.css'
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import { Link, useParams } from 'react-router-dom'

function CartaoSolicitarSegundaVia() {

    const { id } = useParams()

    return (
        <Frame gap="32px">
            <Titulo>
                <h6>Solicitar 2º via do cartão</h6>
                <SubTitulo>
                    Por qual motivo você quer solicitar a 2ª via do seu cartão:
                </SubTitulo>
            </Titulo>
            <div className={styles.wrapper_cards}>
                <div className={styles.card_dashboard}>
                    <Frame estilo="spaced">
                        <div className={styles.empilhado}>
                            <Texto size="14px" weight={700}>
                                Cartão foi roubado ou perdido
                            </Texto>
                        </div>
                        <Link to={`/cartao/solicitar-segunda-via/${id}/endereco`}>
                            <MdOutlineKeyboardArrowRight size={24} className={styles.icon}/>
                        </Link>
                    </Frame>
                </div>
                <div className={styles.card_dashboard}>
                    <Frame estilo="spaced">
                        <div className={styles.empilhado}>
                            <Texto size="14px" weight={700}>
                                Cartão está danificado
                            </Texto>
                        </div>
                        <Link to={`/cartao/solicitar-segunda-via/${id}/endereco`}>
                            <MdOutlineKeyboardArrowRight size={24} className={styles.icon} />
                        </Link>
                    </Frame>
                </div>
            </div>
        </Frame>
    )
}
export default CartaoSolicitarSegundaVia
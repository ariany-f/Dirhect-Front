import Frame from '@components/Frame'
import Titulo from '@components/Titulo'
import Texto from '@components/Texto'
import styles from './Extrato.module.css'
import { FaBarcode, FaCreditCard, FaPix } from 'react-icons/fa6'
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'

function AdicionarSaldo() {
    return (
        <Frame gap="32px">
            <Titulo>
                <h6>Escolha uma forma de adicionar seu saldo</h6>
            </Titulo>
            <div className={styles.wrapper_cards}>
                    <div className={styles.card_dashboard}>
                        <Frame estilo="spaced">
                            <div className={styles.empilhado}>
                                <Texto weight={700}>
                                    <FaPix size={20} />&nbsp;Pix
                                </Texto>
                                <p>
                                    A confirmação de pagamento demora em média alguns segundos.
                                </p>
                            </div>
                            <MdOutlineKeyboardArrowRight />
                        </Frame>
                        <Frame estilo="spaced">
                            <div className={styles.empilhado}>
                                <Texto weight={700}>
                                    <FaBarcode size={20} />&nbsp;Boleto Bancário
                                </Texto>
                                <p>
                                    A confirmação de pagamento demora em média 3 dias úteis.
                                </p>
                            </div>
                            <MdOutlineKeyboardArrowRight />
                        </Frame>
                        <Frame estilo="spaced">
                            <div className={styles.empilhado}>
                                <Texto weight={700}>
                                    <FaCreditCard size={20} />&nbsp;Cartão de Crédito
                                </Texto>
                                <p>
                                    A confirmação de pagamento demora em média alguns minutos.
                                </p>
                            </div>
                            <MdOutlineKeyboardArrowRight />
                        </Frame>
                    </div>
                </div>
        </Frame>
    )
}
export default AdicionarSaldo
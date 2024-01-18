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
                            <FaPix size={20} />
                            <div className={styles.empilhado}>
                                <Texto weight={700}>
                                    Pix
                                </Texto>
                                <Texto weight={500}>
                                    A confirmação de pagamento demora em média alguns segundos.
                                </Texto>
                            </div>
                            <MdOutlineKeyboardArrowRight />
                        </Frame>
                        <Frame estilo="spaced">
                            <FaBarcode size={20} />
                            <div className={styles.empilhado}>
                                <Texto weight={700}>
                                    Boleto Bancário
                                </Texto>
                                <Texto weight={500}>
                                    A confirmação de pagamento demora em média 3 dias úteis.
                                </Texto>
                            </div>
                            <MdOutlineKeyboardArrowRight />
                        </Frame>
                        <Frame estilo="spaced">
                            <FaCreditCard size={20} />
                            <div className={styles.empilhado}>
                                <Texto weight={700}>
                                    Cartão de Crédito
                                </Texto>
                                <Texto weight={500}>
                                    A confirmação de pagamento demora em média alguns minutos.
                                </Texto>
                            </div>
                            <MdOutlineKeyboardArrowRight />
                        </Frame>
                    </div>
                </div>
        </Frame>
    )
}
export default AdicionarSaldo
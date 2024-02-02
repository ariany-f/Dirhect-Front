import Frame from '@components/Frame'
import Titulo from '@components/Titulo'
import Texto from '@components/Texto'
import styles from './Extrato.module.css'
import { FaBarcode, FaCreditCard, FaPix } from 'react-icons/fa6'
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import { useState } from 'react'
import ModalAdicionarSaldoBoletoBancario from '../../components/ModalAdicionarSaldo'
import ModalAdicionarSaldoPix from '../../components/ModalAdicionarSaldo/pix'
import ModalAdicionarSaldoCartao from '../../components/ModalAdicionarSaldo/cartao'
import { Link } from 'react-router-dom'
import http from '@http'

function AdicionarSaldo() {

    const [modalBoletoOpened, setModalBoletoOpened] = useState(false)
    const [modalPixOpened, setModalPixOpened] = useState(false)
    const [modalCartaoOpened, setModalCartaoOpened] = useState(false)

    function submitAdicionarSaldo(valor, card = null) {
        
        const obj = {}
        obj['transaction_type_enum'] = 16
        if(modalBoletoOpened)
        {
            obj['payment_type_enum'] = 2
        }
        if(modalPixOpened)
        {
            obj['payment_type_enum'] = 1
        }
        if(modalCartaoOpened)
        {
            obj['payment_type_enum'] = 3
        }
        obj['amount'] = valor

        if(card)
        {
            obj['card'] = {
                "installments": 1,
                "installment_amount": valor,
                "number": card.number,
                "validate": card.expiry,
                "cvv": card.cvc,
                "holder": card.name
            }
        }

        http.post('api/dashboard/balance', obj)
        .then((response) => {
            console.log(response)
        })
        .catch(erro => {
            console.error(erro)
        })
    }

    return (
        <Frame gap="32px">
            <Titulo>
                <h6>Escolha uma forma de adicionar seu saldo</h6>
            </Titulo>
            <div className={styles.wrapper_cards}>
                    <div className={styles.card_dashboard}>
                        <Link onClick={() => setModalPixOpened(true)}>
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
                        </Link>
                        <Link onClick={() => setModalBoletoOpened(true)}>
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
                        </Link>
                        <Link onClick={() => setModalCartaoOpened(true)}>
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
                        </Link>
                    </div>
                </div>
                <ModalAdicionarSaldoBoletoBancario aoClicar={submitAdicionarSaldo} opened={modalBoletoOpened} aoFechar={() => setModalBoletoOpened(false)} />
                <ModalAdicionarSaldoPix aoClicar={submitAdicionarSaldo} opened={modalPixOpened} aoFechar={() => setModalPixOpened(false)} />
                <ModalAdicionarSaldoCartao aoClicar={submitAdicionarSaldo} opened={modalCartaoOpened} aoFechar={() => setModalCartaoOpened(false)} />
        </Frame>
    )
}
export default AdicionarSaldo
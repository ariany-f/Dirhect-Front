import imagem from './cartoes-plataforma.png'
import styles from './Banner.module.css'
import logo from '/imagens/logo.png'
import { RiShoppingCartFill, RiBusFill, RiTrophyFill, RiOpenArmFill } from 'react-icons/ri'
import { PiForkKnifeFill, PiFirstAidKitFill } from 'react-icons/pi'
import { BiSolidBook } from 'react-icons/bi'
import { CgPill } from 'react-icons/cg'
import { MdComputer } from 'react-icons/md'

function Banner() {
    return (
        <div className={styles.container}>
            <img className={styles.banner} src={imagem} alt="Imagem Cartões"/>
            <img className={styles.logo} src={logo} alt="Logo"/>
            <div className={styles.bottomBanner}>
                <p className={styles.texto}>
                    Múltiplos benefícios reunidos em um só cartão.
                </p>
                <ul className={styles.ul}>
                    <li><RiShoppingCartFill size={24} /></li>
                    <li><PiForkKnifeFill size={24} /></li>
                    <li><PiFirstAidKitFill size={24} /></li>
                    <li><BiSolidBook size={24} /></li>
                    <li><MdComputer size={24} /></li>
                    <li><CgPill size={24} /></li>
                    <li><RiOpenArmFill size={24} /></li>
                    <li><RiBusFill size={24} /></li>
                    <li><RiTrophyFill size={24} /></li>
                </ul>
            </div>
        </div>
    )
}

export default Banner
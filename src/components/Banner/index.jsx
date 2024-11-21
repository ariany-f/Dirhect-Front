import imagem from './homem-com-cartao.png'
import styles from './Banner.module.css'
import logo from '/imagens/logo.png'
import { RiShoppingCartFill, RiBusFill, RiTrophyFill, RiOpenArmFill } from 'react-icons/ri'
import { PiForkKnifeFill, PiFirstAidKitFill } from 'react-icons/pi'
import { BiSolidBook } from 'react-icons/bi'
import { CgPill } from 'react-icons/cg'
import { MdComputer } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { Skeleton } from 'primereact/skeleton'
import { useEffect, useRef, useState } from 'react'

function Banner() {

    const [image, setImage] = useState(false)
    const [logotipo, setLogotipo] = useState(false)
    const ref = useRef(null)
    const refLogo = useRef(null)

    useEffect(() => {
        if(imagem){
            setImage(true)
        }
        if(logo){
            setLogotipo(true)
        }
    }, [imagem, logo])

    return (
        <div className={styles.container}>
            {image ?
                <img ref={ref} className={styles.banner} src={imagem} alt="Imagem Cartões"/>
                : <Skeleton variant="rectangular" width={600} height={980} />
            }
            <Link to="/login" className={styles.logo} >
                {logotipo ?
                    <img src={logo} ref={refLogo} alt="Logo"/>
                    : ''
                }
            </Link>
            <div className={styles.bottomBanner}>
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
import Link, { LinkProps }from 'next/link'
import s from './style.module.scss'
import { ReactNode } from 'react'
interface CustomLinkProps extends LinkProps {
    children : ReactNode
}
const LinkCustom = ( {children, ...props} : CustomLinkProps) => {
  return (
    <Link {...props} className={s.link}>{children}</Link>
  )
}

export default LinkCustom
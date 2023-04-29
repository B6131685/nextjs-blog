import React, { forwardRef, useRef, Ref}  from 'react'
import s from './style.module.scss'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant: 'green' | 'red' | 'blue' 
    children?: React.ReactNode;
}

// eslint-disable-next-line react/display-name
const CButton = forwardRef((props:ButtonProps, ref: Ref<HTMLButtonElement>) => {
    const {className, variant, children, ...rest} = props
    let Classs = `${s.base} ${s[variant]} ${className} `
    return <button className={Classs}  {...rest} ref={ref}>{children}</button>
})

export default CButton
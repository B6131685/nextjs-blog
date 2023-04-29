import s from './style.module.scss'

interface Props extends React.ButtonHTMLAttributes<HTMLLabelElement> {
    message: string;
}

const ValidateLabel = ( { message }: Props) => {
  return (
    <label className={s.style}>{message}</label>
  )
}

export default ValidateLabel
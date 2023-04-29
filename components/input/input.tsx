import React, { forwardRef, InputHTMLAttributes } from "react";
import s from "./style.module.scss";
interface Props extends InputHTMLAttributes<HTMLInputElement> {};

const InputText = forwardRef<HTMLInputElement, Props>(function Input(
  props,
  ref
) {
  return <input className={s.style} type="text" {...props} ref={ref} />;
});

export default InputText;

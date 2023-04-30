import React, { ButtonHTMLAttributes } from "react";
import s from "./style.module.scss";
import { IoMdCloseCircle } from "react-icons/io";
interface ITageLabel extends ButtonHTMLAttributes<HTMLSpanElement> {
  label: string;
  closeMark?: () => void;
  active?: boolean;
  pointer?: boolean;
}

const TagLabel = ({
  closeMark,
  label,
  active = false,
  pointer = false,
  ...props
}: ITageLabel) => {
  return (
    <span
      className={`
        ${s.tageLabel}
        ${active ? s.active : ''}
        ${pointer ? s.pointer : ''}`
      }
      {...props}
    >
      {label}{" "}
      {closeMark ? (
        <IoMdCloseCircle className={s.icon} onClick={closeMark} />
      ) : null}
    </span>
  );
};

export default TagLabel;

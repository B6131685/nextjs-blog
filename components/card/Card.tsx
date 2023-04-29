import React from "react";
import s from "./style.module.scss";
import { Tag } from "@/services/blog/interface";
import TagLabel from "../tagLabel/tagLabel";
import Skeleton from "react-loading-skeleton";
type Props = {
  title: string;
  writer: string;
  tags: Tag[];
};

const Card = ({ tags = [], title, writer }: Props) => {
  return (
    <div className={s.container}>
      <div>
        <h1>{title}</h1>
      </div>
      <div>{writer}</div>
      <div className={s.tagSection}>
        {tags.map((item: Tag) => {
          return <TagLabel label={item.tageLabel} key={item._id} />;
        })}
      </div>
    </div>
  );
};

const Loading = () => {
  return (
    <div className={s.container}>
      <div>
        <Skeleton
          width={"100%"}
          height="30px"
          count={1}
          style={{ marginBottom: "15px" }}
        />
      </div>
      <div>
        <Skeleton width={"200px"} height="100%" count={1} />
      </div>
      <div className={s.tagSection}>
        <Skeleton width={"30px"} height={"30px"} circle={true} />
        <Skeleton width={"30px"} height={"30px"} circle={true} />
        <Skeleton width={"30px"} height={"30px"} circle={true} />
      </div>
    </div>
  );
};

Card.Loading = Loading
export default Card;

"use client";
import React from 'react'
import NewPost from '../../new/page'
import { usePathname } from 'next/navigation';
import { useGetBlogById } from '@/services/blog';

type Props = {}

const Editblog = (props: Props) => {
  const path = usePathname();
  const { data: BlogData, isSuccess } = useGetBlogById(path!.split("/")[2])
  return (
    <NewPost blogData={BlogData}/>
  )
}

export default Editblog
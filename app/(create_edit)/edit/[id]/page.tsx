"use client";
import React from 'react'
import NewPost from '../../new/page'
import { usePathname } from 'next/navigation';
import { useGetBlogById } from '@/services/blog';
import Editor from '@/views/editor';

const Editblog = () => {
  const path = usePathname();
  const { data: BlogData } = useGetBlogById(path!.split("/")[2])
  return (
    <Editor blogData={BlogData}/>
  )
}

export default Editblog
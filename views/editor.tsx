"use client";
import { useForm } from "react-hook-form";
import BlogLogo from "@/components/BlogLogo";
import Link from "next/link";
import s from "./style.module.scss";
import dynamic from "next/dynamic";
// import SunEditor from "suneditor-react";
const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});
import SunEditorCore from "suneditor/src/lib/core";
import { ChangeEvent, useRef, useState, KeyboardEvent, useEffect } from "react";
import CButton from "@/components/buttons/button";

import InputText from "@/components/input/input";
import { useSession } from "next-auth/react";
import TagLabel from "@/components/tagLabel/tagLabel";
import { useCreateBlog, useUpdateBlogByID } from "@/services/blog";
import Loading from "@/components/loading/Loading";
import {
  useIsFetching,
  useIsMutating,
  useQueryClient,
} from "@tanstack/react-query";
import ValidateLabel from "@/components/validateLabel/ValidateLabel";
import { ISingleblog } from "@/services/blog/interface";
import axios from "@/configs/axios/axios_config";
import router from "next/router";

interface Props {
  blogData?: ISingleblog | undefined;
}
const Editor = ({ blogData = undefined }: Props) => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const [title, setTitle] = useState<string>("");
  const [tempTag, setTempTage] = useState<string>("");
  const [tages, setTags] = useState<string[]>([]);

  const [waiteSaveImg, setWaiteSaveImg] = useState<boolean>(false);
  const { isLoading: isLoadingCreateBlog, mutate: createBlog } =
    useCreateBlog();
  const { isLoading: isLoadingUpdateBlog, mutate: updateBlog } =
    useUpdateBlogByID();
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();

  const btnSubmit = useRef<HTMLInputElement>(null);
  const editor = useRef<SunEditorCore>();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm();
  const getSunEditorInstance = (sunEditor: SunEditorCore) => {
    editor.current = sunEditor;
  };

  const submit = async () => {
    setWaiteSaveImg(true);
    const doc:Document = new DOMParser().parseFromString(
      editor.current?.getContents(true) as string,
      "text/html"
    )

    for (
      let i = 0;
      i < Array.from(doc.body.getElementsByTagName("img")).length;
      i++
    ) {
      let img = doc.body.getElementsByTagName("img")[i];
      //sun editor ทดรูปภาพเป็น base64
      let base64EncodedText = (img.getAttribute("src") as string).split(",")[1];
      if (base64EncodedText && btoa(atob(base64EncodedText)) === base64EncodedText) {
        const res = await axios.post("/hello", {
          base64: base64EncodedText,
        });

          (img.style.height = "auto"),
          (img.style.width = "100%"),
          (img.style.maxWidth = "100%"),
          img.setAttribute("src", res.data.publicURL);
        img.parentElement && (img.parentElement.style.textAlign = "center");
      }
    }

    for (let index = 0; index < Array.from(doc.body.getElementsByClassName("se-image-container")).length; index++) {
      let containerDIV = doc.body.getElementsByClassName("se-image-container")[index] as HTMLElement;
      containerDIV.setAttribute("contentEditable","true")
      containerDIV.style.maxWidth = "100%";
      containerDIV.setAttribute("suppressContentEditableWarning","true")
    }

    setWaiteSaveImg(false);

    if (session?.user?.email && !blogData) {
      createBlog(
        {
          email: session?.user?.email,
          title: title,
          content: doc.body.innerHTML,
          tags: tages,
        },
        {
          onSuccess(data: { acknowledged: boolean; insertedId: string }) {
            queryClient.invalidateQueries({ queryKey: ["tags"] });
            router.push(`/blogs/${data.insertedId}`);
          },
        }
      );
    }else{
      if(blogData){

        updateBlog({
          id: blogData?._id,
          data: {
            title,
            tage:tages,
            content: doc.body.innerHTML
          }
        },{
          onSuccess() {
            queryClient.invalidateQueries({ queryKey: ["tags"] });
            router.push(`/blogs/${blogData?._id}`);
          },
        })
      }else{
        alert(`blog is: ${blogData}`)
      }
    }
  };

  function handleTitle(e: ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value);
  }

  function handleTempTage(e: ChangeEvent<HTMLInputElement>) {
    setTempTage(e.target.value);
  }

  function handleEnterTempTage(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && tempTag !== "") {
      setTags((prev) => [...prev, tempTag]);
      setTempTage("");
    }
  }

  function DeleteTage(index: number) {
    queryClient.invalidateQueries({ queryKey: ["tags"] });
    setTags((prev) => [...prev.filter((_, i) => index !== i)]);
  }

  useEffect(() => {
    if (blogData) {
      setTitle(blogData.title);
      setTags([
        ...blogData.tags.map((item) => {
          return item.tageLabel;
        }),
      ]);
      editor.current?.setContents(blogData.content);
    }
  }, []);

  return (
    <div className={s.container}>
      {!!isFetching || !!isMutating || waiteSaveImg ? <Loading /> : null}

      <aside className={s.Navbar}>
        <div>
          <Link href="/blogs">
            <BlogLogo />
          </Link>
        </div>
        <div>
          <CButton variant="blue" onClick={() => btnSubmit.current?.click()}>
            Publish
          </CButton>
        </div>
      </aside>
      <div className={s.formCard}>
        <div className={s.title}>
          {/* <form onSubmit={handleSubmit(submit)}> */}
          <form>
            <span>Title : </span>
            <InputText
              {...register("title", {
                required: { value: true, message: "กรุณากรอกชื่อเรื่อง" },
              })}
              value={title}
              onChange={handleTitle}
            />
            {errors.title ? (
              <ValidateLabel message={errors.title?.message as string} />
            ) : null}
            <input type="submit" style={{ display: "none" }} ref={btnSubmit} />
          </form>
        </div>
        <div className={s.title}>
          <span>Tage : </span>
          {tages.map((item, index) => (
            <TagLabel
              key={index}
              label={item}
              closeMark={() => {
                DeleteTage(index);
              }}
            />
          ))}
          <InputText
            value={tempTag}
            onChange={handleTempTage}
            onKeyDown={handleEnterTempTage}
          />
        </div>
      </div>
      <div className={s.editor_container}>
        {<SunEditor /> ? (
          <SunEditor
            getSunEditorInstance={getSunEditorInstance}
            placeholder="Write Text ..."
            setOptions={{
              minHeight: "500px",
              height: "auto",
              defaultStyle: "font-size: 20px ",
              imageAlignShow: false,
              imageUploadSizeLimit: 16000000,
              imageHeight: "auto",
              imageWidth: "40%",
              fontSize: [
                8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72,
              ],
              buttonList: [
                ["undo", "redo"],
                [
                  "bold",
                  "italic",
                  "underline",
                  "strike",
                  "fontSize",
                  "fontColor",
                  "hiliteColor",
                  "outdent",
                  "indent",
                  "list",
                  "removeFormat",
                ],
                ["image"],
                ["showBlocks", "codeView"],
              ],
            }}
          />
        ) : null}
      </div>
    </div>
  );
};

export default Editor;

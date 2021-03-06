import { useContext, useState } from "react";
import styles from "../styles/upload.module.css";
import { useRef } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faPlusCircle,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { totalContext } from "../pages/_app";
import homestyles from "../styles/home.module.css";
import { uploadContext } from "../pages/api/upload";
import axios from "axios";
import { useRecaptcha } from "./recaptcha_client";

type inputArray = {
  val: string | { file: File | null; alt: string };
  key: number;
}[];

function InputType({
  index,
  inputs,
  setInputs,
}: {
  index: number;
  inputs: inputArray;
  setInputs: (inputs: inputArray) => void;
}) {
  const input = inputs[index];
  return (
    <div className={styles.input_container}>
      {typeof input.val === "string" ? (
        <TextareaAutosize
          value={input.val}
          placeholder="Enter a description..."
          className={styles.textarea}
          onInput={(e) => {
            setInputs(
              inputs.map((input, i) =>
                i === index
                  ? {
                      val: (e.target as HTMLTextAreaElement).value,
                      key: input.key,
                    }
                  : input
              )
            );
          }}
          onKeyDown={function (e) {
            const target = e.target as HTMLTextAreaElement;
            if (e.key == "Tab") {
              e.preventDefault();
              const start = target.selectionStart;
              const end = target.selectionEnd;

              // set textarea value to: text before caret + tab + text after caret
              target.value =
                target.value.substring(0, start) +
                "\t" +
                target.value.substring(end);

              // put caret at right position again
              target.selectionStart = target.selectionEnd = start + 1;
            }
          }}
          key={index}
        />
      ) : (
        <UploadFile
          defaultfile={input.val}
          key={index}
          onchange={(file) => {
            setInputs(
              inputs.map((input, i) =>
                i === index
                  ? {
                      val: file,
                      key: input.key,
                    }
                  : input
              )
            );
          }}
        ></UploadFile>
      )}
      <button
        onClick={() => {
          setInputs(inputs.filter((_, i) => i !== index));
        }}
        className={styles.delete_button}
      >
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </div>
  );
}

function UploadFile({
  onchange,
  defaultfile,
}: {
  onchange: (file: { file: File | null; alt: string }) => void;
  defaultfile: {
    file: File | null;
    alt: string;
  };
}) {
  console.log(File);
  const [file, setFile] = useState<{ file: File; objsrc: string } | null>(
    defaultfile.file
      ? {
          file: defaultfile.file,
          objsrc: URL.createObjectURL(defaultfile.file),
        }
      : null
  );
  const fileref = useRef<HTMLInputElement>(null);
  return (
    <>
      <input
        type="file"
        onChange={(e) => {
          setFile(
            e.target.files && e.target.files.length > 0
              ? {
                  file: e.target.files[0],
                  objsrc: URL.createObjectURL(e.target.files[0]),
                }
              : null
          );
          onchange({
            file: e.target.files ? e.target.files?.[0] : null,
            alt: "",
          });
        }}
        style={{
          display: "none",
        }}
        ref={fileref}
      />
      <div className={styles.file_container}>
        {file ? (
          <div
            onClick={() => {
              fileref.current?.click();
            }}
          >
            Change File
          </div>
        ) : (
          <></>
        )}
        {file ? (
          file.file.type.includes("image") ? (
            <img
              src={file.objsrc}
              alt={defaultfile.alt}
              className={styles.file}
            />
          ) : file.file.type.includes("video") ? (
            <video src={file.objsrc} controls className={styles.file} />
          ) : file.file.type.includes("audio") ? (
            <audio src={file.objsrc} controls className={styles.file} />
          ) : (
            <p>Downloadable File</p>
          )
        ) : (
          <span
            onClick={() => {
              fileref.current?.click();
            }}
          >
              <FontAwesomeIcon style={{
              width: '1rem'
            }} icon={faPlusCircle} /> Add File
          </span>
        )}
        {file &&
        !file.file.type.includes("video") &&
        !file.file.type.includes("audio") ? (
          <input
            type="text"
            placeholder="a name or description... used for alt tag in image, or title for downloadable files (optional)"
            className={styles.alt_input}
            onInput={(e) => {
              onchange({
                file: file.file,
                alt: (e.target as HTMLInputElement).value,
              });
            }}
              value={defaultfile.alt}
          />
        ) : (
          <></>
        )}
      </div>
    </>
  );
}

function Upload() {
  const [title, setTitle] = useState("");
  const keyref = useRef(1);
  const [inputs, setInputs] = useState<inputArray>([]);
  const [error, seterror] = useState("");
  const [uploading, setUploading] = useState(false);
  const maketoken = useRecaptcha();
  const { noAnimation, CurrentImportance, setProgress } =
    useContext(totalContext);
  return (
    <div
      className={styles.outer_container}
      style={{
        pointerEvents: uploading ? "none" : undefined,
        opacity: uploading ? 0.5 : undefined,
      }}
    >
      <div className={styles.container}>
        <h1 className={homestyles.title}>Upload Post</h1>
        <TextareaAutosize
          value={title}
          className={styles.title}
          placeholder="Enter a title..."
          onInput={(e) => {
            setTitle((e.target as HTMLInputElement).value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
            }
          }}
        />
        {inputs.map((input, index) => (
          <InputType
            inputs={inputs}
            setInputs={setInputs}
            index={index}
            key={input.key}
          ></InputType>
        ))}
        <div className={styles.add_container}>
          <button
            className={styles.add_button}
            onClick={() => {
              setInputs([...inputs, { val: "", key: keyref.current++ }]);
            }}
          >
            Add Description
          </button>
          <div className={styles.add_spacer} />
          <button
            className={styles.add_button}
            onClick={() => {
              setInputs([
                ...inputs,
                {
                  val: {
                    file: null,
                    alt: "",
                  },
                  key: keyref.current++,
                },
              ]);
            }}
          >
            Add File
          </button>
        </div>
        {error != "" ? <p className={styles.upload_error}>{error}</p> : <></>}
        <div className={styles.upload_container}>
          <button
            onClick={async () => {
              if (title != "") {
                if (inputs.length > 0) {
                  if (
                    inputs.filter(
                      (input) =>
                        input.val != "" &&
                        (typeof input.val === "string" ||
                          input.val.file != null)
                    ).length == inputs.length
                  ) {
                    const importance = CurrentImportance.current + 1;
                    noAnimation(importance);
                    setProgress(0, importance);
                    setUploading(true);
                    const formData = new FormData();
                    formData.append("title", title);
                    const content: uploadContext = [];
                    let fileID = 0;
                    inputs.forEach((input) => {
                      if (input.val != null && typeof input.val != "string") {
                        formData.append(`file${fileID}`, input.val.file!);
                        content.push({
                          type: "file",
                          content: fileID,
                          alt: input.val.alt,
                        });
                        fileID++;
                      } else if (typeof input.val == "string") {
                        content.push({
                          type: "text",
                          content: input.val,
                        });
                      }
                    });
                    formData.append("recaptcha", await maketoken());
                    formData.append("content", JSON.stringify(content));
                    axios
                      .post("/api/upload", formData, {
                        headers: {
                          "Content-Type": "multipart/form-data",
                        },
                        onUploadProgress: (progressEvent) => {
                          setProgress(
                            progressEvent.loaded / progressEvent.total / 1.1,
                            importance
                          );
                        },
                      })
                      .then((data) => {
                        setUploading(false);
                        setProgress(1, importance);
                        setTitle("");
                        setInputs([{ val: "", key: 0 }]);
                      })
                      .catch((err) => {
                        setUploading(false);
                        setProgress(1, importance);
                        seterror(err?.response?.data?.err || String(err));
                      });
                  } else {
                    seterror("You need to add all the descriptions and files");
                  }
                } else {
                  seterror("You need to add at least one description or file");
                }
              } else {
                seterror("Please enter a title");
              }
            }}
            className={styles.upload_button}
          >
            <FontAwesomeIcon icon={faPaperPlane}></FontAwesomeIcon>
          </button>
        </div>
      </div>
    </div>
  );
}
export default Upload;

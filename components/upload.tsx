import { useState } from "react";
import styles from "../styles/upload.module.css";
import { useRef } from "react";
import { GoogleReCaptcha } from "react-google-recaptcha-v3";
import { useEffect } from "react";
import { RefObject } from "react";
import { MutableRefObject } from "react";

function Upload() {
    const tokenref = useRef<string | null>(null)
    const inputref = useRef<(string | File | null)[]>([]);
  return (
    <div>
      <GoogleReCaptcha
        onVerify={(token) => {
          tokenref.current = token;
        }}
      />
      <h1>Make Post</h1>
      <TextandFileUpload inputRefs={inputref}></TextandFileUpload>
    </div>
  );
}

function UploadFile({ onchange }: { onchange: (file: File | null) => void }) {
  const [file, setFile] = useState<{ file: File; objsrc: string } | undefined>(
    undefined
  );
  const fileref = useRef<HTMLInputElement>(null);
  return (
    <>
      <input
        type="file"
        onChange={(e) => {
          setFile(
            e.target.files
              ? {
                  file: e.target.files[0],
                  objsrc: URL.createObjectURL(e.target.files[0]),
                }
              : undefined
          );
          onchange(e.target.files ? e.target.files?.[0] : null);
        }}
        style={{
          display: "none",
        }}
        ref={fileref}
      />
          <div onClick={() => {
            fileref.current?.click();
      }} style={
          {
              cursor: "pointer",
          }
      }>
        {file?<img src={file.objsrc} alt="file" className={styles.image} />:<p>Choose File</p>}
      </div>
    </>
  );
}

function TextandFileUpload({
  inputRefs,
}: {
  inputRefs: MutableRefObject<(string | File | null)[]>;
}) {
  const [inputs, setInputs] = useState<(string | File | null)[]>([
    "cool",
    null,
  ]);
  useEffect(() => {
    inputRefs.current = inputs;
  }, [inputs, inputRefs, inputRefs.current]);
  return (
    <div>
      {inputs.map((input, index) =>
        typeof input === "string" ? (
          <input
            value={input}
            onInput={(event) => {
              setInputs(
                inputs.map((input, i) =>
                  i === index
                    ? (event.target as HTMLTextAreaElement).value
                    : input
                )
              );
            }}
            key={index}
            className={styles.input}
          />
        ) : (
          <UploadFile
            key={index}
            onchange={(file) => {
              setInputs(inputs.map((input, i) => (i === index ? file : input)));
            }}
          ></UploadFile>
        )
      )}
    </div>
  );
}
export default Upload;

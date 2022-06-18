import { LegacyRef, useEffect, useRef, useState } from "react";

function Virtualised({
  children,
  width,
  height,
  defaultHeight,
  style,
}: {
  children: ((ref: LegacyRef<HTMLDivElement>) => JSX.Element)[];
  width: number;
  height: number;
  defaultHeight: number;
  style?: React.CSSProperties;
}) {
  const [cachedHeight, setCachedHeight] = useState<Record<number, number>>({});
  const refs = useRef<Record<number, LegacyRef<HTMLDivElement>>>({});
  const [scrollTop, setScrollTop] = useState(0);
  const [paddingTop, setPaddingTop] = useState(0);
  const [paddingBottom, setPaddingBottom] = useState(
    defaultHeight * children.length
  );
  const ref: LegacyRef<HTMLDivElement> = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      const scroll = () => {
        const scrollTop = Number(ref.current?.scrollTop);
        setScrollTop(scrollTop);
        let startingIndex = 0;
        for (let i = 0; i < children.length; i++) {
          let height = cachedHeight[i];
          if (!height) {
            height = defaultHeight;
          }
          if (
            scrollTop >= startingIndex &&
            scrollTop < startingIndex + height
          ) {
              setPaddingTop(startingIndex);
              break
          }
          startingIndex += height;
        }
          console.log(startingIndex);
      };
      scroll();
      ref.current.addEventListener("scroll", scroll);
      return () => {
        ref.current?.removeEventListener("scroll", scroll);
      };
    }
  }, [ref]);

  return (
    <div
      style={{
        ...style,
        width,
        height,
        overflow: "auto",
      }}
      ref={ref}
    >
      {children.map((child, i) => {
        let hCache = refs.current[i];
        if (!hCache) {
          hCache = {
            current: null,
          };
        }
        return child(hCache);
      })}
    </div>
  );
}
export default Virtualised;

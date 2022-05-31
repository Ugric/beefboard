import Image from "next/image";
import { useEffect, useRef, useState } from "react";

function ResponsiveImage({
  aspectRatio,
  className,
  onSizeUpdate,
  ...props
}: {
  src: string;
  alt: string;
  aspectRatio: number;
  onSizeUpdate?: () => void;
  className?: string;
}) {
  const imageref = useRef<any>(null);
  const [width, setwidth] = useState(0);
  const [height, setheight] = useState(0);
  useEffect(() => {
    if (imageref.current) {
      const outputsize = () => {
        setwidth(imageref.current?.offsetWidth);
        setheight(imageref.current?.offsetWidth / aspectRatio);
        onSizeUpdate && onSizeUpdate();
      };
      outputsize();
      new ResizeObserver(outputsize).observe(imageref.current);
    }
  }, [imageref]);
  return (
    <div ref={imageref}>
      <Image
        width={width}
        key={width + "x" + height}
        height={height}
        {...props}
      ></Image>
    </div>
  );
}
export default ResponsiveImage;

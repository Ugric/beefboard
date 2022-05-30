import Image from "next/image";
import beefboardlogo from "../static-images/beefboard-logo.png";

function Logo({ width, height }: { width?: number, height?: number }) {
    const dimentions = [1328, 1108];
    if (width && height) {
        dimentions[0] = width;
        dimentions[1] = height;
    } else if (width) {
        dimentions[0] = width;
        dimentions[1] = width * (1108 / 1328);
    } else if (height) {
        dimentions[0] = height * (1328 / 1108);
        dimentions[1] = height;
    }
  return <Image src={beefboardlogo} width={dimentions[0]} height={dimentions[1]}></Image>;
}

export default Logo;

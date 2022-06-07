import React, { useEffect } from "react";
import { useState } from "react";

const AdBanner = () => {
  useEffect(() => {
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push(
        {}
      );
    } catch (err) {
      console.log(err);
    }
  }, []);
  const [adNumber] = useState(
    Math.random()
  )

  return (
    <ins
      className="adsbygoogle"
      style={{
        display: "block",
        width: "100%",
      }}
      data-ad-format="auto"
      data-full-width-responsive={true}
      data-ad-client="ca-pub-6522065990038784"
      data-ad-slot={adNumber}
    />
  );
};

export default AdBanner;

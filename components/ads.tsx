import React, { useEffect } from "react";

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

  return (
    <ins
      className="adsbygoogle"
      style={{
        display: "block",
      }}
      data-ad-format="fluid"
      data-ad-layout-key="-ef+6k-30-ac+ty"
      data-ad-client="ca-pub-6522065990038784"
      data-ad-slot="5682958907"
    />
  );
};

export default AdBanner;

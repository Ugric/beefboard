import { createContext, useContext, useEffect } from "react";

const recaptchaContext = createContext<{
    site_key: string,
}>({
    site_key: "",
});

function RecaptchaProvider({
    children,
    site_key
}: {
        children: React.ReactNode;
        site_key: string;
    }) {
    useEffect(() => {
        const script = document.createElement("script");
        script.src =
          "https://www.google.com/recaptcha/api.js?" +
          new URLSearchParams({
            render: site_key,
          });
        document.head.appendChild(script);
    }, [])
    return (
      <>
        <recaptchaContext.Provider value={{ site_key }}>
          {children}
        </recaptchaContext.Provider>
      </>
    );
}

function useRecaptcha() {
    const { site_key } = useContext(recaptchaContext);
    return () => {
        return new Promise<string>((resolve, reject) => {
            const grecaptcha = (window as any)["grecaptcha"];
            grecaptcha.ready(() => {
                grecaptcha.execute(site_key, { action: "homepage" }).then(resolve).catch(reject);
            });
        });
    };
}
export { useRecaptcha, RecaptchaProvider };
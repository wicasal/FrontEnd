import { useEffect } from "react";

const useScript = (url, onload) => {
  useEffect(() => {
    const script = document.createElement("script");

    script.src = url;
    script.onload = onload;
    script.referrerpolicy="strict-origin-when-cross-origin";
    script.defer=true;
    script.async=true;

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [url, onload]);
};

export default useScript;
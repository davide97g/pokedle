import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

type LAYOUT_TYPE = "MOBILE" | "DESKTOP";

const MOBILE_WIDTH = 640;

interface LayoutContext {
  layout: LAYOUT_TYPE;
  isMobile: boolean;
}

export const LayoutContext = createContext({
  layout: "DESKTOP" as LAYOUT_TYPE,
  isMobile: false,
} as LayoutContext);

export function LayoutProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [layout, setLayout] = useState<LAYOUT_TYPE>("DESKTOP");
  const isMobile = useMemo(() => layout === "MOBILE", [layout]);

  const handleWidthChange = useCallback(() => {
    if (window.innerWidth < MOBILE_WIDTH) {
      setLayout("MOBILE");
    } else {
      setLayout("DESKTOP");
    }
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleWidthChange);
    window.addEventListener("orientationchange", handleWidthChange);
    window.addEventListener("devicechange", handleWidthChange);
    window.addEventListener("fullscreenchange", handleWidthChange);
    handleWidthChange();
    return () => {
      window.removeEventListener("resize", handleWidthChange);
      window.removeEventListener("orientationchange", handleWidthChange);
      window.removeEventListener("devicechange", handleWidthChange);
      window.removeEventListener("fullscreenchange", handleWidthChange);
    };
  }, [handleWidthChange]);

  const value = useMemo(
    () => ({
      layout,
      isMobile,
    }),
    [isMobile, layout]
  );

  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  );
}

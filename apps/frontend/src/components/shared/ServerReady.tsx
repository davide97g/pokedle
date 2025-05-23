import { ReactNode } from "react";
import { useSystemGetInfo } from "../../hooks/system/useSystemGetInfo";
import { Loader } from "./loader/Loader";

export default function ServerReady({ children }: { children: ReactNode }) {
  const systemInfo = useSystemGetInfo();

  if (systemInfo.isFetching)
    return (
      <>
        <Loader />
        <div className="m-auto pt-32">
          <h1 className="text-xl text-primary-400">Server is not ready</h1>
          <p className="text-primary-300">
            Please wait a moment and refresh the page.
          </p>
        </div>
      </>
    );
  if (systemInfo.isError) {
    console.error(systemInfo.error);
    return (
      <div className="text-yellow-400 m-auto">
        <h1 className="text-xl">Server is not ready</h1>
        <p>Please wait a moment and refresh the page.</p>
      </div>
    );
  }
  return children;
}

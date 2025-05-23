import "./loader.css";

export const Loader = ({
  transparent = false,
}: Readonly<{ transparent?: boolean }>) => {
  return (
    <div
      className={`${
        transparent ? "" : "bg-black bg-opacity-50"
      } absolute top-0 left-0 w-full h-full z-50`}
    >
      <div className="lds-ripple absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

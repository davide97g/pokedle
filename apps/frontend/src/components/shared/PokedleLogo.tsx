export function PokedleLogo() {
  return (
    <div
      className="flex items-center justify-center"
      onClick={() => {
        window.location.href = "/";
      }}
    >
      <img src="./logo.png" alt="logo" height={45} width={45} />
      <span className="font-bold text-inherit">Pokedle</span>
    </div>
  );
}

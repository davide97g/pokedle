export default function About() {
  return (
    <div className="flex flex-col justify-center items-center gap-10 px-10">
      <div className="pt-28 md:pt-20 flex flex-row items-center">
        <img src="./logo.png" alt="logo" height={45} width={45} />
        <h1 className="text-2xl">About Pokèdle</h1>
      </div>
      <p>
        Pokèdle is a guessing game where you have to guess the pokèmon based on
        it's characteristics.
      </p>
      <a href="https://www.buymeacoffee.com/pokedle">
        <img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=☕&slug=pokedle&button_colour=FFDD00&font_colour=000000&font_family=Lato&outline_colour=000000&coffee_colour=ffffff" />
      </a>
    </div>
  );
}

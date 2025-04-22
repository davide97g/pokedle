export default function About() {
  return (
    <div className="flex flex-col justify-center items-center gap-10 px-10">
      <div className="pt-28 md:pt-20 flex flex-row items-center">
        <img src="./logo.png" alt="logo" height={45} width={45} />
        <h1 className="text-2xl">About Pokèdle</h1>
      </div>
      <p>
        Pokèdle is a guessing game where you have to guess the pokèmon based on
        its characteristics.
      </p>
      <p>Author: Davide Ghiotto</p>
      <p>
        This project is open source and you can find the code on{" "}
        <a
          href="https://github.com/davide97g/pokedle"
          className="text-blue-500 hover:text-blue-700"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </p>
      <p>
        I also have a{" "}
        <a
          href="https://www.youtube.com/channel/UCp-6Cv5ksm2mY-xLJqvLVKw"
          className="text-blue-500 hover:text-blue-700"
          target="_blank"
          rel="noopener noreferrer"
        >
          YouTube channel
        </a>
      </p>
      <a href="https://www.buymeacoffee.com/pokedle">
        <img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=☕&slug=pokedle&button_colour=FFDD00&font_colour=000000&font_family=Lato&outline_colour=000000&coffee_colour=ffffff" />
      </a>
      <div className="flex flex-row gap-4">
        <a
          href="https://www.iubenda.com/privacy-policy/66878785"
          className="iubenda-white iubenda-noiframe iubenda-embed iubenda-noiframe"
          title="Privacy Policy "
        >
          Privacy Policy
        </a>
        <a
          href="https://www.iubenda.com/privacy-policy/66878785/cookie-policy"
          className="iubenda-white iubenda-noiframe iubenda-embed iubenda-noiframe"
          title="Cookie Policy "
        >
          Cookie Policy
        </a>
      </div>
    </div>
  );
}

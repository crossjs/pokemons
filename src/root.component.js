import React from "react";
import {
  StylesProvider,
  createGenerateClassName,
  ThemeProvider,
  createMuiTheme
} from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";
import Container from "@material-ui/core/Container";
import PokeList from "./components/poke-list";
import { CssBaseline } from "@material-ui/core";
import { getPokemons } from "./api";

const generateClassName = createGenerateClassName({
  productionPrefix: "pk-",
  seed: "pk-"
});
const createTheme = darkMode =>
  createMuiTheme({
    palette: {
      type: darkMode ? "dark" : "light"
    }
  });
export default function Root(props) {
  const [loading, setLoading] = React.useState(false);
  const [pokemons, setPokemons] = React.useState(props.pokemons || []);
  const [darkMode, setDarkMode] = React.useState(true);
  const theme = React.useMemo(() => createTheme(darkMode), [darkMode]);
  React.useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side-pokemons");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
    window.addEventListener("mode-event", handleThemeEvent);

    async function initPokemons() {
      if (pokemons.length === 0) {
        setLoading(true);
        const pokes = await getPokemons();
        setLoading(false);
        setPokemons(pokes);
      }
    }
    initPokemons();
    return () => {
      window.removeEventListener("mode-event", handleThemeEvent);
    };
  }, [pokemons]);

  const handleThemeEvent = e => {
    if (typeof e.detail !== "undefined") {
      setDarkMode(e.detail);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <StylesProvider generateClassName={generateClassName}>
        {loading && <LinearProgress color="secondary" />}
        <Container>
          <PokeList pokemons={pokemons} />
        </Container>
      </StylesProvider>
    </ThemeProvider>
  );
}

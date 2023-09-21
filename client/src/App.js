import Home from "./pages/home/Home";
import Login from "./components/Login"
import List from "./pages/list/List";
import Single from "./pages/single/Single";
import New from "./pages/new/New";
import { BrowserRouter, Routes, Route ,Navigate} from "react-router-dom";
import { productInputs, userInputs } from "./formSource";
import "./style/dark.scss";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import Main from "./components/Main";
import Signup from "./components/Singup";
import AddCategory from "./components/Category/AddCategory";
import Addplantcare from "./components/Plant Care/Plantcare";
import ProductAdd from "./components/ProductAdd/ProductAdd";
function App() {
  const { darkMode } = useContext(DarkModeContext);
  const user = localStorage.getItem("token");
  return (
    <div className={darkMode ? "app dark" : "app"}>
      <BrowserRouter>
        <Routes>
        {user && <Route path="/" exact element={<Home />} />}
        <Route path="login" element={<Login />} />
        <Route path="/" element={<Navigate replace to="/login" />} />
        <Route path="/signup" exact element={<Signup />} />
        <Route path="/addCategory" element={<AddCategory/>} />
			  <Route path="/addplantcare" element={<Addplantcare/>} />
        <Route path="/addAddProduct" element={<ProductAdd/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

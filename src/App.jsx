import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

const router = createBrowserRouter(
  createRoutesFromElements(<Route path="/" element={<MainLayout />}></Route>)
);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;

import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { IndexPage } from "./pages/index";

// 라우터 객체 생성: "/" 경로에 IndexPage 컴포넌트 매핑
export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route index Component={IndexPage} />
    // 추후 <Route path="about" Component={AboutPage} /> 등 더 추가 가능
  )
);

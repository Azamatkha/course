import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Home } from "@/pages/Home";
import { Courses } from "@/pages/Courses";
import { CoursePage } from "@/pages/CoursePage";
import { LessonPage } from "@/pages/LessonPage";
import { ProgressPage } from "@/pages/ProgressPage";
import { BookmarksPage } from "@/pages/BookmarksPage";
import { SearchPage } from "@/pages/SearchPage";
import { GlossaryPage } from "@/pages/GlossaryPage";
import { About } from "@/pages/About";
import { NotFound } from "@/pages/NotFound";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/courses", element: <Courses /> },
      { path: "/courses/:courseId", element: <CoursePage /> },
      { path: "/courses/:courseId/:slug", element: <LessonPage /> },
      { path: "/progress", element: <ProgressPage /> },
      { path: "/bookmarks", element: <BookmarksPage /> },
      { path: "/search", element: <SearchPage /> },
      { path: "/glossary", element: <GlossaryPage /> },
      { path: "/about", element: <About /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}

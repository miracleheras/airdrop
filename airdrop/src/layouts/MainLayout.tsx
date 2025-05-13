import { Header } from "../components/Header";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="w-full text-white">
      <Header />
      <div className="w-full h-full">{children}</div>
    </div>
  );
};

export const withMainLayout =
  (Page: React.FC): React.FC =>
  () => {
    return (
      <MainLayout>
        <Page />
      </MainLayout>
    );
  };

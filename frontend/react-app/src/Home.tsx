import { useState } from "react";
import Header from "./components/StandardComponents/Header";
import NavigationBar from "./components/Homepage/NavigationBar";
import LoginCard from "./components/Homepage/LoginCard";
import RegisterCard from "./components/Homepage/RegisterCard";
import Footer from "./components/StandardComponents/Footer";
import Body from "./components/StandardComponents/Body";

const Home = () => {
  const navItems = [
    ["Home", "/"],
    ["Products", "/products"],
    ["About Us", "/about"],
    ["FAQs", "/faqs"],
    ["Login", "/login"],
    ["Register", "/register"],
  ];
  const locationSplit = location.href.split("/");
  const [page, setPage] = useState(() => {
    switch ("/" + locationSplit[3]) {
      case navItems[0][1]: {
        return 0;
      }
      case navItems[1][1]: {
        return 1;
      }
      case navItems[2][1]: {
        return 2;
      }
      case navItems[3][1]: {
        return 3;
      }
      case navItems[4][1]: {
        return 4;
      }
      case navItems[5][1]: {
        return 5;
      }
      default: {
        return 0;
      }
    }
  });

  return (
    <>
      <title>Penguin Inspections</title>
      <Header>
        <div>
          <NavigationBar
            mainItems={navItems.slice(0, 4)}
            endItems={navItems.slice(4)}
            preSelected={page}
            onSelectItem={(index: number) => {
              window.history.replaceState(
                null,
                navItems[index][0],
                navItems[index][1]
              );
              setPage(index);
            }}
          />
        </div>
      </Header>
      <Body>
        <>
          {page == 4 && (
            <LoginCard
              alertParam={locationSplit[4]}
              alertMessageCode={locationSplit[5]}
            />
          )}
          {page == 5 && (
            <RegisterCard
              alertParam={locationSplit[4]}
              alertMessageCode={locationSplit[5]}
            />
          )}
        </>
      </Body>
      <Footer />
    </>
  );
};

export default Home;

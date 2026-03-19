import { useState } from "react";
import NavigationBar from "./components/Dashboard/NavigationBar";
import Header from "./components/StandardComponents/Header";
import Equipment from "./components/Dashboard/Equipment";
import Sets from "./components/Dashboard/Sets";
import getDomain from "./components/middleware/GetDomain";
import RentPopup from "./components/Dashboard/RentPopup";

const App = () => {
  let navItems: string[][];

  if (getDomain() == "") {
    navItems = [
      ["Dashboard", "/"],
      ["Equipment", "/equipment"],
      ["Sets", "/sets"],
      ["Settings", "/settings"],
      ["Logout", "/logout"],
    ];
  } else {
    navItems = [
      ["Dashboard", "/"],
      ["Equipment", "/equipment"],
      ["Sets", "/sets"],
      ["Rent", "/rent"],
      ["Settings", "/settings"],
      ["Logout", "/logout"],
    ];
  }

  const locationSplit = location.href.split("/");
  const [page, setPage] = useState(() => {
    switch ("/" + locationSplit[4]) {
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
      default: {
        return 0;
      }
    }
  });

  const HandleLogout = () => {
    fetch("/auth/logout", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status == 200) {
          location.href = "/login/0/" + data.message;
        } else {
          console.error("Logout Failed");
        }
      });
  };

  if (page == 3 && navItems.length - 1 != 4) {
    window.open("/rent", "_blank");
  }

  return (
    <>
      <title>Dashboard - Penguin Inspections</title>
      <Header>
        <div>
          <NavigationBar
            mainItems={navItems.slice(0, navItems.length - 1)}
            endItems={navItems.slice(navItems.length - 1)}
            preSelected={page}
            onSelectItem={(index: number) => {
              window.history.replaceState(
                null,
                navItems[index][0],
                "/dashboard" + navItems[index][1]
              );
              setPage(index);
            }}
          />
        </div>
      </Header>
      <div>
        <>
          {page == 1 && <Equipment />}
          {page == 2 && <Sets />}
          {page == 3 && <RentPopup />}
          {page == navItems.length - 1 ? HandleLogout() : null}{" "}
        </>
      </div>
    </>
  );
};

export default App;

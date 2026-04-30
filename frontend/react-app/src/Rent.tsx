import { useState } from "react";
import NavigationBar from "./components/Dashboard/NavigationBar";
import Header from "./components/StandardComponents/Header";
import Clients from "./components/Rent/Clients";
import RentableItems from "./components/Rent/RentableItems";

const Rent = () => {
  const navItems = [
    ["Dashboard", "/"], // Dashboard page
    ["Rentables", "/items"], // Manage Rentable Items page
    ["Manage", "/manage"], // Manage Orders page
    ["Clients", "/clients"], // Manage Clients page
    ["Order", "/order"], // New "Order" page
    ["Settings", "/settings"], // Settings page
    ["Close", "/close"],
  ];

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
                "/rent" + navItems[index][1]
              );
              setPage(index);
            }}
          />
        </div>
      </Header>
      <div>
        <>
          {page == 1 && <RentableItems />}
          {page == 2 && <p>Manage Orders</p>}
          {page == 3 && <Clients />}
          {page == 4 && <p>Create Orders</p>}
          {page == 5 && <p>Settings</p>}
          {page == navItems.length - 1 && window.close()}
        </>
      </div>
    </>
  );
};

export default Rent;

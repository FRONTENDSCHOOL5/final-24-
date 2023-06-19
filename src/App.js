import { useState } from "react";
import { GlobalStyle } from "./GlobalStyle";
import Router from "./routes/Router";
import { UserContext } from "./context/UserContext.jsx";
import { ModalContext } from "./context/ModalContext.jsx";
function App() {
  const [account, setAccount] = useState(localStorage.getItem("account")||null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken")||null);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
  const [isOpenPostModal, setIsOpenPostModal] = useState(false);

  return (
    <>
      <GlobalStyle />
      <UserContext.Provider
        value={{
          account,
          setAccount,
          accessToken,
          setAccessToken,
        }}
      >
        <ModalContext.Provider
          value={{
            isOpenConfirmModal,
            setIsOpenConfirmModal,
            isOpenPostModal,
            setIsOpenPostModal,
          }}
        >
          <Router />
        </ModalContext.Provider>
      </UserContext.Provider>
    </>
  );
}
export default App;

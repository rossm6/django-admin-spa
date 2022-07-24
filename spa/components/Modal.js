import React, { createContext, useEffect } from "react";
import { createPortal } from "react-dom";

const ModalContext = createContext();

function Modal ({ bg, children, closeModal, p, maxWidth, mx, my, show, title }) {

  useEffect(() => {
    const body = document.getElementsByTagName("body")[0];
    if(show){
      body.style.overflow = "hidden";
    }
    else{
      body.style.overflow = "unset";
    }
  }, [show]);

  return (
    <ModalContext.Provider value={{ closeModal }}>
      {
        createPortal(
          <>
            <Box
              sx={{
                position: "fixed",
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                overflowY: "auto",
                minHeight: "100vh",
                zIndex: MODAL_OVERLAY_Z_INDEX,
              }}
            >
              <Box
                sx={{
                  mx: mx,
                  my: my,
                  maxWidth: maxWidth,
                  display: "flex",
                  flexDirection: "column",
                  zIndex: MODAL_Z_INDEX,
                  bg: bg,
                  p: p
                }}
              >
                {children}
              </Box>
            </Box>
            <Box
              sx={{
                position: "fixed",
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                height: "100vh",
                zIndex: MODAL_OVERLAY_Z_INDEX,
                bg: "blue",
                opacity: 0.5
              }}
            ></Box>
          </>,
          document.getElementsByTagName("body")[0]
        )
      }
    </ModalContext.Provider>
  );

}

export default Object.assign({}, {
  Modal
});

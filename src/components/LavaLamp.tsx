import React from "react";

export const LavaLamp: React.FC = () => {
  const color1 = "var(--color-accent-1)";
  const color2 = "var(--color-accent-2)";

  return (
    <>
      <>
        {color1 && (
          <div
            className="fixed -left-[20vw] bottom-[30svh] top-[5svh] w-[80vw] rounded-full blur-[100px] -z-10"
            style={{
              backgroundColor: color1,
            }}
          />
        )}
        {color2 && (
          <div
            className="fixed -right-[25vw] bottom-[0svh] top-[35svh] w-[80vw] rounded-full blur-[100px] -z-10"
            style={{
              backgroundColor: color2,
            }}
          />
        )}
      </>

      <>
        {color1 && (
          <div
            className="fixed left-[5vw] top-[5svh] h-[60svh] w-[50vw] rounded-full blur-[100px] -z-10"
            style={{
              backgroundColor: color1,
            }}
          />
        )}
        {color2 && (
          <div
            className="fixed bottom-[2svh] right-[5vw] h-[60svh] w-[50vw] rounded-full blur-[100px] -z-10"
            style={{
              backgroundColor: color2,
            }}
          />
        )}
      </>
    </>
  );
};

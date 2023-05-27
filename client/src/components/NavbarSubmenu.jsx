import React from "react";
import Popover from "./Popover";

export default function NavbarSubmenu({ title, content, icon }) {
  return (
    <Popover
      position="bottom"
      content={() => content()}
      trigger={({ triggerRef, onClick }) => (
        <div className="navlink" ref={triggerRef} onClick={(e) => onClick(e)}>
          {!!icon && <img src={icon} alt="icon" />}
          {title}
        </div>
      )}
    ></Popover>
  );
}

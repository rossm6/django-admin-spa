import React from "react";
import { Flex, NavLink } from 'theme-ui';

function Nav () {

  return (
    <Flex as="nav">
      <NavLink href="#!" p={2}>
        Home
      </NavLink>
      <NavLink href="#!" p={2}>
        Blog
      </NavLink>
      <NavLink href="#!" p={2}>
        About
      </NavLink>
    </Flex>
  );

}

export default Nav;

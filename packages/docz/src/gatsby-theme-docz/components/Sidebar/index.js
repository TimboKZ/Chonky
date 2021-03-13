/** @jsx jsx */
/** @jsxFrag React.Fragment */
import { Global } from '@emotion/core';
import { useCurrentDoc, useMenus } from 'docz';
import { NavSearch } from 'gatsby-theme-docz/src/components/NavSearch';
import React, { useEffect, useRef, useState } from 'react';
import { Box, jsx } from 'theme-ui';

import { NavGroup } from '../NavGroup';
import { NavLink } from '../NavLink';
import { global, overlay, wrapper } from './styles';

export const Sidebar = React.forwardRef((props, ref) => {
    const [query, setQuery] = useState('');
    const menus = useMenus({ query });
    const currentDoc = useCurrentDoc();
    const currentDocRef = useRef();
    const handleChange = (ev) => {
        setQuery(ev.target.value);
    };
    useEffect(() => {
        if (ref.current && currentDocRef.current) {
            ref.current.scrollTo(0, currentDocRef.current.offsetTop);
        }
    }, [ref]);
    return (
        <>
            <Box onClick={props.onClick} sx={overlay(props)}>
                {props.open && <Global styles={global} />}
            </Box>
            <Box ref={ref} sx={wrapper(props)} data-testid="sidebar">
                <NavSearch
                    placeholder="Type to search..."
                    value={query}
                    onChange={handleChange}
                />
                {menus &&
                    menus.map((menu) => {
                        if (!menu.route)
                            return (
                                <NavGroup key={menu.id} item={menu} sidebarRef={ref} />
                            );
                        if (menu.route === currentDoc.route) {
                            return (
                                <NavLink key={menu.id} item={menu} ref={currentDocRef}>
                                    {menu.name}
                                </NavLink>
                            );
                        }
                        return (
                            <NavLink key={menu.id} item={menu}>
                                {menu.name}
                            </NavLink>
                        );
                    })}
            </Box>
        </>
    );
});

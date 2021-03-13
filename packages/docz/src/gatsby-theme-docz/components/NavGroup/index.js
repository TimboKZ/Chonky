/** @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';
import { useCurrentDoc } from 'docz';

import * as styles from './styles';
import { NavLink } from '../NavLink';

export const NavGroup = ({ item, sidebarRef }) => {
    const currentDoc = useCurrentDoc();
    const currentDocRef = React.useRef();
    React.useEffect(() => {
        if (sidebarRef.current && currentDocRef.current) {
            sidebarRef.current.scrollTo(0, currentDocRef.current.offsetTop);
        }
    }, [sidebarRef]);
    return (
        <div sx={styles.wrapper} data-testid="nav-group">
            <div sx={styles.title}>{item.name}</div>
            <div sx={styles.sublinkWrapper} data-testid="nav-group-links">
                {item.menu &&
                    item.menu.map((menu) => {
                        if (currentDoc.route === menu.route) {
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
            </div>
        </div>
    );
};

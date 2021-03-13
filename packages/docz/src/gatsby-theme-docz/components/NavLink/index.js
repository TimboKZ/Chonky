/** @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';
import { Link } from 'gatsby';

import * as styles from './styles';

export const NavLink = React.forwardRef(({ item, ...props }, ref) => {
    if (item.hidden) {
        return null;
    }

    const to = item.route;
    return (
        <React.Fragment>
            <Link
                {...props}
                to={to}
                sx={styles.link}
                activeClassName="active"
                ref={ref}
            />
        </React.Fragment>
    );
});

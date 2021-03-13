/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { LinkData } from '../util/links';

export interface LinkCardProps {
    className?: string;
    linkData: LinkData;
}

const useStyles = makeStyles((theme) => ({
    card: (linkData: LinkData) => ({
        backgroundColor: linkData.color,
        color: theme.palette.getContrastText(linkData.color),
    }),
    actionText: {
        fontWeight: 'bold',
        textAlign: 'right',
        marginTop: 5,
        fontSize: '0.8em',
    },
}));

export const LinkCard: React.FC<LinkCardProps> = ({ className, linkData }) => {
    const classes = useStyles(linkData);

    return (
        <Card className={`${classes.card} ${className}`}>
            <CardActionArea href={linkData.url}>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        {linkData.title}
                    </Typography>
                    <Typography variant="body1" component="p">
                        {linkData.description}
                    </Typography>
                    <div className={classes.actionText}>Click to read</div>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

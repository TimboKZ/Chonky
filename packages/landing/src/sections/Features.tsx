/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */
import Avatar from '@material-ui/core/Avatar';

import Box from '@material-ui/core/Box';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';

import Typography from '@material-ui/core/Typography';
import AllInclusiveIcon from '@material-ui/icons/AllInclusive';
import CodeIcon from '@material-ui/icons/Code';
import ControlCameraIcon from '@material-ui/icons/ControlCamera';
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun';
import KeyboardIcon from '@material-ui/icons/Keyboard';
import MenuOpenIcon from '@material-ui/icons/MenuOpen';
import PhoneAndroidIcon from '@material-ui/icons/PhoneAndroid';

import PhotoFilterIcon from '@material-ui/icons/PhotoFilter';
import PhotoSizeSelectSmallIcon from '@material-ui/icons/PhotoSizeSelectSmall';

import PowerIcon from '@material-ui/icons/Power';
import SortByAlphaIcon from '@material-ui/icons/SortByAlpha';
import ViewComfyIcon from '@material-ui/icons/ViewComfy';
import React from 'react';
import { Title } from '../components/Title';

export interface LinksProps {}
export const Features: React.FC<LinksProps> = (props) => {
    const classes = useStyles();

    return (
        <>
            <Title>Features...</Title>
            <Box className={classes.featuresWrapper}>
                <Typography variant="h6" className={classes.listTitle}>
                    ...for developers:
                </Typography>
                <div className={classes.featureList}>
                    {developerFeatures.map((feature, index) => (
                        <ListItem
                            component={'div'}
                            key={`feature-${index}`}
                            className={classes.developerFeature}
                        >
                            <ListItemAvatar className={classes.developerAvatar}>
                                <Avatar className={classes.developerIcon}>
                                    {feature.icon}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={feature.title}
                                secondary={feature.description}
                                className={classes.developerFeatureText}
                            />
                        </ListItem>
                    ))}
                </div>
            </Box>
            <br />
            <Box className={classes.featuresWrapper}>
                <Typography variant="h6" className={classes.listTitle}>
                    ...for users:
                </Typography>
                <div className={classes.featureList}>
                    {userFeatures.map((feature, index) => (
                        <ListItem
                            component={'div'}
                            key={`feature-${index}`}
                            className={classes.userFeature}
                        >
                            <ListItemAvatar className={classes.userAvatar}>
                                <Avatar className={classes.userIcon}>
                                    {feature.icon}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={feature.title}
                                secondary={feature.description}
                                className={classes.userFeatureText}
                            />
                        </ListItem>
                    ))}
                </div>
            </Box>
        </>
    );
};

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        featuresWrapper: {},
        listTitle: {
            textAlign: 'center',
        },
        featureList: {
            justifyContent: 'center',
            flexBasis: '100%',
            flexWrap: 'wrap',
            display: 'flex',
        },
        developerFeature: {
            boxShadow:
                '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px' +
                ' rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
            backgroundColor: 'white',
            flexDirection: 'column',
            padding: '20px 10px',
            textAlign: 'center',
            borderRadius: 6,
            margin: '8px',
            width: 280,
        },
        userFeature: {
            boxShadow:
                '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px' +
                ' rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
            backgroundColor: 'white',
            alignItems: 'center',
            borderRadius: 6,
            padding: '15px',
            margin: '8px',
            width: 280,
        },
        developerFeatureText: {
            '& > span': {
                fontWeight: 'bold',
                fontSize: '1.3em',
                margin: '10px',
            },
            '& > p': {
                fontSize: '1em',
            },
        },
        userFeatureText: {},
        developerAvatar: {
            minWidth: 'auto',
        },
        userAvatar: {},
        developerIcon: {
            '& > *': {
                fontSize: '2.4em',
            },
            backgroundColor: '#4834d4',
            height: 75,
            width: 75,
        },
        userIcon: {
            backgroundColor: '#6ab04c',
        },
    })
);

interface FeatureData {
    icon: any;
    title: string;
    description: string;
    only2x?: boolean;
}

const developerFeatures: FeatureData[] = [
    {
        icon: <PowerIcon />,
        title: 'Custom file actions',
        description:
            'Chonky offers a powerful file action framework. File browser ' +
            'behaviour can be tweaked significantly without forking the library.',
    },
    {
        icon: <AllInclusiveIcon />,
        title: 'Backend agnostic',
        description:
            'Chonky focuses only on file browser UI. It does not make any' +
            ' assumptions about your server backend (or lack thereof).',
    },
    {
        icon: <CodeIcon />,
        title: 'TypeScript support',
        description:
            'Chonky is written in TypeScript. It exports many types and ' +
            'generic interfaces that can help you write type safe code.',
    },
];

const userFeatures: FeatureData[] = [
    { icon: <ViewComfyIcon />, title: 'List & Grid view', description: '' },
    { icon: <PhotoFilterIcon />, title: 'Thumbnails & file icons', description: '' },
    {
        icon: <SortByAlphaIcon />,
        title: 'Search, sorting & filtering',
        description: '',
    },
    { icon: <MenuOpenIcon />, title: 'Toolbar & context menus', description: '' },
    { icon: <KeyboardIcon />, title: 'Keyboard shortcuts', description: '' },
    { icon: <ControlCameraIcon />, title: 'Drag and drop', description: '' },
    { icon: <PhotoSizeSelectSmallIcon />, title: 'File selections', description: '' },
    { icon: <DirectionsRunIcon />, title: 'Virtualization', description: '' },
    { icon: <PhoneAndroidIcon />, title: 'Mobile friendly UI', description: '' },
];

const theme = {
    fontFamily: {
        base: ['sans-serif'],
        monospace: ['Fira Code', 'monospace'],
    },
    maxWidth: 1024,
    sidebarWidth: 280,
};

const styles = {
    StyleGuide: {
        '@global body': {
            fontFamily: 'sans-serif',
        },
        '@global img': {
            maxWidth: '100%',
        },
        '@global blockquote': {
            padding: '16px 16px 1px 16px !important',
            borderLeft: 'solid 4px #bbb !important',
            backgroundColor: '#eee !important',
            borderRadius: '3px !important',
            margin: '1.5em 0 !important',
        },
        '@global code': {
            backgroundColor: '#eee !important',
            whiteSpace: 'nowrap !important',
            borderRadius: '3px !important',
            fontSize: '0.9em !important',
            padding: '0 4px !important',
        },
        '@global tbody > tr > td': {
            borderBottom: 'solid 1px #efefef !important',
        },
        '@global tbody > tr > td:nth-of-type(2) > span': {
            whiteSpace: 'pre',
        },
        '@global tbody > tr > td:nth-of-type(3) code': {
            padding: '3px 6px 6px !important',
            whiteSpace: 'pre !important',
            display: 'inline-block',
        },
    },
    SectionHeading: {
        sectionName: {
            textDecoration: 'none !important',
            '&:hover': {
                opacity: 0.75,
            },
        },
    },
    Heading: {
        heading1: {
            borderBottom: 'solid 3px #ddd',
            fontWeight: 'bold',
            display: 'block',
            marginBottom: 0,
            marginTop: 50,
            width: '100%',
        },
        heading2: {
            borderBottom: 'solid 2px #ddd',
            fontWeight: 'bold',
            marginBottom: 20,
            marginTop: 80,
        },
        heading3: {
            fontWeight: 'bold',
            marginTop: 40,
        },
        heading4: {
            fontWeight: 'bold',
            marginTop: 30,
        },
    },
};

module.exports = {theme, styles};
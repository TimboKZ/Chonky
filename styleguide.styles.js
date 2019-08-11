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
        '@global code': {
            backgroundColor: '#eee !important',
            whiteSpace: 'nowrap !important',
            borderRadius: '3px !important',
            fontSize: '0.9em !important',
            padding: '0 4px !important',
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
            marginTop: 60,
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
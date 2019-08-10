const theme = {
    fontFamily: {
        base: ['sans-serif'],
        monospace: ['Fira Code', 'monospace'],
    },
};

const styles = {
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
            marginTop: 30,
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
};

module.exports = {theme, styles};
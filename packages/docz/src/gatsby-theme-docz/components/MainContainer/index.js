/** @jsx jsx */
import { Container, jsx } from 'theme-ui';

import { container } from './styles';

export const MainContainer = ({ children, ...rest }) => {
    return (
        <Container sx={container} {...rest}>
            {children}
            <div className="docs-banner">
                If you have a question, want to request a feature or report a bug,
                please{' '}
                <a href="https://github.com/TimboKZ/Chonky/issues">
                    create an issue on GitHub
                </a>
                . You can also report inaccurate or unclear documentation on{' '}
                <a href="https://discord.gg/4HJaFn9">Chonky's Discord server</a>.
            </div>
        </Container>
    );
};

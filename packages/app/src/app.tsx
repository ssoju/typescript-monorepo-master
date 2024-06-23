import styled from 'styled-components';
import React from 'react';
import { Header } from '@typescript-monorepo/header';
import { Routes } from './routes';
import GlobalStyles from './styles/globalStyles';

const links = [
    {
        href: '/about',
        name: 'about',
    },
    {
        href: '/contacts',
        name: 'contacts',
    },
];

export const App: React.FC = () => {
    return (
        <Container>
            <GlobalStyles />
            <Header title="Monorepo" links={links} />
            <Routes />
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

export const Html = ({ content, state, styleElement }: any) => {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="Description"
                    content="A template of a monorepo to create a react application."
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />

                <meta name="mobile-web-app-capable" content="yes" />

                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta
                    name="apple-mobile-web-app-status-bar-style"
                    content="black"
                />
                <meta name="apple-mobile-web-app-title" content="Yokaidex" />
                <link
                    rel="apple-touch-icon"
                    href="images/icons/icon-152x152.png"
                />

                <meta
                    name="msapplication-TileImage"
                    content="images/icons/icon-144x144.png"
                />
                <meta name="msapplication-TileColor" content="#fdd835" />

                <meta name="theme-color" content="#000000" />
                <title>
                    Typescript monorepo - A template of a monorepo to create a
                    react application.
                </title>
                {styleElement}
            </head>
            <body>
                <div id="root" dangerouslySetInnerHTML={{ __html: content }} />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `window.__APOLLO_STATE__=${JSON.stringify(
                            state
                        ).replace(/</g, '\\u003c')};`,
                    }}
                />
            </body>
        </html>
    );
};

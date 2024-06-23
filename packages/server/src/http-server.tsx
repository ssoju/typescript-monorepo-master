/* eslint-disable testing-library/render-result-naming-convention */
import express from 'express';
import compression from 'compression';
import ReactDOMServer from 'react-dom/server';
import { App, Html } from '@typescript-monorepo/app';
import { StaticRouter } from 'react-router-dom';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    HttpLink,
} from '@apollo/client';
import fetch from 'cross-fetch';
import { getDataFromTree } from '@apollo/client/react/ssr';
import * as path from 'path';

export const client = new ApolloClient({
    // Provide required constructor fields
    cache: new InMemoryCache(),
    link: new HttpLink({
        uri: 'https://graphql-pokeapi.graphcdn.app',
        fetch,
    }),
    ssrMode: true,
    // Provide some optional constructor fields
    name: 'graphql-pokemon-client',
    version: '1.0',
    queryDeduplication: false,
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'cache-and-network',
        },
    },
});

export function createHttpServer(): express.Express {
    const app = express();

    app.use(compression());
    app.use('/dist', express.static(path.resolve('../app/dist/')));

    app.use(ssrHandler);

    return app;
}

async function ssrHandler(req: express.Request, res: express.Response) {
    const sheet = new ServerStyleSheet();
    const app = (
        <StyleSheetManager sheet={sheet.instance}>
            <ApolloProvider client={client}>
                <StaticRouter location={req.url} context={{}}>
                    <App />
                </StaticRouter>{' '}
            </ApolloProvider>
        </StyleSheetManager>
    );

    try {
        const content = await getDataFromTree(sheet.collectStyles(app));

        const styleElement = sheet.getStyleElement();

        console.log('content', content, 'styleElement', styleElement[0]);

        // Extract the entirety of the Apollo Client cache's current state
        const initialState = client.extract();

        // Add both the page content and the cache state to a top-level component
        const html = (
            <Html
                content={content}
                state={initialState}
                styleElement={styleElement}
            />
        );

        // Render the component to static markup and return it
        res.status(200);
        res.send(
            `<!doctype html>\n${ReactDOMServer.renderToStaticMarkup(html)}`
        );
        res.end();
    } catch (error) {
        console.error(error);
        res.status(500);
        res.end();
    } finally {
        sheet.seal();
    }
}

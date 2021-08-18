/* eslint-disable react/no-danger */
import NextDocument, {
    DocumentContext,
    Head,
    Html,
    Main,
    NextScript,
} from "next/document";
import React from "react";
import { getCssString } from "../stitches.config";

export default class Document extends NextDocument {
    static async getInitialProps(ctx: DocumentContext) {
        try {
            const initialProps = await NextDocument.getInitialProps(ctx);

            return {
                ...initialProps,
                styles: (
                    <>
                        {initialProps.styles}
                        <style
                            id="stitches"
                            dangerouslySetInnerHTML={{ __html: getCssString() }}
                        />
                    </>
                ),
            };
        } finally {
            // do nothing
        }
    }

    render() {
        return (
            <Html lang="en">
                <Head />
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
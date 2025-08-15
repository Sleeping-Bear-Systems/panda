import type { JSX } from "hono/jsx/jsx-runtime";

/**
 * Layout props.
 */
export type LayoutProps = {
  title: string;
  children: JSX.Element | JSX.Element[];
};

/**
 * Layout function.
 * @param props The layout props.
 * @returns The JSX for the layout.
 */
export function Layout(props: LayoutProps): JSX.Element {
  return (
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/css/app.css" />
        <script src="/js/htmx.min.js"></script>
        <title>{props.title}</title>
      </head>
      <body>{props.children}</body>
    </html>
  );
}

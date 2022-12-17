import { Children } from 'react'
import Document, { Html, Main, Head, NextScript } from 'next/document'
import ServerStyleSheets from '@mui/styles/ServerStyleSheets'
import createEmotionServer from '@emotion/server/create-instance'
import createEmotionCache from '~/createEmotionCache'
export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="ja">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

MyDocument.getInitialProps = async (ctx) => {
  const sheets = new ServerStyleSheets()
  const originalRenderPage = ctx.renderPage
  const cache = createEmotionCache()
  const { extractCriticalToChunks } = createEmotionServer(cache)

  ctx.renderPage = () =>
    originalRenderPage({
      // eslint-disable-next-line react/display-name
      enhanceApp: (App: any) => (props) => sheets.collect(<App emotionCache={cache} {...props} />),
    })

  const initialProps = await Document.getInitialProps(ctx)

  // This is important. It prevents emotion to render invalid HTML.
  // See https://github.com/mui-org/material-ui/issues/26561#issuecomment-855286153
  const emotionStyles = extractCriticalToChunks(initialProps.html)
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(' ')}`}
      key={style.key}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ))
  return {
    ...initialProps,
    styles: [...Children.toArray(initialProps.styles), sheets.getStyleElement(), ...emotionStyleTags],
  }
}

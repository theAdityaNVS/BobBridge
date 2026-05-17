'use client';

import { Highlight, themes } from 'prism-react-renderer';

interface Props {
  code: string;
  lang: 'java' | 'json';
}

export function CodeBlock({ code, lang }: Props) {
  return (
    <Highlight code={code} language={lang} theme={themes.vsDark}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={`${className} p-4 rounded-md overflow-auto text-sm`}
          style={style}
        >
          {tokens.map((line, i) => {
            const { key: _lineKey, ...lineProps } = getLineProps({ line });
            return (
              <div key={i} {...lineProps}>
                {line.map((token, j) => {
                  const { key: _tokenKey, ...tokenProps } = getTokenProps({ token });
                  return <span key={j} {...tokenProps} />;
                })}
              </div>
            );
          })}
        </pre>
      )}
    </Highlight>
  );
}

// Made with Bob

'use client';

import { Highlight, themes } from 'prism-react-renderer';
import type { SupportedLanguage } from '@/lib/types';

interface Props {
  code: string;
  lang: SupportedLanguage | 'json';
}

// Map our language IDs to Prism language identifiers
const PRISM_LANG_MAP: Record<SupportedLanguage | 'json', string> = {
  java: 'java',
  python: 'python',
  javascript: 'javascript',
  typescript: 'typescript',
  go: 'go',
  rust: 'rust',
  csharp: 'csharp',
  php: 'php',
  ruby: 'ruby',
  json: 'json',
};

export function CodeBlock({ code, lang }: Props) {
  const prismLang = PRISM_LANG_MAP[lang] || 'javascript';
  
  return (
    <Highlight code={code} language={prismLang as any} theme={themes.vsDark}>
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

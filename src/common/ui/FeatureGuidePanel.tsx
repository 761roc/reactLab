import type { FeatureGuide, GuideCodeLanguage } from '../../core/feature-guide-types';
import styles from './FeatureGuidePanel.module.css';

function escapeHtml(input: string) {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function highlightPlainSegment(text: string, language: GuideCodeLanguage) {
  if (language === 'css') {
    return text
      .replace(/([.#]?[a-zA-Z_][a-zA-Z0-9_-]*)(?=\s*\{)/g, '<span class="token-selector">$1</span>')
      .replace(/([a-z-]+)(\s*:)/g, '<span class="token-property">$1</span>$2')
      .replace(/\b(\d+)(px|rem|em|vw|vh|%)?/g, '<span class="token-number">$1$2</span>');
  }

  if (language === 'bash') {
    return text
      .replace(/\b(yarn|npm|pnpm|npx|node|cd|ls|cat|rg|git)\b/g, '<span class="token-command">$1</span>')
      .replace(/\s(--?[a-zA-Z0-9-]+)/g, ' <span class="token-property">$1</span>');
  }

  return text
    .replace(
      /\b(import|export|from|const|let|var|return|if|else|for|while|switch|case|break|continue|new|type|interface|extends|implements|async|await|function|class|try|catch|finally|throw|in|of)\b/g,
      '<span class="token-keyword">$1</span>'
    )
    .replace(/\b(true|false|null|undefined)\b/g, '<span class="token-boolean">$1</span>')
    .replace(/\b(\d+)\b/g, '<span class="token-number">$1</span>')
    .replace(/\b([A-Za-z_$][\w$]*)(?=\s*\()/g, '<span class="token-function">$1</span>')
    .replace(/(&lt;\/?)([A-Za-z][\w.-]*)(?=[\s&gt;])/g, '$1<span class="token-tag">$2</span>');
}

function highlightCode(code: string, language: GuideCodeLanguage) {
  const escaped = escapeHtml(code);

  const matcher =
    /(\/\*[\s\S]*?\*\/|\/\/[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)/g;

  let result = '';
  let lastIndex = 0;
  let match = matcher.exec(escaped);

  while (match) {
    const currentIndex = match.index;
    const plain = escaped.slice(lastIndex, currentIndex);
    result += highlightPlainSegment(plain, language);

    const token = match[0];
    const tokenClass =
      token.startsWith('//') || token.startsWith('/*')
        ? 'token-comment'
        : 'token-string';
    result += `<span class="${tokenClass}">${token}</span>`;

    lastIndex = currentIndex + token.length;
    match = matcher.exec(escaped);
  }

  result += highlightPlainSegment(escaped.slice(lastIndex), language);

  return result;
}

interface FeatureGuidePanelProps {
  guide: FeatureGuide;
}

function parseStepTitle(title: string) {
  const matched = title.match(/^(Step\s*\d+)\s*[·:：-]\s*(.+)$/i);
  if (!matched) {
    return {
      stepLabel: undefined,
      cleanTitle: title
    };
  }

  return {
    stepLabel: matched[1],
    cleanTitle: matched[2]
  };
}

export function FeatureGuidePanel({ guide }: FeatureGuidePanelProps) {
  return (
    <section className={styles.wrapper}>
      <header className={styles.header}>
        <h3>{guide.heading}</h3>
        <p>{guide.description}</p>
      </header>

      <div className={styles.blockList}>
        {guide.blocks.map((block, index) => {
          const { stepLabel, cleanTitle } = parseStepTitle(block.title);
          const codeLines = block.code
            ? highlightCode(block.code.snippet, block.code.language).split('\n')
            : [];

          return (
            <article className={styles.block} key={block.title}>
              <div className={styles.blockHeader}>
                <h4>{cleanTitle}</h4>
                {stepLabel ? <span className={styles.stepBadge}>{stepLabel}</span> : null}
                {!stepLabel ? <span className={styles.stepBadgeMuted}>Block {index + 1}</span> : null}
              </div>
            <p>{block.summary}</p>

            {block.bullets ? (
              <ul className={styles.bullets}>
                {block.bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}

            {block.code ? (
              <div className={styles.codeSurface}>
                <div className={styles.codeMeta}>
                  {block.code.title ? <p className={styles.codeTitle}>{block.code.title}</p> : <span />}
                  <span className={styles.langBadge}>{block.code.language.toUpperCase()}</span>
                </div>

                <pre className={styles.code} data-language={block.code.language}>
                  <code>
                    {codeLines.map((line, lineIndex) => (
                      <span className={styles.codeLine} key={`${block.title}-${lineIndex + 1}`}>
                        <span className={styles.lineNumber}>{lineIndex + 1}</span>
                        <span
                          className={styles.lineContent}
                          dangerouslySetInnerHTML={{ __html: line.length > 0 ? line : '&nbsp;' }}
                        />
                      </span>
                    ))}
                  </code>
                </pre>
              </div>
            ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}

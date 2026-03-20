import { useState } from 'react';
import type { CSSProperties } from 'react';
import { SectionCard } from './SectionCard';
import styles from './KnowledgeSummaryPage.module.css';

export type RuntimeExecutor = (log: (...args: unknown[]) => void) => void;

export type KnowledgeHeroCard = {
  label: string;
  value: string;
  detail: string;
};

export type KnowledgeDefinition = {
  title: string;
  detail: string;
};

export type KnowledgeRelation = {
  title: string;
  detail: string;
  signal: string;
};

export type KnowledgeQuestion = {
  title: string;
  answer: string;
  explanation: string;
  code: string;
  codeTitle: string;
  runtimeNote?: string;
  run?: RuntimeExecutor;
};

export type KnowledgeQuestionGroup = {
  title: string;
  note: string;
  label: string;
  questions: readonly KnowledgeQuestion[];
};

export type KnowledgePitfall = {
  title: string;
  detail: string;
  points: readonly string[];
};

export type KnowledgeRule = {
  title: string;
  detail: string;
};

type KnowledgeSummaryPageProps = {
  eyebrow: string;
  title: string;
  lead: string;
  heroCards: readonly KnowledgeHeroCard[];
  definitionsTitle: string;
  definitionsNote: string;
  definitions: readonly KnowledgeDefinition[];
  relationsTitle: string;
  relationsNote: string;
  relations: readonly KnowledgeRelation[];
  relationCodeTitle: string;
  relationCode: string;
  questionGroups: readonly KnowledgeQuestionGroup[];
  diagnosticTitle: string;
  diagnosticNote: string;
  diagnosticSteps: readonly KnowledgeRule[];
  pitfallsTitle: string;
  pitfallsNote: string;
  pitfalls: readonly KnowledgePitfall[];
  rulesTitle: string;
  rulesNote: string;
  rules: readonly KnowledgeRule[];
  overviewTitle: string;
  overviewNote: string;
  themeStyle?: CSSProperties;
};

function escapeHtml(input: string) {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function highlightPlainSegment(text: string) {
  return text
    .replace(
      /\b(import|export|from|const|let|var|return|if|else|for|while|switch|case|break|continue|new|type|interface|extends|implements|async|await|function|class|try|catch|finally|throw|in|of)\b/g,
      '<span class="' + styles.tokenKeyword + '">$1</span>'
    )
    .replace(/\b(true|false|null|undefined)\b/g, '<span class="' + styles.tokenBoolean + '">$1</span>')
    .replace(/\b(\d+)\b/g, '<span class="' + styles.tokenNumber + '">$1</span>')
    .replace(/\b([A-Za-z_$][\w$]*)(?=\s*\()/g, '<span class="' + styles.tokenFunction + '">$1</span>')
    .replace(/(&lt;\/?)([A-Za-z][\w.-]*)(?=[\s&gt;])/g, `$1<span class="${styles.tokenTag}">$2</span>`);
}

function highlightCode(code: string) {
  const escaped = escapeHtml(code);
  const matcher =
    /(\/\*[\s\S]*?\*\/|\/\/[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)/g;

  let result = '';
  let lastIndex = 0;
  let match = matcher.exec(escaped);

  while (match) {
    const currentIndex = match.index;
    const plain = escaped.slice(lastIndex, currentIndex);
    result += highlightPlainSegment(plain);

    const token = match[0];
    const tokenClass =
      token.startsWith('//') || token.startsWith('/*') ? styles.tokenComment : styles.tokenString;

    result += `<span class="${tokenClass}">${token}</span>`;
    lastIndex = currentIndex + token.length;
    match = matcher.exec(escaped);
  }

  result += highlightPlainSegment(escaped.slice(lastIndex));

  return result;
}

function CodeBlock({ code, title }: { code: string; title: string }) {
  const lines = highlightCode(code).split('\n');

  return (
    <div className={styles.codeBlock}>
      <div className={styles.codeHeader}>
        <span>{title}</span>
        <span>JS / TS Example</span>
      </div>
      <pre className={styles.codePre}>
        <code>
          {lines.map((line, index) => (
            <span className={styles.codeLine} key={`${title}-${index + 1}`}>
              <span className={styles.lineNumber}>{index + 1}</span>
              <span
                className={styles.lineContent}
                dangerouslySetInnerHTML={{ __html: line.length > 0 ? line : '&nbsp;' }}
              />
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}

function formatValue(value: unknown): string {
  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'undefined') {
    return 'undefined';
  }

  if (typeof value === 'function') {
    return `[Function ${value.name || 'anonymous'}]`;
  }

  if (typeof value === 'symbol') {
    return value.toString();
  }

  if (value instanceof Date) {
    return `Date(${value.toISOString()})`;
  }

  if (value instanceof Map) {
    return `Map(${JSON.stringify(Array.from(value.entries()))})`;
  }

  if (value instanceof Set) {
    return `Set(${JSON.stringify(Array.from(value.values()))})`;
  }

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function collectRuntimeOutput(run: RuntimeExecutor) {
  const logs: string[] = [];

  const log = (...args: unknown[]) => {
    logs.push(args.map((item) => formatValue(item)).join(' '));
  };

  try {
    run(log);
  } catch (error) {
    logs.push(`Error: ${error instanceof Error ? error.message : String(error)}`);
  }

  return logs;
}

function RuntimePanel({ run, note }: { run: RuntimeExecutor; note: string }) {
  const [outputs, setOutputs] = useState(() => collectRuntimeOutput(run));

  return (
    <div className={styles.runtimeBox}>
      <div className={styles.runtimeHeader}>
        <span className={styles.runtimeLabel}>运行结果</span>
        <button className={styles.runButton} onClick={() => setOutputs(collectRuntimeOutput(run))} type="button">
          重新运行
        </button>
      </div>
      <div className={styles.outputList}>
        {outputs.map((item, index) => (
          <div className={styles.outputRow} key={`${item}-${index + 1}`}>
            <span className={styles.outputIndex}>{index + 1}</span>
            <pre className={styles.outputValue}>{item}</pre>
          </div>
        ))}
      </div>
      <p className={styles.runtimeNote}>{note}</p>
    </div>
  );
}

export function KnowledgeSummaryPage({
  eyebrow,
  title,
  lead,
  heroCards,
  definitionsTitle,
  definitionsNote,
  definitions,
  relationsTitle,
  relationsNote,
  relations,
  relationCodeTitle,
  relationCode,
  questionGroups,
  diagnosticTitle,
  diagnosticNote,
  diagnosticSteps,
  pitfallsTitle,
  pitfallsNote,
  pitfalls,
  rulesTitle,
  rulesNote,
  rules,
  overviewTitle,
  overviewNote,
  themeStyle,
}: KnowledgeSummaryPageProps) {
  const overviewItems = questionGroups.flatMap((group) =>
    group.questions.map((item) => ({ item, label: group.label })),
  );

  return (
    <div className={styles.page} style={themeStyle}>
      <header className={styles.hero}>
        <span className={styles.eyebrow}>{eyebrow}</span>
        <h2>{title}</h2>
        <p className={styles.heroLead}>{lead}</p>
        <div className={styles.heroGrid}>
          {heroCards.map((card) => (
            <article className={styles.heroCard} key={card.label}>
              <span className={styles.eyebrow}>{card.label}</span>
              <strong className={styles.heroStat}>{card.value}</strong>
              <p>{card.detail}</p>
            </article>
          ))}
        </div>
      </header>

      <SectionCard note={definitionsNote} title={definitionsTitle}>
        <div className={styles.definitionGrid}>
          {definitions.map((item) => (
            <article className={styles.definitionCard} key={item.title}>
              <strong>{item.title}</strong>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard note={relationsNote} title={relationsTitle}>
        <div className={styles.relationGrid}>
          {relations.map((item) => (
            <article className={styles.relationCard} key={item.title}>
              <strong>{item.title}</strong>
              <p>{item.detail}</p>
              <span className={styles.signal}>{item.signal}</span>
            </article>
          ))}
        </div>
        <CodeBlock code={relationCode} title={relationCodeTitle} />
      </SectionCard>

      {questionGroups.map((group) => (
        <SectionCard key={group.title} note={group.note} title={group.title}>
          <div className={styles.columns}>
            {group.questions.map((item) => (
              <article className={styles.questionCard} key={item.title}>
                <div className={styles.labelRow}>
                  <span className={styles.label}>{group.label}</span>
                  <span className={styles.label}>Question</span>
                </div>
                <strong>{item.title}</strong>
                <div className={styles.answerBox}>
                  <span>答案</span>
                  <p>{item.answer}</p>
                </div>
                <div className={styles.explainBox}>
                  <span>解读</span>
                  <p>{item.explanation}</p>
                </div>
                <CodeBlock code={item.code} title={item.codeTitle} />
                {item.run && item.runtimeNote ? <RuntimePanel note={item.runtimeNote} run={item.run} /> : null}
              </article>
            ))}
          </div>
        </SectionCard>
      ))}

      <SectionCard note={diagnosticNote} title={diagnosticTitle}>
        <div className={styles.stepsGrid}>
          {diagnosticSteps.map((item) => (
            <article className={styles.ruleCard} key={item.title}>
              <strong>{item.title}</strong>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard note={pitfallsNote} title={pitfallsTitle}>
        <div className={styles.columns}>
          {pitfalls.map((item) => (
            <article className={styles.pitfallCard} key={item.title}>
              <strong>{item.title}</strong>
              <p>{item.detail}</p>
              <ul>
                {item.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard note={rulesNote} title={rulesTitle}>
        <div className={styles.rules}>
          {rules.map((item) => (
            <article className={styles.ruleCard} key={item.title}>
              <strong>{item.title}</strong>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard note={overviewNote} title={overviewTitle}>
        <div className={styles.columns}>
          {overviewItems.map(({ item, label }) => (
            <article className={styles.questionCard} key={item.title}>
              <div className={styles.labelRow}>
                <span className={styles.label}>{label}</span>
              </div>
              <strong>{item.title}</strong>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

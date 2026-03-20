import styles from './InterviewEditorialPage.module.css';

export type EditorialFact = {
  label: string;
  value: string;
};

export type EditorialSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
  code?: string;
  codeTitle?: string;
};

export type EditorialComparisonTable = {
  title: string;
  intro: string;
  headers: [string, string, string];
  rows: ReadonlyArray<readonly [string, string, string]>;
};

type InterviewEditorialPageProps = {
  archiveLabel: string;
  company: string;
  issue: string;
  title: string;
  strapline: string;
  abstract: string;
  leadTitle: string;
  lead: string;
  answerOutline: readonly string[];
  quickAnswer: string;
  pullQuote: string;
  facts: readonly EditorialFact[];
  sections: readonly EditorialSection[];
  interviewTips: readonly string[];
  mistakes: readonly string[];
  comparisonTable?: EditorialComparisonTable;
  singleColumn?: boolean;
};

function CodeFrame({ title, code }: { title: string; code: string }) {
  return (
    <section className={styles.codeFrame}>
      <div className={styles.codeHeader}>
        <span>{title}</span>
        <span>Interview Notes</span>
      </div>
      <pre className={styles.codeBlock}>
        <code>{code}</code>
      </pre>
    </section>
  );
}

export function InterviewEditorialPage({
  archiveLabel,
  company,
  issue,
  title,
  strapline,
  abstract,
  leadTitle,
  lead,
  answerOutline,
  quickAnswer,
  pullQuote,
  facts,
  sections,
  interviewTips,
  mistakes,
  comparisonTable,
  singleColumn,
}: InterviewEditorialPageProps) {
  return (
    <div className={styles.page}>
      <header className={styles.masthead}>
        <div className={styles.issueMeta}>
          <span>{archiveLabel}</span>
          <span>{company}</span>
          <span>{issue}</span>
        </div>
        <h1 className={styles.mastTitle}>THE INTERVIEW LEDGER</h1>
        <p className={styles.mastSubtitle}>
          不背空话，按面试官真正关心的机制、边界和取舍来拆题。
        </p>
      </header>

      <section className={styles.banner}>
        <div>
          <span className={styles.bannerEyebrow}>本题导读</span>
          <h2>{leadTitle}</h2>
          <p>{lead}</p>
        </div>

        <div className={styles.bannerBrief}>
          <span className={styles.sectionEyebrow}>答题主线</span>
          <ol className={styles.questionTicker}>
            {answerOutline.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </div>
      </section>

      {comparisonTable ? (
        <section className={styles.comparisonPanel}>
          <div className={styles.comparisonIntro}>
            <span className={styles.sectionEyebrow}>速览对照</span>
            <h2>{comparisonTable.title}</h2>
            <p>{comparisonTable.intro}</p>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.compareTable}>
              <thead>
                <tr>
                  <th>{comparisonTable.headers[0]}</th>
                  <th>{comparisonTable.headers[1]}</th>
                  <th>{comparisonTable.headers[2]}</th>
                </tr>
              </thead>
              <tbody>
                {comparisonTable.rows.map(([dimension, left, right]) => (
                  <tr key={dimension}>
                    <td>{dimension}</td>
                    <td>{left}</td>
                    <td>{right}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      <article className={styles.story}>
        <header className={styles.storyHeader}>
          <div className={styles.storyIndex}>
            <span className={styles.storyLabel}>Main Story</span>
            <span className={styles.storyBadge}>{company}</span>
          </div>
          <div className={styles.storyHeadlineWrap}>
            <p className={styles.strapline}>{strapline}</p>
            <h2 className={styles.storyTitle}>{title}</h2>
            <p className={styles.storyAbstract}>{abstract}</p>
          </div>
        </header>

        <div className={styles.storyGrid}>
          <div className={styles.storyMain}>
            <section className={styles.quickAnswerBox}>
              <span className={styles.sectionEyebrow}>一分钟直答</span>
              <p>{quickAnswer}</p>
            </section>

            <div className={styles.factGrid}>
              {facts.map((fact) => (
                <div className={styles.factCard} key={fact.label}>
                  <span>{fact.label}</span>
                  <strong>{fact.value}</strong>
                </div>
              ))}
            </div>

            {sections.map((section, index) => (
              <section className={styles.storySection} key={section.title}>
                <div className={styles.storySectionHeader}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <h3>{section.title}</h3>
                </div>
                <div
                  className={`${styles.storyCopy} ${singleColumn ? styles.storyCopySingleColumn : ''}`}
                >
                  {section.paragraphs.map((paragraph, paragraphIndex) => (
                    <p
                      className={paragraphIndex === 0 ? styles.openingParagraph : undefined}
                      key={`${section.title}-${paragraphIndex + 1}`}
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
                {section.bullets ? (
                  <ul className={styles.inlineBulletList}>
                    {section.bullets.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
                {section.code && section.codeTitle ? (
                  <CodeFrame code={section.code} title={section.codeTitle} />
                ) : null}
              </section>
            ))}
          </div>

          <aside className={styles.storyRail}>
            <section className={styles.pullQuote}>
              <span className={styles.sectionEyebrow}>编辑手记</span>
              <p>{pullQuote}</p>
            </section>

            <section className={styles.railCard}>
              <span className={styles.sectionEyebrow}>面试答题法</span>
              <ul className={styles.railList}>
                {interviewTips.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className={styles.railCard}>
              <span className={styles.sectionEyebrow}>易失分点</span>
              <ul className={styles.railList}>
                {mistakes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          </aside>
        </div>
      </article>
    </div>
  );
}

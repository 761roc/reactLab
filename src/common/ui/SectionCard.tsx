import type { PropsWithChildren } from 'react';
import styles from './SectionCard.module.css';

interface SectionCardProps extends PropsWithChildren {
  title: string;
  note?: string;
}

export function SectionCard({ title, note, children }: SectionCardProps) {
  return (
    <section className={styles.card}>
      <header className={styles.header}>
        <h3>{title}</h3>
        {note ? <p>{note}</p> : null}
      </header>
      <div>{children}</div>
    </section>
  );
}

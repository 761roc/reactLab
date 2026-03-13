import { Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { getFeatureById } from '../core/feature-registry';
import styles from './FeatureHost.module.css';

export function FeatureHost() {
  const { featureId } = useParams<{ featureId: string }>();
  const feature = getFeatureById(featureId);

  if (!feature) {
    return (
      <section className={styles.panel}>
        <h2>Unknown Feature</h2>
        <p>Current route does not map to a registered feature module.</p>
      </section>
    );
  }

  const Entry = feature.EntryComponent;
  const content = (
    <Suspense fallback={<p className={styles.loading}>Loading feature module...</p>}>
      <Entry />
    </Suspense>
  );

  return <div className={styles.panel}>{feature.withProviders ? feature.withProviders(content) : content}</div>;
}

import type { PropsWithChildren } from 'react';
import { RecoilRoot } from 'recoil';

export function RecoilDemoProviders({ children }: PropsWithChildren) {
  return <RecoilRoot>{children}</RecoilRoot>;
}

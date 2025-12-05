import { Suspense } from 'react';
import PickupDetailsClient from './PickupDetailsClient';

export default function PickupDetailsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PickupDetailsClient />
    </Suspense>
  );
}

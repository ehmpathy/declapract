import { FileActionPlan } from '../../../../domain';
import { displayPlan } from './displayPlan';

export const displayPlans = async ({ plans }: { plans: FileActionPlan[] }) => {
  const sortedPlans = plans.sort((a, b) => (a.path < b.path ? -1 : 1));
  for (const plan of sortedPlans) {
    await displayPlan({ plan }); // one at a time, sequentially
  }
};

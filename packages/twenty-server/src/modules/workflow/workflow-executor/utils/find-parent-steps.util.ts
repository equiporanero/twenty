import { isDefined } from 'twenty-shared/utils';

import { isWorkflowIfElseAction } from 'src/modules/workflow/workflow-executor/workflow-actions/if-else/guards/is-workflow-if-else-action.guard';
import { type WorkflowAction } from 'src/modules/workflow/workflow-executor/workflow-actions/types/workflow-action.type';

// IF-ELSE steps store their children in settings.input.branches[].nextStepIds,
// not in the step's own nextStepIds. This utility detects both standard and
// IF-ELSE branch parent relationships.
export const findParentSteps = ({
  step,
  steps,
}: {
  step: WorkflowAction;
  steps: WorkflowAction[];
}): WorkflowAction[] => {
  return steps.filter((candidateParent) => {
    if (!isDefined(candidateParent)) {
      return false;
    }

    if (candidateParent.nextStepIds?.includes(step.id)) {
      return true;
    }

    if (isWorkflowIfElseAction(candidateParent)) {
      return candidateParent.settings.input.branches.some(
        (branch) => branch.nextStepIds?.includes(step.id),
      );
    }

    return false;
  });
};

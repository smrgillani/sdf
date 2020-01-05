export interface MessageType {
  name: string;
  icon: string;
  label: string;
  defaultInputType: string;
}

export const messageTypes: MessageType[] = [
  {
    name: 'opinion',
    icon: 'icomoon icon-opinion',
    label: 'Opinion',
    defaultInputType: 'text',
  },
  {
    name: 'decisions',
    icon: 'icomoon icon-decision',
    label: 'Decisions',
    defaultInputType: 'text',
  },
  {
    name: 'argument',
    icon: 'icomoon icon-argument',
    label: 'Argument',
    defaultInputType: 'text',
  },
  {
    name: 'decision_poll',
    icon: 'icomoon icon-poll',
    label: 'Poll',
    defaultInputType: 'poll',
  },
  {
    name: 'assumption',
    icon: 'icomoon icon-assumption',
    label: 'Assumption',
    defaultInputType: 'text',
  },
  {
    name: 'thought_experiment',
    icon: 'icomoon icon-thought',
    label: 'Thought Experiment',
    defaultInputType: 'text',
  },
  {
    name: 'hypothesis',
    icon: 'icomoon icon-hypothesis',
    label: 'Hypothesis',
    defaultInputType: 'text',
  },
  {
    name: 'gut_feeling',
    icon: 'icomoon icon-gut',
    label: 'Gut Feeling',
    defaultInputType: 'text',
  },
];

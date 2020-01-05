/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

interface Window {
  _mfq: any;
  mf: any;
}

interface Mouseflow {
  start();
}

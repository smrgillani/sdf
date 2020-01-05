export function throwIfAlreadyLoaded(parentModule: any, moduleName: string) {
  if (parentModule) {
    throw new Error(`${moduleName} has been loaded already. Import Core modules in the AppModule only.`);
  }
}

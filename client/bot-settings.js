// 1v1 prototype: bots are disabled at the authoritative server level.
// Keep the adapter shape so the rest of the settings/runtime code needs no special cases.
export function mountBotSettings(){
  return {refresh(){},settle(){}};
}

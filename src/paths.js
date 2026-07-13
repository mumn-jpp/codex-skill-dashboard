import path from 'node:path'; import os from 'node:os';
export function resolveRuntimePaths({platform=process.platform,env=process.env,homeDir=os.homedir(),cli={}}={}) {
  const p=platform==='win32'?path.win32:path.posix;
  const codexHome=cli.codexHome||env.CODEX_HOME||p.join(homeDir,'.codex');
  let dataDir=cli.dataDir;
  if(!dataDir){if(platform==='win32') dataDir=p.join(env.LOCALAPPDATA||p.join(homeDir,'AppData','Local'),'CodexSkillDashboard'); else if(platform==='darwin') dataDir=p.join(homeDir,'Library','Application Support','CodexSkillDashboard'); else dataDir=p.join(env.XDG_DATA_HOME||p.join(homeDir,'.local','share'),'codex-skill-dashboard');}
  const roots=[{type:'skills',path:p.join(codexHome,'skills')},{type:'plugin',path:p.join(codexHome,'plugins','cache')},...(cli.scanDirs||[]).map(x=>({type:'external',path:x}))];
  return {codexHome,dataDir,annotationPath:p.join(dataDir,'annotations.json'),scanRoots:roots};
}

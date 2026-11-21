document.addEventListener("DOMContentLoaded", function () {
  const agents = [
    {name:"Astra",role:"Contrôleur"},{name:"Brimstone",role:"Contrôleur"},{name:"Clove",role:"Contrôleur"},{name:"Harbor",role:"Contrôleur"},{name:"Miks",role:"Contrôleur"},{name:"Omen",role:"Contrôleur"},{name:"Viper",role:"Contrôleur"},
    {name:"Iso",role:"Duelliste"},{name:"Jett",role:"Duelliste"},{name:"Neon",role:"Duelliste"},{name:"Phoenix",role:"Duelliste"},{name:"Raze",role:"Duelliste"},{name:"Reyna",role:"Duelliste"},{name:"Waylay",role:"Duelliste"},{name:"Yoru",role:"Duelliste"},
    {name:"Breach",role:"Initiateur"},{name:"Fade",role:"Initiateur"},{name:"Gekko",role:"Initiateur"},{name:"KAY/O",role:"Initiateur"},{name:"Skye",role:"Initiateur"},{name:"Sova",role:"Initiateur"},{name:"Tejo",role:"Initiateur"},
    {name:"Chamber",role:"Sentinelle"},{name:"Cypher",role:"Sentinelle"},{name:"Deadlock",role:"Sentinelle"},{name:"Killjoy",role:"Sentinelle"},{name:"Sage",role:"Sentinelle"},{name:"Veto",role:"Sentinelle"},{name:"Vyse",role:"Sentinelle"}
  ];
  const maps = [
    {name:"Abyss",active:true,sites:"2 sites • grandes lignes de vue",agents:["Jett","Omen","Sova","Cypher","Clove"]},
    {name:"Ascent",active:false,sites:"2 sites • mid important",agents:["Jett","Omen","Sova","Killjoy","KAY/O"]},
    {name:"Bind",active:true,sites:"2 sites • téléporteurs",agents:["Raze","Brimstone","Fade","Viper","Cypher"]},
    {name:"Breeze",active:false,sites:"2 sites • longues distances",agents:["Jett","Viper","Sova","Cypher","Chamber"]},
    {name:"Corrode",active:true,sites:"2 sites • zones étagées",agents:["Omen","Raze","Sova","Killjoy","Breach"]},
    {name:"Fracture",active:false,sites:"2 sites • attaques multiples",agents:["Raze","Brimstone","Breach","Fade","Cypher"]},
    {name:"Haven",active:true,sites:"3 sites • rotations rapides",agents:["Jett","Omen","Sova","Cypher","Breach"]},
    {name:"Icebox",active:false,sites:"2 sites • verticalité",agents:["Jett","Viper","Sova","Killjoy","Sage"]},
    {name:"Lotus",active:true,sites:"3 sites • portes rotatives",agents:["Raze","Omen","Fade","Viper","Killjoy"]},
    {name:"Pearl",active:false,sites:"2 sites • couloirs et mid",agents:["Jett","Astra","Fade","Killjoy","Skye"]},
    {name:"Split",active:false,sites:"2 sites • passages étroits",agents:["Raze","Omen","Breach","Cypher","Sage"]},
    {name:"Summit",active:true,sites:"2 sites • murs modulables",agents:["Jett","Clove","Sova","Vyse","Gekko"]},
    {name:"Sunset",active:true,sites:"2 sites • contrôle du mid",agents:["Raze","Omen","Fade","Cypher","Breach"]}
  ];
  const $ = id => document.getElementById(id);
  const mapGrid=$("mapGrid"), agentGrid=$("agentGrid"), weaponGrid=$("weaponGrid");
  let agentDetails=[];
  let mapDetails=[];
  let weaponDetails=[];
  const detailByName=name=>agentDetails.find(a=>a.displayName.toLowerCase()===name.toLowerCase());
  const mapDetailByName=name=>mapDetails.find(m=>m.displayName.toLowerCase()===name.toLowerCase());
  const randomMap=$("randomMap"), favoriteMap=$("favoriteMap");
  if (!mapGrid || !agentGrid || !randomMap || !favoriteMap) {
    console.error("TimsValorant : un élément HTML nécessaire est introuvable.");
    return;
  }
  const option = m => '<option value="'+m.name+'">'+m.name+(m.active?' • classé':'')+'</option>';
  randomMap.innerHTML=maps.map(option).join("");
  favoriteMap.innerHTML=maps.map(option).join("");
  mapGrid.innerHTML=maps.map(m=>'<article class="map-card" data-map="'+m.name+'" role="button" tabindex="0" aria-label="Voir la fiche de '+m.name+'"><span class="map-status '+(m.active?'':'off')+'">'+(m.active?'● EN CLASSÉ':'○ HORS ROTATION')+'</span><h3>'+m.name+'</h3><p>'+m.sites+'</p><span class="map-card-hint">VOIR LA MAP ↗</span></article>').join("");
  const weaponFilters=$("weaponFilters");
  const weaponCategory=w=>{
    const c=(w.category||"").toLowerCase();
    if(c.includes("sidearm"))return "Sidearm";
    if(c.includes("smg"))return "SMG";
    if(c.includes("shotgun"))return "Shotgun";
    if(c.includes("sniper"))return "Sniper";
    if(c.includes("heavy"))return "Heavy";
    if(c.includes("melee"))return "Melee";
    if(c.includes("rifle"))return "Rifle";
    return "Other";
  };
  const weaponCategoryLabel=c=>({Sidearm:"PISTOLET",SMG:"PM",Shotgun:"FUSIL À POMPE",Rifle:"FUSIL",Sniper:"SNIPER",Heavy:"MITRAILLEUSE",Melee:"CORPS À CORPS",Other:"ARME"})[c]||"ARME";
  function renderWeapons(category){
    if(!weaponGrid)return;
    const items=weaponDetails.filter(w=>category==="Tous"||weaponCategory(w)===category);
    weaponGrid.innerHTML=items.map(w=>'<article class="weapon-card" data-weapon="'+w.uuid+'" role="button" tabindex="0" aria-label="Voir les statistiques de '+w.displayName+'"><h3>'+w.displayName+'</h3><p>'+weaponCategoryLabel(weaponCategory(w))+' <span>• '+(w.shopData&&w.shopData.cost!=null?w.shopData.cost.toLocaleString("fr-FR")+" crédits":"Prix variable")+'</span></p></article>').join("");
  }
  const compareSelectA=$("compareWeaponA"),compareSelectB=$("compareWeaponB"),compareResult=$("compareResult");
  function populateCompareSelects(){
    if(!compareSelectA||!compareSelectB)return;
    const options=weaponDetails.filter(w=>w.weaponStats).map(w=>'<option value="'+w.uuid+'">'+w.displayName+'</option>').join("");
    compareSelectA.innerHTML=options;compareSelectB.innerHTML=options;
    const first=weaponDetails.find(w=>w.displayName==="Vandal")||weaponDetails[0];
    const second=weaponDetails.find(w=>w.displayName==="Phantom")||weaponDetails[1];
    if(first)compareSelectA.value=first.uuid;
    if(second)compareSelectB.value=second.uuid;
  }
  function compareStat(w,key){
    const s=w.weaponStats||{},shop=w.shopData||{};
    if(key==="cost")return shop.cost??null;
    if(key==="magazine")return s.magazineSize??null;
    if(key==="fireRate")return s.fireRate??null;
    if(key==="reload")return s.reloadTimeSeconds??null;
    if(key==="equip")return s.equipTimeSeconds??null;
    if(key==="run")return s.runSpeedMultiplier??null;
    if(key==="wall")return s.wallPenetration||null;
    return null;
  }
  function formatCompare(value,key){
    if(value===null||value===undefined||value==="")return "—";
    if(key==="cost")return Number(value).toLocaleString("fr-FR")+" crédits";
    if(key==="magazine")return value+" balles";
    if(key==="fireRate")return value+" tirs/s";
    if(key==="reload"||key==="equip")return value+" s";
    if(key==="run")return value+"×";
    return String(value).replace("EWallPenetration::","");
  }
  function renderCompare(){
    if(!compareSelectA||!compareSelectB||!compareResult)return;
    const a=weaponDetails.find(w=>w.uuid===compareSelectA.value),b=weaponDetails.find(w=>w.uuid===compareSelectB.value);
    if(!a||!b){compareResult.innerHTML="<p>Les données des armes ne sont pas disponibles.</p>";return;}
    if(a.uuid===b.uuid){compareResult.innerHTML='<p class="compare-warning">Choisis deux armes différentes pour les comparer.</p>';return;}
    const rows=[["Prix","cost","low"],["Chargeur","magazine","high"],["Cadence de tir","fireRate","high"],["Temps de rechargement","reload","low"],["Temps d’équipement","equip","low"],["Vitesse de déplacement","run","high"],["Pénétration","wall","neutral"]];
    const rowHtml=rows.map(([label,key,best])=>{
      const av=compareStat(a,key),bv=compareStat(b,key);
      let aw="",bw="";
      if(best!=="neutral"&&typeof av==="number"&&typeof bv==="number"&&av!==bv){aw=(best==="high"?av>bv:av<bv)?"compare-better":"";bw=(best==="high"?bv>av:bv<av)?"compare-better":"";}
      return '<div class="compare-stat-row"><span class="compare-stat-label">'+label+'</span><strong class="'+aw+'">'+formatCompare(av,key)+'</strong><strong class="'+bw+'">'+formatCompare(bv,key)+'</strong></div>';
    }).join("");
    compareResult.innerHTML='<div class="compare-weapons"><div class="compare-weapon"><img src="'+a.displayIcon+'" alt=""><h4>'+a.displayName+'</h4><span>'+weaponCategoryLabel(weaponCategory(a))+'</span></div><div class="compare-vs large">VS</div><div class="compare-weapon"><img src="'+b.displayIcon+'" alt=""><h4>'+b.displayName+'</h4><span>'+weaponCategoryLabel(weaponCategory(b))+'</span></div></div><div class="compare-table"><div class="compare-table-head"><span>STATISTIQUE</span><strong>'+a.displayName+'</strong><strong>'+b.displayName+'</strong></div>'+rowHtml+'</div><p class="compare-legend"><i></i> Valeur la plus avantageuse selon la statistique (en vert).</p>';
  }
  const compareButton=$("compareButton");
  if(compareButton)compareButton.addEventListener("click",renderCompare);
  function renderAgents(role) {
    agentGrid.innerHTML=agents.filter(a=>role==="Tous"||a.role===role).map(a=>
      '<article class="agent-card" data-agent="'+a.name+'" role="button" tabindex="0" aria-label="Voir la fiche de '+a.name+'"><h3>'+a.name+'</h3><p>'+a.role+'</p></article>'
    ).join("");
  }
  const agentCompareMap=$("agentCompareMap"),agentCompareA=$("agentCompareA"),agentCompareB=$("agentCompareB"),agentCompareResult=$("agentCompareResult");
  function fillAgentCompare(){
    if(!agentCompareMap||!agentCompareA||!agentCompareB)return;
    agentCompareMap.innerHTML=maps.map(m=>'<option value="'+m.name+'">'+m.name+'</option>').join("");
    const opts=agents.map(a=>'<option value="'+a.name+'">'+a.name+' — '+a.role+'</option>').join("");
    agentCompareA.innerHTML=opts;agentCompareB.innerHTML=opts;
    agentCompareA.value="Jett";agentCompareB.value="Raze";
  }
  const mapRoleBonuses={
    Abyss:{Duelliste:0.8,Initiateur:0.7,Contrôleur:0.4,Sentinelle:0.5},
    Ascent:{Duelliste:0.6,Initiateur:0.9,Contrôleur:0.7,Sentinelle:0.8},
    Bind:{Duelliste:0.8,Initiateur:0.7,Contrôleur:0.9,Sentinelle:0.4},
    Breeze:{Duelliste:0.9,Initiateur:0.8,Contrôleur:0.7,Sentinelle:0.4},
    Corrode:{Duelliste:0.7,Initiateur:0.8,Contrôleur:0.8,Sentinelle:0.6},
    Fracture:{Duelliste:0.8,Initiateur:0.9,Contrôleur:0.7,Sentinelle:0.5},
    Haven:{Duelliste:0.8,Initiateur:0.9,Contrôleur:0.7,Sentinelle:0.6},
    Icebox:{Duelliste:0.9,Initiateur:0.7,Contrôleur:0.8,Sentinelle:0.6},
    Lotus:{Duelliste:0.8,Initiateur:0.8,Contrôleur:0.9,Sentinelle:0.6},
    Pearl:{Duelliste:0.7,Initiateur:0.8,Contrôleur:0.8,Sentinelle:0.7},
    Split:{Duelliste:0.8,Initiateur:0.8,Contrôleur:0.9,Sentinelle:0.8},
    Summit:{Duelliste:0.8,Initiateur:0.8,Contrôleur:0.7,Sentinelle:0.7},
    Sunset:{Duelliste:0.8,Initiateur:0.8,Contrôleur:0.9,Sentinelle:0.7}
  };
  function agentMapScore(map,agentName){
    const index=map.agents.indexOf(agentName);
    const agent=agents.find(a=>a.name===agentName);
    if(index>=0)return Math.max(7.2,9.8-index*0.55);
    const role=agent?agent.role:"";
    const roleFit=(mapRoleBonuses[map.name]||{})[role]||0.5;
    const nameSeed=agentName.split("").reduce((sum,ch)=>sum+ch.charCodeAt(0),0);
    const smallVariation=((nameSeed%5)-2)*0.12;
    return Math.max(5.2,Math.min(7.1,5.7+roleFit+smallVariation));
  }
  function agentMapReason(map,agentName,score){
    const index=map.agents.indexOf(agentName);
    const agent=agents.find(a=>a.name===agentName);
    if(index===0)return "Top pick de notre sélection sur "+map.name+" : son kit correspond particulièrement bien aux besoins de cette map.";
    if(index>0)return "Présent dans notre sélection pour "+map.name+" (rang "+(index+1)+"/5), avec un kit intéressant pour cette configuration.";
    const role=agent?agent.role.toLowerCase():"";
    return "Il n’est pas dans notre top 5 éditorial sur "+map.name+", mais son rôle de "+role+" peut rester utile selon la composition et ton style de jeu.";
  }
  function renderAgentCompare(){
    if(!agentCompareMap||!agentCompareA||!agentCompareB||!agentCompareResult)return;
    const map=maps.find(m=>m.name===agentCompareMap.value);
    const nameA=agentCompareA.value,nameB=agentCompareB.value;
    if(nameA===nameB){agentCompareResult.innerHTML='<p class="compare-warning">Choisis deux agents différents pour les comparer.</p>';return;}
    const a=agents.find(x=>x.name===nameA),b=agents.find(x=>x.name===nameB);
    if(!map||!a||!b)return;
    const scoreA=agentMapScore(map,nameA),scoreB=agentMapScore(map,nameB);
    const winner=scoreA===scoreB?null:(scoreA>scoreB?a:b);
    const infoA=detailByName(nameA),infoB=detailByName(nameB);
    const mapInfo=mapDetailByName(map.name);
    const portraitA=infoA&&(infoA.displayIcon||infoA.fullPortrait)||"";
    const portraitB=infoB&&(infoB.displayIcon||infoB.fullPortrait)||"";
    const mapImage=mapInfo&&(mapInfo.splash||mapInfo.listViewIcon)||"";
    const card=(agent,score,reason,portrait)=>'<article class="agent-match-card '+(winner&&winner.name===agent.name?"recommended":"")+'"><div class="agent-match-image">'+(portrait?'<img src="'+portrait+'" alt="Portrait de '+agent.name+'">':'')+'</div><span class="agent-match-role">'+agent.role.toUpperCase()+'</span><h3>'+agent.name+'</h3><div class="agent-match-score"><strong>'+score.toLocaleString("fr-FR",{maximumFractionDigits:1})+'/10</strong><span>INDICE MAP</span></div><p>'+reason+'</p>'+(winner&&winner.name===agent.name?'<span class="agent-match-badge">CHOIX CONSEILLÉ</span>':"")+'</article>';
    agentCompareResult.innerHTML='<div class="agent-match-map">'+(mapImage?'<img src="'+mapImage+'" alt="Visuel de '+map.name+'">':"")+'<div><span class="eyebrow">COMPARAISON SUR</span><h3>'+map.name+'</h3><p>'+map.sites+'</p></div></div><div class="agent-match-grid">'+card(a,scoreA,agentMapReason(map,nameA,scoreA),portraitA)+'<div class="agent-compare-vs big">VS</div>'+card(b,scoreB,agentMapReason(map,nameB,scoreB),portraitB)+'</div><div class="agent-match-verdict"><span class="eyebrow">NOTRE CONSEIL</span><h3>'+(winner?winner.name+" est le choix le plus recommandé sur "+map.name:"Égalité sur "+map.name)+'</h3><p>'+(winner?"D’après le classement de picks intégré à cette map, "+winner.name+" est mieux placé dans notre sélection. "+(winner.name===nameA?agentMapReason(map,nameA,scoreA):agentMapReason(map,nameB,scoreB)):"Les deux agents ont le même indice dans notre sélection. Choisis celui que tu maîtrises le mieux et selon les besoins de ton équipe.")+'</p></div>';
  }
  fillAgentCompare();
  const agentCompareButton=$("agentCompareButton");
  if(agentCompareButton)agentCompareButton.addEventListener("click",renderAgentCompare);
  const mapDataPromise=fetch("https://valorant-api.com/v1/maps?language=fr-FR")
    .then(r=>{if(!r.ok)throw new Error("API maps indisponible");return r.json();})
    .then(data=>{mapDetails=data.data||[];})
    .catch(err=>console.warn("Images des maps indisponibles",err));
  const agentDataPromise=fetch("https://valorant-api.com/v1/agents?isPlayableCharacter=true&language=fr-FR")
    .then(r=>{if(!r.ok)throw new Error("API agents indisponible");return r.json();})
    .then(data=>{agentDetails=data.data||[];const active=document.querySelector(".filter-btn.selected");renderAgents(active?active.dataset.role:"Tous");})
    .catch(err=>console.warn("Fiches agents indisponibles",err));
  Promise.all([agentDataPromise,mapDataPromise]).then(()=>{if(agentCompareResult)renderAgentCompare();});
  const weaponDataPromise=fetch("https://valorant-api.com/v1/weapons?language=fr-FR")
    .then(r=>{if(!r.ok)throw new Error("API armes indisponible");return r.json();})
    .then(data=>{weaponDetails=(data.data||[]).filter(w=>w.displayName&&w.displayIcon);renderWeapons("Tous");populateCompareSelects();})
    .catch(err=>{console.warn("Données des armes indisponibles",err);if(weaponGrid)weaponGrid.innerHTML='<p class="data-note">Impossible de charger les armes pour le moment. Réessaie dans quelques instants.</p>';});
  const agentModal=document.createElement("div");
  agentModal.className="agent-modal";
  agentModal.innerHTML='<div class="agent-modal-backdrop" data-close-agent></div><section class="agent-modal-box" role="dialog" aria-modal="true"><button class="agent-modal-close" type="button" aria-label="Fermer" data-close-agent>×</button><div class="agent-modal-visual"><img id="agentModalImage" alt=""></div><div class="agent-modal-info"><span class="result-kicker" id="agentModalRole"></span><h2 id="agentModalName"></h2><p id="agentModalDescription"></p><h3>COMPÉTENCES</h3><div id="agentModalAbilities" class="agent-abilities"></div></div></section>';
  document.body.appendChild(agentModal);
  async function openAgent(name){
    const base=agents.find(a=>a.name===name);if(!base)return;
    await agentDataPromise;
    const info=detailByName(name);
    $("agentModalName").textContent=name;
    $("agentModalRole").textContent=(info&&info.role?info.role.displayName:base.role).toUpperCase();
    $("agentModalDescription").textContent=info&&info.description?info.description:"Description momentanément indisponible.";
    const img=$("agentModalImage");img.src=info&&(info.fullPortrait||info.fullPortraitV2||info.displayIcon)||"";img.alt="Portrait de "+name;
    $("agentModalAbilities").innerHTML=info&&info.abilities?info.abilities.filter(a=>a.slot!=="Passive").map(a=>'<article><strong>'+a.displayName+'</strong><p>'+a.description+'</p></article>').join(""):"";
    agentModal.classList.add("visible");document.body.classList.add("modal-open");
  }
  function closeAgent(){agentModal.classList.remove("visible");document.body.classList.remove("modal-open");}
  agentGrid.addEventListener("click",e=>{const card=e.target.closest("[data-agent]");if(card)openAgent(card.dataset.agent);});
  agentGrid.addEventListener("keydown",e=>{const card=e.target.closest("[data-agent]");if(card&&(e.key==="Enter"||e.key===" ")){e.preventDefault();openAgent(card.dataset.agent);}});
  agentModal.addEventListener("click",e=>{if(e.target.closest("[data-close-agent]"))closeAgent();});
  document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeAgent();closeMap();closeWeapon();}});
  // Gestion centralisée des clics et du clavier sur les cartes.
  // Le mode capture évite qu'un autre élément de la carte bloque l'ouverture.
  document.addEventListener("click",function(e){
    const mapCard=e.target.closest("[data-map]");
    const agentCard=e.target.closest("[data-agent]");
    const weaponCard=e.target.closest("[data-weapon]");
    if(mapCard){e.preventDefault();e.stopImmediatePropagation();openMap(mapCard.dataset.map);return;}
    if(agentCard){e.preventDefault();e.stopImmediatePropagation();openAgent(agentCard.dataset.agent);return;}
    if(weaponCard){e.preventDefault();e.stopImmediatePropagation();openWeapon(weaponCard.dataset.weapon);return;}
  },true);
  document.addEventListener("keydown",function(e){
    if(e.key!=="Enter"&&e.key!==" ")return;
    const mapCard=e.target.closest("[data-map]");
    const agentCard=e.target.closest("[data-agent]");
    const weaponCard=e.target.closest("[data-weapon]");
    const card=mapCard||agentCard||weaponCard;
    if(!card)return;
    e.preventDefault();e.stopImmediatePropagation();
    if(mapCard)openMap(mapCard.dataset.map);
    else if(agentCard)openAgent(agentCard.dataset.agent);
    else openWeapon(weaponCard.dataset.weapon);
  },true);

  const mapModal=document.createElement("div");
  mapModal.className="map-modal";
  mapModal.innerHTML='<div class="map-modal-backdrop" data-close-map></div><section class="map-modal-box" role="dialog" aria-modal="true"><button class="map-modal-close" type="button" aria-label="Fermer" data-close-map>×</button><div class="map-modal-hero"><img id="mapModalImage" alt=""><div class="map-modal-shade"></div><div class="map-modal-title"><span class="result-kicker" id="mapModalStatus"></span><h2 id="mapModalName"></h2><p id="mapModalSites"></p></div></div><div class="map-modal-content"><div><h3>À CONNAÎTRE SUR CETTE MAP</h3><p id="mapModalDescription"></p></div><div><h3>AGENTS RECOMMANDÉS</h3><p class="map-modal-note">Une sélection indicative selon la configuration de la map. Clique sur un agent pour découvrir sa fiche.</p><div id="mapModalAgents" class="map-agent-list"></div></div></div></section>';
  document.body.appendChild(mapModal);
  async function openMap(name){
    const map=maps.find(m=>m.name===name);if(!map)return;
    await mapDataPromise;
    const info=mapDetailByName(name);
    $("mapModalName").textContent=name;
    $("mapModalStatus").textContent=map.active?"● EN ROTATION COMPÉTITIVE":"○ HORS ROTATION";
    $("mapModalSites").textContent=map.sites;
    $("mapModalDescription").textContent=info&&info.narrativeDescription?info.narrativeDescription:"Découvre les zones, les lignes de vue et les possibilités de rotation de "+name+". Prépare tes placements et coordonne tes compétences avec ton équipe.";
    const mapImg=$("mapModalImage");
    mapImg.src=info&&(info.splash||info.listViewIcon||info.displayIcon)||"";
    mapImg.alt="Visuel de la map "+name;
    $("mapModalAgents").innerHTML=map.agents.map(agentName=>{
      const a=agents.find(x=>x.name===agentName);
      return a?'<button type="button" class="map-agent-chip" data-map-agent="'+a.name+'"><strong>'+a.name+'</strong><span>'+a.role+'</span></button>':"";
    }).join("");
    mapModal.classList.add("visible");document.body.classList.add("modal-open");
  }
  function closeMap(){mapModal.classList.remove("visible");if(!agentModal.classList.contains("visible"))document.body.classList.remove("modal-open");}
  mapGrid.addEventListener("click",e=>{const card=e.target.closest("[data-map]");if(card)openMap(card.dataset.map);});
  mapGrid.addEventListener("keydown",e=>{const card=e.target.closest("[data-map]");if(card&&(e.key==="Enter"||e.key===" ")){e.preventDefault();openMap(card.dataset.map);}});
  mapModal.addEventListener("click",e=>{
    if(e.target.closest("[data-close-map]"))closeMap();
    const agentButton=e.target.closest("[data-map-agent]");
    if(agentButton){closeMap();openAgent(agentButton.dataset.mapAgent);}
  });
  const weaponModal=document.createElement("div");
  weaponModal.className="weapon-modal";
  weaponModal.innerHTML='<div class="weapon-modal-backdrop" data-close-weapon></div><section class="weapon-modal-box" role="dialog" aria-modal="true"><button class="weapon-modal-close" type="button" aria-label="Fermer" data-close-weapon>×</button><div class="weapon-modal-visual"><img id="weaponModalImage" alt=""></div><div class="weapon-modal-info"><span class="result-kicker" id="weaponModalCategory"></span><h2 id="weaponModalName"></h2><p id="weaponModalDescription"></p><div class="weapon-stats" id="weaponModalStats"></div><h3>DÉGÂTS PAR DISTANCE</h3><div id="weaponModalDamage" class="weapon-damage"></div></div></section>';
  document.body.appendChild(weaponModal);
  async function openWeapon(uuid){
    await weaponDataPromise;
    const w=weaponDetails.find(item=>item.uuid===uuid);if(!w)return;
    const category=weaponCategory(w), stats=w.weaponStats||{}, shop=w.shopData||{};
    $("weaponModalName").textContent=w.displayName;
    $("weaponModalCategory").textContent=weaponCategoryLabel(category)+" • "+(shop.cost!=null?shop.cost.toLocaleString("fr-FR")+" CRÉDITS":"PRIX VARIABLE");
    const descriptions={Sidearm:"Arme de poing adaptée aux manches économiques et aux situations de secours.",SMG:"Arme automatique compacte, efficace à courte portée.",Shotgun:"Arme conçue pour les engagements rapprochés.",Rifle:"Arme polyvalente pour les duels à moyenne et longue portée.",Sniper:"Arme de précision pensée pour les tirs à longue distance.",Heavy:"Arme lourde offrant une forte capacité de tir.",Melee:"Arme de corps à corps."};
    $("weaponModalDescription").textContent=descriptions[category]||"Découvre les caractéristiques de cette arme dans l'arsenal VALORANT.";
    const img=$("weaponModalImage");img.src=w.displayIcon||"";img.alt="Visuel de "+w.displayName;
    const statItems=[["Chargeur",stats.magazineSize!=null?stats.magazineSize+" balles":"—"],["Cadence",stats.fireRate!=null?stats.fireRate+" tirs/s":"—"],["Rechargement",stats.reloadTimeSeconds!=null?stats.reloadTimeSeconds+" s":"—"],["Pénétration",stats.wallPenetration?stats.wallPenetration.replace("EWallPenetration::",""):"—"]];
    $("weaponModalStats").innerHTML=statItems.map(s=>'<div><span>'+s[0]+'</span><strong>'+s[1]+'</strong></div>').join("");
    const ranges=stats.damageRanges||[];
    $("weaponModalDamage").innerHTML=ranges.length?ranges.map(r=>'<div class="weapon-damage-row"><strong>'+r.rangeStartMeters+'–'+r.rangeEndMeters+' m</strong><span>Tête : '+(r.headDamage??"—")+'</span><span>Corps : '+(r.bodyDamage??"—")+'</span><span>Jambes : '+(r.legDamage??"—")+'</span></div>').join(""):'<p class="data-note">Données de dégâts non disponibles pour cette arme.</p>';
    weaponModal.classList.add("visible");document.body.classList.add("modal-open");
  }
  function closeWeapon(){weaponModal.classList.remove("visible");if(!agentModal.classList.contains("visible")&&!mapModal.classList.contains("visible"))document.body.classList.remove("modal-open");}
  if(weaponGrid){
    weaponGrid.addEventListener("click",e=>{const card=e.target.closest("[data-weapon]");if(card)openWeapon(card.dataset.weapon);});
    weaponGrid.addEventListener("keydown",e=>{const card=e.target.closest("[data-weapon]");if(card&&(e.key==="Enter"||e.key===" ")){e.preventDefault();openWeapon(card.dataset.weapon);}});
  }
  weaponModal.addEventListener("click",e=>{if(e.target.closest("[data-close-weapon]"))closeWeapon();});
  if(weaponFilters)weaponFilters.querySelectorAll("[data-weapon-category]").forEach(btn=>btn.addEventListener("click",()=>{
    weaponFilters.querySelectorAll(".filter-btn").forEach(b=>b.classList.remove("selected"));
    btn.classList.add("selected");renderWeapons(btn.dataset.weaponCategory);
  }));
  renderAgents("Tous");
  const agentFilters=$("agentFilters");
  if(agentFilters)agentFilters.querySelectorAll(".filter-btn").forEach(btn=>btn.addEventListener("click",function(){
    agentFilters.querySelectorAll(".filter-btn").forEach(b=>b.classList.remove("selected"));
    btn.classList.add("selected");renderAgents(btn.dataset.role);
  }));
  function showAgent(target,agent,kicker,description) {
    target.innerHTML='<div class="result-agent"><span class="result-kicker">'+kicker+'</span><h3>'+agent.name+'</h3><span class="role-pill">'+agent.role.toUpperCase()+'</span><p>'+description+'</p></div>';
  }
  const randomButton=$("randomButton"), randomResult=$("randomResult");
  if(randomButton&&randomResult) randomButton.addEventListener("click",function(){
    const map=maps.find(m=>m.name===randomMap.value);
    const pool=map.agents.map(n=>agents.find(a=>a.name===n)).filter(Boolean);
    const chosen=pool[Math.floor(Math.random()*pool.length)];
    showAgent(randomResult,chosen,"TON AGENT POUR "+map.name.toUpperCase(),"Sélection aléatoire parmi des agents adaptés à cette map. Pense aussi à la composition de ton équipe.");
  });
  const advisorButton=$("advisorButton"), advisorResult=$("advisorResult");
  if(advisorButton&&advisorResult) advisorButton.addEventListener("click",function(){
    const map=maps.find(m=>m.name===$("favoriteMap").value);
    const rank=$("rankSelect").value, style=$("playStyle").value;
    const role=style==="aggressive"?"Duelliste":style==="support"?"Initiateur":style==="defensive"?"Sentinelle":null;
    const pool=map.agents.map(n=>agents.find(a=>a.name===n)).filter(Boolean);
    const chosen=(role&&pool.find(a=>a.role===role))||pool[0];
    const rankTips={Fer:"Concentre-toi sur les bases et joue avec ton équipe.",Bronze:"Travaille tes placements et tes compétences.",Argent:"Communique les informations et joue les trades.",Or:"Prépare un plan et adapte tes rotations.",Platine:"Coordonne tes utilitaires avec ton équipe.",Diamant:"Travaille les timings et les reprises de site.",Ascendant:"Anticipe les habitudes adverses.",Immortel:"Privilégie la coordination et l'adaptation.",Radiant:"Optimise les timings, les informations et les synergies."};
    const styleText=role?"Ton style favorise le rôle "+role.toLowerCase()+".":"Ton style polyvalent favorise un agent flexible.";
    showAgent(advisorResult,chosen,"SUGGESTION • "+map.name.toUpperCase()+" • "+rank.toUpperCase(),styleText+" "+rankTips[rank]+" Conseil indicatif : choisis aussi selon les agents de ton équipe et ceux que tu maîtrises.");
  });
  const budgetButton=$("budgetButton"), budgetResult=$("budgetResult");
  function updateBudget(){
    const credits=Math.max(0,Number($("creditsInput").value)||0);
    const shield=Number($("shieldSelect").value)||0;
    const abilities=Math.max(0,Number($("abilityInput").value)||0);
    const left=credits-shield-abilities;
    budgetResult.innerHTML='<span>CRÉDITS RESTANTS</span><strong style="color:'+(left<0?'#ff7782':'#5ce0a0')+'">'+left.toLocaleString("fr-FR")+'</strong><p>'+(left<0?'Budget dépassé de '+Math.abs(left).toLocaleString("fr-FR")+' crédits.':'Après protections et compétences prévues.')+'</p>';
  }
  if(budgetButton&&budgetResult) budgetButton.addEventListener("click",updateBudget);
  if(budgetResult) updateBudget();
  const menuToggle=$("menuToggle"), mainNav=$("mainNav");
  if(menuToggle&&mainNav){
    menuToggle.addEventListener("click",function(){
      const open=mainNav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded",String(open));menuToggle.textContent=open?"✕":"☰";
    });
    mainNav.querySelectorAll("a").forEach(a=>a.addEventListener("click",function(){
      mainNav.classList.remove("open");menuToggle.setAttribute("aria-expanded","false");menuToggle.textContent="☰";
    }));
  }
  console.info("TimsValorant : outils chargés.");
});

/* Authentification et profils persistants avec Supabase */
document.addEventListener("DOMContentLoaded", function () {
  const accountStatus = document.getElementById("accountStatus");
  const authForms = document.getElementById("accountAuthForms");
  const signupForm = document.getElementById("signupForm");
  const loginForm = document.getElementById("loginForm");
  const profileBox = document.getElementById("accountProfile");
  const profileForm = document.getElementById("profileForm");
  if (!accountStatus || !authForms || !signupForm || !loginForm || !profileBox || !profileForm) return;

  const SUPABASE_URL = "https://mwzsisojquzzjbthxvfl.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_jQOjtI99RK2auSfXhEOSyQ_9WgA2oV6";
  if (!window.supabase || !window.supabase.createClient) {
    accountStatus.textContent = "Le service de comptes n’a pas pu être chargé. Actualise la page dans quelques instants.";
    accountStatus.classList.add("error");
    return;
  }
  const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
  const agentNames = ["Astra","Brimstone","Clove","Harbor","Miks","Omen","Viper","Iso","Jett","Neon","Phoenix","Raze","Reyna","Waylay","Yoru","Breach","Fade","Gekko","KAY/O","Skye","Sova","Tejo","Chamber","Cypher","Deadlock","Killjoy","Sage","Veto","Vyse"];
  const mapOptions = document.getElementById("favoriteMap");
  const mapSelects = ["signupMap","profileMap"].map(id => document.getElementById(id));
  const agentSelects = ["signupAgent","profileAgent"].map(id => document.getElementById(id));
  const mapsMarkup = mapOptions ? mapOptions.innerHTML : "";
  mapSelects.forEach(select => { if (select) select.innerHTML = mapsMarkup; });
  agentSelects.forEach(select => {
    if (select) select.innerHTML = agentNames.map(name => '<option value="' + name + '">' + name + '</option>').join("");
  });

  const headerProfileButton = document.getElementById("headerProfileButton");
  const headerProfileAvatar = document.getElementById("headerProfileAvatar");
  const headerProfileInitial = document.getElementById("headerProfileInitial");
  const headerProfileName = document.getElementById("headerProfileName");
  const profileAvatarPreview = document.getElementById("profileAvatarPreview");
  const profileAvatarInput = document.getElementById("profileAvatarInput");
  let currentAvatarUrl = "";

  function setAvatarImages(url, username) {
    const initial = (username || "J").trim().charAt(0).toUpperCase() || "J";
    currentAvatarUrl = url || "";
    headerProfileInitial.textContent = initial;
    if (url) {
      headerProfileAvatar.src = url;
      headerProfileAvatar.hidden = false;
      headerProfileInitial.hidden = true;
      profileAvatarPreview.src = url;
      profileAvatarPreview.hidden = false;
    } else {
      headerProfileAvatar.removeAttribute("src");
      headerProfileAvatar.hidden = true;
      headerProfileInitial.hidden = false;
      profileAvatarPreview.removeAttribute("src");
      profileAvatarPreview.hidden = true;
    }
    // Le bouton de profil affiche uniquement la photo ou l’initiale, sans pseudo.
  }

  if (headerProfileButton) {
    headerProfileButton.addEventListener("click", () => {
      document.getElementById("account").scrollIntoView({ behavior: "smooth" });
    });
  }
  const openFavoriteMap = document.getElementById("profileOpenMap");
  const openFavoriteAgent = document.getElementById("profileOpenAgent");
  if (openFavoriteMap) openFavoriteMap.addEventListener("click", () => {
    const name = document.getElementById("profileMap").value;
    const card = document.querySelector('[data-map="' + name + '"]');
    if (card) card.click();
  });
  if (openFavoriteAgent) openFavoriteAgent.addEventListener("click", () => {
    const name = document.getElementById("profileAgent").value;
    const card = document.querySelector('[data-agent="' + name + '"]');
    if (card) card.click();
  });

  if (profileAvatarInput) {
    profileAvatarInput.addEventListener("change", () => {
      const file = profileAvatarInput.files && profileAvatarInput.files[0];
      if (!file) return;
      if (!["image/jpeg","image/png","image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024) {
        setStatus("Choisis une image JPG, PNG ou WebP de 5 Mo maximum.", "error");
        profileAvatarInput.value = "";
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      profileAvatarPreview.src = previewUrl;
      profileAvatarPreview.hidden = false;
    });
  }

  const historyList = document.getElementById("playerHistoryList");
  const refreshHistoryButton = document.getElementById("refreshHistoryButton");
  let historyUserId = null;
  function renderHistory(items) {
    if (!historyList) return;
    if (!items || !items.length) {
      historyList.innerHTML = '<p class="history-empty">Aucune activité pour le moment. Consulte une map ou un agent pour commencer ton historique !</p>';
      return;
    }
    historyList.innerHTML = items.map(item => {
      const label = item.item_type === "map" ? "MAP" : "AGENT";
      const date = new Date(item.created_at);
      const dateLabel = date.toLocaleDateString("fr-FR",{day:"2-digit",month:"short"}) + " • " + date.toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"});
      return '<div class="history-row"><span class="history-type">' + label + '</span><strong>' + item.item_name + '</strong><time>' + dateLabel + '</time></div>';
    }).join("");
  }
  async function loadPlayerHistory() {
    if (!historyUserId || !historyList) return;
    historyList.innerHTML = '<p class="history-empty">Chargement de ton historique…</p>';
    const {data,error} = await client.from("player_activity").select("id,item_type,item_name,created_at").eq("user_id",historyUserId).order("created_at",{ascending:false}).limit(12);
    if (error) { historyList.innerHTML = '<p class="history-empty">Historique indisponible. Vérifie que le nouveau script SQL a bien été exécuté.</p>'; return; }
    renderHistory(data);
  }
  async function recordPlayerActivity(type,name) {
    if (!historyUserId || !name) return;
    const {error} = await client.from("player_activity").insert({user_id:historyUserId,item_type:type,item_name:name});
    if (!error) loadPlayerHistory();
  }
  if (refreshHistoryButton) refreshHistoryButton.addEventListener("click",loadPlayerHistory);
  const historyMaps=document.getElementById("mapGrid"), historyAgents=document.getElementById("agentGrid");
  if (historyMaps) historyMaps.addEventListener("click",event=>{const card=event.target.closest(".map-card[data-map]");if(card)recordPlayerActivity("map",card.dataset.map);});
  if (historyAgents) historyAgents.addEventListener("click",event=>{const card=event.target.closest(".agent-card[data-agent]");if(card)recordPlayerActivity("agent",card.dataset.agent);});
  const randomPickButton=document.getElementById("randomButton");
  if (randomPickButton) randomPickButton.addEventListener("click",()=>{const result=document.querySelector("#randomResult .result-agent h3");const mapName=document.getElementById("randomMap").value;if(mapName)recordPlayerActivity("map",mapName);if(result)recordPlayerActivity("agent",result.textContent.trim());});
  const advisorPickButton=document.getElementById("advisorButton");
  if (advisorPickButton) advisorPickButton.addEventListener("click",()=>{const result=document.querySelector("#advisorResult .result-agent h3");const mapName=document.getElementById("favoriteMap").value;if(mapName)recordPlayerActivity("map",mapName);if(result)recordPlayerActivity("agent",result.textContent.trim());});

  function setStatus(message, type) {
    accountStatus.textContent = message;
    accountStatus.classList.remove("success","error");
    if (type) accountStatus.classList.add(type);
  }
  function showLoggedOut() {
    authForms.hidden = false;
    profileBox.hidden = true;
    if (headerProfileButton) headerProfileButton.hidden = true;
    historyUserId = null;
    if (historyList) historyList.innerHTML = '<p class="history-empty">Connecte-toi pour retrouver ton historique personnel.</p>';
  }
  function withTimeout(promise, ms, message) {
    return Promise.race([
      promise,
      new Promise((_, reject) => setTimeout(() => reject(new Error(message)), ms))
    ]);
  }

  async function showProfile(user) {
    if (!user) { showLoggedOut(); return; }
    const { data, error } = await withTimeout(client.from("profiles").select("username,favorite_map,favorite_agent,avatar_url").eq("id", user.id).maybeSingle(), 10000, "Le chargement du profil prend trop de temps. Vérifie ta connexion puis réessaie.");
    if (error) {
      setStatus("Connecté, mais le profil n’est pas encore accessible. Vérifie que le script SQL a bien été exécuté dans Supabase.", "error");
      showLoggedOut();
      return;
    }
    if (!data) {
      setStatus("Compte connecté. Le profil est en cours de création ; actualise la page dans un instant.", "success");
      showLoggedOut();
      return;
    }
    authForms.hidden = true;
    profileBox.hidden = false;
    document.getElementById("profileWelcome").textContent = "BIENVENUE, " + data.username;
    document.getElementById("profileUsername").value = data.username || "";
    document.getElementById("profileMap").value = data.favorite_map || "";
    document.getElementById("profileAgent").value = data.favorite_agent || "";
    document.getElementById("profileShortcutMap").textContent = data.favorite_map || "Non définie";
    document.getElementById("profileShortcutAgent").textContent = data.favorite_agent || "Non défini";
    setAvatarImages(data.avatar_url, data.username);
    historyUserId = user.id;
    loadPlayerHistory();
    if (headerProfileButton) headerProfileButton.hidden = false;
    setStatus("Tu es connecté. Ton profil est synchronisé avec ton compte.", "success");
  }

  signupForm.addEventListener("submit", async event => {
    event.preventDefault();
    const username = document.getElementById("signupUsername").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value;
    const favorite_map = document.getElementById("signupMap").value;
    const favorite_agent = document.getElementById("signupAgent").value;
    if (username.length < 3 || username.length > 20) {
      setStatus("Choisis un pseudo de 3 à 20 caractères.", "error"); return;
    }
    setStatus("Création de ton compte…");
    const { data, error } = await client.auth.signUp({
      email, password,
      options: {
        emailRedirectTo: window.location.origin + window.location.pathname,
        data: { username, favorite_map, favorite_agent }
      }
    });
    if (error) { setStatus(error.message, "error"); return; }
    if (data.session) {
      await showProfile(data.user);
    } else {
      setStatus("Compte créé ! Consulte ta boîte mail pour confirmer ton adresse, puis connecte-toi ici. Pense à vérifier les courriers indésirables.", "success");
      signupForm.reset();
    }
  });

  loginForm.addEventListener("submit", async event => {
    event.preventDefault();
    const submitButton = loginForm.querySelector('button[type="submit"]');
    if (submitButton) submitButton.disabled = true;
    setStatus("Connexion à Supabase…");
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    try {
      const { data, error } = await withTimeout(client.auth.signInWithPassword({ email, password }), 12000, "La connexion prend trop de temps. Vérifie Internet et réessaie dans quelques instants.");
      if (error) { setStatus("Connexion impossible : vérifie ton adresse e-mail, ton mot de passe et la confirmation de ton adresse.", "error"); return; }
      setStatus("Connexion réussie. Chargement du profil…", "success");
      await showProfile(data.user);
    } catch (error) {
      setStatus(error.message || "Une erreur est survenue pendant la connexion. Réessaie.", "error");
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });

  profileForm.addEventListener("submit", async event => {
    event.preventDefault();
    const { data: userData } = await client.auth.getUser();
    if (!userData.user) { showLoggedOut(); setStatus("Reconnecte-toi pour modifier ton profil.", "error"); return; }
    const username = document.getElementById("profileUsername").value.trim();
    if (username.length < 3 || username.length > 20) {
      setStatus("Choisis un pseudo de 3 à 20 caractères.", "error"); return;
    }
    setStatus("Enregistrement des modifications…");
    let avatarUrl = currentAvatarUrl;
    const avatarFile = profileAvatarInput.files && profileAvatarInput.files[0];
    if (avatarFile) {
      setStatus("Envoi de ta photo de profil…");
      const extension = avatarFile.type === "image/png" ? "png" : avatarFile.type === "image/webp" ? "webp" : "jpg";
      const avatarPath = userData.user.id + "/" + Date.now() + "." + extension;
      const { error: uploadError } = await client.storage.from("avatars").upload(avatarPath, avatarFile, {
        upsert: true,
        contentType: avatarFile.type,
        cacheControl: "3600"
      });
      if (uploadError) {
        setStatus("La photo n’a pas pu être envoyée. Vérifie la configuration du stockage Supabase.", "error");
        return;
      }
      const { data: publicData } = client.storage.from("avatars").getPublicUrl(avatarPath);
      avatarUrl = publicData.publicUrl;
    }
    const updates = {
      username,
      favorite_map: document.getElementById("profileMap").value,
      favorite_agent: document.getElementById("profileAgent").value,
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString()
    };
    const { error } = await client.from("profiles").update(updates).eq("id", userData.user.id);
    if (error) {
      setStatus(error.code === "23505" ? "Ce pseudo est déjà utilisé. Choisis-en un autre." : "Impossible d’enregistrer : vérifie la configuration de la table profiles.", "error");
      return;
    }
    await showProfile(userData.user);
  });

  document.getElementById("logoutButton").addEventListener("click", async () => {
    const { error } = await client.auth.signOut();
    if (error) { setStatus("La déconnexion a échoué. Réessaie.", "error"); return; }
    showLoggedOut();
    setStatus("Tu es déconnecté.", "success");
  });

  client.auth.onAuthStateChange((event) => {
    if (event === "SIGNED_OUT") {
      showLoggedOut();
      setStatus("Tu es déconnecté.");
    }
  });

  client.auth.getSession().then(({ data, error }) => {
    if (error) { setStatus("Impossible de vérifier ta session. Actualise la page.", "error"); return; }
    if (data.session) showProfile(data.session.user);
    else { showLoggedOut(); setStatus("Crée un compte ou connecte-toi pour retrouver ton profil sur tes appareils."); }
  });
});

document.addEventListener("DOMContentLoaded",function(){
 const root=document.getElementById("crosshair");if(!root)return;
 const ids=["crosshairColor","crosshairLength","crosshairGap","crosshairThickness","crosshairOpacity","crosshairCenterDot","crosshairOutline"];
 const el=id=>document.getElementById(id),preview=el("crosshairPreview"),status=el("crosshairStatus");
 const presets={classic:{color:"#00ff9c",length:5,gap:3,thickness:2,opacity:100,dot:false,outline:true},dot:{color:"#ffffff",length:1,gap:0,thickness:2,opacity:100,dot:true,outline:true},small:{color:"#00d9ff",length:3,gap:1,thickness:1,opacity:100,dot:false,outline:false},open:{color:"#ffff00",length:7,gap:6,thickness:2,opacity:90,dot:false,outline:true}};
 function draw(){const v={color:el(ids[0]).value,length:+el(ids[1]).value,gap:+el(ids[2]).value,thickness:+el(ids[3]).value,opacity:+el(ids[4]).value,dot:el(ids[5]).checked,outline:el(ids[6]).checked};preview.style.setProperty("--ch-color",v.color);preview.style.setProperty("--ch-opacity",v.opacity/100);preview.style.setProperty("--ch-length",v.length*3+"px");preview.style.setProperty("--ch-gap",v.gap*3+"px");preview.style.setProperty("--ch-thickness",v.thickness*2+"px");preview.style.setProperty("--ch-outline",v.outline?"2px":"0px");preview.classList.toggle("has-dot",v.dot);["Length","Gap","Thickness"].forEach((n,i)=>el("crosshair"+n+"Value").textContent=[v.length,v.gap,v.thickness][i]);el("crosshairOpacityValue").textContent=v.opacity+"%";return v;}
 function apply(v){el(ids[0]).value=v.color;el(ids[1]).value=v.length;el(ids[2]).value=v.gap;el(ids[3]).value=v.thickness;el(ids[4]).value=v.opacity;el(ids[5]).checked=v.dot;el(ids[6]).checked=v.outline;draw();}
 ids.forEach(id=>el(id).addEventListener("input",draw));
 root.querySelectorAll("[data-crosshair-preset]").forEach(b=>b.addEventListener("click",()=>apply(presets[b.dataset.crosshairPreset])));
 el("crosshairRandom").addEventListener("click",()=>apply({color:["#00ff9c","#ffffff","#ff4655","#00d9ff","#ffff00","#ff70d9"][Math.floor(Math.random()*6)],length:1+Math.floor(Math.random()*9),gap:Math.floor(Math.random()*8),thickness:1+Math.floor(Math.random()*4),opacity:80+Math.floor(Math.random()*5)*5,dot:Math.random()>.7,outline:Math.random()>.25}));
 el("crosshairCopy").addEventListener("click",async()=>{const v=draw();const summary="Réglages de viseur TimsValorant\nCouleur : "+v.color+"\nLongueur : "+v.length+"\nÉcartement : "+v.gap+"\nÉpaisseur : "+v.thickness+"\nOpacité : "+v.opacity+"%\nPoint central : "+(v.dot?"Oui":"Non")+"\nContour : "+(v.outline?"Oui":"Non");try{await navigator.clipboard.writeText(summary);status.textContent="Réglages copiés !";}catch(e){status.textContent="Copie indisponible sur ce navigateur."; }});
 apply(presets.classic);
});
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
 el("crosshairCopy").addEventListener("click",async()=>{const v=draw();const summary="Réglages de viseur TimsValorant\\nCouleur : "+v.color+"\\nLongueur : "+v.length+"\\nÉcartement : "+v.gap+"\\nÉpaisseur : "+v.thickness+"\\nOpacité : "+v.opacity+"%\\nPoint central : "+(v.dot?"Oui":"Non")+"\\nContour : "+(v.outline?"Oui":"Non");try{await navigator.clipboard.writeText(summary);status.textContent="Réglages copiés !";}catch(e){status.textContent="Copie indisponible sur ce navigateur.";}});
 apply(presets.classic);
});

/* TimsValorant skins catalogue */
document.addEventListener("DOMContentLoaded",function(){
 const root=document.getElementById("skins");if(!root)return;
 const grid=document.getElementById("skinsGrid"),status=document.getElementById("skinsStatus"),search=document.getElementById("skinSearch"),category=document.getElementById("skinCategory"),more=document.getElementById("skinsLoadMore"),modal=document.getElementById("skinModal");
 const $=id=>document.getElementById(id);let skins=[],weapons=[],visible=24;
 const categoryFor=weapon=>{const raw=(weapon?.category||"").toLowerCase();if(raw.includes("sidearm"))return"Sidearm";if(raw.includes("smg"))return"SMG";if(raw.includes("shotgun"))return"Shotgun";if(raw.includes("sniper"))return"Sniper";if(raw.includes("heavy"))return"Heavy";if(raw.includes("melee"))return"Melee";if(raw.includes("rifle"))return"Rifle";const n=(weapon?.displayName||"").toLowerCase();if(["classic","shorty","frenzy","ghost","sheriff"].includes(n))return"Sidearm";if(["stinger","spectre"].includes(n))return"SMG";if(["bucky","judge"].includes(n))return"Shotgun";if(["bulldog","guardian","phantom","vandal"].includes(n))return"Rifle";if(["marshal","operator"].includes(n))return"Sniper";if(["ares","odin"].includes(n))return"Heavy";if(n.includes("melee")||n.includes("mêlée"))return"Melee";return"Other";};
 const safe=value=>String(value||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 function filtered(){const q=search.value.trim().toLowerCase(),cat=category.value;return skins.filter(s=>(cat==="all"||s.category===cat)&&(!q||(s.name+" "+s.weapon).toLowerCase().includes(q)));}
 function render(){const items=filtered(),shown=items.slice(0,visible);grid.innerHTML=shown.map((s,i)=>'<button type="button" class="skin-card" data-skin-index="'+skins.indexOf(s)+'"><span class="skin-card-image">'+(s.image?'<img loading="lazy" src="'+safe(s.image)+'" alt="">':'<span class="skin-no-image">TV</span>')+'</span><span class="skin-card-info"><strong>'+safe(s.name)+'</strong><small>'+safe(s.weapon)+'</small></span></button>').join("");status.textContent=items.length?items.length+" skin(s) trouvé(s).":"Aucun skin ne correspond à ta recherche.";more.hidden=items.length<=visible;}
 function openSkin(s){$("skinModalTitle").textContent=s.name;$("skinModalWeapon").textContent=s.weapon+" • "+s.tier;$("skinModalImage").src=s.image||"";$("skinModalImage").alt=s.name;$("skinModalDescription").textContent="Variantes disponibles : "+(s.chromas.length||0)+". Les variantes sont affichées ci-dessous lorsqu’une image est disponible.";const holder=$("skinModalChromas");holder.innerHTML=s.chromas.map((c,i)=>'<button type="button" class="skin-chroma" data-chroma="'+i+'">'+(c.displayIcon?'<img src="'+safe(c.displayIcon)+'" alt="">':'<span>◆</span>')+'<small>'+safe(c.displayName||("Variante "+(i+1)))+'</small></button>').join("");holder.querySelectorAll("[data-chroma]").forEach(b=>b.addEventListener("click",()=>{const c=s.chromas[+b.dataset.chroma];$("skinModalImage").src=c.displayIcon||s.image;$("skinModalTitle").textContent=c.displayName||s.name;}));modal.hidden=false;document.body.style.overflow="hidden";}
 function closeSkin(){modal.hidden=true;document.body.style.overflow="";}
 grid.addEventListener("click",e=>{const card=e.target.closest("[data-skin-index]");if(card)openSkin(skins[+card.dataset.skinIndex]);});
 modal.querySelectorAll("[data-skin-close]").forEach(b=>b.addEventListener("click",closeSkin));
 document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!modal.hidden)closeSkin();});
 search.addEventListener("input",()=>{visible=24;render();});category.addEventListener("change",()=>{visible=24;render();});
 more.addEventListener("click",()=>{visible+=24;render();});
 async function load(){try{const [skinRes,weaponRes]=await Promise.all([fetch("https://valorant-api.com/v1/weapons/skins?language=fr-FR"),fetch("https://valorant-api.com/v1/weapons?language=fr-FR")]);if(!skinRes.ok||!weaponRes.ok)throw new Error("API indisponible");const [skinJson,weaponJson]=await Promise.all([skinRes.json(),weaponRes.json()]);weapons=weaponJson.data||[];const weaponById=new Map(weapons.map(w=>[w.uuid,w]));skins=(skinJson.data||[]).filter(s=>s.displayName&&s.displayIcon&&!s.displayName.toLowerCase().includes("standard")).map(s=>{const w=weaponById.get(s.weaponUuid);return{name:s.displayName,image:s.displayIcon,weapon:w?.displayName||"Arme",category:categoryFor(w),tier:s.contentTierUuid?"Collection":"Skin",chromas:(s.chromas||[]).filter(c=>c.displayIcon||c.fullRender)};});skins.sort((a,b)=>a.name.localeCompare(b.name,"fr"));status.textContent="Catalogue chargé.";render();}catch(e){status.textContent="Impossible de charger les skins pour le moment. Réessaie dans quelques instants.";grid.innerHTML='<div class="skins-error">Le catalogue dépend d’une API publique externe. Vérifie ta connexion puis actualise la page.</div>';}}
 load();
});

/* TimsValorant team builder */
document.addEventListener("DOMContentLoaded",function(){
 const root=document.getElementById("team");if(!root)return;
 const agents=[{n:"Astra",r:"Contrôleur"},{n:"Brimstone",r:"Contrôleur"},{n:"Clove",r:"Contrôleur"},{n:"Harbor",r:"Contrôleur"},{n:"Miks",r:"Contrôleur"},{n:"Omen",r:"Contrôleur"},{n:"Viper",r:"Contrôleur"},{n:"Iso",r:"Duelliste"},{n:"Jett",r:"Duelliste"},{n:"Neon",r:"Duelliste"},{n:"Phoenix",r:"Duelliste"},{n:"Raze",r:"Duelliste"},{n:"Reyna",r:"Duelliste"},{n:"Waylay",r:"Duelliste"},{n:"Yoru",r:"Duelliste"},{n:"Breach",r:"Initiateur"},{n:"Fade",r:"Initiateur"},{n:"Gekko",r:"Initiateur"},{n:"KAY/O",r:"Initiateur"},{n:"Skye",r:"Initiateur"},{n:"Sova",r:"Initiateur"},{n:"Tejo",r:"Initiateur"},{n:"Chamber",r:"Sentinelle"},{n:"Cypher",r:"Sentinelle"},{n:"Deadlock",r:"Sentinelle"},{n:"Killjoy",r:"Sentinelle"},{n:"Sage",r:"Sentinelle"},{n:"Veto",r:"Sentinelle"},{n:"Vyse",r:"Sentinelle"}];
 const maps=[{n:"Abyss",p:["Jett","Omen","Sova","Cypher","Clove"]},{n:"Ascent",p:["Jett","Omen","Sova","Killjoy","KAY/O"]},{n:"Bind",p:["Raze","Brimstone","Fade","Viper","Cypher"]},{n:"Breeze",p:["Jett","Viper","Sova","Cypher","Chamber"]},{n:"Corrode",p:["Omen","Raze","Sova","Killjoy","Breach"]},{n:"Fracture",p:["Raze","Brimstone","Breach","Fade","Cypher"]},{n:"Haven",p:["Jett","Omen","Sova","Cypher","Breach"]},{n:"Icebox",p:["Jett","Viper","Sova","Killjoy","Sage"]},{n:"Lotus",p:["Raze","Omen","Fade","Viper","Killjoy"]},{n:"Pearl",p:["Jett","Astra","Fade","Killjoy","Skye"]},{n:"Split",p:["Raze","Omen","Breach","Cypher","Sage"]},{n:"Summit",p:["Jett","Clove","Sova","Vyse","Gekko"]},{n:"Sunset",p:["Raze","Omen","Fade","Cypher","Breach"]}];
 const $=id=>document.getElementById(id),mapSel=$("teamMap"),roster=$("teamRoster"),roles=$("teamRoleGrid"),score=$("teamScore"),advice=$("teamAdvice"),status=$("teamStatus");
 const opts='<option value="">Choisir un agent</option>'+agents.map(a=>'<option value="'+a.n+'">'+a.n+' — '+a.r+'</option>').join("");
 mapSel.innerHTML=maps.map(m=>'<option value="'+m.n+'">'+m.n+'</option>').join("");
 const players=Array.from({length:5},(_,i)=>({name:"Joueur "+(i+1),agent:""}));
 function render(){roster.innerHTML=players.map((p,i)=>'<article class="team-player"><div class="team-player-top"><span>JOUEUR 0'+(i+1)+'</span><span class="team-player-role">'+(agents.find(a=>a.n===p.agent)?.r||"Rôle à définir")+'</span></div><label>PSEUDO<input type="text" maxlength="18" data-player-name="'+i+'" value="'+p.name.replace(/&/g,"&amp;").replace(/"/g,"&quot;")+'" placeholder="Pseudo du joueur"></label><label>AGENT<select data-player-agent="'+i+'">'+opts+'</select></label></article>').join("");players.forEach((p,i)=>{roster.querySelector('[data-player-agent="'+i+'"]').value=p.agent;});analyze();}
 function analyze(){const chosen=players.map(p=>agents.find(a=>a.n===p.agent)).filter(Boolean),counts={"Duelliste":0,"Initiateur":0,"Contrôleur":0,"Sentinelle":0};chosen.forEach(a=>counts[a.r]++);score.textContent=chosen.length+"/5";roles.innerHTML=Object.entries(counts).map(([r,n])=>'<div class="team-role-stat"><span>'+r+'</span><strong>'+n+'</strong><small>'+ (n?"Présent":"Manquant")+'</small></div>').join("");const missing=Object.keys(counts).filter(r=>!counts[r]);const duplicates=players.map(p=>p.agent).filter(Boolean).filter((v,i,a)=>a.indexOf(v)!==i);if(chosen.length<5)advice.textContent="Il te reste "+(5-chosen.length)+" agent(s) à choisir pour compléter la composition.";else if(missing.length)advice.textContent="Rôle(s) absent(s) : "+missing.join(", ")+". Pense à équilibrer ta composition.";else if(duplicates.length)advice.textContent="Un même agent est sélectionné plusieurs fois. Chaque joueur doit choisir un agent différent.";else advice.textContent="Les quatre rôles sont représentés : ta composition est équilibrée sur le papier. Vérifie que chacun maîtrise son agent.";return{chosen,counts,missing,duplicates};}
 roster.addEventListener("input",e=>{const i=e.target.dataset.playerName;if(i!==undefined)players[+i].name=e.target.value;});
 roster.addEventListener("change",e=>{const i=e.target.dataset.playerAgent;if(i!==undefined){players[+i].agent=e.target.value;render();}});
 $("teamSuggest").addEventListener("click",()=>{const map=maps.find(m=>m.n===mapSel.value)||maps[0];map.p.forEach((name,i)=>{players[i].agent=name;});render();status.textContent="Composition conseillée pour "+map.n+" chargée. Tu peux la modifier.";});
 $("teamReset").addEventListener("click",()=>{players.forEach((p,i)=>{p.name="Joueur "+(i+1);p.agent="";});render();status.textContent="Composition réinitialisée.";});
 mapSel.addEventListener("change",()=>{status.textContent="Map sélectionnée : "+mapSel.value+". Tu peux demander une composition conseillée.";});
 const teamName=$("teamName"),teamStorageKey="timsvalorant-team-v1";
 $("teamSave").addEventListener("click",()=>{try{localStorage.setItem(teamStorageKey,JSON.stringify({name:teamName.value,map:mapSel.value,players}));status.textContent="Team sauvegardée sur cet appareil !";}catch(e){status.textContent="Sauvegarde indisponible sur ce navigateur.";}});
 $("teamLoad").addEventListener("click",()=>{try{const saved=JSON.parse(localStorage.getItem(teamStorageKey)||"null");if(!saved||!Array.isArray(saved.players)||saved.players.length!==5)throw new Error("Aucune sauvegarde");teamName.value=typeof saved.name==="string"?saved.name:"";if(maps.some(m=>m.n===saved.map))mapSel.value=saved.map;saved.players.forEach((p,i)=>{players[i].name=typeof p.name==="string"?p.name:"Joueur "+(i+1);players[i].agent=agents.some(a=>a.n===p.agent)?p.agent:"";});render();status.textContent="Ta team sauvegardée a été chargée.";}catch(e){status.textContent="Aucune team sauvegardée sur cet appareil.";}});
 $("teamCopy").addEventListener("click",async()=>{const map=mapSel.value;const lines=["TIMSVALORANT — "+(teamName.value.trim()||"TEAM"),"Map : "+map,...players.map((p,i)=>"Joueur "+(i+1)+" : "+(p.name||"Joueur "+(i+1))+" — "+(p.agent||"À choisir"))];try{await navigator.clipboard.writeText(lines.join("\\n"));status.textContent="Composition copiée !";}catch(e){status.textContent="Copie indisponible sur ce navigateur.";}});render(););
});

/* Guide tactique par map */
document.addEventListener("DOMContentLoaded",function(){
 const select=document.getElementById("strategyMap"),grid=document.getElementById("strategyGrid");
 if(!select||!grid)return;
 const guides={
 "Abyss":{intro:"Les longues lignes de vue et les accès verticaux demandent une prise d'espace coordonnée.",attack:[["Prendre l'information","Avancez par petits groupes et utilisez les utilitaires pour vérifier les angles éloignés avant de traverser les zones ouvertes."],["Créer un décalage","Faites pression sur un accès pendant que deux joueurs préparent une entrée différente. Évitez de tous vous exposer sur la même ligne."],["Sécuriser le post-plant","Après la pose, jouez les croisements et gardez un joueur en mesure de surveiller les retours."]],defense:[["Jouer les lignes ensemble","Placez-vous pour vous aider mutuellement : un joueur prend l'information, l'autre peut échanger le duel."],["Protéger les accès","Gardez de l'utilitaire pour ralentir une entrée et ne dépensez pas tout au début de la manche."],["Attention aux chutes","Vérifiez les chemins verticaux et les accès inhabituels avant de tourner vers l'autre site."]]},
 "Ascent":{intro:"Le contrôle du milieu facilite les rotations et ouvre plusieurs options d'attaque.",attack:[["Disputer le milieu","Prenez progressivement le contrôle du mid avec de l'information et des fumigènes pour couper les lignes dangereuses."],["Ouvrir un site à deux","Coordonnez flash ou reconnaissance avec l'entrée du premier joueur. Un coéquipier doit pouvoir échanger rapidement."],["Garder une option","Ne révélez pas toute l'équipe trop tôt : conservez un joueur pour punir une rotation."]],defense:[["Ne pas abandonner le mid","Contestez le milieu avec prudence et récupérez l'information avant de reculer."],["Retarder les entrées","Utilisez les utilitaires sur les passages principaux pour faire perdre du temps à l'attaque."],["Jouer les reprises ensemble","Si le site est perdu, regroupez-vous et combinez vos capacités au lieu d'entrer un par un."]]},
 "Bind":{intro:"Les téléporteurs créent des rotations rapides et permettent de brouiller les pistes.",attack:[["Faire parler les téléporteurs","Utilisez les téléporteurs pour déplacer la pression, mais ne répétez pas toujours le même timing."],["Prendre Hookah ou Short","Obtenez l'espace avec des utilitaires coordonnés avant de vous engager dans le site."],["Varier le rythme","Alternez prise d'espace lente et exécution rapide pour empêcher la défense de lire votre plan."]],defense:[["Surveiller les deux accès","Organisez les échanges entre les joueurs de Hookah, Short et les sites pour éviter les duels isolés."],["Garder une capacité","Conservez un ralentissement ou une fumée pour stopper l'entrée au moment du contact."],["Lire les téléporteurs","Un bruit de téléporteur est une information, pas une preuve : vérifiez avant de faire tourner toute l'équipe."]]},
 "Breeze":{intro:"Les distances sont importantes : l'information, les fumigènes et le choix des duels comptent beaucoup.",attack:[["Couper les lignes longues","Placez les fumigènes avant de traverser les zones exposées et évitez les déplacements isolés."],["Écarter la défense","Prenez de l'espace sur plusieurs accès pour obliger les défenseurs à choisir où regarder."],["Préparer le plant","Désignez un joueur pour couvrir les longues lignes pendant que les autres sécurisent le site."]],defense:[["Éviter les duels gratuits","Jouez les angles avec un coéquipier et reculez si l'attaque utilise beaucoup d'utilitaires."],["Garder l'information","Un joueur peut observer une zone pendant que les autres restent prêts à aider l'autre site."],["Reprendre avec les fumées","Pour retake, coupez les lignes de vue et avancez ensemble plutôt que de traverser à découvert."]]},
 "Corrode":{intro:"Les changements de hauteur et les accès resserrés rendent le contrôle de l'espace essentiel.",attack:[["Nettoyer les hauteurs","Vérifiez les positions surélevées avec reconnaissance et utilitaires avant de progresser."],["Prendre les zones étape par étape","Sécurisez une première zone, stabilisez-vous, puis avancez avec les joueurs capables d'échanger."],["Ne pas forcer le plant","Si la défense tient les accès, récupérez de l'information et changez de point d'entrée."]],defense:[["Jouer les hauteurs intelligemment","Utilisez les différences de niveau pour obtenir de l'information sans rester bloqué."],["Ralentir les passages","Gardez des capacités pour les accès étroits et communiquez dès que l'attaque utilise ses utilitaires."],["Préparer la rotation","Évitez les rotations trop précoces : confirmez le site visé avant de quitter votre position."]]},
 "Fracture":{intro:"La pression peut venir de plusieurs directions : la communication et les timings sont prioritaires.",attack:[["Synchroniser les deux côtés","Répartissez l'équipe pour créer une pression coordonnée, puis engagez-vous ensemble au signal."],["Forcer les utilitaires","Montrez une présence sur un accès pour faire dépenser la défense, puis exploitez l'espace ailleurs."],["Garder le contact","Les joueurs séparés doivent annoncer leurs informations rapidement pour éviter les entrées désynchronisées."]],defense:[["Ne pas défendre seul","Placez des joueurs capables de se soutenir sur chaque côté et prévoyez un chemin de renfort."],["Identifier la vraie attaque","Ne tournez pas sur une simple présence : attendez une information solide ou plusieurs utilitaires."],["Reprendre en équipe","Choisissez un point de regroupement et combinez les capacités avant de reprendre le site."]]},
 "Haven":{intro:"Avec trois sites, les rotations et la gestion de l'information sont déterminantes.",attack:[["Étendre la défense","Montrez une présence sur deux zones pour obtenir de l'espace, puis regroupez-vous rapidement."],["Contrôler les liens","Le contrôle des connexions entre les sites facilite les changements de plan."],["Protéger le porteur du spike","Gardez un joueur proche du spike et évitez de le laisser isolé pendant les prises d'espace."]],defense:[["Équilibrer les trois sites","Répartissez les joueurs et prévoyez qui peut aider chaque site sans abandonner toute une zone."],["Retarder plutôt que chasser","Votre objectif est de gagner du temps et de transmettre l'information, pas de poursuivre l'attaque."],["Surveiller les rotations","Gardez un joueur en mesure de vérifier les passages centraux avant de déplacer les renforts."]]},
 "Icebox":{intro:"Les hauteurs, les cordes et les angles verticaux rendent le nettoyage des positions indispensable.",attack:[["Nettoyer les hauteurs","Vérifiez les positions élevées avant de traverser le site et accompagnez l'entrée avec de l'utilitaire."],["Couper les lignes","Placez les fumigènes pour isoler les angles dangereux et faciliter le plant."],["Protéger l'après-plant","Jouez les positions croisées et évitez de tous vous placer au même endroit."]],defense:[["Protéger les accès verticaux","Vérifiez les cordes et les positions élevées pour éviter les surprises."],["Ne pas surjouer le contact","Repliez-vous si l'attaque prend l'espace avec beaucoup d'utilitaires, puis préparez une reprise."],["Coordonner la reprise","Utilisez les fumigènes et les capacités de zone avant de reprendre les angles un par un."]]},
 "Lotus":{intro:"Les trois sites et les portes destructibles offrent plusieurs possibilités de rotation.",attack:[["Prendre le contrôle central","Sécurisez les zones de connexion pour garder le choix entre les sites."],["Utiliser les portes avec intention","Les portes peuvent masquer une rotation ou isoler un duel : annoncez leur utilisation à l'équipe."],["Garder un lurker utile","Un joueur peut surveiller les rotations, mais doit rester assez proche pour rejoindre l'exécution."]],defense:[["Ne pas se laisser attirer","Les portes et les bruits peuvent créer de fausses informations : confirmez avant de tourner."],["Jouer les retards","Gardez des capacités pour ralentir une entrée et permettre aux renforts d'arriver."],["Préparer le retake","Sur trois sites, choisissez rapidement un point de regroupement si le site est perdu."]]},
 "Pearl":{intro:"Le milieu et les longues connexions permettent de déplacer la pression d'un site à l'autre.",attack:[["Gagner le mid","Prenez progressivement les zones centrales pour ouvrir plusieurs chemins vers les sites."],["Isoler les angles","Utilisez les fumigènes et la reconnaissance pour réduire le nombre d'angles à vérifier."],["Changer de site","Si l'accès est bloqué, faites une rotation groupée plutôt que de forcer un passage."]],defense:[["Contester sans s'exposer","Prenez l'information au milieu avec une possibilité de repli."],["Protéger les connexions","Gardez un œil sur les passages qui relient le mid aux sites."],["Garder les utilitaires de reprise","Ne dépensez pas toutes vos capacités pour le premier contact si une reprise est probable."]]},
 "Split":{intro:"Les couloirs étroits et les zones en hauteur rendent les fumigènes et les prises de contrôle du mid très utiles.",attack:[["Contrôler le mid","Prenez le milieu avec des capacités de zone et préparez une montée coordonnée."],["Entrer avec un échange","Le premier joueur ne doit pas être seul : un coéquipier doit pouvoir échanger immédiatement."],["Éviter les goulots","Ne vous empilez pas dans un passage étroit face aux capacités de zone."]],defense:[["Tenir les passages","Utilisez les capacités pour ralentir les entrées dans les couloirs et les montées."],["Protéger les hauteurs","Surveillez les accès vers les zones élevées et annoncez les changements de niveau."],["Reculer ensemble","Si l'attaque prend le mid, adaptez les positions sans offrir de duels isolés."]]},
 "Summit":{intro:"Cette carte demande de bien lire les accès et de profiter des couvertures disponibles.",attack:[["Prendre l'information avant d'avancer","Envoyez une capacité de reconnaissance ou un joueur mobile pour vérifier les angles."],["Créer deux menaces","Faites pression sur deux accès pour étirer la défense avant de choisir le site."],["Protéger les lignes de repli","Après le plant, gardez des positions qui permettent de vous aider mutuellement."]],defense:[["Garder des positions croisées","Placez les joueurs pour qu'ils puissent se soutenir sans offrir plusieurs duels séparés."],["Réagir aux utilitaires","Annoncez les capacités utilisées et adaptez la défense avant l'entrée sur site."],["Ne pas donner l'espace gratuitement","Contestez les zones importantes quand c'est possible, puis repliez-vous avec un plan."]]},
 "Sunset":{intro:"Le contrôle du mid ouvre des possibilités de rotation et aide à couper les renforts.",attack:[["Prendre le mid ensemble","Utilisez reconnaissance et fumigènes pour obtenir le contrôle du milieu avant de choisir votre site."],["Créer une pression sur B","Faites avancer l'équipe avec des utilitaires coordonnés et gardez un joueur pour surveiller les rotations."],["Éviter les entrées isolées","Attendez que les capacités de l'équipe soient prêtes avant de lancer l'exécution."]],defense:[["Protéger le mid","Gardez une présence ou de l'utilitaire pour empêcher l'attaque de circuler librement."],["Surveiller les passages","Communiquez les présences sur les accès A et B avant de déplacer les renforts."],["Retake coordonné","Si le site est pris, regroupez les joueurs et utilisez les capacités pour reprendre l'espace progressivement."]]}
 };
 const recommended={"Abyss":["Jett","Omen","Sova","Cypher","Clove"],"Ascent":["Jett","Omen","Sova","Killjoy","KAY/O"],"Bind":["Raze","Brimstone","Fade","Viper","Cypher"],"Breeze":["Jett","Viper","Sova","Cypher","Chamber"],"Corrode":["Omen","Raze","Sova","Killjoy","Breach"],"Fracture":["Raze","Brimstone","Breach","Fade","Cypher"],"Haven":["Jett","Omen","Sova","Cypher","Breach"],"Icebox":["Jett","Viper","Sova","Killjoy","Sage"],"Lotus":["Raze","Omen","Fade","Viper","Killjoy"],"Pearl":["Jett","Astra","Fade","Killjoy","Skye"],"Split":["Raze","Omen","Breach","Cypher","Sage"],"Summit":["Jett","Clove","Sova","Vyse","Gekko"],"Sunset":["Raze","Omen","Fade","Cypher","Breach"]};
 let side="attack";
 select.innerHTML=Object.keys(guides).map(n=>'<option value="'+n+'">'+n+'</option>').join("");
 function render(){const name=select.value,guide=guides[name]||guides.Ascent;document.getElementById("strategyMapTitle").textContent=name;document.getElementById("strategyMapIntro").textContent=guide.intro;grid.innerHTML=guide[side].map((item,i)=>'<article class="strategy-card"><span>0'+(i+1)+' / '+(side==="attack"?"ATTAQUE":"DÉFENSE")+'</span><h3>'+item[0]+'</h3><p>'+item[1]+'</p></article>').join("");document.getElementById("strategyAgents").innerHTML='<span class="eyebrow">AGENTS À ENVISAGER SUR '+name.toUpperCase()+'</span><div>'+recommended[name].map(a=>'<span>'+a+'</span>').join("")+'</div>';}
 select.addEventListener("change",render);
 document.querySelectorAll("[data-strategy-side]").forEach(btn=>btn.addEventListener("click",()=>{side=btn.dataset.strategySide;document.querySelectorAll("[data-strategy-side]").forEach(b=>{const active=b===btn;b.classList.toggle("active",active);b.setAttribute("aria-pressed",String(active));});render();}));
 render();
});

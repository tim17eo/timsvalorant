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
  const mapGrid=$("mapGrid"), agentGrid=$("agentGrid");
  let agentDetails=[];
  let mapDetails=[];
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
  function renderAgents(role) {
    agentGrid.innerHTML=agents.filter(a=>role==="Tous"||a.role===role).map(a=>
      '<article class="agent-card" data-agent="'+a.name+'" role="button" tabindex="0" aria-label="Voir la fiche de '+a.name+'"><h3>'+a.name+'</h3><p>'+a.role+'</p></article>'
    ).join("");
  }
  const agentDataPromise=fetch("https://valorant-api.com/v1/agents?isPlayableCharacter=true&language=fr-FR")
    .then(r=>{if(!r.ok)throw new Error("API agents indisponible");return r.json();})
    .then(data=>{agentDetails=data.data||[];const active=document.querySelector(".filter-btn.selected");renderAgents(active?active.dataset.role:"Tous");})
    .catch(err=>console.warn("Fiches agents indisponibles",err));
  const mapDataPromise=fetch("https://valorant-api.com/v1/maps?language=fr-FR")
    .then(r=>{if(!r.ok)throw new Error("API maps indisponible");return r.json();})
    .then(data=>{mapDetails=data.data||[];})
    .catch(err=>console.warn("Images des maps indisponibles",err));
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
  document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeAgent();closeMap();}});
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
  renderAgents("Tous");
  document.querySelectorAll(".filter-btn").forEach(btn=>btn.addEventListener("click",function(){
    document.querySelectorAll(".filter-btn").forEach(b=>b.classList.remove("selected"));
    btn.classList.add("selected"); renderAgents(btn.dataset.role);
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
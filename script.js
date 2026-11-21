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
  const randomMap=$("randomMap"), favoriteMap=$("favoriteMap");
  if (!mapGrid || !agentGrid || !randomMap || !favoriteMap) {
    console.error("TimsValorant : un élément HTML nécessaire est introuvable.");
    return;
  }
  const option = m => '<option value="'+m.name+'">'+m.name+(m.active?' • classé':'')+'</option>';
  randomMap.innerHTML=maps.map(option).join("");
  favoriteMap.innerHTML=maps.map(option).join("");
  mapGrid.innerHTML=maps.map(m=>'<article class="map-card"><span class="map-status '+(m.active?'':'off')+'">'+(m.active?'● EN CLASSÉ':'○ HORS ROTATION')+'</span><h3>'+m.name+'</h3><p>'+m.sites+'</p></article>').join("");
  function renderAgents(role) {
    agentGrid.innerHTML=agents.filter(a=>role==="Tous"||a.role===role).map(a=>'<article class="agent-card"><h3>'+a.name+'</h3><p>'+a.role+'</p></article>').join("");
  }
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
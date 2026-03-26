
(function () {
  const SUPPORTED_LANGUAGES = ["en", "sv"];

  function normalizeLanguage(value) {
    if (!value) {
      return null;
    }

    const shortCode = value.toLowerCase().slice(0, 2);
    return SUPPORTED_LANGUAGES.includes(shortCode) ? shortCode : null;
  }

  function getStoredLanguage() {
    try {
      return normalizeLanguage(localStorage.getItem("siteLanguage"));
    } catch (error) {
      return null;
    }
  }

  function setStoredLanguage(language) {
    try {
      localStorage.setItem("siteLanguage", language);
    } catch (error) {
      // Ignore storage errors.
    }
  }

  function detectInitialLanguage() {
    const queryLanguage = normalizeLanguage(
      new URLSearchParams(window.location.search).get("lang")
    );

    if (queryLanguage) {
      setStoredLanguage(queryLanguage);
      return queryLanguage;
    }

    const storedLanguage = getStoredLanguage();
    if (storedLanguage) {
      return storedLanguage;
    }

    const browserLanguage = normalizeLanguage(navigator.language);
    return browserLanguage || "en";
  }

  function paragraphsToHtml(paragraphs) {
    return paragraphs.join("<br /><br />");
  }

  function getCurrentPageKey() {
    const fileName = (window.location.pathname.split("/").pop() || "index.html")
      .toLowerCase()
      .trim();

    if (fileName === "index.html") {
      return "home";
    }
    if (fileName === "om_oss.html") {
      return "about";
    }
    if (fileName === "for_foraldrar.html") {
      return "parents";
    }
    if (fileName === "psnuto_lygelna.html") {
      return "pontus";
    }
    if (fileName === "contact.html") {
      return "contact";
    }

    return null;
  }

  function setText(selector, value) {
    const element = document.querySelector(selector);
    if (element) {
      element.textContent = value;
    }
  }

  function setHtml(selector, value) {
    const element = document.querySelector(selector);
    if (element) {
      element.innerHTML = value;
    }
  }

  function setTextList(selector, values) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(function (element, index) {
      if (values[index] !== undefined) {
        element.textContent = values[index];
      }
    });
  }

  function setHtmlList(selector, values) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(function (element, index) {
      if (values[index] !== undefined) {
        element.innerHTML = values[index];
      }
    });
  }

  function getText(selector) {
    const element = document.querySelector(selector);
    return element ? element.textContent : "";
  }

  function getHtml(selector) {
    const element = document.querySelector(selector);
    return element ? element.innerHTML : "";
  }

  function getTextList(selector) {
    return Array.from(document.querySelectorAll(selector)).map(function (element) {
      return element.textContent;
    });
  }

  function getHtmlList(selector) {
    return Array.from(document.querySelectorAll(selector)).map(function (element) {
      return element.innerHTML;
    });
  }

  const original = {
    title: document.title,
    common: {
      brand: getText(".tm-site-name"),
      nav: getTextList(".tm-main-nav .nav-link"),
      footerText: getText(".footer__text"),
      footerTitle: getText(".footer__title"),
      footerCopy: getText(".footer__copy"),
    },
    home: {
      heroTitle: getText(".hero__title"),
      heroHtml: getHtml(".hero__text"),
      filterPrefix: getText("#activeFilterInfo span"),
      clearFilter: getText("#activeFilterInfo .clear-filter-btn"),
    },
    about: {
      heroTitle: getText(".hero__title"),
      heroHtml: getHtml(".hero__text"),
      rulesTitle: getText(".hero__rules-title"),
      ruleTitles: getTextList(".rule-title"),
      ruleHtmls: getHtmlList(".rule-text"),
    },
    parents: {
      sectionTitle: getText(".answer__title"),
      questions: getTextList(".question"),
      answers: getHtmlList(".answer"),
    },
    pontus: {
      blogTitle: getText(".tm-blog-post .tm-gold-text"),
      blogParagraphs: getHtmlList(".tm-blog-post p"),
      cardTitles: getTextList(".tm-content-box h4"),
      cardParagraphs: getHtmlList(".tm-content-box p"),
    },
    contact: {
      sectionTitle: getText(".answer__title"),
      cards: getTextList(".tm-content-box h4"),
    },
  };

  const swedish = {
    common: {
      brand: "Langley",
      nav: [
        "Om oss",
        "För föräldrar",
        "Psnuto Lygelna (Pontus Langley)",
        "Kontakt",
      ],
      footerText:
        "Ett kollektiv av tidigare Langley-anställda som talar ut för säkerhet, värdighet och rättvisa.",
      footerTitle: "Kontakta oss",
      footerCopy: "Kollektiv av tidigare anställda",
    },
    home: {
      title: "Langley - Hem",
      heroTitle: "Introduktion",
      heroHtml: paragraphsToHtml([
        "Uttalandena på denna webbplats kommer från tidigare anställda på Langley Hotels. Vi har valt att anonymisera deras identiteter för att skydda dem och deras rätt till privatliv.",
        "Varje berättelse speglar erfarenheter från personer som arbetat inom Langley Hotels. Dessa berättelser är inte begränsade till en eller två personer, utan representerar oro som lyfts av många som beskriver liknande mönster och behandling. Som kollektiv av tidigare anställda har vi granskat berättelserna tillsammans och gått igenom innehållet noggrant. Enligt dem som bidragit stöds dessa uppgifter även av vittnesmål från andra tidigare anställda, vilket ger dem ytterligare tyngd.",
        "De som delat sina erfarenheter har gjort det för att ge en röst åt människor som känt sig ignorerade och för att belysa vad de uppfattar som systematiska problem i företaget. Problemen sträcker sig från osäkra arbetsförhållanden till sexuella trakasserier och ekonomisk exploatering, och många menar att dessa exempel bara är en del av ett mycket större problem.",
        "Vissa av dem som delat sina berättelser säger att de redan har tagit juridiska steg eller försökt uppmärksamma relevanta myndigheter på dessa frågor, men mötts av avfärdande eller att företagsledningen inte tagit dem på allvar. I deras ögon var detta inte isolerade händelser, utan en del av en djupare och mer långvarig kultur av bristande respekt för anställdas rättigheter, säkerhet och välmående.",
        "Därför anser vi att det är avgörande att dessa berättelser blir hörda. Genom att dela erfarenheterna hoppas vi skapa ett tryggt utrymme där fler kan tala ut och därigenom bygga kraft för förändring. Vi vill inte att någon annan ska behöva gå igenom det som så många av oss upplevde, och vi hoppas att berättelserna hjälper andra att förstå den verklighet som många mötte bakom kulisserna på Langley Hotels.",
        "Vi är inte de enda som talar. Enligt de inblandade har dessa berättelser också bekräftats av externa källor, och i flera fall ska arbetsplatsgranskningar och externa utredningar ha pekat på mönster som går bortom enskilda händelser. Tidigare anställda menar att problemen speglar en djupare kultur av vårdslöshet och exploatering.",
        "Vi har samlat våra röster för att sätta stopp för detta, och vi tänker fortsätta kämpa för rättvisa, för oss själva och för framtida generationer som går ut i arbetslivet.",
        "Vi uppmuntrar alla som upplevt något liknande, eller som känner igen sin egen historia här, att kontakta oss. Ju fler röster vi samlar, desto starkare blir vårt budskap. Vi vill att andra ska veta att de inte är ensamma och att vi tillsammans kan bygga en rörelse för förändring.",
        "Ingen ska behöva känna sig ensam i denna kamp, och tillsammans kan vi skapa förändring.",
      ]),
      filterPrefix: "Visar berättelser med taggen:",
      clearFilter: "Rensa filter",
    },
  };
  swedish.about = {
    title: "Langley - Om oss",
    heroTitle: "Om oss",
    heroHtml: paragraphsToHtml([
      "<strong>Ett kollektiv av tidigare Langley-anställda</strong>",
      "Vi är ett kollektiv av tidigare anställda som en gång var en del av Langley, ett företag som vi nu känner oss tvungna att tala öppet om. Syftet med denna webbplats är att ge en röst åt dem som upplevde förödmjukelse, orättvisa och brott mot lagar och avtal under sin tid på Langley.",
      "Vi arbetade i en miljö där våra erfarenheter ignorerades, våra rättigheter sattes åt sidan och vi nekades den respekt och rättvisa behandling vi förtjänade.",
    ]),
    rulesTitle: "Vad vi står för",
    ruleTitles: [
      "Vår gemensamma erfarenhet",
      "Ett systematiskt problem",
      "Vår vision: Samla röster och kräva förändring",
      "Vad vi står för",
      "Vi kräver förändring och rättvisa",
    ],
    ruleHtmls: [
      paragraphsToHtml([
        "Vi arbetade i olika avdelningar och på olika Langley-hotell. Vissa av oss var chefer, andra arbetade i frontlinjen, men våra erfarenheter var smärtsamt lika.",
        "Det som förenar oss är känslan av att vi blev utnyttjade, nedvärderade och illa behandlade av både ledningen och ägaren. Även när vi försökte driva våra ärenden vidare eller inleda rättsliga processer ignorerade företaget oss, hånade oss och vägrade ta oss på allvar.",
      ]),
      paragraphsToHtml([
        "Det blev tydligt att denna orättvisekultur inte bara var en serie enskilda händelser. Den var en struktur inbyggd på varje nivå i företaget.",
        "Detta drabbade inte bara några få individer. Det är ett systematiskt problem som påverkat många som arbetat på Langley. Våra erfarenheter stöds av både interna och externa bedömningar samt samtal med andra tidigare anställda. Detta är en kultur skapad av ledningen och ägaren, och den påverkar tyvärr alla som arbetar där.",
      ]),
      paragraphsToHtml([
        "Genom denna webbplats vill vi skapa en plattform för alla som haft en negativ erfarenhet av Langley och ge fler möjlighet att dela sina berättelser.",
        "Vi tror att vi genom att samla dessa berättelser kan rikta ljus mot problemen som har funnits, och fortfarande finns, inom företaget. Vi vill att denna sida ska vara en trygg plats där människor kan uttrycka sina känslor och erfarenheter och se att de inte är ensamma.",
        "Vi söker fler tidigare anställda som gått igenom liknande erfarenheter och vill dela sina berättelser. Ju fler röster vi samlar, desto starkare blir vårt budskap. Vi vill att andra ska veta att de inte är ensamma och att vi tillsammans kan bygga en rörelse för förändring.",
      ]),
      paragraphsToHtml([
        "Vi är ett kollektiv som tror på rättvisa och respekt för alla anställda.",
        "Vi vill att arbetsgivare ska förstå vikten av att behandla arbetstagare med värdighet och integritet. Vi vill ge en röst åt dem som tystats, glömts bort eller tryckts ned.",
        "Genom denna webbplats vill vi också visa att det finns ett annat sätt, ett sätt där vi kan stå upp för våra rättigheter och vägra acceptera exploatering.",
      ]),
      paragraphsToHtml([
        "Om du också varit en del av Langley och har en erfarenhet du vill dela, eller om du vill veta mer om berättelserna som samlats här, är du alltid välkommen att kontakta oss.",
        "Tillsammans kan vi skapa förändring.",
      ]),
    ],
  };

  swedish.parents = {
    title: "Langley - För föräldrar",
    sectionTitle: "För föräldrar",
    questions: [
      "Tänk på säkra arbetsvillkor för ditt barn",
      "Varför unga är särskilt sårbara",
      "Vad vi vill att föräldrar ska förstå",
      "Varför vi talar ut",
      "Behöver du stöd eller vill dela information?",
    ],
    answers: [
      paragraphsToHtml([
        "Som förälder vill du ge ditt barn möjlighet att växa och utvecklas. Att skicka tonåringar utomlands för arbete kan verka som en värdefull chans att få erfarenhet och självständighet.",
        "Tyvärr har denna dröm en annan sida, en sida som vi bevittnade på nära håll under vår tid på Langley.",
        "Vi, ett kollektiv av tidigare Langley-anställda, vill öka medvetenheten om de risker som många unga, särskilt tonåringar, kan möta när de arbetar för Langley. Vi såg en arbetsmiljö där unga exploaterades, där löner inte betalades korrekt, där orimliga avdrag gjordes för boende och där försäkringar inte täckte arbetsplatsolyckor.",
        "Mest oroande av allt var fallen av sexuella trakasserier som inträffade men ignorerades och tystades ner. Detta borde Langley ha tagit på största allvar, men det skedde inte.",
      ]),
      paragraphsToHtml([
        "Unga, oerfarna och tillitsfulla personer är särskilt sårbara och kan lätt bli mål för denna typ av exploatering.",
        "Många unga medarbetare vet inte hur de ska agera. De följer med, accepterar det de får och hoppas att deras insats ska uppskattas och erkännas. Tyvärr är verkligheten ofta en annan.",
        "När man är ung och vill bevisa sig är det lätt att hamna i en situation där man inte känner att man kan stå upp för sina rättigheter. Det är just där vi såg många fall av orättvisa som påverkade anställda djupt.",
      ]),
      paragraphsToHtml([
        "Vi vill att föräldrar ska vara medvetna om de risker deras barn kan möta när de tar jobb på Langley.",
        "Vi uppmanar föräldrar att vara proaktiva och noggrant undersöka en arbetsgivare innan de låter sina barn åka utomlands, särskilt när arbetet är i ett annat land. Baserat på vad vi har sett rekommenderar vi inte att någon arbetar för Langley, och särskilt inte unga människor.",
        "För en tonåring kan det vara svårt att känna igen varningssignaler och övergrepp. Som förälder kan du vara deras skyddsnät.",
      ]),
      paragraphsToHtml([
        "Vi vill föra ut denna information till en bredare allmänhet för att förhindra att fler unga hamnar i samma situationer.",
        "Om ditt barn har arbetat på Langley och haft en negativ upplevelse, eller om du misstänker att barnet kan vara i riskzonen, tveka inte att kontakta oss.",
        "Vi vill hjälpa till att synliggöra dessa frågor och arbeta för förändring, för alla ungas skull.",
      ]),
      "Du är välkommen att kontakta oss via uppgifterna på denna webbplats. Din rapport kan hjälpa till att skydda andra unga.",
    ],
  };
  swedish.pontus = {
    title: "Langley - Psnuto Lygelna (Pontus Langley)",
    blogTitle: "Vår syn på Pontus Langley",
    lead:
      "Pontus Langley, ägare av Langley Hotels, är enligt vår uppfattning en av de centrala personerna bakom den företagskultur som många av oss upplevde under vår tid på Langley.",
    paragraphs: [
      "Ur vårt perspektiv har hans ledarstil präglats av kontroll, avstånd till de verkligheter som anställda mötte och brist på respekt för den oro som personalen lyfte. Många av oss fick intrycket att beslut drevs mer av makt och image än av ansvar, rättvisa eller omsorg om människorna som arbetade i företaget.",
      "<span style='font-weight: 700 !important;'>En kultur formad uppifrån</span>",
      "I vår erfarenhet var problemen inom Langley inte isolerade händelser eller missförstånd. De speglade en bredare kultur som vi anser formades på de högsta nivåerna i företaget.",
      "Många tidigare anställda upplevde att deras rättigheter, oro och välmående inte togs på allvar. I stället för ansvar såg man ofta tystnad, avfärdande eller en stark känsla av att det inte ledde någonstans att säga ifrån.",
      "Därför anser vi att det är omöjligt att tala om tidigare anställdas erfarenheter utan att också ta upp ledarskapet bakom företaget.",
      "<span style='font-weight: 700 !important;'>Offentlig bild och intern verklighet</span>",
      "För många utomstående kan Langley framstå som polerat och framgångsrikt. Men för många av oss som arbetade bakom kulisserna kändes verkligheten mycket annorlunda.",
      "Det fanns en tydlig kontrast mellan företagets offentliga bild och vad många anställda upplevde internt. Den kontrasten är en av huvudorsakerna till att vi talar ut i dag. Vi anser att image aldrig får vara viktigare än hur anställda behandlas.",
      "<span style='font-weight: 700 !important;'>Människorna runt honom</span>",
      "Enligt vår uppfattning var en av de mest oroande aspekterna av denna kultur inte bara ledarskapet i sig, utan också människorna runt omkring som gjorde det möjligt att fortsätta.",
      "Alltför ofta verkade personer med ansvar ovilliga att ifrågasätta orättvis behandling, lyfta oro eller stå upp för anställda. Oavsett om det berodde på rädsla, lojalitet eller egenintresse bidrog denna tystnad till att upprätthålla en kultur som många av oss upplevde som djupt skadlig.",
    ],
    cardTitles: ["Varför detta är viktigt", "Vår slutsats", "Slutord"],
    cardParagraphs: [
      paragraphsToHtml([
        "Denna sida handlar inte om personliga angrepp för sakens skull. Den handlar om ansvar.",
        "Vi anser att ledarskap spelar roll. Hur ett företag styrs påverkar varje del av arbetsplatsen, från säkerhet och respekt till tillit och ansvarstagande. När ledarskapet brister är det ofta de anställda som får betala priset.",
        "Det är därför vi anser att det är viktigt att tala öppet om den roll ledarskapet spelade i att skapa den miljö som så många tidigare anställda beskriver.",
      ]),
      paragraphsToHtml([
        "När vi ser tillbaka tror många av oss att Langleys problem inte var slumpmässiga. De var en del av en kultur som hade tillåtits växa under lång tid utan meningsfullt ansvar.",
        "Vi hoppas att genom att tala öppet om våra erfarenheter kommer fler att förstå hur företaget fungerade inifrån och varför så många tidigare anställda lämnades med bestående negativa erfarenheter.",
      ]),
      "Vårt mål är inte bara att berätta sanningen om vad vi gick igenom, utan också att hjälpa till att förhindra att andra utsätts för samma behandling i framtiden.",
    ],
  };

  swedish.contact = {
    title: "Langley - Kontakt",
    sectionTitle: "Kontakt och stöd",
    cards: [
      "Dela din berättelse",
      "Frågor från föräldrar",
      "Rapporter om arbetsmiljö",
      "Löne- och avtalsproblem",
      "Rapporter om trakasserier och övergrepp",
      "Media- och påverkansförfrågningar",
    ],
  };

  function applyCommonText(text) {
    setText(".tm-site-name", text.brand);
    setTextList(".tm-main-nav .nav-link", text.nav);
    setText(".footer__text", text.footerText);
    setText(".footer__title", text.footerTitle);
    setText(".footer__copy", text.footerCopy);
  }

  function applyEnglish() {
    document.title = original.title;
    applyCommonText(original.common);

    const pageKey = getCurrentPageKey();
    if (pageKey === "home") {
      setText(".hero__title", original.home.heroTitle);
      setHtml(".hero__text", original.home.heroHtml);
      const filterSpan = document.querySelector("#activeFilterInfo span");
      if (filterSpan) {
        filterSpan.innerHTML =
          'Showing stories tagged: <strong id="activeTagName"></strong>';
      }
      setText("#activeFilterInfo .clear-filter-btn", "Clear filter");
      return;
    }

    if (pageKey === "about") {
      setText(".hero__title", original.about.heroTitle);
      setHtml(".hero__text", original.about.heroHtml);
      setText(".hero__rules-title", original.about.rulesTitle);
      setTextList(".rule-title", original.about.ruleTitles);
      setHtmlList(".rule-text", original.about.ruleHtmls);
      return;
    }

    if (pageKey === "parents") {
      setText(".answer__title", original.parents.sectionTitle);
      setTextList(".question", original.parents.questions);
      setHtmlList(".answer", original.parents.answers);
      return;
    }

    if (pageKey === "pontus") {
      setText(".tm-blog-post .tm-gold-text", original.pontus.blogTitle);
      const blogParagraphs = document.querySelectorAll(".tm-blog-post p");
      original.pontus.blogParagraphs.forEach(function (paragraph, index) {
        if (blogParagraphs[index]) {
          blogParagraphs[index].innerHTML = paragraph;
        }
      });
      setTextList(".tm-content-box h4", original.pontus.cardTitles);
      setHtmlList(".tm-content-box p", original.pontus.cardParagraphs);
      return;
    }

    if (pageKey === "contact") {
      setText(".answer__title", original.contact.sectionTitle);
      setTextList(".tm-content-box h4", original.contact.cards);
    }
  }
  function applySwedish() {
    const pageKey = getCurrentPageKey();
    applyCommonText(swedish.common);

    if (pageKey === "home") {
      document.title = swedish.home.title;
      setText(".hero__title", swedish.home.heroTitle);
      setHtml(".hero__text", swedish.home.heroHtml);
      const filterSpan = document.querySelector("#activeFilterInfo span");
      if (filterSpan) {
        filterSpan.innerHTML =
          swedish.home.filterPrefix + ' <strong id="activeTagName"></strong>';
      }
      setText("#activeFilterInfo .clear-filter-btn", swedish.home.clearFilter);
      return;
    }

    if (pageKey === "about") {
      document.title = swedish.about.title;
      setText(".hero__title", swedish.about.heroTitle);
      setHtml(".hero__text", swedish.about.heroHtml);
      setText(".hero__rules-title", swedish.about.rulesTitle);
      setTextList(".rule-title", swedish.about.ruleTitles);
      setHtmlList(".rule-text", swedish.about.ruleHtmls);
      return;
    }

    if (pageKey === "parents") {
      document.title = swedish.parents.title;
      setText(".answer__title", swedish.parents.sectionTitle);
      setTextList(".question", swedish.parents.questions);
      setHtmlList(".answer", swedish.parents.answers);
      return;
    }

    if (pageKey === "pontus") {
      document.title = swedish.pontus.title;
      setText(".tm-blog-post .tm-gold-text", swedish.pontus.blogTitle);

      const blogParagraphs = document.querySelectorAll(".tm-blog-post p");
      if (blogParagraphs.length > 0) {
        blogParagraphs[0].textContent = swedish.pontus.lead;
      }

      swedish.pontus.paragraphs.forEach(function (paragraph, index) {
        if (blogParagraphs[index + 1]) {
          blogParagraphs[index + 1].innerHTML = paragraph;
        }
      });

      setTextList(".tm-content-box h4", swedish.pontus.cardTitles);
      setHtmlList(".tm-content-box p", swedish.pontus.cardParagraphs);
      return;
    }

    if (pageKey === "contact") {
      document.title = swedish.contact.title;
      setText(".answer__title", swedish.contact.sectionTitle);
      setTextList(".tm-content-box h4", swedish.contact.cards);
      return;
    }

    document.title = original.title;
  }

  let currentLanguage = detectInitialLanguage();

  function applyLanguage() {
    document.documentElement.lang = currentLanguage;

    if (currentLanguage === "sv") {
      applySwedish();
    } else {
      applyEnglish();
    }
  }

  window.getSiteLanguage = function () {
    return currentLanguage;
  };

  window.setSiteLanguage = function (language) {
    const normalized = normalizeLanguage(language);
    if (!normalized || normalized === currentLanguage) {
      return;
    }

    currentLanguage = normalized;
    setStoredLanguage(normalized);
    applyLanguage();

    document.dispatchEvent(
      new CustomEvent("site-language-changed", {
        detail: { language: normalized },
      })
    );
  };

  applyLanguage();
})();





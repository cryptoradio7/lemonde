export interface Article {
  id: number;
  titre: string;
  chapeau: string;
  contenu: string;
  auteur: string;
  date: string;
  rubrique: string;
  tags: string[];
  imageUrl: string;
  slug: string;
  tempsLecture: string;
}

export const rubriques = [
  'Politique',
  'International',
  'Économie',
  'Culture',
  'Sport',
  'Sciences',
  'Idées',
  'Société',
] as const;

export type Rubrique = (typeof rubriques)[number];

export const articles: Article[] = [
  // ── Politique ──────────────────────────────────────────────
  {
    id: 1,
    titre: 'Réforme des institutions : le gouvernement dévoile son projet de loi',
    chapeau:
      'Le premier ministre a présenté les grandes lignes d\'une réforme constitutionnelle visant à renforcer le rôle du Parlement et à moderniser le fonctionnement de l\'exécutif.',
    contenu: `Le premier ministre a dévoilé, mardi 10 février, les contours d'une réforme institutionnelle d'envergure. Le texte, qui sera soumis au Conseil d'État avant d'être présenté en conseil des ministres, prévoit notamment la limitation du recours à l'article 49.3 et l'introduction d'un droit d'initiative législative renforcé pour les commissions parlementaires.

« Il ne s'agit pas de changer de République, mais de la rendre plus efficace et plus démocratique », a déclaré le chef du gouvernement lors d'une conférence de presse à Matignon. Le projet comprend également la création d'un mécanisme de référendum d'initiative partagée simplifié, abaissant le seuil de signatures nécessaires de 4,7 millions à 1,5 million de citoyens.

L'opposition de gauche a salué « un pas dans la bonne direction » tout en regrettant l'absence de proportionnelle intégrale dans le projet. À droite, on s'interroge sur le calendrier, jugeant cette réforme « inopportune » à un an des élections régionales. Le Rassemblement national a dénoncé un « rideau de fumée » destiné à détourner l'attention de la situation économique.

Le texte devrait être examiné en première lecture à l'Assemblée nationale dès le mois d'avril. Plusieurs constitutionnalistes estiment que la réforme a de bonnes chances d'aboutir, à condition que le gouvernement accepte des amendements significatifs lors du débat parlementaire.`,
    auteur: 'Marie Descamps',
    date: '2026-02-10T14:30:00Z',
    rubrique: 'Politique',
    tags: ['réforme', 'institutions', 'Parlement', 'Constitution'],
    imageUrl:
      'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&h=450&fit=crop&q=80',
    slug: 'reforme-institutions-gouvernement-projet-loi',
    tempsLecture: '5 min',
  },
  {
    id: 2,
    titre: 'Municipales partielles : la gauche reconquiert trois grandes villes',
    chapeau:
      'Les élections municipales partielles ont confirmé la dynamique favorable à la gauche dans plusieurs agglomérations du sud de la France.',
    contenu: `Les électeurs de Perpignan, Béziers et Montpellier se sont rendus aux urnes dimanche pour des municipales partielles consécutives à des annulations judiciaires. Dans les trois cas, les candidats soutenus par l'alliance de gauche l'ont emporté, parfois dès le premier tour.

À Perpignan, la candidate socialiste Claire Martínez a obtenu 52,3 % des voix face au maire sortant, mettant fin à six années de gestion par l'extrême droite. « Ce soir, Perpignan retrouve ses valeurs républicaines », a-t-elle lancé devant ses partisans réunis place de la Victoire. Le taux de participation, à 58 %, a été nettement supérieur à celui des scrutins précédents.

À Béziers, le basculement a été tout aussi net. Le candidat écologiste, allié au Parti socialiste, a recueilli 54,1 % des suffrages au second tour. La campagne, dominée par les questions de pouvoir d'achat et de transition écologique, a mobilisé une partie de l'électorat habituellement abstentionniste, notamment dans les quartiers populaires.

Ces résultats sont analysés par les politologues comme un signal fort à dix-huit mois de l'élection présidentielle. Ils confirment la difficulté du camp présidentiel à s'implanter dans les territoires et la recomposition en cours du paysage politique français.`,
    auteur: 'Thomas Lefèvre',
    date: '2026-01-26T20:15:00Z',
    rubrique: 'Politique',
    tags: ['municipales', 'gauche', 'élections', 'sud'],
    imageUrl:
      'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&h=450&fit=crop&q=80',
    slug: 'municipales-partielles-gauche-reconquiert-trois-villes',
    tempsLecture: '4 min',
  },
  {
    id: 3,
    titre: 'Budget 2026 : le Sénat adopte un texte durci sur la maîtrise des dépenses',
    chapeau:
      'Les sénateurs ont voté un budget prévoyant 12 milliards d\'euros d\'économies supplémentaires par rapport au projet initial du gouvernement.',
    contenu: `Le Sénat a adopté, dans la nuit de jeudi à vendredi, le projet de loi de finances pour 2026 après trois semaines de débats intenses. Le texte voté par la chambre haute prévoit un effort budgétaire de 42 milliards d'euros, soit 12 milliards de plus que le projet initial présenté par Bercy en octobre.

Les sénateurs de la majorité sénatoriale, composée de la droite et du centre, ont notamment renforcé les mesures de réduction des effectifs dans la fonction publique d'État. Le texte prévoit la suppression de 15 000 postes sur trois ans, contre 8 000 dans la version gouvernementale. Le ministère de l'Éducation nationale serait toutefois épargné par ces coupes.

La gauche sénatoriale a vivement critiqué ce qu'elle qualifie de « budget d'austérité déguisé ». « On nous demande de faire des économies sur le dos des plus fragiles, tout en refusant de toucher aux niches fiscales des plus aisés », a dénoncé le président du groupe socialiste. Plusieurs amendements visant à créer une taxe sur les superprofits ont été rejetés.

La commission mixte paritaire, chargée de trouver un compromis entre les versions de l'Assemblée et du Sénat, se réunira le 5 mars. Le gouvernement a d'ores et déjà fait savoir qu'il n'accepterait pas les coupes les plus drastiques votées par les sénateurs, laissant présager des négociations difficiles.`,
    auteur: 'Sophie Renard',
    date: '2026-02-21T06:45:00Z',
    rubrique: 'Politique',
    tags: ['budget', 'Sénat', 'finances publiques', 'économies'],
    imageUrl:
      'https://images.unsplash.com/photo-1575517111478-7f6afd0973db?w=800&h=450&fit=crop&q=80',
    slug: 'budget-2026-senat-maitrise-depenses',
    tempsLecture: '5 min',
  },
  {
    id: 4,
    titre: 'Affaire des assistants parlementaires : le procès s\'ouvre à Paris',
    chapeau:
      'Douze anciens élus et collaborateurs comparaissent devant le tribunal correctionnel pour des soupçons d\'emplois fictifs au Parlement européen.',
    contenu: `Le procès de douze anciens eurodéputés et assistants parlementaires s'est ouvert lundi devant la 11ᵉ chambre du tribunal correctionnel de Paris. L'affaire, qui remonte à la période 2009-2017, porte sur des soupçons d'emplois fictifs au sein de plusieurs délégations françaises au Parlement européen.

Selon le parquet, les prévenus auraient détourné au total près de 4,2 millions d'euros de fonds publics européens en employant des assistants qui travaillaient en réalité pour leurs partis respectifs en France. Les magistrats instructeurs ont relevé un système « organisé et systématique » de contournement des règles d'utilisation des enveloppes de frais de personnel.

Les avocats de la défense contestent cette lecture des faits. « Le travail partisan et le travail parlementaire sont indissociables dans la pratique politique européenne », a plaidé Mᵉ Laurent Dubois, représentant l'un des principaux prévenus. La défense entend démontrer que les assistants concernés effectuaient bien un travail en lien avec le mandat européen de leurs employeurs.

Le procès, prévu pour durer six semaines, est suivi de près à Bruxelles, où le Parlement européen a depuis renforcé ses procédures de contrôle. Les prévenus encourent jusqu'à dix ans d'emprisonnement et un million d'euros d'amende pour détournement de fonds publics.`,
    auteur: 'François Morel',
    date: '2026-03-02T09:00:00Z',
    rubrique: 'Politique',
    tags: ['justice', 'Parlement européen', 'emplois fictifs', 'procès'],
    imageUrl:
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=450&fit=crop&q=80',
    slug: 'affaire-assistants-parlementaires-proces-paris',
    tempsLecture: '4 min',
  },

  // ── International ──────────────────────────────────────────
  {
    id: 5,
    titre: 'Sommet de l\'Union africaine : un accord historique sur la libre circulation',
    chapeau:
      'Les chefs d\'État africains ont signé à Addis-Abeba un protocole facilitant la circulation des personnes entre les 55 pays membres de l\'organisation.',
    contenu: `Le 37ᵉ sommet de l'Union africaine, qui s'est tenu du 15 au 17 février à Addis-Abeba, a abouti à la signature d'un protocole qualifié d'historique sur la libre circulation des personnes. Trente-huit des cinquante-cinq États membres ont ratifié le texte, qui prévoit la suppression progressive des visas pour les ressortissants africains d'ici à 2030.

Le protocole établit un « passeport africain » unique, déjà testé sous forme pilote depuis 2018 mais jusqu'ici limité aux diplomates et hauts fonctionnaires. Les citoyens des pays signataires pourront séjourner jusqu'à 90 jours sans visa dans tout État partie, et bénéficier de procédures simplifiées pour les séjours de longue durée.

Le président de la Commission de l'Union africaine a salué « une étape décisive vers l'intégration continentale ». « L'Afrique ne peut pas construire une zone de libre-échange si les personnes ne peuvent pas circuler librement », a-t-il déclaré, en référence à la Zone de libre-échange continentale africaine (ZLECAf) entrée en vigueur en 2021.

Plusieurs pays d'Afrique du Nord et d'Afrique australe n'ont cependant pas signé le texte, invoquant des préoccupations sécuritaires et migratoires. Les observateurs estiment néanmoins que la dynamique est enclenchée et que les récalcitrants pourraient rejoindre l'accord dans les prochaines années.`,
    auteur: 'Aminata Diallo',
    date: '2026-02-18T11:20:00Z',
    rubrique: 'International',
    tags: ['Union africaine', 'libre circulation', 'Afrique', 'diplomatie'],
    imageUrl:
      'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=800&h=450&fit=crop&q=80',
    slug: 'sommet-union-africaine-accord-libre-circulation',
    tempsLecture: '5 min',
  },
  {
    id: 6,
    titre: 'Élections au Brésil : Lula face à un Congrès de plus en plus hostile',
    chapeau:
      'Le président brésilien peine à faire adopter ses réformes sociales face à une majorité parlementaire conservatrice renforcée.',
    contenu: `La situation politique brésilienne se tend à mesure que le président Lula da Silva tente de faire adopter un ambitieux plan de lutte contre la pauvreté. Le Congrès, dominé par une coalition conservatrice hétéroclite, a rejeté mercredi pour la troisième fois consécutive un projet de loi visant à étendre le programme Bolsa Família aux travailleurs informels.

Avec seulement 180 députés sur 513 acquis à sa cause, le chef de l'État se retrouve dans une position de faiblesse inédite. Les négociations avec le « centrão », ce bloc de partis pragmatiques qui monnayent leur soutien contre des postes et des budgets, se sont enlisées ces dernières semaines après le refus de Lula de nommer un ministre issu de leurs rangs.

Les tensions se sont cristallisées autour de la réforme fiscale, considérée comme le chantier prioritaire du gouvernement. Le texte, qui prévoit une simplification de la fiscalité indirecte et l'instauration d'un impôt minimum sur les grandes fortunes, est bloqué en commission depuis janvier. Les milieux d'affaires, qui avaient initialement soutenu la simplification fiscale, se sont retournés contre le volet redistributif du projet.

Dans les sondages, la popularité du président reste stable autour de 45 % d'opinions favorables, mais les analystes soulignent que cette base pourrait s'éroder si le blocage institutionnel persiste. Plusieurs voix au sein du Parti des travailleurs appellent à un remaniement gouvernemental pour relancer l'action de l'exécutif.`,
    auteur: 'Pedro Alvarez',
    date: '2026-02-05T16:00:00Z',
    rubrique: 'International',
    tags: ['Brésil', 'Lula', 'Congrès', 'réformes sociales'],
    imageUrl:
      'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&h=450&fit=crop&q=80',
    slug: 'elections-bresil-lula-congres-hostile',
    tempsLecture: '5 min',
  },
  {
    id: 7,
    titre: 'Tensions en mer de Chine méridionale : Pékin déploie une nouvelle flottille',
    chapeau:
      'La marine chinoise a envoyé plusieurs navires près des îles Spratleys, provoquant une vive réaction des Philippines et du Vietnam.',
    contenu: `La marine de l'Armée populaire de libération a déployé une flottille de six navires, dont un porte-hélicoptères de classe 075, à proximité des îles Spratleys, selon des images satellites analysées par le Centre d'études stratégiques et internationales (CSIS) de Washington. Ce déploiement, le plus important depuis 2023, intervient dans un contexte de tensions croissantes autour des revendications territoriales en mer de Chine méridionale.

Manille a immédiatement convoqué l'ambassadeur de Chine pour protester contre ce qu'elle qualifie de « provocation inacceptable ». Les Philippines, qui revendiquent plusieurs récifs dans la zone, ont renforcé leur présence navale autour du banc de Scarborough. Le président philippin a appelé ses alliés, notamment les États-Unis, à « faire respecter le droit international maritime ».

Le Vietnam a également réagi avec fermeté, dénonçant une « violation flagrante » de sa souveraineté sur les Paracels et les Spratleys. Hanoï a annoncé des exercices militaires conjoints avec l'Inde dans les eaux voisines, un signal diplomatique fort à l'adresse de Pékin.

Washington a appelé « toutes les parties » au calme, tout en réaffirmant ses engagements de défense envers les Philippines au titre du traité de défense mutuelle de 1951. Le Pentagone a confirmé que le groupe aéronaval du USS Ronald Reagan se trouvait « dans la région » sans préciser sa position exacte.`,
    auteur: 'Jean-Philippe Martins',
    date: '2026-03-08T08:30:00Z',
    rubrique: 'International',
    tags: ['Chine', 'mer de Chine', 'Philippines', 'géopolitique'],
    imageUrl:
      'https://images.unsplash.com/photo-1524397057410-1e775ed476f3?w=800&h=450&fit=crop&q=80',
    slug: 'tensions-mer-chine-meridionale-flottille',
    tempsLecture: '5 min',
  },
  {
    id: 8,
    titre: 'L\'Union européenne et le Mercosur signent enfin leur accord commercial',
    chapeau:
      'Après plus de vingt ans de négociations, Bruxelles et les pays du Mercosur ont conclu un traité de libre-échange historique.',
    contenu: `L'Union européenne et les quatre pays fondateurs du Mercosur — Brésil, Argentine, Uruguay et Paraguay — ont signé vendredi à Montevideo un accord de libre-échange qualifié d'historique par les deux parties. Le traité, dont les négociations avaient débuté en 1999, crée la plus grande zone de libre-échange du monde en termes de population, couvrant plus de 780 millions de consommateurs.

L'accord prévoit la suppression progressive, sur dix ans, de 91 % des droits de douane sur les biens industriels exportés par l'UE vers le Mercosur. En contrepartie, l'Europe ouvrira son marché aux produits agricoles sud-américains, avec des contingents tarifaires pour les secteurs les plus sensibles comme la viande bovine, le sucre et l'éthanol.

La France, qui s'était longtemps opposée au texte, a finalement levé son veto après l'obtention de clauses « miroir » environnementales contraignantes. Les produits importés devront respecter les normes européennes en matière de pesticides et de traçabilité. Un mécanisme de sanctions commerciales pourra être activé en cas de déforestation massive dans les pays exportateurs.

Les agriculteurs français ont néanmoins manifesté leur mécontentement. La FNSEA a qualifié l'accord de « trahison », estimant que les clauses miroir seraient insuffisantes pour protéger les éleveurs européens face à la concurrence sud-américaine. Des manifestations sont prévues dans plusieurs villes françaises la semaine prochaine.`,
    auteur: 'Clara Fontaine',
    date: '2026-01-17T19:45:00Z',
    rubrique: 'International',
    tags: ['UE', 'Mercosur', 'libre-échange', 'commerce'],
    imageUrl:
      'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&h=450&fit=crop&q=80',
    slug: 'union-europeenne-mercosur-accord-commercial',
    tempsLecture: '5 min',
  },

  // ── Économie ───────────────────────────────────────────────
  {
    id: 9,
    titre: 'La BCE maintient ses taux directeurs face à une inflation persistante',
    chapeau:
      'La Banque centrale européenne a décidé de laisser ses taux inchangés, malgré les appels des gouvernements de la zone euro à desserrer la politique monétaire.',
    contenu: `Le conseil des gouverneurs de la Banque centrale européenne a décidé jeudi de maintenir ses trois taux directeurs à leur niveau actuel, le taux de refinancement restant à 3,25 %. Cette décision, attendue par les marchés, intervient alors que l'inflation dans la zone euro est remontée à 2,6 % en janvier, après plusieurs mois de décrue.

La présidente de la BCE a justifié cette prudence par la « résurgence des pressions inflationnistes sous-jacentes », pointant notamment la hausse des prix des services et des denrées alimentaires. « Nous ne pouvons pas nous permettre de baisser la garde alors que l'inflation n'est pas encore durablement revenue à notre cible de 2 % », a-t-elle déclaré lors de la conférence de presse suivant la réunion.

Cette décision a suscité des critiques de plusieurs gouvernements européens. Le ministre français de l'Économie a regretté une politique « trop restrictive » qui « freine la reprise industrielle ». L'Italie et l'Espagne ont exprimé des préoccupations similaires, soulignant que le coût élevé du crédit pénalise l'investissement et le marché immobilier.

Les marchés financiers ont réagi de manière contrastée. L'euro s'est légèrement apprécié face au dollar, tandis que les indices boursiers européens ont reculé d'environ 0,5 %. Les analystes estiment qu'une première baisse de taux pourrait intervenir en juin si la tendance désinflationniste reprend dans les prochains mois.`,
    auteur: 'Philippe Garnier',
    date: '2026-02-13T17:00:00Z',
    rubrique: 'Économie',
    tags: ['BCE', 'taux directeurs', 'inflation', 'zone euro'],
    imageUrl:
      'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=450&fit=crop&q=80',
    slug: 'bce-maintient-taux-directeurs-inflation',
    tempsLecture: '4 min',
  },
  {
    id: 10,
    titre: 'Immobilier : les prix repartent à la hausse dans les métropoles françaises',
    chapeau:
      'Après deux ans de correction, le marché immobilier français montre des signes de reprise, porté par la baisse progressive des taux de crédit.',
    contenu: `Les derniers chiffres des notaires confirment un retournement du marché immobilier français. Au quatrième trimestre 2025, les prix des logements anciens ont progressé de 1,8 % en moyenne dans les dix plus grandes métropoles, mettant fin à une période de baisse entamée au printemps 2023.

Paris, qui avait connu une correction particulièrement marquée avec un recul cumulé de 12 % entre 2023 et 2025, affiche désormais une hausse de 2,1 % sur les trois derniers mois. Le prix moyen au mètre carré dans la capitale s'établit à 9 450 euros, un niveau qui reste nettement inférieur au pic de 10 800 euros atteint en 2022.

Cette reprise s'explique principalement par l'amélioration des conditions de financement. Les taux de crédit immobilier sont redescendus sous la barre des 3 % pour les meilleurs dossiers, après avoir frôlé les 4,5 % à l'automne 2023. « Les acheteurs reviennent sur le marché, notamment les primo-accédants qui avaient été écartés par la hausse des taux », analyse la présidente de la Chambre des notaires de Paris.

Le volume des transactions reste toutefois en deçà des niveaux d'avant-crise. Avec environ 820 000 ventes enregistrées en 2025, le marché est encore loin des 1,1 million de transactions annuelles observées en 2021. Les professionnels tablent sur une normalisation progressive au cours de l'année 2026.`,
    auteur: 'Isabelle Dumont',
    date: '2026-01-28T10:30:00Z',
    rubrique: 'Économie',
    tags: ['immobilier', 'prix', 'crédit', 'métropoles'],
    imageUrl:
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=450&fit=crop&q=80',
    slug: 'immobilier-prix-hausse-metropoles-francaises',
    tempsLecture: '4 min',
  },
  {
    id: 11,
    titre: 'La filière hydrogène vert français lève 8 milliards d\'euros',
    chapeau:
      'Un consortium d\'entreprises françaises a annoncé un investissement massif dans la production d\'hydrogène décarboné, soutenu par des fonds européens.',
    contenu: `Un consortium réunissant TotalEnergies, Air Liquide, EDF et plusieurs start-up spécialisées a annoncé mercredi un plan d'investissement de 8 milliards d'euros sur cinq ans pour développer la filière hydrogène vert en France. Le projet, baptisé « H2 France 2030 », vise à faire de l'Hexagone le premier producteur européen d'hydrogène décarboné d'ici à la fin de la décennie.

Le plan prévoit la construction de douze gigafactories d'électrolyseurs réparties sur le territoire, ainsi que la mise en place d'un réseau de pipelines de 2 000 kilomètres reliant les sites de production aux zones industrielles consommatrices. La région Hauts-de-France accueillera le plus grand site, avec une capacité de production de 200 mégawatts.

L'Union européenne contribuera à hauteur de 2,4 milliards d'euros via le programme IPCEI (Important Projects of Common European Interest). Le reste du financement sera assuré par les entreprises du consortium et par la Banque publique d'investissement (Bpifrance), qui apportera 1,2 milliard d'euros en prêts et en garanties.

Les associations environnementales ont accueilli favorablement l'annonce tout en appelant à la vigilance. « L'hydrogène vert est une solution d'avenir, à condition qu'il soit produit à partir d'électricité renouvelable et non nucléaire, et qu'il ne serve pas de prétexte pour retarder la décarbonation directe de l'industrie », a déclaré le directeur de Greenpeace France.`,
    auteur: 'Marc Lefebvre',
    date: '2026-02-26T14:15:00Z',
    rubrique: 'Économie',
    tags: ['hydrogène', 'énergie', 'investissement', 'transition'],
    imageUrl:
      'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&h=450&fit=crop&q=80',
    slug: 'filiere-hydrogene-vert-francais-8-milliards',
    tempsLecture: '4 min',
  },
  {
    id: 12,
    titre: 'Chômage : le taux passe sous la barre des 7 % pour la première fois depuis 2008',
    chapeau:
      'L\'INSEE annonce un taux de chômage de 6,9 % au quatrième trimestre 2025, un niveau inédit depuis dix-sept ans en France métropolitaine.',
    contenu: `La France n'avait pas connu un tel niveau de chômage depuis la crise financière de 2008. Selon les chiffres publiés mardi par l'INSEE, le taux de chômage au sens du Bureau international du travail (BIT) s'est établi à 6,9 % de la population active au quatrième trimestre 2025, en recul de 0,3 point par rapport au trimestre précédent.

Cette baisse s'explique en partie par la dynamique de création d'emplois dans les secteurs de la santé, du numérique et de la transition énergétique. L'économie française a créé 285 000 emplois nets en 2025, un chiffre supérieur aux prévisions des économistes. Le secteur des services aux entreprises a été le principal contributeur, suivi par l'industrie, qui crée des emplois pour la première fois depuis 2019.

Le gouvernement s'est félicité de ces résultats, y voyant la preuve de l'efficacité de sa politique de l'offre. Le ministre du Travail a souligné que la réforme de l'assurance-chômage et les allègements de charges sur les bas salaires avaient « porté leurs fruits ». L'opposition estime de son côté que la qualité des emplois créés laisse à désirer, pointant la progression des contrats courts et du temps partiel subi.

Les économistes restent prudents quant à la pérennité de cette amélioration. Le ralentissement de la croissance attendu en 2026, combiné aux incertitudes géopolitiques, pourrait freiner les embauches dans les prochains trimestres.`,
    auteur: 'Anne-Sophie Petit',
    date: '2026-02-04T07:30:00Z',
    rubrique: 'Économie',
    tags: ['chômage', 'emploi', 'INSEE', 'marché du travail'],
    imageUrl:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=450&fit=crop&q=80',
    slug: 'chomage-taux-sous-7-pourcent-premiere-fois',
    tempsLecture: '4 min',
  },

  // ── Culture ────────────────────────────────────────────────
  {
    id: 13,
    titre: 'Césars 2026 : « Les Ombres du silence » rafle cinq récompenses',
    chapeau:
      'Le film d\'Agathe Riedinger sur la mémoire de la guerre d\'Algérie a dominé la cérémonie, remportant les prix du meilleur film, de la meilleure réalisation et du meilleur scénario.',
    contenu: `La 51ᵉ cérémonie des Césars, qui s'est tenue vendredi soir à l'Olympia, a consacré « Les Ombres du silence », le troisième long-métrage d'Agathe Riedinger. Le film, qui explore les non-dits familiaux autour de la guerre d'Algérie à travers le portrait d'une femme découvrant le passé de son grand-père, a remporté cinq statuettes, dont celles du meilleur film et de la meilleure réalisation.

Roschdy Zem, magistral dans le rôle du grand-père confronté à ses souvenirs, a été couronné meilleur acteur. « Ce film parle de silence, et ce soir c'est le cinéma qui prend la parole », a-t-il déclaré dans un discours sobre et émouvant. Hafsia Herzi, qui incarne sa petite-fille, était nommée dans la catégorie meilleure actrice mais a été devancée par Virginie Efira pour son rôle dans « La Dernière Saison ».

La soirée a également été marquée par le triomphe du cinéma d'animation français. « Archipel », du studio Folimage, a reçu le César du meilleur film d'animation, confirmant la vitalité du secteur. Le documentaire « Terres brûlées », consacré aux mégafeux en Gironde, a quant à lui remporté le prix du meilleur documentaire.

La cérémonie, présentée pour la deuxième année consécutive par Jamel Debbouze, a enregistré un regain d'audience télévisée avec 3,2 millions de téléspectateurs, soit 600 000 de plus que l'année précédente.`,
    auteur: 'Lucie Renoir',
    date: '2026-03-01T00:30:00Z',
    rubrique: 'Culture',
    tags: ['Césars', 'cinéma', 'Algérie', 'récompenses'],
    imageUrl:
      'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&h=450&fit=crop&q=80',
    slug: 'cesars-2026-ombres-du-silence-cinq-recompenses',
    tempsLecture: '4 min',
  },
  {
    id: 14,
    titre: 'Le musée d\'Orsay inaugure une aile consacrée aux impressionnistes oubliés',
    chapeau:
      'Une nouvelle galerie permanente met en lumière les artistes femmes et les peintres issus des colonies qui ont contribué au mouvement impressionniste.',
    contenu: `Le musée d'Orsay a inauguré mercredi une nouvelle aile de 1 200 mètres carrés dédiée aux « impressionnistes méconnus ». L'espace, fruit de deux ans de travaux et d'un investissement de 18 millions d'euros, présente quelque 150 œuvres d'artistes jusqu'ici largement absents des cimaises du célèbre musée parisien.

Parmi les pièces maîtresses de cette nouvelle galerie figurent plusieurs toiles de Berthe Morisot et Mary Cassatt, enfin présentées à la hauteur de leur importance historique. Mais la véritable révélation réside dans la découverte d'artistes comme Marie Bracquemond, Eva Gonzalès ou encore le Martiniquais Francisco Oller, dont les œuvres étaient jusqu'ici reléguées dans les réserves.

« Il était temps de corriger une injustice historiographique », a déclaré la directrice du musée lors du vernissage. « Le mouvement impressionniste ne se résume pas à Monet, Renoir et Degas. Il a été porté par des dizaines d'artistes dont le travail a été effacé par les préjugés de genre et d'origine. »

La scénographie, conçue par l'architecte japonaise Kazuyo Sejima, joue sur la lumière naturelle et les parois translucides pour créer une expérience immersive. L'aile comprend également un espace numérique interactif permettant de comparer les techniques des différents peintres. L'ouverture au public est prévue pour le 15 mars.`,
    auteur: 'Élise Beaumont',
    date: '2026-03-05T18:00:00Z',
    rubrique: 'Culture',
    tags: ['musée d\'Orsay', 'impressionnisme', 'art', 'exposition'],
    imageUrl:
      'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=800&h=450&fit=crop&q=80',
    slug: 'musee-orsay-aile-impressionnistes-oublies',
    tempsLecture: '4 min',
  },
  {
    id: 15,
    titre: 'Festival d\'Angoulême : la bande dessinée africaine à l\'honneur',
    chapeau:
      'La 53ᵉ édition du festival a décerné son Grand Prix à l\'auteur congolais Barly Baruti, figure majeure de la BD africaine.',
    contenu: `Le Festival international de la bande dessinée d'Angoulême a réservé un accueil triomphal à Barly Baruti, devenu le premier auteur africain à recevoir le Grand Prix du festival. L'artiste congolais, âgé de 67 ans, est reconnu pour son œuvre prolifique mêlant récits historiques et chroniques sociales de l'Afrique centrale.

« Cette reconnaissance vient couronner quarante ans de travail et des générations d'auteurs africains qui ont fait vivre la bande dessinée sur notre continent, souvent dans des conditions difficiles », a déclaré Barly Baruti en recevant son prix. Son album « Madame Livingstone », co-écrit avec le Belge Christophe Cassiau-Haurie, est considéré comme un classique du neuvième art africain.

L'édition 2026 a fait la part belle à la création venue du continent africain, avec une exposition rétrospective de 300 planches originales retraçant l'histoire de la BD africaine depuis les années 1960. De jeunes auteurs sénégalais, ivoiriens et camerounais ont également été mis à l'honneur dans le programme « Nouveau Monde », dédié à la découverte de talents émergents.

Le festival a accueilli cette année 215 000 visiteurs en quatre jours, un record. Les organisateurs attribuent cette affluence à l'ouverture croissante du festival à des formes narratives diverses, du manga au roman graphique en passant par le webtoon, tout en maintenant une exigence de qualité éditoriale.`,
    auteur: 'Nicolas Dupont',
    date: '2026-01-31T12:00:00Z',
    rubrique: 'Culture',
    tags: ['Angoulême', 'bande dessinée', 'Afrique', 'festival'],
    imageUrl:
      'https://images.unsplash.com/photo-1601645191163-3fc0d5d64e35?w=800&h=450&fit=crop&q=80',
    slug: 'festival-angouleme-bande-dessinee-africaine',
    tempsLecture: '4 min',
  },
  {
    id: 16,
    titre: 'Musique : le retour très attendu de Christine and the Queens avec un album en français',
    chapeau:
      'Après trois ans d\'absence, l\'artiste présente « Rentrer au port », un album entièrement francophone salué par la critique.',
    contenu: `Christine and the Queens fait son grand retour sur la scène musicale avec « Rentrer au port », un album de douze titres entièrement en français, sorti vendredi chez Because Music. L'artiste, qui avait pris du recul après une période d'intense médiatisation internationale, livre un disque intime et dépouillé, aux antipodes de la pop synthétique de ses précédents albums.

Les textes, d'une rare densité poétique, explorent les thèmes du retour aux origines, de la filiation et de la réconciliation avec soi-même. Le premier single, « Les Falaises », un morceau porté par un piano et des cordes, a déjà été écouté plus de 8 millions de fois sur les plateformes de streaming en une semaine.

« J'avais besoin de revenir à l'essentiel, à ma langue, à des émotions brutes », a expliqué l'artiste dans un entretien au magazine Les Inrockuptibles. L'album a été enregistré en partie dans une ferme du Cantal, avec un groupe réduit de musiciens. La production, signée par le Britannique James Ford, privilégie les textures acoustiques et les arrangements orchestraux.

La critique française est unanime. Télérama y voit « le plus beau disque francophone de la décennie », tandis que Libération salue « un acte de courage artistique rare dans l'industrie musicale mondialisée ». Une tournée de vingt dates dans les Zéniths français est annoncée pour l'automne 2026.`,
    auteur: 'Camille Vidal',
    date: '2026-02-14T09:00:00Z',
    rubrique: 'Culture',
    tags: ['musique', 'Christine and the Queens', 'album', 'chanson française'],
    imageUrl:
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&h=450&fit=crop&q=80',
    slug: 'christine-queens-retour-album-francais',
    tempsLecture: '4 min',
  },

  // ── Sport ──────────────────────────────────────────────────
  {
    id: 17,
    titre: 'Ligue 1 : le PSG freiné à Lyon, Marseille en profite',
    chapeau:
      'Le Paris Saint-Germain a concédé un match nul (1-1) à Lyon, permettant à l\'Olympique de Marseille de revenir à trois points en tête du classement.',
    contenu: `Le Paris Saint-Germain a laissé échapper deux points précieux au Groupama Stadium dimanche soir lors de la 25ᵉ journée de Ligue 1. Menés au score après un but de Rayan Cherki dès la 12ᵉ minute, les Parisiens ont dû attendre la 78ᵉ minute et un penalty transformé par Ousmane Dembélé pour arracher le match nul (1-1).

L'Olympique lyonnais, renforcé par les arrivées hivernales de deux milieux de terrain, a proposé un visage séduisant. Le dispositif tactique de l'entraîneur, articulé autour d'un pressing haut et de transitions rapides, a mis en difficulté la défense parisienne pendant toute la première période. Le gardien du PSG a notamment réalisé deux arrêts décisifs pour maintenir son équipe dans le match.

Dans l'autre match phare de la soirée, l'Olympique de Marseille a dominé le LOSC (3-1) au Vélodrome grâce à un doublé de son attaquant vedette. Les Phocéens reviennent ainsi à trois points du PSG au classement, relançant une course au titre que beaucoup pensaient pliée après la série de dix victoires consécutives des Parisiens en fin d'année 2025.

« Le championnat est loin d'être terminé », a prévenu l'entraîneur marseillais après la rencontre. « Nous avons un effectif de qualité et la ferveur de notre public. Tout est possible. » La prochaine journée verra un choc direct entre Monaco, troisième, et le PSG au Parc des Princes.`,
    auteur: 'Hugo Bertrand',
    date: '2026-02-23T22:45:00Z',
    rubrique: 'Sport',
    tags: ['Ligue 1', 'PSG', 'OL', 'OM', 'football'],
    imageUrl:
      'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&h=450&fit=crop&q=80',
    slug: 'ligue-1-psg-freine-lyon-marseille-profite',
    tempsLecture: '4 min',
  },
  {
    id: 18,
    titre: 'Roland-Garros : la FFT dévoile le programme du centenaire du tournoi',
    chapeau:
      'Pour célébrer les cent ans du tournoi, la Fédération française de tennis prévoit des festivités exceptionnelles et une dotation record.',
    contenu: `La Fédération française de tennis a présenté jeudi le programme des célébrations du centenaire de Roland-Garros, qui se tiendra du 24 mai au 8 juin. Le tournoi, créé en 1925 au stade de la porte d'Auteuil, fêtera cet anniversaire avec une dotation record de 58 millions d'euros et une série d'événements commémoratifs.

Parmi les temps forts annoncés, un match d'exhibition réunissant d'anciennes gloires du tennis français est prévu le 23 mai, veille du début du tournoi. Rafael Nadal, quatorze fois vainqueur à Roland-Garros et retraité depuis 2025, sera l'invité d'honneur de la cérémonie d'ouverture. « Roland-Garros est ma deuxième maison. C'est un honneur immense de participer à ce centenaire », a déclaré l'Espagnol dans un message vidéo.

Le site a fait l'objet de derniers aménagements pour l'occasion. Le toit rétractable du court Suzanne-Lenglen, dont les travaux avaient débuté en 2024, sera inauguré. Un « village du centenaire » installé dans les allées du stade proposera une exposition retraçant l'histoire du tournoi, avec des objets inédits issus des archives de la FFT.

Sur le plan sportif, tous les yeux seront tournés vers le jeune Français Arthur Cazaux, 21 ans et déjà 12ᵉ mondial, qui porte les espoirs d'un premier titre français masculin depuis Yannick Noah en 1983. « La pression sera énorme, mais je suis prêt à l'assumer », a confié le joueur lors de sa dernière conférence de presse.`,
    auteur: 'Pierre Gasquet',
    date: '2026-03-12T11:00:00Z',
    rubrique: 'Sport',
    tags: ['Roland-Garros', 'tennis', 'centenaire', 'FFT'],
    imageUrl:
      'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&h=450&fit=crop&q=80',
    slug: 'roland-garros-programme-centenaire-tournoi',
    tempsLecture: '4 min',
  },
  {
    id: 19,
    titre: 'Jeux olympiques 2030 : la candidature française des Alpes en bonne voie',
    chapeau:
      'Le CIO a salué les progrès de la candidature française pour les Jeux d\'hiver 2030, malgré des interrogations persistantes sur l\'enneigement.',
    contenu: `La commission d'évaluation du Comité international olympique a rendu un rapport « globalement positif » sur la candidature des Alpes françaises pour les Jeux olympiques d'hiver 2030. Le document, publié mardi, souligne la qualité des infrastructures existantes et le soutien des collectivités locales, tout en pointant des « points de vigilance » sur l'impact climatique.

La candidature prévoit de répartir les épreuves entre Nice, qui accueillerait les cérémonies d'ouverture et les sports de glace, et les stations alpines de Courchevel, La Clusaz et Serre Chevalier pour les épreuves de neige. Le budget prévisionnel de 2,1 milliards d'euros repose à 60 % sur des financements privés et des recettes de billetterie.

La question de la fiabilité de l'enneigement reste le principal point faible du dossier. Le CIO a demandé des garanties supplémentaires sur la capacité des stations à produire de la neige artificielle de manière durable, dans un contexte où les Alpes ont connu trois hivers consécutifs de faible enneigement. Les organisateurs ont répondu en présentant un plan de neige de culture alimenté à 100 % par des énergies renouvelables.

La décision finale du CIO est attendue en juillet 2026. La candidature française est en concurrence avec celle de la Suède, jugée plus solide sur le plan environnemental mais moins aboutie en termes d'infrastructures. Les bookmakers donnent un léger avantage à la France, portée par l'héritage des Jeux de Paris 2024.`,
    auteur: 'Antoine Moreau',
    date: '2026-03-15T15:30:00Z',
    rubrique: 'Sport',
    tags: ['JO 2030', 'Alpes', 'CIO', 'candidature'],
    imageUrl:
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=450&fit=crop&q=80',
    slug: 'jeux-olympiques-2030-candidature-alpes-francaises',
    tempsLecture: '5 min',
  },
  {
    id: 20,
    titre: 'Cyclisme : Pogačar annonce qu\'il visera le Tour et le Giro en 2026',
    chapeau:
      'Le Slovène Tadej Pogačar tentera de réaliser un nouveau doublé Giro-Tour de France, un exploit qu\'il avait accompli en 2024.',
    contenu: `Tadej Pogačar a confirmé mercredi son intention de disputer à la fois le Giro d'Italie et le Tour de France en 2026, deux épreuves séparées de seulement trois semaines. Le coureur de l'équipe UAE Team Emirates, qui avait réussi ce doublé historique en 2024, estime être en mesure de rééditer cette performance.

« Mon corps récupère très bien entre les grands tours. En 2024, j'ai montré que c'était possible, et je suis encore plus fort aujourd'hui », a déclaré le Slovène de 27 ans lors de la présentation du parcours du Tour de France 2026 à Paris. Son programme comprendra également plusieurs classiques printanières, dont Milan-San Remo et la Flèche Wallonne.

Le parcours du Tour 2026, dévoilé en présence de Pogačar, prévoit un départ de Strasbourg et une arrivée sur les Champs-Élysées après trois semaines et 3 450 kilomètres. Les organisateurs ont placé quatre arrivées en altitude dans les deux dernières semaines, dont un contre-la-montre en montée à l'Alpe d'Huez qui promet d'être décisif.

Le principal rival de Pogačar, le Danois Jonas Vingegaard, a prévenu qu'il serait « prêt à en découdre ». Remis de la grave chute qui l'avait écarté des pelotons pendant six mois en 2024, le double vainqueur du Tour aborde la saison avec des ambitions renouvelées. « La rivalité avec Tadej me pousse à repousser mes limites », a-t-il confié.`,
    auteur: 'Julien Maillot',
    date: '2026-02-19T13:00:00Z',
    rubrique: 'Sport',
    tags: ['cyclisme', 'Pogačar', 'Tour de France', 'Giro'],
    imageUrl:
      'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&h=450&fit=crop&q=80',
    slug: 'cyclisme-pogacar-tour-giro-2026',
    tempsLecture: '4 min',
  },

  // ── Sciences ───────────────────────────────────────────────
  {
    id: 21,
    titre: 'Le CNRS annonce une percée majeure dans la fusion nucléaire',
    chapeau:
      'Des chercheurs français ont atteint un record de durée de confinement du plasma, rapprochant la perspective d\'une énergie de fusion commerciale.',
    contenu: `Une équipe du CNRS et du CEA a annoncé vendredi avoir maintenu un plasma à plus de 100 millions de degrés pendant 6 minutes et 22 secondes dans le tokamak WEST, installé à Cadarache (Bouches-du-Rhône). Ce record mondial, qui double la précédente performance établie par la Chine en 2023, constitue une étape importante vers la maîtrise de la fusion nucléaire.

Le tokamak WEST, qui sert de plateforme d'essai pour les technologies du projet international ITER, a bénéficié de la mise à jour de ses divertors en tungstène, les composants qui supportent les flux de chaleur les plus intenses. « Cette avancée démontre que nos matériaux sont capables de résister aux conditions extrêmes de la fusion sur des durées significatives », a expliqué la directrice de l'Institut de recherche sur la fusion magnétique.

La fusion nucléaire, qui reproduit le mécanisme énergétique du Soleil, est considérée comme le Graal de l'énergie propre. Contrairement à la fission nucléaire utilisée dans les centrales actuelles, elle ne produit pas de déchets radioactifs à vie longue et utilise comme combustible le deutérium, présent en abondance dans l'eau de mer.

Ce résultat renforce la position de la France dans la course internationale à la fusion. Le projet ITER, dont la mise en service a été repoussée à 2035, devrait bénéficier directement de ces avancées. Parallèlement, plusieurs start-up privées, dont la française Renaissance Fusion, développent des approches alternatives qui pourraient aboutir plus rapidement.`,
    auteur: 'Dr. Hélène Marchand',
    date: '2026-03-07T10:00:00Z',
    rubrique: 'Sciences',
    tags: ['fusion nucléaire', 'CNRS', 'énergie', 'recherche'],
    imageUrl:
      'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=450&fit=crop&q=80',
    slug: 'cnrs-percee-fusion-nucleaire',
    tempsLecture: '5 min',
  },
  {
    id: 22,
    titre: 'Découverte d\'une nouvelle espèce de grand singe à Bornéo',
    chapeau:
      'Une population d\'orangs-outans génétiquement distincte a été identifiée dans une forêt reculée de Kalimantan, portant à quatre le nombre d\'espèces connues.',
    contenu: `Une équipe internationale de primatologues a annoncé dans la revue Nature la découverte d'une nouvelle espèce d'orang-outan dans les forêts montagneuses du centre de Bornéo. Baptisée Pongo kalimanensis, cette espèce se distingue des trois autres connues par des caractéristiques morphologiques et génétiques uniques.

La population, estimée à environ 800 individus, vit dans une zone de forêt primaire difficile d'accès, à plus de 1 000 mètres d'altitude. C'est cette isolation géographique qui explique que l'espèce soit restée inconnue de la science jusqu'ici. Les analyses ADN ont révélé une divergence génétique remontant à environ 2 millions d'années avec les orangs-outans de Bornéo déjà connus.

« C'est une découverte extraordinaire, mais elle s'accompagne d'une responsabilité immense », a déclaré le professeur Erik Meijaard, co-auteur de l'étude. Avec seulement 800 individus, l'espèce est immédiatement classée « en danger critique d'extinction » par les chercheurs, qui demandent la création d'une réserve naturelle protégée dans la zone.

La menace principale vient de l'expansion des plantations de palmiers à huile, qui a déjà détruit 80 % de l'habitat des orangs-outans à Bornéo au cours des quarante dernières années. Le gouvernement indonésien a réagi en annonçant un moratoire temporaire sur l'exploitation forestière dans la région concernée, en attendant les résultats d'une étude d'impact environnemental.`,
    auteur: 'Pauline Verdier',
    date: '2026-01-22T08:00:00Z',
    rubrique: 'Sciences',
    tags: ['biodiversité', 'orang-outan', 'Bornéo', 'découverte'],
    imageUrl:
      'https://images.unsplash.com/photo-1462953491269-9aff00919dc2?w=800&h=450&fit=crop&q=80',
    slug: 'decouverte-nouvelle-espece-grand-singe-borneo',
    tempsLecture: '4 min',
  },
  {
    id: 23,
    titre: 'Intelligence artificielle : un modèle français rivalise avec les géants américains',
    chapeau:
      'La start-up Mistral AI dévoile un nouveau modèle de langage qui égale les performances de GPT-5 sur plusieurs benchmarks, pour un coût d\'entraînement dix fois inférieur.',
    contenu: `Mistral AI, la pépite française de l'intelligence artificielle, a présenté lundi son nouveau modèle de langage, baptisé « Mistral Large 3 ». Selon les benchmarks publiés par l'entreprise et vérifiés par des laboratoires indépendants, ce modèle atteint des performances comparables à celles de GPT-5 d'OpenAI sur la plupart des tâches de raisonnement, de codage et de compréhension du langage.

La particularité de Mistral Large 3 réside dans son efficacité computationnelle. Le modèle a été entraîné avec un budget de 25 millions de dollars, soit environ un dixième du coût estimé de l'entraînement de GPT-5. Cette prouesse technique repose sur une architecture innovante dite « mixture of experts », qui permet de n'activer qu'une fraction des paramètres du modèle pour chaque requête.

Le cofondateur de Mistral AI a annoncé que le modèle serait disponible en open source sous licence Apache 2.0, une décision stratégique qui le distingue de la concurrence américaine. « Nous croyons que l'IA doit être un bien commun. Rendre nos modèles accessibles à tous, c'est notre meilleure arme contre la concentration du pouvoir technologique », a-t-il déclaré.

L'annonce a provoqué une onde de choc dans la Silicon Valley. La valorisation de Mistral AI, estimée à 12 milliards d'euros après son dernier tour de financement, pourrait encore augmenter. Le gouvernement français s'est félicité de ce succès, y voyant la validation de sa stratégie de soutien aux champions nationaux de l'IA, dotée de 2,5 milliards d'euros sur cinq ans.`,
    auteur: 'Antoine Leclerc',
    date: '2026-03-17T07:00:00Z',
    rubrique: 'Sciences',
    tags: ['intelligence artificielle', 'Mistral AI', 'technologie', 'IA'],
    imageUrl:
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop&q=80',
    slug: 'intelligence-artificielle-modele-francais-rivaux-americains',
    tempsLecture: '5 min',
  },
  {
    id: 24,
    titre: 'Climat : 2025 a été l\'année la plus chaude jamais enregistrée, confirme Copernicus',
    chapeau:
      'Le service climatique européen confirme que la température moyenne mondiale a dépassé de 1,55 °C les niveaux préindustriels l\'an dernier.',
    contenu: `Le service Copernicus de surveillance du changement climatique a confirmé mardi que l'année 2025 a été la plus chaude jamais enregistrée depuis le début des relevés météorologiques en 1850. La température moyenne mondiale a dépassé de 1,55 °C les niveaux de l'ère préindustrielle, franchissant symboliquement le seuil de 1,5 °C fixé par l'accord de Paris.

Les scientifiques soulignent que ce dépassement sur une année civile ne signifie pas que l'objectif de Paris est définitivement hors d'atteinte, celui-ci portant sur une moyenne calculée sur plusieurs décennies. Néanmoins, la tendance est « préoccupante », selon la directrice adjointe de Copernicus. « Chaque dixième de degré compte. À 1,5 °C, les impacts climatiques sont déjà sévères ; à 2 °C, ils deviennent catastrophiques pour de nombreuses régions du monde. »

L'année 2025 a été marquée par une série d'événements climatiques extrêmes : canicules record en Asie du Sud-Est, incendies dévastateurs en Méditerranée, inondations historiques en Afrique de l'Est. Le phénomène El Niño, qui a amplifié le réchauffement au premier semestre, a cédé la place à une phase neutre, mais les températures sont restées anormalement élevées tout au long de l'année.

Ces données seront au cœur des discussions de la COP31, prévue en novembre 2026 en Australie. Les pays les plus vulnérables exigent des engagements de réduction des émissions plus ambitieux de la part des grandes puissances, ainsi qu'un renforcement du fonds « pertes et préjudices » créé à la COP28.`,
    auteur: 'Dr. Martin Chevallier',
    date: '2026-01-14T12:30:00Z',
    rubrique: 'Sciences',
    tags: ['climat', 'réchauffement', 'Copernicus', 'température'],
    imageUrl:
      'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&h=450&fit=crop&q=80',
    slug: 'climat-2025-annee-plus-chaude-copernicus',
    tempsLecture: '5 min',
  },

  // ── Idées ──────────────────────────────────────────────────
  {
    id: 25,
    titre: 'Tribune : « Pour une VIᵉ République écologique et sociale »',
    chapeau:
      'Un collectif de constitutionnalistes et de militants appelle à refonder les institutions françaises autour des impératifs environnementaux.',
    contenu: `Il est temps de tirer les conséquences institutionnelles de l'urgence écologique. La Vᵉ République, conçue en 1958 pour répondre aux défis de la décolonisation et de la guerre froide, n'est plus adaptée aux enjeux du XXIᵉ siècle. Nous appelons à l'ouverture d'un processus constituant pour fonder une VIᵉ République qui place la préservation du vivant au cœur de l'architecture institutionnelle.

Concrètement, nous proposons l'inscription dans la Constitution d'un principe de non-régression écologique, assorti d'un mécanisme de « veto climatique » permettant à une Chambre du futur, composée de citoyens tirés au sort et de scientifiques, de bloquer tout projet de loi incompatible avec les objectifs de décarbonation. Ce mécanisme s'inspirerait du modèle de la Convention citoyenne pour le climat, tout en le dotant d'un pouvoir contraignant.

Nous plaidons également pour la création d'un droit constitutionnel à un environnement sain et à l'accès aux communs naturels — eau, air, sols, biodiversité. Ce droit serait justiciable devant une juridiction spécialisée, dotée du pouvoir d'annuler les actes administratifs portant atteinte à ces communs. Plusieurs pays latino-américains ont déjà ouvert cette voie avec la reconnaissance des droits de la nature.

Cette proposition n'est pas utopique. Elle répond à une demande démocratique profonde, exprimée lors des consultations citoyennes organisées dans toute la France ces dernières années. Il est temps que nos institutions rattrapent leur retard sur la conscience écologique de nos concitoyens.`,
    auteur: 'Collectif pour une VIᵉ République',
    date: '2026-02-08T06:00:00Z',
    rubrique: 'Idées',
    tags: ['Constitution', 'écologie', 'démocratie', 'tribune'],
    imageUrl:
      'https://images.unsplash.com/photo-1444664597500-035db93e2323?w=800&h=450&fit=crop&q=80',
    slug: 'tribune-sixieme-republique-ecologique-sociale',
    tempsLecture: '6 min',
  },
  {
    id: 26,
    titre: 'Débat : l\'intelligence artificielle peut-elle rendre la justice ?',
    chapeau:
      'Deux juristes confrontent leurs visions sur l\'utilisation croissante des algorithmes dans le système judiciaire français.',
    contenu: `L'introduction progressive d'outils d'intelligence artificielle dans le fonctionnement de la justice française soulève des questions fondamentales sur la nature même de l'acte de juger. Alors que le ministère de la Justice vient d'annoncer l'expérimentation de systèmes d'aide à la décision dans les tribunaux administratifs, le débat s'intensifie entre partisans de la modernisation et défenseurs d'une justice irréductiblement humaine.

Pour les promoteurs de la « justice algorithmique », l'IA offre la promesse d'une plus grande égalité de traitement. Les études montrent que, pour des faits identiques, les peines prononcées varient considérablement d'un tribunal à l'autre, voire d'un juge à l'autre. Un algorithme entraîné sur la jurisprudence pourrait réduire ces disparités et garantir une application plus uniforme du droit.

Les opposants rétorquent que juger ne se réduit pas à appliquer mécaniquement des règles à des faits. La justice implique l'écoute, la compréhension des circonstances singulières, l'exercice d'une forme d'empathie éclairée que les machines sont incapables de reproduire. « Confier le sort des justiciables à un algorithme, c'est renoncer à ce qui fait la dignité de la justice : sa capacité à traiter chaque cas comme unique », argumente un ancien premier président de la Cour de cassation.

Le véritable enjeu réside peut-être moins dans l'opposition binaire entre justice humaine et justice algorithmique que dans la définition des limites acceptables de l'assistance technologique. L'IA comme outil d'aide à la recherche jurisprudentielle ou à la rédaction de décisions semble faire consensus ; son utilisation comme outil de prédiction ou de recommandation de peines divise profondément la profession.`,
    auteur: 'Pr. Catherine Thibault',
    date: '2026-03-10T09:30:00Z',
    rubrique: 'Idées',
    tags: ['intelligence artificielle', 'justice', 'éthique', 'droit'],
    imageUrl:
      'https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=800&h=450&fit=crop&q=80',
    slug: 'debat-intelligence-artificielle-justice',
    tempsLecture: '6 min',
  },
  {
    id: 27,
    titre: 'Essai : « La fatigue démocratique, un mal européen »',
    chapeau:
      'Le politologue Yascha Mounk analyse les causes profondes de la désaffection citoyenne envers les institutions démocratiques en Europe.',
    contenu: `L'abstention record aux élections européennes de 2024, la montée des populismes et la défiance généralisée envers les partis traditionnels témoignent d'un malaise profond. Ce que l'on qualifie trop rapidement de « crise de la démocratie » relève en réalité d'une fatigue, c'est-à-dire d'un épuisement lent et progressif des ressorts qui font fonctionner le système démocratique.

Cette fatigue a des causes multiples. La première est la perte de prise des citoyens sur les décisions qui affectent leur quotidien. La mondialisation économique, la construction européenne et la technocratisation de l'action publique ont transféré le pouvoir de décision vers des espaces lointains et opaques. Le vote, autrefois instrument de transformation sociale, apparaît de plus en plus comme un rituel vidé de sa substance.

La deuxième cause tient à l'effondrement des corps intermédiaires. Syndicats, partis, associations, Églises : toutes les institutions qui assuraient la médiation entre les individus et le pouvoir politique se sont affaiblies. Le citoyen se retrouve seul face à l'État, isolé dans un sentiment d'impuissance que les réseaux sociaux amplifient en créant l'illusion d'une parole entendue.

Pour sortir de cette impasse, il ne suffit pas de « renouer le dialogue » ou de multiplier les consultations en ligne. Il faut repenser les formes mêmes de la participation démocratique, en donnant aux citoyens un pouvoir réel de décision sur les sujets qui les concernent directement, à l'échelle locale comme nationale. Le tirage au sort, les budgets participatifs et les assemblées citoyennes offrent des pistes prometteuses, à condition de ne pas en faire de simples exercices cosmétiques.`,
    auteur: 'Yascha Mounk',
    date: '2026-01-20T14:00:00Z',
    rubrique: 'Idées',
    tags: ['démocratie', 'Europe', 'abstention', 'politique'],
    imageUrl:
      'https://images.unsplash.com/photo-1494172961521-33799ddd43a5?w=800&h=450&fit=crop&q=80',
    slug: 'essai-fatigue-democratique-mal-europeen',
    tempsLecture: '7 min',
  },

  // ── Société ────────────────────────────────────────────────
  {
    id: 28,
    titre: 'Éducation : le nombre d\'élèves par classe baisse pour la première fois depuis 2015',
    chapeau:
      'Le ministère annonce une moyenne de 23,4 élèves par classe en primaire, fruit de la politique de dédoublement dans les zones d\'éducation prioritaire.',
    contenu: `Les chiffres publiés jeudi par la Direction de l'évaluation, de la prospective et de la performance (DEPP) confirment une tendance attendue : le nombre moyen d'élèves par classe dans l'enseignement primaire est passé de 24,1 à 23,4 à la rentrée 2025, la plus forte baisse enregistrée depuis une décennie.

Cette évolution résulte de la combinaison de deux facteurs : la poursuite du dédoublement des classes de CP et CE1 en éducation prioritaire, étendue aux CE2 depuis 2024, et la baisse démographique, avec 50 000 naissances de moins par an par rapport au milieu des années 2010. Dans les réseaux d'éducation prioritaire renforcés (REP+), la moyenne est tombée à 14,2 élèves par classe.

Les enseignants et les chercheurs en sciences de l'éducation accueillent ces résultats avec un optimisme prudent. « La réduction de la taille des classes est un levier efficace, mais il ne suffit pas à lui seul. Il faut aussi investir dans la formation des enseignants et dans l'accompagnement pédagogique », souligne un chercheur de l'Institut français de l'éducation.

Les syndicats enseignants tempèrent également l'enthousiasme. « Ces moyennes nationales masquent de grandes disparités. Dans de nombreuses écoles hors éducation prioritaire, les classes de 28 ou 30 élèves restent la norme », rappelle le secrétaire général du SNUipp-FSU. Le ministère a promis que l'effort serait étendu aux zones rurales à partir de la rentrée 2027.`,
    auteur: 'Nathalie Girard',
    date: '2026-02-27T08:15:00Z',
    rubrique: 'Société',
    tags: ['éducation', 'école', 'classes', 'éducation prioritaire'],
    imageUrl:
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=450&fit=crop&q=80',
    slug: 'education-nombre-eleves-classe-baisse',
    tempsLecture: '4 min',
  },
  {
    id: 29,
    titre: 'Santé mentale : la France lance un numéro national de prévention du suicide',
    chapeau:
      'Le 3114, désormais accessible 24 heures sur 24, voit ses moyens doublés après une hausse préoccupante des tentatives de suicide chez les jeunes.',
    contenu: `Le ministère de la Santé a annoncé mercredi un renforcement sans précédent du dispositif national de prévention du suicide. Le 3114, numéro national créé en 2021, verra ses effectifs passer de 200 à 400 écoutants professionnels, permettant de réduire le temps d'attente moyen de 12 à 3 minutes. Un budget de 45 millions d'euros sur trois ans a été débloqué pour cette montée en puissance.

Cette décision intervient dans un contexte alarmant. Selon les dernières données de Santé publique France, les passages aux urgences pour geste suicidaire chez les 15-24 ans ont augmenté de 30 % entre 2022 et 2025. Les jeunes filles de 15 à 19 ans sont particulièrement touchées, avec une hausse de 40 % des tentatives de suicide sur la même période.

« La santé mentale des jeunes est un enjeu de santé publique majeur qui nécessite une réponse à la hauteur », a déclaré la ministre de la Santé. Outre le renforcement du 3114, le plan prévoit la création de 200 postes de psychologues dans les établissements scolaires et l'extension du dispositif « Mon soutien psy » aux 11-17 ans, avec une prise en charge intégrale par l'Assurance maladie.

Les professionnels de la psychiatrie saluent cette mobilisation tout en rappelant que la prévention du suicide nécessite une approche globale. « Le téléphone et les consultations sont essentiels, mais il faut aussi agir sur les déterminants sociaux : précarité, isolement, harcèlement scolaire, surexposition aux écrans », insiste le président de la Société française de psychiatrie de l'enfant et de l'adolescent.`,
    auteur: 'Dr. Sylvie Lambert',
    date: '2026-03-19T11:45:00Z',
    rubrique: 'Société',
    tags: ['santé mentale', 'suicide', 'jeunes', 'prévention'],
    imageUrl:
      'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&h=450&fit=crop&q=80',
    slug: 'sante-mentale-numero-national-prevention-suicide',
    tempsLecture: '5 min',
  },
  {
    id: 30,
    titre: 'Logement : le plan « zéro SDF » peine à atteindre ses objectifs',
    chapeau:
      'Malgré la construction de 15 000 places d\'hébergement d\'urgence en 2025, le nombre de personnes sans domicile fixe continue d\'augmenter.',
    contenu: `Le plan « zéro SDF », lancé en grande pompe par le gouvernement en 2024 avec l'ambition de mettre fin au sans-abrisme en France d'ici à 2027, fait face à un constat d'échec partiel. Selon le dernier rapport de la Fondation Abbé Pierre, publié mardi, le nombre de personnes sans domicile fixe a atteint 330 000 en France, contre 300 000 deux ans plus tôt.

Le gouvernement met en avant les efforts réalisés : 15 000 nouvelles places d'hébergement d'urgence ont été créées en 2025, portant le total à 220 000. Le programme « Un logement d'abord », qui vise à orienter directement les personnes sans abri vers des logements pérennes plutôt que vers des centres d'hébergement, a permis de reloger 42 000 ménages depuis 2024.

Mais ces résultats sont insuffisants face à l'afflux de nouvelles personnes en situation de rue. La crise du logement, la précarisation du marché du travail et les flux migratoires contribuent à grossir les rangs des sans-abri plus vite que le dispositif ne parvient à les accueillir. « On remplit un tonneau percé », résume le directeur de l'hébergement d'urgence de la Croix-Rouge française.

Les associations demandent un changement de paradigme. « Tant que l'on ne s'attaquera pas aux causes structurelles du mal-logement — spéculation immobilière, insuffisance de la construction sociale, loyers déconnectés des revenus —, le sans-abrisme continuera de progresser », estime le président de la Fondation Abbé Pierre, qui appelle à la construction de 150 000 logements sociaux par an pendant dix ans.`,
    auteur: 'Rachid Bensaïd',
    date: '2026-02-11T07:00:00Z',
    rubrique: 'Société',
    tags: ['logement', 'SDF', 'sans-abri', 'hébergement'],
    imageUrl:
      'https://images.unsplash.com/photo-1518398046578-8cca57782e17?w=800&h=450&fit=crop&q=80',
    slug: 'logement-plan-zero-sdf-objectifs',
    tempsLecture: '5 min',
  },
  {
    id: 31,
    titre: 'Alimentation : le bio recule, le local progresse dans les cantines scolaires',
    chapeau:
      'La loi Egalim impose 50 % de produits durables dans la restauration collective, mais les établissements privilégient de plus en plus les circuits courts au détriment du label bio.',
    contenu: `Les cantines scolaires françaises servent de plus en plus de produits locaux, mais de moins en moins de produits biologiques. C'est le paradoxe révélé par une étude de l'Agence Bio publiée lundi, qui montre que la part du bio dans la restauration collective scolaire a reculé de 26 % à 21 % entre 2023 et 2025, tandis que les produits issus de circuits courts sont passés de 18 % à 31 %.

Ce basculement s'explique par les contraintes budgétaires des collectivités. Face à l'inflation alimentaire, de nombreuses communes ont préféré se tourner vers des producteurs locaux conventionnels, dont les prix sont souvent plus compétitifs que ceux du bio importé. « Entre un poulet bio brésilien et un poulet fermier de la région, le choix est vite fait pour les parents et les élus », résume le responsable d'une centrale d'achat municipale.

Les professionnels du bio s'inquiètent de cette tendance. « Le local n'est pas synonyme de durable. Un produit peut être cultivé à 30 kilomètres de l'école et avoir été traité avec des pesticides nocifs pour la santé et l'environnement », alerte la présidente de la Fédération nationale de l'agriculture biologique.

Le ministère de l'Agriculture a annoncé vouloir clarifier les critères de la loi Egalim pour éviter les effets de substitution. Un décret en préparation devrait préciser que les produits locaux comptabilisés dans les 50 % de produits durables devront répondre à des critères environnementaux minimaux, incluant une limitation de l'usage des produits phytosanitaires.`,
    auteur: 'Émilie Rousseau',
    date: '2026-03-03T10:00:00Z',
    rubrique: 'Société',
    tags: ['alimentation', 'bio', 'cantines', 'circuits courts'],
    imageUrl:
      'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800&h=450&fit=crop&q=80',
    slug: 'alimentation-bio-recule-local-progresse-cantines',
    tempsLecture: '4 min',
  },
  {
    id: 32,
    titre: 'Transports : la gratuité des TER expérimentée dans trois régions',
    chapeau:
      'Les régions Occitanie, Bretagne et Centre-Val de Loire lancent une expérimentation de gratuité totale des trains régionaux pour les moins de 26 ans.',
    contenu: `Trois régions françaises se lancent dans une expérimentation inédite en Europe : la gratuité totale des trains express régionaux (TER) pour les jeunes de moins de 26 ans. Annoncée conjointement par les présidents des régions Occitanie, Bretagne et Centre-Val de Loire, la mesure sera effective à partir du 1ᵉʳ avril pour une durée de dix-huit mois.

L'objectif est double : réduire l'empreinte carbone des déplacements et améliorer la mobilité des jeunes, souvent pénalisés par le coût des transports. « Un jeune sur cinq renonce à des opportunités d'emploi ou de formation faute de pouvoir se déplacer. La gratuité des TER peut changer la donne », argumente la présidente de la région Occitanie.

Le coût de l'expérimentation est estimé à 180 millions d'euros sur dix-huit mois, financé à 60 % par les régions et à 40 % par l'État dans le cadre du plan « mobilités durables ». SNCF Voyageurs prévoit une hausse de fréquentation de 25 à 30 % et a annoncé le renforcement de l'offre aux heures de pointe pour absorber l'augmentation du trafic.

Les opposants à la mesure, principalement issus de la droite, dénoncent un « gouffre financier » et craignent que la gratuité n'engendre des effets d'aubaine. « Offrir la gratuité à des étudiants parisiens qui prennent le TER le week-end pour aller à la plage, est-ce vraiment une priorité ? », ironise un sénateur de l'opposition. Les promoteurs répondent qu'un bilan détaillé sera réalisé pour mesurer l'impact réel sur les comportements de mobilité.`,
    auteur: 'Karim Benzema',
    date: '2026-03-20T14:30:00Z',
    rubrique: 'Société',
    tags: ['transports', 'TER', 'gratuité', 'jeunes'],
    imageUrl:
      'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&h=450&fit=crop&q=80',
    slug: 'transports-gratuite-ter-trois-regions',
    tempsLecture: '4 min',
  },
];

// ── Helper functions ─────────────────────────────────────────

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getArticlesByRubrique(rubrique: string): Article[] {
  return articles
    .filter((a) => a.rubrique === rubrique)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function searchArticles(query: string, rubrique?: string): Article[] {
  const lowerQuery = query.toLowerCase();
  return articles
    .filter((a) => {
      const matchesQuery =
        a.titre.toLowerCase().includes(lowerQuery) ||
        a.chapeau.toLowerCase().includes(lowerQuery) ||
        a.contenu.toLowerCase().includes(lowerQuery) ||
        a.tags.some((tag) => tag.toLowerCase().includes(lowerQuery));
      const matchesRubrique = rubrique ? a.rubrique === rubrique : true;
      return matchesQuery && matchesRubrique;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getRelatedArticles(
  article: Article,
  limit: number = 4
): Article[] {
  return articles
    .filter((a) => a.id !== article.id)
    .map((a) => {
      let score = 0;
      if (a.rubrique === article.rubrique) score += 3;
      const sharedTags = a.tags.filter((tag) => article.tags.includes(tag));
      score += sharedTags.length * 2;
      return { article: a, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.article);
}

export function getAllRubriques(): string[] {
  return [...rubriques];
}

export function getRecentArticles(limit: number = 10): Article[] {
  return [...articles]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}

export function getFeaturedArticle(): Article {
  return [...articles].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )[0];
}

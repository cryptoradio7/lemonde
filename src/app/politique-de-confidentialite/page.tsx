import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Politique de confidentialité',
  description: 'Politique de confidentialité et gestion des cookies du site Le Monde.',
};

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="max-w-article mx-auto px-4 py-8">
      <h1 className="font-serif text-3xl font-bold mb-6">Politique de confidentialité</h1>

      <div className="prose prose-lg font-serif text-lm-dark leading-relaxed space-y-6">
        <section>
          <h2 className="text-xl font-bold mt-8 mb-3">1. Introduction</h2>
          <p>
            Le Monde s&apos;engage à protéger la vie privée de ses utilisateurs.
            Cette politique de confidentialité explique comment nous collectons,
            utilisons et protégeons vos données personnelles lorsque vous utilisez
            notre site web.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3">2. Données collectées</h2>
          <p>
            Nous collectons uniquement des données anonymisées via notre outil
            d&apos;analyse Plausible Analytics, qui est conforme au RGPD. Aucune
            donnée personnelle identifiable n&apos;est collectée sans votre
            consentement explicite.
          </p>
          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li>Pages visitées (URL anonymisée)</li>
            <li>Durée de la visite</li>
            <li>Provenance du trafic (référent)</li>
            <li>Type d&apos;appareil et navigateur (sans empreinte numérique)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3">3. Cookies</h2>
          <p>
            Notre site utilise un nombre minimal de cookies. Plausible Analytics
            ne dépose aucun cookie. Nous utilisons uniquement le stockage local
            (localStorage) pour mémoriser votre choix de consentement.
          </p>
          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li>
              <strong>cookie_consent</strong> : mémorise votre choix d&apos;acceptation
              ou de refus des analytics (localStorage)
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3">4. Vos droits</h2>
          <p>
            Conformément au Règlement Général sur la Protection des Données (RGPD),
            vous disposez des droits suivants :
          </p>
          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li>Droit d&apos;accès à vos données</li>
            <li>Droit de rectification</li>
            <li>Droit à l&apos;effacement</li>
            <li>Droit à la portabilité des données</li>
            <li>Droit d&apos;opposition au traitement</li>
            <li>Droit de retirer votre consentement à tout moment</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3">5. Partage des données</h2>
          <p>
            Nous ne vendons, n&apos;échangeons ni ne transférons vos données
            personnelles à des tiers. Les données analytiques anonymisées sont
            traitées par Plausible Analytics, hébergé dans l&apos;Union européenne.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3">6. Sécurité</h2>
          <p>
            Nous mettons en œuvre des mesures de sécurité appropriées pour protéger
            vos données contre tout accès non autorisé, modification, divulgation
            ou destruction.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3">7. Modifications</h2>
          <p>
            Cette politique de confidentialité peut être mise à jour périodiquement.
            Nous vous informerons de tout changement significatif en publiant la
            nouvelle politique sur cette page.
          </p>
          <p className="text-sm text-lm-gray mt-4">
            Dernière mise à jour : mars 2026
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3">8. Contact</h2>
          <p>
            Pour toute question concernant cette politique de confidentialité ou
            pour exercer vos droits, vous pouvez nous contacter :
          </p>
          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li>
              <strong>Par courrier</strong> : Le Monde, 67-69 avenue Pierre-Mendès-France, 75013 Paris
            </li>
            <li>
              <strong>Par email</strong> : confidentialite@lemonde.fr
            </li>
            <li>
              <strong>Délégué à la Protection des Données (DPO)</strong> : dpo@lemonde.fr
            </li>
          </ul>
          <p className="mt-3">
            Vous pouvez également adresser une réclamation à la{' '}
            <strong>CNIL (Commission Nationale de l&apos;Informatique et des Libertés)</strong>{' '}
            à l&apos;adresse{' '}
            <strong>www.cnil.fr</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}

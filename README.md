# Sparko – echter Preisvergleich

Diese Version ersetzt den bisherigen Demo-Preisvergleich durch eine echte serverseitige Preissuche.

## Was funktioniert?

- Name ist auf "Sparko" geändert.
- Nutzer können Produkte suchen.
- Das Backend fragt Google Shopping über SerpApi ab.
- Ergebnisse werden nach Preis sortiert.
- Shop, Preis, Versandhinweis, Bewertung, Bild und Angebotslink werden angezeigt.
- `no_cache=true` fordert bei jeder Suche eine frische Abfrage an.
- Die Seite läuft ohne API-Key im Demo-Modus weiter.

Die verwendete Schnittstelle stellt Google-Shopping-Ergebnisse bereit. Sie liefert u. a. Titel, Händler, Preis, Lieferung, Bewertung, Thumbnail und Produktlink.

## Start auf deinem Rechner

1. Node.js installieren.
2. Im Projektordner:
   `npm install`
3. `.env.example` in `.env` kopieren.
4. Deinen SerpApi-Key einsetzen:
   `SERPAPI_KEY=...`
5. Start:
   `npm start`
6. Browser öffnen:
   `http://localhost:3000`

## Wichtig zu echten Preisen

Ohne API-Key gibt es bewusst nur den Demo-Modus. Für echte, laufend aktualisierte Preise braucht Sparko eine externe Preisdatenquelle.

Die aktuelle Implementierung nutzt SerpApi Google Shopping. SerpApi dokumentiert den Endpunkt `engine=google_shopping` und die Felder für Preis, Shop, Lieferung, Bild und Produktlink.

Für ein echtes Geschäftsmodell sollten wir danach noch Affiliate-Links bzw. Händler-Feeds integrieren. Dann kann Sparko beim Klick auf ein Angebot eine Provision erhalten, sofern der jeweilige Händler bzw. das Affiliate-Netzwerk teilnimmt.

## Deployment

Die App kann später auf einen Node-kompatiblen Hoster (z. B. Render, Railway, Fly.io oder einen anderen Anbieter) deployed werden. Dort wird `SERPAPI_KEY` als geheime Umgebungsvariable gesetzt.

## Nächste sinnvolle Erweiterungen

- Affiliate-Tracking
- echte Händler-Links statt Google-Produktseiten
- Preisverlauf
- Preisalarm
- Wunschliste
- Filter (Versand, Händler, Zustand)
- Produkt-Matching, damit unterschiedliche Schreibweisen desselben Produkts zusammengeführt werden

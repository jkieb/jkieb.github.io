# Tuftelei

Astro-Projekt (Ideenarchiv, Projekte) – liegt im Portfolio-Repo und ist unter
<https://jkieb.github.io/tuftelei/> erreichbar.

```sh
cd tuftelei
npm install
npm run dev      # http://localhost:4321/tuftelei/
npm run build
```

Deployt wird alles gemeinsam über `.github/workflows/deploy.yml` im Repo-Root:
Das Portfolio (statisch, Root) und der Astro-Build (`/tuftelei/`) landen in
einem Pages-Artefakt. Ideen: siehe `ideen/README.md`.

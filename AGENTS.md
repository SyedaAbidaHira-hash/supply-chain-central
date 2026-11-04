<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture
- All app data comes from the external Aiven MySQL database via `src/lib/db.server.ts` (mysql2, password in `MYSQL_PASSWORD` secret) and the `getScmData` server function in `src/lib/scm.functions.ts`; why: credentials must stay server-side and pages share one cached query.
